import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest){
    const body = await req.json();
    const {
        pickupDate,
        dropDate,
        pickupLocation,
        dropLocation,
        budget,
        adults,
        kids,
        vehicle,
        data
    } = body

    if(!pickupDate || !dropDate || !pickupLocation || !dropLocation || !budget || !adults || !kids || !vehicle || !data){
        return NextResponse.json({error : "Data incorrect or misssing"},{status : 400})
    }



    await prisma.itinerary.create({
        data : {
            pickupLocation : pickupLocation,
            dropLocation : dropLocation,
            days : kids,
            description : data
        }
    })

    console.log(body)
    return NextResponse.json({status : 200})
}