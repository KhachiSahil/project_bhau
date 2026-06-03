import { sendCompletionEmail } from "@/app/lib/utils/mail";
import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const enquiryId = searchParams.get('enqId');

  if (!enquiryId)
    return NextResponse.json({ msg: 'enquiryId not recieved' }, { status: 400 })

  const data = await prisma.enquiry.findUnique({
    where:
      { id: enquiryId },
      relationLoadStrategy: 'join',
    include: {
      Customer: true,
      destination: true,
      pickupLocation: true,
      dropLocation: true,
      followUps: true,
      website: true,
      hotels: {
        include: {
          bookingDates: true
        }
      },
      cabBookings: {
        include: {
          CabOwner: {
            include: {
              bookedDates: true
            }
          }
        }
      }
    }
  })
  if (!data)
    return NextResponse.json({ data: 'Enquiry not found' }, { status: 404 })

  return NextResponse.json({ data }, { status: 200 })
}


export async function POST(req: NextRequest) {
  try {
    const { data, followUps = [] } = await req.json();

    const {
      id,
      Customer,
      adults,
      kids,
      destination,
      pickupLocation,
      dropLocation,
      pickupDate,
      dropDate,
      quotation,
      requirements,
      status,
      cabBookings = [],
      hotels = [],
      employeeId,
      websiteId,
    } = data;

    if (!Customer || !pickupDate || !dropDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* -----------------------------------------
       old enquiry + customer in parallel
    ----------------------------------------- */

    const [oldEnquiry, customerRow] = await Promise.all([
      prisma.enquiry.findUnique({
        where: { id },
        select: {
          status: true,
        },
      }),

      prisma.customer.upsert({
        where: Customer.id
          ? { id: Customer.id }
          : { email: Customer.email },
        update: {
          name: Customer.name,
          phone: Customer.phone,
        },
        create: {
          id: Customer.id,
          email: Customer.email,
          name: Customer.name,
          phone: Customer.phone,
        },
      }),
    ]);

    /* -----------------------------------------
       destinations in parallel
    ----------------------------------------- */

    const upsertDest = (name: string) =>
      prisma.destination.upsert({
        where: { name },
        update: {},
        create: { name },
      });

    const [destRow, pickRow, dropRow] = await Promise.all([
      upsertDest(destination.name),
      upsertDest(pickupLocation.name),
      upsertDest(dropLocation.name),
    ]);

    /* -----------------------------------------
       enquiry
    ----------------------------------------- */

    const enquiryRow = await prisma.enquiry.upsert({
      where: id ? { id } : { id: "-placeholder-" },
      update: {
        customerId: customerRow.id,
        adults,
        kids,
        pickupDate: new Date(pickupDate),
        dropDate: new Date(dropDate),
        destinationId: destRow.id,
        pickupLocationId: pickRow.id,
        dropLocationId: dropRow.id,
        quotation,
        requirements,
        status,
      },
      create: {
        id,
        customerId: customerRow.id,
        adults,
        kids,
        pickupDate: new Date(pickupDate),
        dropDate: new Date(dropDate),
        destinationId: destRow.id,
        pickupLocationId: pickRow.id,
        dropLocationId: dropRow.id,
        quotation,
        requirements,
        status,
        employeeId,
        websiteId,
      },
    });

    /* -----------------------------------------
       cab workflow
    ----------------------------------------- */

    const cabTask =
      cabBookings.length > 0
        ? (async () => {
            const cabSrc = cabBookings[0];

            const cabRow = await prisma.cabBooking.upsert({
              where: cabSrc.id
                ? { id: cabSrc.id }
                : { id: "-placeholder-" },
              update: {
                pickupDate: new Date(cabSrc.pickupDate),
                dropDate: new Date(cabSrc.dropDate),
                enquiryId: enquiryRow.id,
                cabOwnerId: cabSrc.CabOwner.id,
              },
              create: {
                id: cabSrc.id,
                pickupDate: new Date(cabSrc.pickupDate),
                dropDate: new Date(cabSrc.dropDate),
                enquiryId: enquiryRow.id,
                cabOwnerId: cabSrc.CabOwner.id,
              },
            });

            await prisma.bookedDate.deleteMany({
              where: {
                cabBookingId: cabRow.id,
              },
            });

            if (cabSrc.CabOwner.bookedDates?.length) {
              await prisma.bookedDate.createMany({
                data: cabSrc.CabOwner.bookedDates.map((bd: any) => ({
                  cabBookingId: cabRow.id,
                  cabOwnerId: cabSrc.CabOwner.id,
                  date: new Date(bd.date),
                })),
              });
            }
          })()
        : Promise.resolve();

    /* -----------------------------------------
       hotel workflow
    ----------------------------------------- */

    const hotelTask = (async () => {
      await prisma.hotelBookingDate.deleteMany({
        where: {
          hotel: {
            enquiryId: enquiryRow.id,
          },
        },
      });

      await prisma.hotel.deleteMany({
        where: {
          enquiryId: enquiryRow.id,
        },
      });

      await Promise.all(
        hotels.map(async (h: any) => {
          const hotelRow = await prisma.hotel.create({
            data: {
              enquiryId: enquiryRow.id,
              name: h.name ?? "",
            },
          });

          if (h.bookingDates?.length) {
            await prisma.hotelBookingDate.createMany({
              data: h.bookingDates.map((bd: any) => ({
                hotelId: hotelRow.id,
                date: new Date(bd.date),
              })),
            });
          }
        })
      );
    })();

    /* -----------------------------------------
       followups workflow
    ----------------------------------------- */

    const followUpTask =
      followUps.length > 0
        ? prisma.followUp.createMany({
            data: followUps.map((f: any) => ({
              enquiryId: enquiryRow.id,
              date: new Date(f.date),
              message: f.message ?? "",
              employeeId,
            })),
          })
        : Promise.resolve();

    /* -----------------------------------------
       run independent workflows together
    ----------------------------------------- */

    await Promise.all([
      cabTask,
      hotelTask,
      followUpTask,
    ]);

    /* -----------------------------------------
       email after successful DB operations
    ----------------------------------------- */

    if (
      status === "Completed" &&
      oldEnquiry?.status !== "Completed"
    ) {
      await sendCompletionEmail(
        customerRow.email,
        enquiryRow
      );
    }

    return NextResponse.json(
      {
        message: "Enquiry saved / updated",
        enquiryId: enquiryRow.id,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("POST /api/common/Enquiries error:", err);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}