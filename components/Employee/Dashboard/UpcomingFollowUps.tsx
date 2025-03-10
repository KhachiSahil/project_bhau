"use client";

import { Phone, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const followUps = [
  { name: "Michael Chen", time: "Today, 3:00 PM", details: "Discuss tour package options" },
  { name: "Elena Rodriguez", time: "Today, 4:30 PM", details: "Share visa requirements" },
  { name: "Priya Sharma", time: "Tomorrow, 11:00 AM", details: "Provide hotel options" },
];

export default function UpcomingFollowUps() {
    const router = useRouter();
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* Header */}
      <h3 className="text-xl font-semibold">Upcoming Follow-ups</h3>
      <p className="text-gray-500 text-sm mb-4">Scheduled follow-ups with customers</p>

      {/* Follow-up Cards */}
      <div className="space-y-3">
        {followUps.map((followUp, index) => (
          <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border">
            <div>
              <h4 className="font-semibold">{followUp.name}</h4>
              <p className="text-gray-500 text-sm">{followUp.time}</p>
              <p className="text-gray-600 text-sm">{followUp.details}</p>
            </div>
            <div className="flex gap-3">
              <Phone className="w-5 h-5 text-gray-600 cursor-pointer" />
              <Check className="w-5 h-5 text-gray-600 cursor-pointer" />
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-end mt-4">
        <button onClick={()=>router.push("/Employee/FollowUps")} className="border-2 font-bold hover:cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-100">
          View All Follow-ups
        </button>
      </div>
    </div>
  );
}
