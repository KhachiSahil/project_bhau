import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";

// GET a single employee's current website assignments + active status
// Used when the modal opens, to hydrate assignedWebsites/isActive for that employee.
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const employeeId = searchParams.get("employeeId");

        if (!employeeId)
            return NextResponse.json({ err: "employeeId is required" }, { status: 404 });

        const employee = await prisma.employee.findUnique({
            where: { id: employeeId },
            include: { websites: true },
        });

        if (!employee)
            return NextResponse.json({ err: "Employee not found" }, { status: 404 });

        return NextResponse.json({ data: employee }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ err: err }, { status: 404 });
    }
}

// POST updates an employee's website assignments and active status in one call.
// websiteIds is the full desired list (not a delta) — `set` replaces the relation wholesale,
// so unassigning a website is just leaving its id out of the array.
export async function POST(req: NextRequest) {
    console.log("hi")
    try {
        const params = await req.json();
        const { employeeId, websiteIds} = params;
        console.log(employeeId)
        if (!employeeId)
            return NextResponse.json({ err: "employeeId is required" }, { status: 404 });

        const response = await prisma.employee.update({
            where: { id: employeeId },
            data: {
                websites: {
                    set: (websiteIds ?? []).map((id: string) => ({ id })),
                },
            },
            include: { websites: true },
        });

        return NextResponse.json({ msg: "Employee updated successfully", data: response }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ err: err }, { status: 404 });
    }
}