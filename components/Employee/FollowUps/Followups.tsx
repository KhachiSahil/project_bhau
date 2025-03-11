"use client";
import { useState } from "react";
import { Search, Phone, Check, MoreVertical } from "lucide-react";

const followUps = [
    { customer: "Michael Chen", location: "Paris, France", enquiryID: "ENQ-1235", schedule: "2023-03-16 15:00", type: "phone", status: "upcoming" },
    { customer: "Elena Rodriguez", location: "Athens, Greece", enquiryID: "ENQ-1240", schedule: "2023-03-16 16:30", type: "phone", status: "upcoming" },
    { customer: "Priya Sharma", location: "Tokyo, Japan", enquiryID: "ENQ-1236", schedule: "2023-03-17 11:00", type: "email", status: "upcoming" },
    { customer: "David Thompson", location: "Cairo, Egypt", enquiryID: "ENQ-1241", schedule: "2023-03-15 10:00", type: "phone", status: "completed" },
    { customer: "Rahul Verma", location: "Singapore", enquiryID: "ENQ-1243", schedule: "2023-03-15 14:30", type: "phone", status: "missed" },
    { customer: "Sarah Johnson", location: "Bali, Indonesia", enquiryID: "ENQ-1234", schedule: "2023-03-14 16:00", type: "video", status: "completed" },
    { customer: "Ananya Patel", location: "Sydney, Australia", enquiryID: "ENQ-1238", schedule: "2023-03-15 09:00", type: "phone", status: "cancelled" },
    { customer: "James Wilson", location: "Cape Town, S. Africa", enquiryID: "ENQ-1237", schedule: "2023-03-14 15:00", type: "phone", status: "completed" },
];

export default function FollowUps() {
    const [activeTab, setActiveTab] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Filter follow-ups based on the selected tab
    const filteredFollowUps = followUps.filter((item) => {
        const matchesTab = activeTab === "All" || item.status === activeTab.toLowerCase();
        const matchesSearch =
            searchQuery === "" ||
            item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.enquiryID.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch;
    });

    return (
        <div className=" p-1 md:p-6 bg-white shadow rounded-lg w-full pb-32">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h2 className="text-2xl sm:text-4xl font-bold">Follow-ups</h2>

                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-4 sm:mt-0 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search follow-ups..."
                            className="pl-10 pr-4 py-2 w-full sm:w-64 border rounded-lg text-gray-600 outline-none focus:ring-2 focus:ring-gray-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <button className="bg-black font-bold hover:cursor-pointer text-white px-4 py-2 rounded-md w-full sm:w-auto">
                        Schedule New
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-col md:flex-row space-x-2 sm:space-x-4 bg-gray-300 rounded-t-xl border-b p-2 sm:p-0">
                {["All", "Upcoming", "Completed", "Missed"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`hover:cursor-pointer px-3 sm:px-4 py-2 text-sm sm:text-lg font-bold ${
                            activeTab === tab ? "text-black border-b-2 bg-gray-100 border-black" : "text-gray-600"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Follow-ups Table (Responsive) */}
            <div className="mt-4 w-full">
                <div className="border rounded-lg overflow-hidden">
                    {filteredFollowUps.length > 0 ? (
                        filteredFollowUps.map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b last:border-none hover:bg-gray-50 transition"
                            >
                                {/* Customer Info */}
                                <div className="w-full sm:w-1/4">
                                    <div className="font-bold text-lg sm:text-xl">{item.customer}</div>
                                    <div className="text-base sm:text-lg text-gray-500">{item.location}</div>
                                </div>

                                {/* Enquiry ID */}
                                <div className="w-full sm:w-1/6 text-gray-600 text-sm sm:text-base">{item.enquiryID}</div>

                                {/* Schedule */}
                                <div className="w-full sm:w-1/6 text-gray-600 text-sm sm:text-base">{item.schedule}</div>

                                {/* Type */}
                                <div className="w-full sm:w-1/6 mt-2 sm:mt-0">
                                    <span className="bg-gray-200 text-gray-700 px-3 py-1 sm:py-2 rounded-md text-sm sm:text-base font-bold">
                                        {item.type}
                                    </span>
                                </div>

                                {/* Status */}
                                <div className="w-full sm:w-1/6 mt-2 sm:mt-0">
                                    <span
                                        className={`px-3 py-1 sm:py-2 rounded-md text-sm sm:text-base font-medium ${
                                            item.status === "upcoming"
                                                ? "bg-gray-100 text-gray-700"
                                                : item.status === "completed"
                                                ? "bg-black text-white"
                                                : item.status === "missed"
                                                ? "bg-gray-200 text-gray-700"
                                                : "bg-red-200 text-red-700"
                                        }`}
                                    >
                                        {item.status}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="w-full sm:w-1/6 flex space-x-3 text-gray-600 mt-3 sm:mt-0">
                                    <Phone className="w-5 h-5 hover:text-black cursor-pointer" />
                                    <Check className="w-5 h-5 hover:text-black cursor-pointer" />
                                    <MoreVertical className="w-5 h-5 hover:text-black cursor-pointer" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-500">No follow-ups found</div>
                    )}
                </div>
            </div>
        </div>
    );
}
