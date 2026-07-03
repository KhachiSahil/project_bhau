import { NEXT_AUTH_CONFIG } from "@/app/lib/auth";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const adminId = searchParams.get("adminId");
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);

    if (!adminId) {
      return NextResponse.json(
        { msg: "admin not found" },
        { status: 401 }
      );
    }

    const found = await prisma.admin.findUnique({
      where: { id: adminId },
      select: { id: true }
    });

    if (!found) {
      return NextResponse.json(
        { msg: "admin not found" },
        { status: 401 }
      );
    }

    const skip = (page - 1) * limit;

    const [enquiries, totalCount] = await Promise.all([
      prisma.enquiry.findMany({
        skip,
        take: limit,
        include: {
          Customer: true,
          destination: true,
          pickupLocation: true,
          dropLocation: true,
          followUps: true,
          website: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.enquiry.count(),
    ]);
    return NextResponse.json({
      enquiries,
      page,
      totalCount,
      hasNextPage: page * limit < totalCount,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { msg: "Internal Server Error" },
      { status: 500 }
    );
  }
}