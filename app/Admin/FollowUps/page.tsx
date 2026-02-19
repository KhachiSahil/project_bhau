"use client"
import CalendarComponent from "@/components/Employee/FollowUps/Calendar";
import Followups from "@/components/Employee/FollowUps/Followups";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function FollowUps() {
        const [followups,setFollowups] = useState([]);
        const {data : session} = useSession();
        useEffect(()=>{
            async function getFollowUps(){
                const data = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Employee/FollowUps?empId=${session?.user.id}`)
                const fetchedData = await data.json()
                setFollowups(fetchedData.followUps)
            }
            getFollowUps();
        },[session])
    return (
        <div className="flex flex-col md:flex-row gap-5 w-full">
            <div className="flex flex-col gap-5 ">
                <CalendarComponent followUps={followups}/>
            </div>
            <div className="w-full md:h-full">
                <Followups followUps={followups}/>
            </div>
        </div>
    )
}