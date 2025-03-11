"use client";

import ModalEnquiries from "@/components/Employee/Enquiries/modalEnquiries";
import { Filter, Eye, Phone, MoreHorizontal } from "lucide-react";
import { useState } from "react";

type StatusType = "Pending" | "Follow-up" | "Completed" | "Cancelled";

const statusColors: Record<StatusType, string> = {
    Pending: "bg-gray-100 text-gray-700",
    "Follow-up": "bg-gray-200 text-gray-600",
    Completed: "bg-black text-white",
    Cancelled: "bg-red-500 text-white",
};

const tabs: { label: string; status?: StatusType }[] = [
    { label: "All" },
    { label: "Pending", status: "Pending" },
    { label: "Follow-up", status: "Follow-up" },
    { label: "Completed", status: "Completed" },
    { label: "Cancelled", status: "Cancelled" },
];

const enquiries: {
    id: string;
    customer: string;
    destination: string;
    budget: string;
    date: string;
    status: StatusType;
}[] = [
    { id: "ENQ-1234", customer: "Sarah Johnson", destination: "Bali, Indonesia", budget: "₹250,000", date: "Mar 15, 2023", status: "Pending" },
    { id: "ENQ-1235", customer: "Michael Chen", destination: "Paris, France", budget: "₹350,000", date: "Mar 14, 2023", status: "Follow-up" },
    { id: "ENQ-1236", customer: "Priya Sharma", destination: "Tokyo, Japan", budget: "₹400,000", date: "Mar 13, 2023", status: "Pending" },
    { id: "ENQ-1237", customer: "James Wilson", destination: "Cape Town, S. Africa", budget: "₹280,000", date: "Mar 12, 2023", status: "Completed" },
    { id: "ENQ-1238", customer: "Ananya Patel", destination: "Sydney, Australia", budget: "₹500,000", date: "Mar 11, 2023", status: "Cancelled" },
    { id: "ENQ-1239", customer: "Robert Kim", destination: "Maldives", budget: "₹600,000", date: "Mar 10, 2023", status: "Completed" },
    { id: "ENQ-1240", customer: "Elena Rodriguez", destination: "Athens, Greece", budget: "₹320,000", date: "Mar 09, 2023", status: "Follow-up" },
    { id: "ENQ-1241", customer: "David Thompson", destination: "Cairo, Egypt", budget: "₹280,000", date: "Mar 08, 2023", status: "Pending" },
    { id: "ENQ-1242", customer: "Sophia Garcia", destination: "Rome, Italy", budget: "₹380,000", date: "Mar 07, 2023", status: "Completed" },
];

export default function Enquiries() {
    const [selectedTab, setSelectedTab] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isModal, setIsModal] = useState<boolean>(false);

    // Filtered Enquiries Based on Tab & Search
    const filteredEnquiries = enquiries.filter((enquiry) =>
        (selectedTab === "All" || enquiry.status === selectedTab) &&
        enquiry.customer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white shadow-md rounded-lg p-0 md:p-6 w-full">
            {isModal && <ModalEnquiries onClose= {()=>{setIsModal(!isModal)}}/>}
            {/* Header */}
            <div className="flex md:flex-row flex-col justify-start md:justify-between items-start gap-3 md:items-center mb-4">
                <div>
                    <h3 className="text-xl md:text-3xl font-semibold">Enquiries</h3>
                    <p className="text-gray-500 text-sm md:text-xl">Manage your customer enquiries</p>
                </div>
                {/* Search Bar */}
                <div className="flex flex-col md:flex-row gap-3">
                    <div>
                        <input
                            type="text"
                            placeholder="Search enquiries..."
                            className="border z-0 rounded-md w-36 pl-2 md:px-4 py-2 text-sm md:text-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {/* Filter Dropdown */}
                    <div className="flex items-center gap-2 border px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100">
                        <Filter size={20} />
                        <select
                            className="text-sm md:text-lg font-bold bg-transparent border-none outline-none cursor-pointer"
                            value={selectedTab}
                            onChange={(e) => setSelectedTab(e.target.value)}
                        >
                            {tabs.map((tab) => (
                                <option key={tab.label} value={tab.label}>
                                    {tab.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="w-[95vw] md:w-auto">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-black text-sm md:text-xl border-b p-2 border-gray-300">
                                <th className="py-4 px-4">ID</th>
                                <th className="py-4 px-4">Customer</th>
                                <th className="py-4 px-4">Destination</th>
                                <th className="py-4 px-4">Budget</th>
                                <th className="py-4 px-4">Date</th>
                                <th className="py-4 px-4">Status</th>
                                <th className="py-4 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEnquiries.map((enquiry, index) => (
                                <tr key={index} className="border-b last:border-none text-sm md:text-lg">
                                    <td className="py-4 md:py-8 px-4 font-bold">{enquiry.id}</td>
                                    <td className="py-4 md:py-8 px-4">{enquiry.customer}</td>
                                    <td className="py-4 md:py-8 px-4">{enquiry.destination}</td>
                                    <td className="py-4 md:py-8 px-4">{enquiry.budget}</td>
                                    <td className="py-4 md:py-8 px-4">{enquiry.date}</td>
                                    <td className="py-4 md:py-8 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs md:text-lg font-bold ${statusColors[enquiry.status]}`}>
                                            {enquiry.status}
                                        </span>
                                    </td>
                                    {/* Actions */}
                                    <td className="py-4 my-auto md:py-8 px-4 flex gap-3 justify-center">
                                        <button onClick={()=> setIsModal(!isModal)} className="hover:text-gray-600">
                                            <Eye size={20} />
                                        </button>
                                        <button className="hover:text-gray-600">
                                            <Phone size={20} />
                                        </button>
                                        <button className="hover:text-gray-600">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
