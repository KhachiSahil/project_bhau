import { NEXT_AUTH_CONFIG } from "@/app/lib/auth";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const empId = searchParams.get('empId');
    if (!type || !empId)
        return NextResponse.json({ "error": "Parameters missing" }, { status: 500 })
    switch (type) {
        case 'Stats':
            try {
                const [totalEnquiries, conversionRate, pendingFollowUps, revenueGenerated] = await Promise.all([
                    prisma.enquiry.count({
                        where: {
                            employeeId: empId
                        }
                    }),
                    prisma.enquiry.count({
                        where: {
                            employeeId: empId,
                            status: "Completed"
                        }
                    }),
                    prisma.followUp.count({
                        where: {
                            employeeId: empId,
                            date: {
                                gte: new Date(),
                            },
                        }
                    }),
                    prisma.enquiry.aggregate({
                        where: {
                            employeeId: empId,
                            status: "Completed"
                        },
                        _sum: {
                            //figuring out how to implement quotation part;
                            kids: true
                        }
                    })
                ])
                return NextResponse.json({
                    "totalEnquiries": totalEnquiries,
                    "conversionRate": ((conversionRate / totalEnquiries) * 100).toFixed(2),
                    "pendingFollowups": pendingFollowUps,
                    "revenueGenerated": 4500

                })
            } catch (err) {
                return NextResponse.json({ "error": err }, { status: 500 });
            }
        case 'Enquiries':
            try {
                const fetchedData = await prisma.followUp.findMany({
                    orderBy: { date: 'asc' },
                    where: {
                        date: {
                            gte: new Date()
                        },
                        employeeId: empId
                    },
                    select: {
                        message: true,
                        date: true,
                        enquiry: {
                            select: {
                                id: true,
                                destination: {
                                    select: {
                                        name: true
                                    }
                                },
                                Customer: {
                                    select: {
                                        name: true,
                                        phone: true
                                    }
                                }
                            }
                        }
                    }
                })
                return NextResponse.json(fetchedData, { status: 200 })
            } catch (err) {
                return NextResponse.json({ "error": "Data not fetched" }, { status: 500 });
            }
        default:
            return NextResponse.json({ "error": "Data not fetched" }, { status: 500 })
    }


}