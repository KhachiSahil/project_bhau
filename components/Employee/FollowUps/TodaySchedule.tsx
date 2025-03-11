"use client"
import { useState } from "react";

export default function TodaySchedule() {
    const [followUps] = useState<string[]>([]);

    // Get today's date
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="p-1 md:p-6 flex flex-col justify-center text-center bg-white shadow-md rounded-lg w-full mx-auto">
            {/* Header */}
            <div className="mb-4">
                <h2 className="text-2xl font-bold">Todays Schedule</h2>
                <p className="text-gray-600">Your follow-ups for {formattedDate}</p>
            </div>

            {/* Follow-ups List */}
            <div className="mt-2">
                {followUps.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2">
                        {followUps.map((followUp, index) => (
                            <li key={index} className="text-gray-800 font-medium">
                                {followUp}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 italic">No follow-ups scheduled for today</p>
                )}
            </div>
        </div>
    );
}
