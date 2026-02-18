import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const adminId = searchParams.get("adminId");

  if (!adminId)
    return NextResponse.json({ msg: "admin not found" }, { status: 401 });

  const found = await prisma.admin.findUnique({
    where: { id: adminId },
  });

  if (!found)
    return NextResponse.json({ msg: "admin not found" }, { status: 401 });

  const enquiries = await prisma.enquiry.findMany({
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
  });
  console.log(enquiries[0].destination)
  return NextResponse.json({ status: 200,enquiries});
}
