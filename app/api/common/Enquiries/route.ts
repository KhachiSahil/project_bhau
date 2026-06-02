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

    const oldEnquiry = await prisma.enquiry.findUnique({
      where: {
        id: id
      }
    })

    /* ------------------------------------------------- *
     * Basic validation
     * ------------------------------------------------- */
    if (!Customer || !pickupDate || !dropDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    /* ------------------------------------------------- *
     * Upsert Customer
     * ------------------------------------------------- */
    const customerRow = await prisma.customer.upsert({
      where: Customer.id ? { id: Customer.id } : { email: Customer.email },
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
    });

    /* ------------------------------------------------- *
     * Upsert / create Enquiry and static look‑ups
     * ------------------------------------------------- */
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

    const enquiryRow = await prisma.enquiry.upsert({
      where: id ? { id } : { id: "-placeholder-" }, // `-placeholder-` never exists
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

    /* ------------------------------------------------- *
     * CabBooking ‑ replace‑all
     * ------------------------------------------------- */
    if (cabBookings.length) {
      const cabSrc = cabBookings[0];                   // (UI allows one owner)
      const cabRow = await prisma.cabBooking.upsert({
        where: cabSrc.id ? { id: cabSrc.id } : { id: "-placeholder-" },
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

      // replace booked‑dates
      await prisma.bookedDate.deleteMany({ where: { cabBookingId: cabRow.id } });
      if (cabSrc.CabOwner.bookedDates?.length) {
        await prisma.bookedDate.createMany({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: cabSrc.CabOwner.bookedDates.map((bd: any) => ({
            cabBookingId: cabRow.id,
            cabOwnerId: cabSrc.CabOwner.id,
            date: new Date(bd.date),
          })),
        });
      }
    }

    /* ------------------------------------------------- *
     *  Hotel blocks ‑ replace‑all
     * ------------------------------------------------- */
    // ❶ delete children first (FK safe)
    await prisma.hotelBookingDate.deleteMany({
      where: { hotel: { enquiryId: enquiryRow.id } },
    });
    // ❷ delete parent hotels
    await prisma.hotel.deleteMany({ where: { enquiryId: enquiryRow.id } });

    // recreate
    for (const h of hotels) {
      const hotelRow = await prisma.hotel.create({
        data: { enquiryId: enquiryRow.id, name: h.name ?? "" },
      });

      if (h.bookingDates?.length) {
        await prisma.hotelBookingDate.createMany({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: h.bookingDates.map((bd: any) => ({
            hotelId: hotelRow.id,
            date: new Date(bd.date),
          })),
        });
      }
    }

    /* ------------------------------------------------- *
     * Follow‑ups ‑ replace‑all
     * ------------------------------------------------- */
    // await prisma.followUp.deleteMany({ where: { enquiryId: enquiryRow.id } });

    if (followUps.length) {
      await prisma.followUp.createMany({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: followUps.map((f: any) => ({
          enquiryId: enquiryRow.id,
          date: new Date(f.date),
          message: f.message ?? "",
          employeeId
        })),
      });
    }



    if (status === "Completed" && oldEnquiry?.status !== "Completed")
      await sendCompletionEmail(customerRow.email, enquiryRow)


    return NextResponse.json(
      { message: "Enquiry saved / updated", enquiryId: enquiryRow.id },
      { status: 200 },
    );
  } catch (err) {
    console.error("POST /api/common/Enquiries error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
