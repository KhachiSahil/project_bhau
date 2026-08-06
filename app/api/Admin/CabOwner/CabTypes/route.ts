import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const data = await prisma.carTypes.findMany({
            orderBy: { name: "asc" },
        });
        return NextResponse.json({ data: data ?? [] }, { status: 200 });
    } catch (err: any) {
        console.error("GET /api/Admin/CabOwner/CabTypes error:", err);
        return NextResponse.json({ err: err?.message || "Failed to fetch cab types" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const params = await req.json();
        const { name, price } = params;
        
        if (!name || price === undefined || price === "") {
            return NextResponse.json({ err: "Car type name and price are required" }, { status: 400 });
        }

        const response = await prisma.carTypes.upsert({
            where: { name: name.trim() },
            update: { Price: String(price) },
            create: { name: name.trim(), Price: String(price) },
        });

        return NextResponse.json({ msg: "Cab type saved successfully", data: response }, { status: 200 });
    } catch (err: any) {
        console.error("POST /api/Admin/CabOwner/CabTypes error:", err);
        return NextResponse.json({ err: err?.message || "Failed to save cab type" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ err: "Cab type ID is required" }, { status: 400 });
        }

        await prisma.carTypes.delete({ where: { id } });

        return NextResponse.json({ msg: "Cab type deleted successfully" }, { status: 200 });
    } catch (err: any) {
        console.error("DELETE /api/Admin/CabOwner/CabTypes error:", err);
        return NextResponse.json({ err: err?.message || "Failed to delete cab type" }, { status: 500 });
    }
}