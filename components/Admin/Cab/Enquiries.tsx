"use client";

import { useState } from "react";
import { Eye, Phone, MoreHorizontal } from "lucide-react";

const cabEnquiries = [
    {
        id: "CAB-1001",
        customer: "Amit Sharma",
        email: "amit.sharma@email.com",
        phone: "9876543210",
        pickup: "Shimla",
        drop: "Manali",
        cabType: "Sedan",
        fareEstimate: "₹4,500",
        pickupDate: "Apr 5, 2025",
        dropDate: "Apr 6, 2025",
    },
    {
        id: "CAB-1002",
        customer: "Neha Verma",
        email: "neha.verma@email.com",
        phone: "9876543221",
        pickup: "Dharamshala",
        drop: "Chandigarh",
        cabType: "SUV",
        fareEstimate: "₹7,200",
        pickupDate: "Apr 4, 2025",
        dropDate: "Apr 4, 2025",
    },
    {
        id: "CAB-1003",
        customer: "Raj Malhotra",
        email: "raj.malhotra@email.com",
        phone: "9876543233",
        pickup: "Kullu",
        drop: "Leh",
        cabType: "Luxury",
        fareEstimate: "₹12,500",
        pickupDate: "Apr 3, 2025",
        dropDate: "Apr 5, 2025",
    },
];

export default function CabEnquiries() {
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Filter enquiries by customer name
    const filteredEnquiries = cabEnquiries.filter((enquiry) =>
        enquiry.customer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white shadow-md rounded-lg p-4 md:p-6 w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-2xl font-semibold">Cab Enquiries</h3>
                    <p className="text-gray-500 text-sm">Manage customer cab bookings</p>
                </div>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search by customer..."
                    className="border rounded-md w-40 pl-2 md:px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="w-[85vw] md:w-auto">
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-center border-collapse">
                        <thead>
                            <tr className="text-gray-700 text-sm border-b border-gray-300 bg-gray-100">
                                <th className="py-4 px-4">ID</th>
                                <th className="py-4 px-4">Customer</th>
                                <th className="py-4 px-4">Pickup & Drop</th>
                                <th className="py-4 px-4">Pickup & Drop Date</th>
                                <th className="py-4 px-4">Cab Type</th>
                                <th className="py-4 px-4">Fare</th>
                                <th className="py-4 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEnquiries.length > 0 ? (
                                filteredEnquiries.map((enquiry, index) => (
                                    <tr key={index} className="border-b last:border-none text-sm">
                                        <td className="py-4 px-4 font-bold">{enquiry.id}</td>

                                        {/* Customer Name, Email, and Phone */}
                                        <td className="py-4 px-4 text-left">
                                            <div className="font-semibold">{enquiry.customer}</div>
                                            <div className="text-gray-500 text-xs">
                                                {enquiry.email}
                                                <div>
                                                    {enquiry.phone}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Pickup & Drop Stacked */}
                                        <td className="py-4 px-4">
                                            <div>{enquiry.pickup}</div>
                                            <div>{enquiry.drop}</div>
                                        </td>

                                        {/* Pickup & Drop Date Stacked */}
                                        <td className="py-4 px-4">
                                            <div>{enquiry.pickupDate}</div>
                                            <div>{enquiry.dropDate}</div>
                                        </td>

                                        <td className="py-4 px-4">{enquiry.cabType}</td>
                                        <td className="py-4 px-4">{enquiry.fareEstimate}</td>

                                        {/* Actions */}
                                        <td className="py-4 px-4 flex gap-3 justify-center">
                                            <button className="hover:text-gray-600">
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-4 text-gray-500 text-lg">
                                        No enquiries found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
