import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const data = await prisma.carTypes.findMany({
        orderBy: { name: "asc" },
    });
    if (!data)
        return NextResponse.json({ err: "Data not fetched" }, { status: 404 });

    return NextResponse.json({ data }, { status: 200 });
}

export async function POST(req: NextRequest) {
    try {
        const params = await req.json();
        const {name, price } = params;
        console.log(name,price)
        if (!name || price === undefined || price === "")
            return NextResponse.json({ err: "Data not fetched" }, { status: 404 });

        const response = await prisma.carTypes.upsert({
            where: { name },
            update: { name, Price: price },
            create: { name, Price: price },
        });

        return NextResponse.json({ msg: "Cab type upserted successfully", data: response }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ err: err }, { status: 404 });
    }
}