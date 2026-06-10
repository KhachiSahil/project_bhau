import { sendCompletionEmail } from "@/app/lib/utils/mail";
import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const enquiryId = searchParams.get("enqId");

  if (!enquiryId)
    return NextResponse.json({ msg: "enquiryId not received" }, { status: 400 });

  const data = await prisma.enquiry.findUnique({
    where: { id: enquiryId },
    include: {
      Customer: true,
      destination: true,
      pickupLocation: true,
      dropLocation: true,
      followUps: true,
      website: true,
      hotels: {
        include: { bookingDates: true },
      },
      cabBookings: {
        include: {
          CabOwner: true,        
          bookedDates: true,   
        },
      },
    },
  });

  if (!data)
    return NextResponse.json({ data: "Enquiry not found" }, { status: 404 });

  return NextResponse.json({ data }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json();

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
      followUps = [],
      employeeId,
      websiteId,
    } = data;

    if (!Customer || !pickupDate || !dropDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Only insert follow-ups that were created in this session (temp ids)
    const newFollowUps = followUps.filter(
      (f: any) => String(f.id).startsWith("temp-") || !f.enquiryId
    );

    // Fetch old status before any writes (outside transaction is fine for a read)
    const oldEnquiry = await prisma.enquiry.findUnique({
      where: { id },
      select: { status: true },
    });

    // All writes in a single transaction so a partial failure rolls back fully
    const enquiryRow = await prisma.$transaction(async (tx) => {

      /* --- customer --- */
      const customerRow = await tx.customer.upsert({
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
      });

      /* --- destinations --- */
      const upsertDest = (name: string) =>
        tx.destination.upsert({
          where: { name },
          update: {},
          create: { name },
        });

      const [destRow, pickRow, dropRow] = await Promise.all([
        upsertDest(destination.name),
        upsertDest(pickupLocation.name),
        upsertDest(dropLocation.name),
      ]);

      /* --- enquiry --- */
      const enquiry = await tx.enquiry.upsert({
        where: { id: id ?? "-placeholder-" },
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

      /* --- cab workflow --- */
      if (cabBookings.length > 0) {
        const cabSrc = cabBookings[0];

        // Find existing cab booking by enquiryId instead of using placeholder upsert
        const existingCab = await tx.cabBooking.findFirst({
          where: { enquiryId: enquiry.id },
          select: { id: true },
        });

        // Fall back to enquiry dates if cab has no own date fields
        const cabPickup = cabSrc.pickupDate
          ? new Date(cabSrc.pickupDate)
          : new Date(pickupDate);
        const cabDrop = cabSrc.dropDate
          ? new Date(cabSrc.dropDate)
          : new Date(dropDate);

        const cabRow = existingCab
          ? await tx.cabBooking.update({
              where: { id: existingCab.id },
              data: {
                pickupDate: cabPickup,
                dropDate: cabDrop,
                cabOwnerId: cabSrc.CabOwner.id,
              },
            })
          : await tx.cabBooking.create({
              data: {
                pickupDate: cabPickup,
                dropDate: cabDrop,
                enquiryId: enquiry.id,
                cabOwnerId: cabSrc.CabOwner.id,
              },
            });

        // Delete all existing booked dates for this booking, then recreate
        await tx.bookedDate.deleteMany({
          where: { cabBookingId: cabRow.id },
        });

        if (cabSrc.bookedDates?.length) {
          await tx.bookedDate.createMany({
            data: cabSrc.bookedDates.map((bd: any) => ({
              cabBookingId: cabRow.id,
              // no cabOwnerId — removed from BookedDate model
              date: new Date(bd.date),
            })),
          });
        }
      }

      /* --- hotel workflow --- */
      // Always clean up, then recreate only if data exists
      await tx.hotelBookingDate.deleteMany({
        where: { hotel: { enquiryId: enquiry.id } },
      });
      await tx.hotel.deleteMany({
        where: { enquiryId: enquiry.id },
      });

      if (hotels.length > 0) {
        await Promise.all(
          hotels.map(async (h: any) => {
            const hotelRow = await tx.hotel.create({
              data: {
                enquiryId: enquiry.id,
                name: h.name ?? "",
              },
            });

            if (h.bookingDates?.length) {
              await tx.hotelBookingDate.createMany({
                data: h.bookingDates.map((bd: any) => ({
                  hotelId: hotelRow.id,
                  date: new Date(bd.date),
                })),
              });
            }
          })
        );
      }

      /* --- followUps workflow --- */
      if (newFollowUps.length > 0) {
        await tx.followUp.createMany({
          data: newFollowUps.map((f: any) => ({
            enquiryId: enquiry.id,
            date: new Date(f.date),
            message: f.message ?? "",
            employeeId,
          })),
        });
      }

      return enquiry;
    });

    /* --- completion email (outside transaction — side effect) --- */
    if (status === "Completed" && oldEnquiry?.status !== "Completed") {
      const customer = await prisma.customer.findUnique({
        where: { id: data.Customer.id },
      });
      if (customer) {
        await sendCompletionEmail(customer.email, enquiryRow);
      }
    }

    return NextResponse.json(
      { message: "Enquiry saved / updated", enquiryId: enquiryRow.id },
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