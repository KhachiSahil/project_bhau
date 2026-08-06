import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";

// Adds/updates a cab belonging to a specific owner. No pricing fields here on purpose.
export async function POST(req: NextRequest) {
    try {
        const params = await req.json();
        const { id, ownerId, model, plateNumber, seats, type } = params;

        if (!ownerId || !model || !plateNumber) {
            return NextResponse.json({ err: "Missing required cab details (ownerId, model, plateNumber)" }, { status: 400 });
        }

        const seatCount = Number(seats) || 4;

        let response;
        if (id) {
            response = await prisma.cab.upsert({
                where: { id },
                update: { model, plateNumber, seats: seatCount, type: type || "Sedan", ownerId },
                create: { id, model, plateNumber, seats: seatCount, type: type || "Sedan", ownerId },
            });
        } else {
            response = await prisma.cab.create({
                data: { model, plateNumber, seats: seatCount, type: type || "Sedan", ownerId },
            });
        }

        return NextResponse.json({ msg: "Cab saved successfully", data: response }, { status: 200 });
    } catch (err: any) {
        console.error("POST /api/Admin/CabOwner/Cab error:", err);
        return NextResponse.json({ err: err?.message || "Failed to save cab" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ err: "Cab ID is required" }, { status: 400 });
        }

        await prisma.$transaction(async (tx) => {
            const bookings = await tx.cabBooking.findMany({
                where: { cabId: id },
                select: { id: true },
            });
            const bookingIds = bookings.map((b) => b.id);

            if (bookingIds.length > 0) {
                await tx.bookedDate.deleteMany({ where: { cabBookingId: { in: bookingIds } } });
                await tx.cabBooking.deleteMany({ where: { id: { in: bookingIds } } });
            }
            await tx.cab.delete({ where: { id } });
        });

        return NextResponse.json({ msg: "Cab deleted successfully" }, { status: 200 });
    } catch (err: any) {
        console.error("DELETE /api/Admin/CabOwner/Cab error:", err);
        return NextResponse.json({ err: err?.message || "Failed to delete cab" }, { status: 500 });
    }
}