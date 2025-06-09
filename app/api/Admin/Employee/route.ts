import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, password, phone } = body;

        if (!name || !password || !phone) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existingUser = await prisma.employee.findFirst({
            where: {
                name,
            },
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }

        const newUser = await prisma.employee.create({
            data: {
                name,
                password,
                phone,
            },
            select: {
                id: true,
                name: true,
                phone: true,
            },
        });

        return NextResponse.json({ message: "User created", user: newUser }, { status: 201 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function GET() {
    const data = await prisma.employee.findMany({
        where: {},
        select: {
            id: true,
            name: true,
            phone: true,
            createdAt : true
        }
    })
    if (!data) {
        return NextResponse.json({ err: 'employees not found' }, { status: 409 })
    }
    return NextResponse.json({ data }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
        }

        const deletedEmployee = await prisma.employee.delete({
            where: {
                id: id,
            },
            select: {
                id: true,
                name: true,
                phone: true,
            },
        });

        return NextResponse.json({ message: "Employee deleted", employee: deletedEmployee }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to delete employee", }, { status: 500 });
    }
}
