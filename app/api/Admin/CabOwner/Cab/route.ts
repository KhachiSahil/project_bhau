import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";

// Adds/updates a cab belonging to a specific owner. No pricing fields here on purpose.
export async function POST(req: NextRequest) {
    try {
        const params = await req.json();
        const { id, ownerId, model, plateNumber, seats, type } = params;

        if (!id || !ownerId || !model || !plateNumber)
            return NextResponse.json({ err: "Data not fetched" }, { status: 404 });

        const response = await prisma.cab.upsert({
            where: { id },
            update: { model, plateNumber, seats, type, ownerId },
            create: { id, model, plateNumber, seats, type, ownerId },
        });

        return NextResponse.json({ msg: "Cab upserted successfully", data: response }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ err: err }, { status: 404 });
    }
}