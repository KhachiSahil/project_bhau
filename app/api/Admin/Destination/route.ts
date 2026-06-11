import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const data = await prisma.destination.findMany({
        orderBy : {
            name : 'asc'
        }
    });
    if (!data)
        return NextResponse.json({ err: "Data not fetched" }, { status: 404 });

    return NextResponse.json({ data }, { status: 200 })
}

// export async function DELETE(req: NextRequest) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const params = searchParams.get("id");
//         if (!params)
//             return NextResponse.json({ err: "Data not fetched" }, { status: 204 });

//         await prisma.destination.delete({
//             where: {
//                 id: params
//             }
//             }
//         )
//         return NextResponse.json(
//             { message: "Destination deleted successfully" },
//             { status: 200 }
//         );
//     } catch (err) {
//         return NextResponse.json({ err: err }, { status: 404 })
//     }
// }

export async function POST(req: NextRequest) {
    try {
        const params = await req.json();
        console.log(params)
        const { id, name, price, description } =params;
        
        if (!id || !name)
            return NextResponse.json({ err: "Data not fetched" }, { status: 404 });

        const response = await prisma.destination.upsert({
            where: {
                id: id
            },
            update: {
                name,
                price,
                description
            },
            create: {
                name,
                price,
                description
            }
        })
        console.log(response)
        return NextResponse.json({ msg: "Destination upserted successfully" }, { status: 200 })
    } catch (err) {
        console.log(err)
        return NextResponse.json({ err: err }, { status: 404 })
    }
}