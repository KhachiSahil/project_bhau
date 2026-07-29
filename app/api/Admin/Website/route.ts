import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const request = searchParams.get("request");
    if (request === 'dropdown') {
        const data = await prisma.website.findMany({
            where : {
                status : 'Active'
            },
            orderBy: {
                status: 'asc'
            }
        });
        if (!data)
            return NextResponse.json({ err: "Data not fetched" }, { status: 404 });
        return NextResponse.json({ data }, { status: 200 })
    } else if (request === 'page') {
        const data = await prisma.website.findMany({
            orderBy: {
                status: 'asc'
            }
        });
        if (!data)
            return NextResponse.json({ err: "Data not fetched" }, { status: 404 });
        return NextResponse.json({ data }, { status: 200 })
    }else{
        return NextResponse.json({ err: "Wrong request" }, { status: 404 });
    }

}

export async function POST(req: NextRequest) {
    try {
        const params = await req.json();
        console.log(params)
        const { id, name, url, status, description } = params;

        if (!id || !name)
            return NextResponse.json({ err: "Data not fetched" }, { status: 404 });

        const response = await prisma.website.upsert({
            where: {
                id: id
            },
            update: {
                name,
                url,
                status,
                description
            },
            create: {
                name,
                url,
                status,
                description
            }
        })
        return NextResponse.json({ msg: "Website upserted successfully" }, { status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ err: err }, { status: 404 })
    }
}