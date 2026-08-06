import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";

// Returns every CabOwner with their cabs and each cab's bookings (with booked date ranges),
// which is exactly the shape CabManagement.tsx needs to render the owner list + calendar.
export async function GET(req: NextRequest) {
    try {
        const data = await prisma.cabOwner.findMany({
            orderBy: { name: "asc" },
            include: {
                cabs: {
                    include: {
                        bookings: {
                            include: {
                                bookedDates: true,
                                enquiry: {
                                    include: {
                                        Customer: true,
                                        destination: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({ data: data ?? [] }, { status: 200 });
    } catch (err: any) {
        console.error("GET /api/Admin/CabOwner error:", err);
        return NextResponse.json({ err: err?.message || "Failed to fetch cab owners" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const params = await req.json();
        const { id, name, phone } = params;

        if (!name || !name.trim()) {
            return NextResponse.json({ err: "Owner name is required" }, { status: 400 });
        }

        let response;
        if (id) {
            response = await prisma.cabOwner.upsert({
                where: { id },
                update: { name: name.trim(), phone: phone || "" },
                create: { id, name: name.trim(), phone: phone || "" },
                include: {
                    cabs: {
                        include: {
                            bookings: {
                                include: {
                                    bookedDates: true,
                                    enquiry: {
                                        include: {
                                            Customer: true,
                                            destination: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
        } else {
            response = await prisma.cabOwner.create({
                data: { name: name.trim(), phone: phone || "" },
                include: {
                    cabs: {
                        include: {
                            bookings: {
                                include: {
                                    bookedDates: true,
                                    enquiry: {
                                        include: {
                                            Customer: true,
                                            destination: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
        }

        return NextResponse.json({ msg: "Cab owner saved successfully", data: response }, { status: 200 });
    } catch (err: any) {
        console.error("POST /api/Admin/CabOwner error:", err);
        return NextResponse.json({ err: err?.message || "Failed to save cab owner" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ err: "Owner ID is required" }, { status: 400 });
        }

        // Delete associated cab bookings, booked dates, cabs, and then owner
        await prisma.$transaction(async (tx) => {
            const cabs = await tx.cab.findMany({ where: { ownerId: id }, select: { id: true } });
            const cabIds = cabs.map((c) => c.id);

            if (cabIds.length > 0) {
                const bookings = await tx.cabBooking.findMany({
                    where: { cabId: { in: cabIds } },
                    select: { id: true },
                });
                const bookingIds = bookings.map((b) => b.id);

                if (bookingIds.length > 0) {
                    await tx.bookedDate.deleteMany({ where: { cabBookingId: { in: bookingIds } } });
                    await tx.cabBooking.deleteMany({ where: { id: { in: bookingIds } } });
                }
                await tx.cab.deleteMany({ where: { ownerId: id } });
            }

            await tx.cabOwner.delete({ where: { id } });
        });

        return NextResponse.json({ msg: "Cab owner deleted successfully" }, { status: 200 });
    } catch (err: any) {
        console.error("DELETE /api/Admin/CabOwner error:", err);
        return NextResponse.json({ err: err?.message || "Failed to delete cab owner" }, { status: 500 });
    }
}