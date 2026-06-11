import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db';


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            data,
            EmployeeId,
            hotelSelection,
            selection,
        } = body;

        const {
            pickupDate,
            dropDate,
            adults,
            kids,
            requirements,
            quotation,
            cabOwner,
            pickupLocationName,
            dropLocationName,
            destinationName,
            websiteName,
            customer,
        } = data;

        // 1. Create or find Customer
        const customerData = await prisma.customer.upsert({
            where: {
                email: customer.email,
            },
            update: {
                name: customer.name,
                phone: customer.phone,
            },
            create: {
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
            },
        });

        // 2. Find or create required foreign keys
        const [pickupLoc, dropLoc, destination, website, cabOwnerData] = await Promise.all([
            prisma.destination.upsert({
                where: { name: pickupLocationName },
                update: {},
                create: { name: pickupLocationName },
            }),
            prisma.destination.upsert({
                where: { name: dropLocationName },
                update: {},
                create: { name: dropLocationName },
            }),
            prisma.destination.upsert({
                where: { name: destinationName },
                update: {},
                create: { name: destinationName },
            }),
            prisma.website.upsert({
                where: { name: websiteName },
                update: {},
                create: { name: websiteName },
            }),
            prisma.cabOwner.upsert({
                where: { name: cabOwner },
                update: {},
                create: { name: cabOwner, phone: "" },
            }),
        ]);

        // 3. Create Enquiry
        const enquiry = await prisma.enquiry.create({
            data: {
                pickupDate: new Date(pickupDate),
                dropDate: new Date(dropDate),
                adults: parseInt(adults),
                kids: parseInt(kids),
                requirements,
                quotation: [quotation],
                pickupLocationId: pickupLoc.id,
                dropLocationId: dropLoc.id,
                destinationId: destination.id,
                websiteId: website.id,
                employeeId: EmployeeId,
                customerId: customerData.id,
            },
        });

        // 4. Create Hotel & HotelBookingDate entries
        for (const [dateStr, hotelName] of Object.entries(hotelSelection)) {
            const hotel = await prisma.hotel.create({
                data: {
                    name: hotelName as string,
                    enquiryId: enquiry.id,
                },
            });

            await prisma.hotelBookingDate.create({
                data: {
                    date: new Date(dateStr),
                    hotelId: hotel.id,
                },
            });
        }

        // 5. Create CabBooking if any cab days selected
        const cabDates: string[] = Object.entries(selection)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .filter(([_, value]) => (value as { cab?: boolean }).cab)
            .map(([date]) => date);

        let cabBookingId: string | null = null;

        if (cabDates.length > 0) {
            const cabBooking = await prisma.cabBooking.create({
                data: {
                    enquiryId: enquiry.id,
                    pickupDate: new Date(pickupDate),
                    dropDate: new Date(dropDate),
                    cabOwnerId: cabOwnerData.id,
                },
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            cabBookingId = cabBooking.id;

            const bookedDates = cabDates.map((dateStr) => ({
                date: new Date(dateStr),
                cabBookingId: cabBooking.id,
            }));

            await prisma.bookedDate.createMany({
                data: bookedDates,
            });
        }

        return NextResponse.json({ message: "Enquiry created successfully", enquiryId: enquiry.id }, { status: 200 });

    } catch (error) {
        console.error("[ENQUIRY_CREATE_ERROR]", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const websiteName = searchParams.get("websiteName");
        const employeeId = searchParams.get("employeeId");
        const pageParam = searchParams.get("page") || "1";
        const limitParam = searchParams.get("limit") || "10";
        const page = parseInt(pageParam, 10);
        const limit = parseInt(limitParam, 10);


        if (!websiteName || !employeeId) {
            return NextResponse.json({ error: "Missing websiteName or employeeId" }, { status: 400 });
        }

        // Find the website by name to get its ID
        const website = await prisma.website.findUnique({
            where: { name: websiteName },
        });

        if (!website) {
            return NextResponse.json({ error: "Website not found" }, { status: 404 });
        }

        const skip = (page - 1) * limit;
        // Get all enquiries matching the employeeId and websiteId
        const [enquiries, totalCount] = await Promise.all([
            prisma.enquiry.findMany({
                where: {
                    websiteId: website.id,
                    employeeId
                },
                include: {
                    Customer: true,
                    pickupLocation: true,
                    dropLocation: true,
                    destination: true,
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit,
            }),
            prisma.enquiry.count({
                where: {
                    employeeId,
                    websiteId: website.id
                }
            })
        ])

        console.log("Fired backend api...")
        return NextResponse.json({
            // data: enquiries, page, totalPages, totalCount,,
            enquiries,
            page,
            totalCount,
            hasNextPage: page * limit < totalCount,
        }, { status: 200 });

    } catch (error) {
        console.error("[GET_ENQUIRIES_ERROR]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}