import prisma from "@/db"
import { NextRequest, NextResponse } from "next/server"

export async  function GET(){
    const followUps = await prisma.followUp.findMany({
        include: {
            employee: {
                select: {
                    name: true
                }
            }
        }
    })
    if(!followUps)
        return NextResponse.json({msg : "followUp error"},{status: 404})
    return NextResponse.json({followUps},{status:200})
}