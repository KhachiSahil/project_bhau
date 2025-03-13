"use client"
import { useState } from "react";
import { Ellipsis } from "lucide-react";
import PackageDetailsModal from "./PackageDetails";

export default function TravelPackagesTable() {
    const packages = [
        { id: "PKG-001", name: "Bali Honeymoon Special", destination: "Bali, Indonesia", category: "Honeymoon", price: "₹250,000", rating: 4.8, bookings: 24 },
        { id: "PKG-005", name: "Singapore Family Fun", destination: "Singapore", category: "Family", price: "₹300,000", rating: 4.5, bookings: 22 },
        { id: "PKG-002", name: "Paris Romance Package", destination: "Paris, France", category: "Honeymoon", price: "₹350,000", rating: 4.7, bookings: 18 },
        { id: "PKG-003", name: "Tokyo Explorer", destination: "Tokyo, Japan", category: "Adventure", price: "₹400,000", rating: 4.6, bookings: 15 },
        { id: "PKG-006", name: "Swiss Alps Adventure", destination: "Switzerland", category: "Adventure", price: "₹450,000", rating: 4.7, bookings: 14 },
        { id: "PKG-004", name: "Maldives Luxury Escape", destination: "Maldives", category: "Luxury", price: "₹600,000", rating: 4.9, bookings: 12 },
        { id: "PKG-007", name: "Dubai Business Elite", destination: "Dubai, UAE", category: "Business", price: "₹280,000", rating: 4.4, bookings: 8 },
    ];

    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
        <>
        {isOpen && <PackageDetailsModal onClose={()=>{setIsOpen(!isOpen)}}/>}
            <div className="bg-white shadow-lg rounded-lg p-2 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <div>
                        <h2 className="md:text-3xl font-bold">All Packages</h2>
                        <p className="text-gray-500 text-lg">View and manage your travel packages</p>
                    </div>
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            placeholder="Search packages..."
                            className="border rounded-lg px-6 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />
                    </div>
                </div>
                <div className="w-[90vw] md:w-auto">
                    <div className="overflow-x-auto">
                        <table className="min-w-full border rounded-lg overflow-hidden">
                            <thead className="bg-gray-100 text-gray-700 text-lg">
                                <tr>
                                    <th className="py-5 px-6 text-left">Package</th>
                                    <th className="py-5 px-6 text-left">Destination</th>
                                    <th className="py-5 px-6 text-left">Category</th>
                                    <th className="py-5 px-6 text-left">Price</th>
                                    <th className="py-5 px-6 text-left">Rating </th>
                                    <th className="py-5 px-6 text-left">Bookings </th>
                                    <th className="py-5 px-6 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 text-lg">
                                {packages.map((pkg, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="py-5 px-6">
                                            <div className="font-semibold">{pkg.name}</div>
                                            <div className="text-gray-500 text-md font-semibold">{pkg.id}</div>
                                        </td>
                                        <td className="py-5 px-6 font-semibold">{pkg.destination}</td>
                                        <td className="py-5 px-6">
                                            <span className="bg-gray-100 text-gray-700 px-3 py-2 rounded-full text-md font-semibold">
                                                {pkg.category}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6 font-semibold">{pkg.price}</td>
                                        <td className="py-5 px-6  items-center font-bold">
                                            ⭐ {pkg.rating}
                                        </td>
                                        <td className="py-5 px-6 font-semibold">{pkg.bookings}</td>
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
