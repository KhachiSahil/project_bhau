"use client";

import ModalEnquiries from "@/components/Employee/Enquiries/modalEnquiries";
import { Filter, Eye, MoreHorizontal } from "lucide-react";
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

const enquiries = [
    { id: "ENQ-1234", customer: "Sarah Johnson", email: "sarah@email.com", phone: "9876543210", arrival: "Bali", end: "Indonesia", Quotation: "₹250,000", date: "Mar 15, 2023", status: "Pending", endDate: "Mar 24, 2023" },
    { id: "ENQ-1235", customer: "Michael Chen", email: "michael@email.com", phone: "9856743210", arrival: "Paris", end: "Indonesia", Quotation: "₹350,000", date: "Mar 14, 2023", status: "Follow-up", endDate: "Mar 24, 2023" },
    { id: "ENQ-1236", customer: "Priya Sharma", email: "priya@email.com", phone: "9845632100", arrival: "Tokyo", end: "Indonesia", Quotation: "₹400,000", date: "Mar 13, 2023", status: "Pending", endDate: "Mar 24, 2023" },
    { id: "ENQ-1237", customer: "James Wilson", email: "james@email.com", phone: "9834521076", arrival: "Cape Town", end: "Indonesia", Quotation: "₹280,000", date: "Mar 12, 2023", status: "Completed", endDate: "Mar 24, 2023" },
    { id: "ENQ-1238", customer: "Ananya Patel", email: "ananya@email.com", phone: "9812345678", arrival: "Sydney", end: "Indonesia", Quotation: "₹500,000", date: "Mar 11, 2023", status: "Cancelled", endDate: "Mar 24, 2023" },
    { id: "ENQ-1239", customer: "Robert Kim", email: "robert@email.com", phone: "9901234567", arrival: "Maldives ", end: "Indonesia", Quotation: "₹600,000", date: "Mar 10, 2023", status: "Completed", endDate: "Mar 24, 2023" },
];

export default function Enquiries() {
    const [selectedTab, setSelectedTab] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isModal, setIsModal] = useState<boolean>(false);

    // Filtered Enquiries Based on Tab & Search (Now includes email & phone)
    const filteredEnquiries = enquiries.filter((enquiry) =>
        (selectedTab === "All" || enquiry.status === selectedTab) &&
        (
            enquiry.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            enquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            enquiry.phone.includes(searchQuery)
        )
    );

    return (
        <div className="bg-white shadow-md rounded-lg p-0 md:p-6 w-full">
            {isModal && <ModalEnquiries onClose={() => setIsModal(!isModal)} />}

            {/* Header */}
            <div className="flex md:flex-row flex-col justify-start md:justify-between items-start gap-3 md:items-center mb-4">
                <div>
                    <h3 className="text-xl md:text-3xl font-semibold">Enquiries</h3>
                    <p className="text-gray-500 text-sm md:text-xl">Manage your customer enquiries</p>
                </div>

                {/* Search Bar */}
                <div className="flex flex-col md:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Search enquiries..."
                        className="border z-0 rounded-md w-36 pl-2 md:px-4 py-2 text-sm md:text-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

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
                                <th className="py-4 px-4">Quotation</th>
                                <th className="py-4 px-4">Date</th>
                                <th className="py-4 px-4">Status</th>
                                <th className="py-4 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEnquiries.map((enquiry, index) => (
                                <tr key={index} className="border-b last:border-none text-sm md:text-lg">
                                    <td className="py-4 md:py-8 px-4 font-bold">{enquiry.id}</td>
                                    <td className="py-4 md:py-8 px-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold">{enquiry.customer}</span>
                                            <span className="font-medium text-sm">{enquiry.email}</span>
                                            <span className="text-sm font-medium">{enquiry.phone}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 md:py-8 px-4">
                                        <div className="flex flex-col">
                                            <span>{enquiry.arrival}</span>
                                            <span>{enquiry.end}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 md:py-8 px-4">{enquiry.Quotation}</td>
                                    <td className="py-4 md:py-8 px-4 whitespace-nowrap">
                                        <span>{enquiry.date}</span>
                                        <span className="block">{enquiry.endDate}</span>
                                    </td>
                                    <td className="py-4 md:py-8 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs md:text-lg font-bold ${statusColors[enquiry.status as StatusType]}`}>
                                            {enquiry.status}
                                        </span>
                                    </td>
                                    <td className="py-4 md:py-8 px-4 flex gap-3 justify-center">
                                        <button onClick={() => setIsModal(!isModal)} className="hover:text-gray-600">
                                            <Eye size={20} />
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
