import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";

// Returns every CabOwner with their cabs and each cab's bookings (with booked date ranges),
// which is exactly the shape CabManagement.tsx needs to render the owner list + calendar.
export async function GET(req: NextRequest) {
    const data = await prisma.cabOwner.findMany({
        orderBy: { name: "asc" },
        include: {
            cabs: {
                include: {
                    bookings: {
                        include: { bookedDates: true },
                    },
                },
            },
        },
    });
    if (!data)
        return NextResponse.json({ err: "Data not fetched" }, { status: 404 });

    return NextResponse.json({ data }, { status: 200 });
}

export async function POST(req: NextRequest) {
    try {
        const params = await req.json();
        const { id, name, phone } = params;

        if (!id || !name)
            return NextResponse.json({ err: "Data not fetched" }, { status: 404 });

        const response = await prisma.cabOwner.upsert({
            where: { id },
            update: { name, phone },
            create: { id, name, phone },
        });

        return NextResponse.json({ msg: "Cab owner upserted successfully", data: response }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ err: err }, { status: 404 });
    }
}