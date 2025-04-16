import {useState } from "react";
import React from "react";
const ownerCabList = [
    {
        id: "1",
        Name: "Bablu",
        Cabs: 5,
        CabsData: [
            {
                cabId: "C1",
                cabType: "Sedan",
                registrationNumber: "HP-12-AB-1234",
                availability: true,
                capacity: 4,
                driverName: "Ramesh Sharma",
                contact: "9876543210"
            },
            {
                cabId: "C2",
                cabType: "SUV",
                registrationNumber: "HP-34-CD-5678",
                availability: false,
                capacity: 6,
                driverName: "Suresh Kumar",
                contact: "9876543221"
            }
        ]
    },
    {
        id: "2",
        Name: "Rajesh",
        Cabs: 3,
        CabsData: [
            {
                cabId: "C6",
                cabType: "Sedan",
                registrationNumber: "HP-22-KL-1111",
                availability: true,
                capacity: 4,
                driverName: "Sunil Mehta",
                contact: "9876543265"
            }
        ]
    }
];

export default function CabList() {
    const [expandedOwner, setExpandedOwner] = useState<string | null>(null);

    const toggleCabs = (ownerId: string) => {
        setExpandedOwner(expandedOwner === ownerId ? null : ownerId);
    };

    return (
        <div className="p-1 md:p-6">
            <div className="bg-white shadow-md rounded-lg w-[95vw] md:w-full">
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full border-collapse">
                        {/* Table Header */}
                        <thead className="bg-gray-100 text-gray-600 text-sm uppercase text-center">
                            <tr>
                                <th className="px-4 py-3">Owner Name</th>
                                <th className="px-4 py-3">Total Cabs</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="text-gray-700 text-center">
                            {ownerCabList.map((owner) => (
                                <React.Fragment key={owner.id}>
                                    {/* Owner Row */}
                                    <tr className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 font-semibold whitespace-nowrap">{owner.Name}</td>
                                        <td className="px-4 py-3">{owner.Cabs}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => toggleCabs(owner.id)}
                                                className="bg-gray-500 font-bold text-white px-4 py-2 rounded-md text-sm hover:bg-gray-400"
                                            >
                                                {expandedOwner === owner.id ? "Hide Cabs" : "Show Cabs"}
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Cabs List (Expand When Clicked) */}
                                    {expandedOwner === owner.id && (
                                        <tr>
                                            <td colSpan={3} className="p-4">
                                                <div className="bg-gray-50 p-3 rounded-md border overflow-x-auto">
                                                    <h3 className="text-md font-bold text-gray-800 mb-2 text-center">Cabs List</h3>
                                                    {owner.CabsData.length > 0 ? (
                                                        <table className="min-w-[600px] w-full text-sm border-collapse text-center">
                                                            <thead className="bg-gray-200">
                                                                <tr>
                                                                    <th className="px-3 py-2">Cab Type</th>
                                                                    <th className="px-3 py-2">Reg No.</th>
                                                                    <th className="px-3 py-2">Capacity</th>
                                                                    <th className="px-3 py-2">Driver</th>
                                                                    <th className="px-3 py-2">Availability</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {owner.CabsData.map((cab) => (
                                                                    <tr key={cab.cabId} className="border-t hover:bg-gray-100">
                                                                        <td className="px-3 py-2">{cab.cabType}</td>
                                                                        <td className="px-3 py-2">{cab.registrationNumber}</td>
                                                                        <td className="px-3 py-2">{cab.capacity} persons</td>
                                                                        <td className="px-3 py-2">
                                                                            {cab.driverName} <br />
                                                                            <span className="text-gray-500 text-xs">{cab.contact}</span>
                                                                        </td>
                                                                        <td className="px-3 py-2">
                                                                            <span
                                                                                className={`px-2 py-1 rounded text-xs ${cab.availability
                                                                                        ? "bg-green-100 text-green-600"
                                                                                        : "bg-red-100 text-red-600"
                                                                                    }`}
                                                                            >
                                                                                {cab.availability ? "Available" : "Not Available"}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        <p className="text-gray-500 text-sm text-center">No cabs available.</p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
