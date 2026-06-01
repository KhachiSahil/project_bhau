import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { differenceInDays } from "date-fns";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            pickupDate,
            dropDate,
            pickupLocation,
            dropLocation,
            destination,
            budget,
            adults,
            kids,
            vehicle,
            data
        } = body;
        console.log(body)
        // Validation
        if (!pickupDate || !dropDate || !pickupLocation || !dropLocation || !destination ||
            budget === undefined || adults === undefined || kids === undefined ||
            !vehicle || !data) {
            return NextResponse.json(
                { error: "Data incorrect or missing" },
                { status: 400 }
            );
        }

        const startDate = new Date(pickupDate);
        const endDate = new Date(dropDate);

        // Validate dates
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return NextResponse.json(
                { error: "Invalid date format" },
                { status: 400 }
            );
        }

        if (endDate <= startDate) {
            return NextResponse.json(
                { error: "Drop date must be after pickup date" },
                { status: 400 }
            );
        }

        const difference = differenceInDays(endDate, startDate) + 1;

        // Upsert destinations
        const pickup = await prisma.destination.upsert({
            where: { name: pickupLocation },
            update: {},
            create: { name: pickupLocation }
        });

        const drop = await prisma.destination.upsert({
            where: { name: dropLocation },
            update: {},
            create: { name: dropLocation }
        });

        const dest = await prisma.destination.upsert({
            where: { name: destination },
            update: {},
            create: { name: destination }
        });

        // Create/update itinerary
        const itinerary = await prisma.itinerary.upsert({
            where: {
                pickupLocationId_dropLocationId_destinationId_days: {
                    pickupLocationId: pickup.id,
                    dropLocationId: drop.id,
                    destinationId: dest.id,
                    days: difference
                }
            },
            update: { description: data },
            create: {
                pickupLocationId: pickup.id,
                dropLocationId: drop.id,
                destinationId: dest.id,
                days: difference,
                description: data
            }
        });

        return NextResponse.json(
            { message: "Success", itinerary },
            { status: 200 }
        );

    } catch (error) {
        console.error("POST /api/itinerary error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const pickupLocation = searchParams.get("pickup");
        const dropLocation = searchParams.get("drop");
        const destination = searchParams.get("destination");
        if (!pickupLocation || !dropLocation || !destination) {
            return NextResponse.json(
                { error: "Data missing" },
                { status: 400 }
            );
        }

        const [pickId, dropId, destinationId] = await Promise.all([
            prisma.destination.findUnique({
                where: { name: pickupLocation }
            }),
            prisma.destination.findUnique({
                where: { name: dropLocation }
            }),
            prisma.destination.findUnique({
                where: { name: destination }
            })
        ]);

        if (!pickId || !dropId || !destinationId) {
            return NextResponse.json(
                { error: "Destination not found" },
                { status: 404 }
            );
        }

        const itinerary = await prisma.itinerary.findMany({
            where: {
                pickupLocationId: pickId.id,
                dropLocationId: dropId.id,
                destinationId: destinationId.id
            }
        });

        if (itinerary.length == 0) {
            return NextResponse.json(
                { error: "Itinerary not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ itinerary,pickupLocation,dropLocation,destination }, { status: 200 });

    } catch (error) {
        console.error("GET /api/itinerary error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}