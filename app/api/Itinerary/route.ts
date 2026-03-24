import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";
import differenceInDays from "date-fns/differenceInDays";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            pickupDate,
            dropDate,
            pickupLocation,
            dropLocation,
            budget,
            adults,
            kids,
            vehicle,
            data
        } = body;

        // Validation
        if (!pickupDate || !dropDate || !pickupLocation || !dropLocation || 
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

        // Create/update itinerary
        const itinerary = await prisma.itinerary.upsert({
            where: {
                pickupLocationId_dropLocationId_days: {
                    pickupLocationId: pickup.id,
                    dropLocationId: drop.id,
                    days: difference
                }
            },
            update: { description: data },
            create: {
                pickupLocationId: pickup.id,
                dropLocationId: drop.id,
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
        const days = searchParams.get("days");

        if (!pickupLocation || !dropLocation || !days) {
            return NextResponse.json(
                { error: "Data missing" }, 
                { status: 400 }
            );
        }

        const daysNumber = Number(days);
        if (isNaN(daysNumber) || daysNumber <= 0) {
            return NextResponse.json(
                { error: "Invalid days parameter" }, 
                { status: 400 }
            );
        }

        const pickId = await prisma.destination.findUnique({
            where: { name: pickupLocation }
        });

        const dropId = await prisma.destination.findUnique({
            where: { name: dropLocation }
        });

        if (!pickId || !dropId) {
            return NextResponse.json(
                { error: "Destination not found" }, 
                { status: 404 }
            );
        }

        const itinerary = await prisma.itinerary.findUnique({
            where: {
                pickupLocationId_dropLocationId_days: {
                    pickupLocationId: pickId.id,
                    dropLocationId: dropId.id,
                    days: daysNumber
                }
            }
        });

        if (!itinerary) {
            return NextResponse.json(
                { error: "Itinerary not found" }, 
                { status: 404 }
            );
        }

        return NextResponse.json({ itinerary }, { status: 200 });

    } catch (error) {
        console.error("GET /api/itinerary error:", error);
        return NextResponse.json(
            { error: "Internal server error" }, 
            { status: 500 }
        );
    }
}