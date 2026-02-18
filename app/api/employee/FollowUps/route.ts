import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest){
    const {searchParams} = new URL(req.url);
    const empId = searchParams.get('empId');

    if(!empId)
        return NextResponse.json({msg : "employee id not found"},{status : 404}) 

    const followUps = await prisma.followUp.findMany({
        where : {
            employeeId : empId
        }
    })
    if(followUps)
        return NextResponse.json({followUps},{status : 200});
    else    
        return NextResponse.json({msg: "error occured"},{status : 404});
}