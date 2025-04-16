"use client";
import CabList from "@/components/Admin/Cab/CabList";
import CalanderList from "@/components/Admin/Cab/CalanderList";
import EnquiriesList from "@/components/Admin/Cab/EnquiriesList";
import { useState } from "react";

const OPTIONS = ["Enquiries", "Cabs", "Calander"] as const; // `as const` makes it a readonly tuple

type OptionType = (typeof OPTIONS)[number];

export default function Cab() {
    const [showData, setIsShowData] = useState<OptionType>("Enquiries");

    return (
        <div>
            <div className="flex gap-2 justify-end">
                <div className="text-xl my-auto font-bold text-gray-700">Show by:</div>
                <div className="border rounded-md p-2 font-bold hover:cursor-pointer">
                    <select onChange={(e) => setIsShowData(e.target.value as OptionType)}>
                        {OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {showData === "Enquiries" && <EnquiriesList />}
            {showData === "Cabs" && <CabList />}
            {showData === "Calander" && <CalanderList />}
        </div>
    );
}
