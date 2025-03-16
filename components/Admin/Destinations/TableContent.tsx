"use client"
import { useState } from "react";
import { Ellipsis } from "lucide-react";
import PackageDetailsModal from "./Details";

export default function TableContent() {
    const destinations = [
        { id: "Bali", region: "Indonesia", category: "Beach", packages: 12, enquiries: 85, bookings: 42, revenue: "₹2,50,000", conversion: "49%" },
        { id: "Paris", region: "France", category: "City", packages: 8, enquiries: 72, bookings: 38, revenue: "₹3,00,000", conversion: "52%" },
        { id: "Tokyo", region: "Japan", category: "City", packages: 10, enquiries: 68, bookings: 35, revenue: "₹3,50,000", conversion: "51%" },
        { id: "Maldives", region: "Maldives", category: "Beach", packages: 6, enquiries: 65, bookings: 32, revenue: "₹4,00,000", conversion: "49%" },
        { id: "Singapore", region: "Singapore", category: "City", packages: 9, enquiries: 60, bookings: 30, revenue: "₹4,50,000", conversion: "50%" },
        { id: "Swiss Alps", region: "Switzerland", category: "Mountain", packages: 7, enquiries: 55, bookings: 28, revenue: "₹6,00,000", conversion: "51%" },
        { id: "Cairo", region: "Egypt", category: "Historical", packages: 5, enquiries: 40, bookings: 15, revenue: "₹2,80,000", conversion: "37%" },
    ];

    const [isOpen, setIsOpen] = useState<boolean>(false);
    
    return (
        <>
            {isOpen && <PackageDetailsModal onClose={() => setIsOpen(false)} />}
            <div className="bg-white shadow-lg rounded-lg p-2 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <div>
                        <h2 className="md:text-3xl font-bold">All Destinations</h2>
                        <p className="text-gray-500 text-lg">View and manage your travel destinations</p>
                    </div>
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            placeholder="Search destinations..."
                            className="border rounded-lg px-6 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />
                    </div>
                </div>
                <div className="w-[90vw] md:w-auto">
                    <div className="overflow-x-auto">
                        <table className="min-w-full border rounded-lg overflow-hidden">
                            <thead className="bg-gray-100 text-gray-700 text-lg">
                                <tr>
                                    <th className="py-5 px-6 text-left">Destination</th>
                                    <th className="py-5 px-6 text-left">Region</th>
                                    <th className="py-5 px-6 text-left">Category</th>
                                    <th className="py-5 px-6 text-left">Packages</th>
                                    <th className="py-5 px-6 text-left">Enquiries</th>
                                    <th className="py-5 px-6 text-left">Bookings</th>
                                    <th className="py-5 px-6 text-left">Revenue</th>
                                    <th className="py-5 px-6 text-left">Conversion</th>
                                    <th className="py-5 px-6 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 text-lg">
                                {destinations.map((dest, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="py-5 px-6 font-semibold">{dest.id}</td>
                                        <td className="py-5 px-6 font-semibold">{dest.region}</td>
                                        <td className="py-5 px-6">
                                            <span className="bg-gray-100 text-gray-700 px-3 py-2 rounded-full text-md font-semibold">
                                                {dest.category}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6 font-semibold">{dest.packages}</td>
                                        <td className="py-5 px-6 font-semibold">{dest.enquiries}</td>
                                        <td className="py-5 px-6 font-semibold">{dest.bookings}</td>
                                        <td className="py-5 px-6 font-semibold">{dest.revenue}</td>
                                        <td className="py-5 px-6 font-semibold">{dest.conversion}</td>
                                        <td className="py-5 px-6">
                                            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-800">
                                                <Ellipsis size={28} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
