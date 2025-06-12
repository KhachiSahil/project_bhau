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

            cabBookingId = cabBooking.id;

            const bookedDates = cabDates.map((dateStr) => ({
                date: new Date(dateStr),
                cabBookingId: cabBooking.id,
                cabOwnerId: cabOwnerData.id,
            }));

            await prisma.bookedDate.createMany({
                data: bookedDates,
            });
        }

        return NextResponse.json({ message: "Enquiry created successfully", enquiryId: enquiry.id }, { status: 201 });

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
        // const website = await prisma.website.findUnique({
        //     where: { name: websiteName },
        // });

        // if (!website) {
        //     return NextResponse.json({ error: "Website not found" }, { status: 404 });
        // }
        const website = {
            id : '162ca5cc-3029-4a90-9c31-8bb33a9d9285',
            name : 'TravelHangouts'
        }
        const skip = (page - 1) * limit;
        // Get all enquiries matching the employeeId and websiteId
        // const [enquiries, totalCount] = await Promise.all([
        //     prisma.enquiry.findMany({
        //         where: {
        //             websiteId: website.id,
        //             employeeId
        //         },
        //         include: {
        //             Customer: true,
        //             pickupLocation: true,
        //             dropLocation: true,
        //             destination: true,
        //         },
        //         orderBy: {
        //             createdAt: 'desc'
        //         },
        //         skip,
        //         take: limit,
        //     }),
        //     prisma.enquiry.count({
        //         where: {
        //             employeeId,
        //             websiteId: website.id
        //         }
        //     })
        // ])
        // const totalPages = Math.ceil(totalCount / limit);
        // console.log(enquiries)
        const dummyData = [
            {
                id: '44920628-b4a0-41ed-a295-fdab046d55cf',
                pickupDate: new Date('2025-06-03T00:00:00.000Z'),
                dropDate: new Date('2025-06-13T00:00:00.000Z'),
                adults: 1,
                kids: 0,
                requirements: 'better rooms with window view',
                status: 'Pending',
                createdAt: new Date('2025-06-11T17:05:06.743Z'),
                quotation: ['12345566'],
                pickupLocationId: '36cc2a4b-42f9-4739-87e6-7f34cb769cb7',
                dropLocationId: '85d633cc-0c42-418d-a1d2-056e2644d65e',
                employeeId: 'd59497d2-f38c-4bb0-a23f-4df35f9331dd',
                websiteId: website.id,
                destinationId: 'fd742e3c-9d8e-46eb-89c2-93892d02f3ca',
                customerId: '08e792ea-9bc3-420b-8732-f570866958d0',
                Customer: {
                    id: '08e792ea-9bc3-420b-8732-f570866958d0',
                    name: 'sahil',
                    email: 'sahil@gmail.com',
                    phone: '98765432',
                },
                pickupLocation: { id: '36cc2a4b-42f9-4739-87e6-7f34cb769cb7', name: 'Pathankot' },
                dropLocation: { id: '85d633cc-0c42-418d-a1d2-056e2644d65e', name: 'Kullu' },
                destination: { id: 'fd742e3c-9d8e-46eb-89c2-93892d02f3ca', name: 'Shimla' },
            },
            {
                id: '1b22a46f-60d6-4dd4-a0ce-6a1d54bfa1ce',
                pickupDate: new Date('2025-06-03T00:00:00.000Z'),
                dropDate: new Date('2025-06-13T00:00:00.000Z'),
                adults: 1,
                kids: 0,
                requirements: 'better rooms with window view',
                status: 'Completed',
                createdAt: new Date('2025-06-11T17:05:02.741Z'),
                quotation: ['12345566'],
                pickupLocationId: '36cc2a4b-42f9-4739-87e6-7f34cb769cb7',
                dropLocationId: '85d633cc-0c42-418d-a1d2-056e2644d65e',
                employeeId: 'd59497d2-f38c-4bb0-a23f-4df35f9331dd',
                websiteId: website.id,
                destinationId: 'fd742e3c-9d8e-46eb-89c2-93892d02f3ca',
                customerId: '08e792ea-9bc3-420b-8732-f570866958d0',
                Customer: {
                    id: '08e792ea-9bc3-420b-8732-f570866958d0',
                    name: 'sahil',
                    email: 'sahil@gmail.com',
                    phone: '98765432',
                },
                pickupLocation: { id: '36cc2a4b-42f9-4739-87e6-7f34cb769cb7', name: 'Pathankot' },
                dropLocation: { id: '85d633cc-0c42-418d-a1d2-056e2644d65e', name: 'Kullu' },
                destination: { id: 'fd742e3c-9d8e-46eb-89c2-93892d02f3ca', name: 'Shimla' },
            },
            {
                id: '1b22a46f-60d6-4dd4-a0ce-6a1d54bfa1ce',
                pickupDate: new Date('2025-06-03T00:00:00.000Z'),
                dropDate: new Date('2025-06-13T00:00:00.000Z'),
                adults: 1,
                kids: 0,
                requirements: 'better rooms with window view',
                status: 'Completed',
                createdAt: new Date('2025-06-11T17:05:02.741Z'),
                quotation: ['12345566'],
                pickupLocationId: '36cc2a4b-42f9-4739-87e6-7f34cb769cb7',
                dropLocationId: '85d633cc-0c42-418d-a1d2-056e2644d65e',
                employeeId: 'd59497d2-f38c-4bb0-a23f-4df35f9331dd',
                websiteId: website.id,
                destinationId: 'fd742e3c-9d8e-46eb-89c2-93892d02f3ca',
                customerId: '08e792ea-9bc3-420b-8732-f570866958d0',
                Customer: {
                    id: '08e792ea-9bc3-420b-8732-f570866958d0',
                    name: 'sahil',
                    email: 'sahil@gmail.com',
                    phone: '98765432',
                },
                pickupLocation: { id: '36cc2a4b-42f9-4739-87e6-7f34cb769cb7', name: 'Pathankot' },
                dropLocation: { id: '85d633cc-0c42-418d-a1d2-056e2644d65e', name: 'Kullu' },
                destination: { id: 'fd742e3c-9d8e-46eb-89c2-93892d02f3ca', name: 'Shimla' },
            },
            {
                id: '1b22a46f-60d6-4dd4-a0ce-6a1d54bfa1ce',
                pickupDate: new Date('2025-06-03T00:00:00.000Z'),
                dropDate: new Date('2025-06-13T00:00:00.000Z'),
                adults: 1,
                kids: 0,
                requirements: 'better rooms with window view',
                status: 'Completed',
                createdAt: new Date('2025-06-11T17:05:02.741Z'),
                quotation: ['12345566'],
                pickupLocationId: '36cc2a4b-42f9-4739-87e6-7f34cb769cb7',
                dropLocationId: '85d633cc-0c42-418d-a1d2-056e2644d65e',
                employeeId: 'd59497d2-f38c-4bb0-a23f-4df35f9331dd',
                websiteId: website.id,
                destinationId: 'fd742e3c-9d8e-46eb-89c2-93892d02f3ca',
                customerId: '08e792ea-9bc3-420b-8732-f570866958d0',
                Customer: {
                    id: '08e792ea-9bc3-420b-8732-f570866958d0',
                    name: 'sahil',
                    email: 'sahil@gmail.com',
                    phone: '98765432',
                },
                pickupLocation: { id: '36cc2a4b-42f9-4739-87e6-7f34cb769cb7', name: 'Pathankot' },
                dropLocation: { id: '85d633cc-0c42-418d-a1d2-056e2644d65e', name: 'Kullu' },
                destination: { id: 'fd742e3c-9d8e-46eb-89c2-93892d02f3ca', name: 'Shimla' },
            },
            {
                id: '1b22a46f-60d6-4dd4-a0ce-6a1d54bfa1ce',
                pickupDate: new Date('2025-06-03T00:00:00.000Z'),
                dropDate: new Date('2025-06-13T00:00:00.000Z'),
                adults: 1,
                kids: 0,
                requirements: 'better rooms with window view',
                status: 'Completed',
                createdAt: new Date('2025-06-11T17:05:02.741Z'),
                quotation: ['12345566'],
                pickupLocationId: '36cc2a4b-42f9-4739-87e6-7f34cb769cb7',
                dropLocationId: '85d633cc-0c42-418d-a1d2-056e2644d65e',
                employeeId: 'd59497d2-f38c-4bb0-a23f-4df35f9331dd',
                websiteId: website.id,
                destinationId: 'fd742e3c-9d8e-46eb-89c2-93892d02f3ca',
                customerId: '08e792ea-9bc3-420b-8732-f570866958d0',
                Customer: {
                    id: '08e792ea-9bc3-420b-8732-f570866958d0',
                    name: 'sahil',
                    email: 'sahil@gmail.com',
                    phone: '98765432',
                },
                pickupLocation: { id: '36cc2a4b-42f9-4739-87e6-7f34cb769cb7', name: 'Pathankot' },
                dropLocation: { id: '85d633cc-0c42-418d-a1d2-056e2644d65e', name: 'Kullu' },
                destination: { id: 'fd742e3c-9d8e-46eb-89c2-93892d02f3ca', name: 'Shimla' },
            },
            {
                id: '1b22a46f-60d6-4dd4-a0ce-6a1d54bfa1ce',
                pickupDate: new Date('2025-06-03T00:00:00.000Z'),
                dropDate: new Date('2025-06-13T00:00:00.000Z'),
                adults: 1,
                kids: 0,
                requirements: 'better rooms with window view',
                status: 'Completed',
                createdAt: new Date('2025-06-11T17:05:02.741Z'),
                quotation: ['12345566'],
                pickupLocationId: '36cc2a4b-42f9-4739-87e6-7f34cb769cb7',
                dropLocationId: '85d633cc-0c42-418d-a1d2-056e2644d65e',
                employeeId: 'd59497d2-f38c-4bb0-a23f-4df35f9331dd',
                websiteId: website.id,
                destinationId: 'fd742e3c-9d8e-46eb-89c2-93892d02f3ca',
                customerId: '08e792ea-9bc3-420b-8732-f570866958d0',
                Customer: {
                    id: '08e792ea-9bc3-420b-8732-f570866958d0',
                    name: 'sahil',
                    email: 'sahil@gmail.com',
                    phone: '98765432',
                },
                pickupLocation: { id: '36cc2a4b-42f9-4739-87e6-7f34cb769cb7', name: 'Pathankot' },
                dropLocation: { id: '85d633cc-0c42-418d-a1d2-056e2644d65e', name: 'Kullu' },
                destination: { id: 'fd742e3c-9d8e-46eb-89c2-93892d02f3ca', name: 'Shimla' },
            },
            {
                id: '1b22a46f-60d6-4dd4-a0ce-6a1d54bfa1ce',
                pickupDate: new Date('2025-06-03T00:00:00.000Z'),
                dropDate: new Date('2025-06-13T00:00:00.000Z'),
                adults: 1,
                kids: 0,
                requirements: 'better rooms with window view',
                status: 'Completed',
                createdAt: new Date('2025-06-11T17:05:02.741Z'),
                quotation: ['12345566'],
                pickupLocationId: '36cc2a4b-42f9-4739-87e6-7f34cb769cb7',
                dropLocationId: '85d633cc-0c42-418d-a1d2-056e2644d65e',
                employeeId: 'd59497d2-f38c-4bb0-a23f-4df35f9331dd',
                websiteId: website.id,
                destinationId: 'fd742e3c-9d8e-46eb-89c2-93892d02f3ca',
                customerId: '08e792ea-9bc3-420b-8732-f570866958d0',
                Customer: {
                    id: '08e792ea-9bc3-420b-8732-f570866958d0',
                    name: 'sahil',
                    email: 'sahil@gmail.com',
                    phone: '98765432',
                },
                pickupLocation: { id: '36cc2a4b-42f9-4739-87e6-7f34cb769cb7', name: 'Pathankot' },
                dropLocation: { id: '85d633cc-0c42-418d-a1d2-056e2644d65e', name: 'Kullu' },
                destination: { id: 'fd742e3c-9d8e-46eb-89c2-93892d02f3ca', name: 'Shimla' },
            },
            {
                id: '1b22a46f-60d6-4dd4-a0ce-6a1d54bfa1ce',
                pickupDate: new Date('2025-06-03T00:00:00.000Z'),
                dropDate: new Date('2025-06-13T00:00:00.000Z'),
                adults: 1,
                kids: 0,
                requirements: 'better rooms with window view',
                status: 'Completed',
                createdAt: new Date('2025-06-11T17:05:02.741Z'),
                quotation: ['12345566'],
                pickupLocationId: '36cc2a4b-42f9-4739-87e6-7f34cb769cb7',
                dropLocationId: '85d633cc-0c42-418d-a1d2-056e2644d65e',
                employeeId: 'd59497d2-f38c-4bb0-a23f-4df35f9331dd',
                websiteId: website.id,
                destinationId: 'fd742e3c-9d8e-46eb-89c2-93892d02f3ca',
                customerId: '08e792ea-9bc3-420b-8732-f570866958d0',
                Customer: {
                    id: '08e792ea-9bc3-420b-8732-f570866958d0',
                    name: 'sahil',
                    email: 'sahil@gmail.com',
                    phone: '98765432',
                },
                pickupLocation: { id: '36cc2a4b-42f9-4739-87e6-7f34cb769cb7', name: 'Pathankot' },
                dropLocation: { id: '85d633cc-0c42-418d-a1d2-056e2644d65e', name: 'Kullu' },
                destination: { id: 'fd742e3c-9d8e-46eb-89c2-93892d02f3ca', name: 'Shimla' },
            },
            {
                id: '1b22a46f-60d6-4dd4-a0ce-6a1d54bfa1ce',
                pickupDate: new Date('2025-06-03T00:00:00.000Z'),
                dropDate: new Date('2025-06-13T00:00:00.000Z'),
                adults: 1,
                kids: 0,
                requirements: 'better rooms with window view',
                status: 'Completed',
                createdAt: new Date('2025-06-11T17:05:02.741Z'),
                quotation: ['12345566'],
                pickupLocationId: '36cc2a4b-42f9-4739-87e6-7f34cb769cb7',
                dropLocationId: '85d633cc-0c42-418d-a1d2-056e2644d65e',
                employeeId: 'd59497d2-f38c-4bb0-a23f-4df35f9331dd',
                websiteId: website.id,
                destinationId: 'fd742e3c-9d8e-46eb-89c2-93892d02f3ca',
                customerId: '08e792ea-9bc3-420b-8732-f570866958d0',
                Customer: {
                    id: '08e792ea-9bc3-420b-8732-f570866958d0',
                    name: 'sahil',
                    email: 'sahil@gmail.com',
                    phone: '98765432',
                },
                pickupLocation: { id: '36cc2a4b-42f9-4739-87e6-7f34cb769cb7', name: 'Pathankot' },
                dropLocation: { id: '85d633cc-0c42-418d-a1d2-056e2644d65e', name: 'Kullu' },
                destination: { id: 'fd742e3c-9d8e-46eb-89c2-93892d02f3ca', name: 'Shimla' },
            },
            {
                id: '1b22a46f-60d6-4dd4-a0ce-6a1d54bfa1ce',
                pickupDate: new Date('2025-06-03T00:00:00.000Z'),
                dropDate: new Date('2025-06-13T00:00:00.000Z'),
                adults: 1,
                kids: 0,
                requirements: 'better rooms with window view',
                status: 'Completed',
                createdAt: new Date('2025-06-11T17:05:02.741Z'),
                quotation: ['12345566'],
                pickupLocationId: '36cc2a4b-42f9-4739-87e6-7f34cb769cb7',
                dropLocationId: '85d633cc-0c42-418d-a1d2-056e2644d65e',
                employeeId: 'd59497d2-f38c-4bb0-a23f-4df35f9331dd',
                websiteId: website.id,
                destinationId: 'fd742e3c-9d8e-46eb-89c2-93892d02f3ca',
                customerId: '08e792ea-9bc3-420b-8732-f570866958d0',
                Customer: {
                    id: '08e792ea-9bc3-420b-8732-f570866958d0',
                    name: 'sahil',
                    email: 'sahil@gmail.com',
                    phone: '98765432',
                },
                pickupLocation: { id: '36cc2a4b-42f9-4739-87e6-7f34cb769cb7', name: 'Pathankot' },
                dropLocation: { id: '85d633cc-0c42-418d-a1d2-056e2644d65e', name: 'Kullu' },
                destination: { id: 'fd742e3c-9d8e-46eb-89c2-93892d02f3ca', name: 'Shimla' },
            },
            {
                id: '1b22a46f-60d6-4dd4-a0ce-6a1d54bfa1ce',
                pickupDate: new Date('2025-06-03T00:00:00.000Z'),
                dropDate: new Date('2025-06-13T00:00:00.000Z'),
                adults: 1,
                kids: 0,
                requirements: 'better rooms with window view',
                status: 'Completed',
                createdAt: new Date('2025-06-11T17:05:02.741Z'),
                quotation: ['12345566'],
                pickupLocationId: '36cc2a4b-42f9-4739-87e6-7f34cb769cb7',
                dropLocationId: '85d633cc-0c42-418d-a1d2-056e2644d65e',
                employeeId: 'd59497d2-f38c-4bb0-a23f-4df35f9331dd',
                websiteId: website.id,
                destinationId: 'fd742e3c-9d8e-46eb-89c2-93892d02f3ca',
                customerId: '08e792ea-9bc3-420b-8732-f570866958d0',
                Customer: {
                    id: '08e792ea-9bc3-420b-8732-f570866958d0',
                    name: 'sahil',
                    email: 'sahil@gmail.com',
                    phone: '98765432',
                },
                pickupLocation: { id: '36cc2a4b-42f9-4739-87e6-7f34cb769cb7', name: 'Pathankot' },
                dropLocation: { id: '85d633cc-0c42-418d-a1d2-056e2644d65e', name: 'Kullu' },
                destination: { id: 'fd742e3c-9d8e-46eb-89c2-93892d02f3ca', name: 'Shimla' },
            },
        ];
        console.log(page)
        return NextResponse.json({
            // data: enquiries, page, totalPages, totalCount,,
            enquiries  :dummyData,
            hasPrevPage: 0 > 1,
            hasNextPage: 2 < 3
        }, { status: 200 });

    } catch (error) {
        console.error("[GET_ENQUIRIES_ERROR]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }   
}