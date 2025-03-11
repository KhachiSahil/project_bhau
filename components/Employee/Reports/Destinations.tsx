"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

const enquiryData = [
    { name: "Bali", enquiries: 120 },
    { name: "Paris", enquiries: 95 },
    { name: "Maldives", enquiries: 85 },
    { name: "Dubai", enquiries: 65 },
    { name: "Sydney", enquiries: 50 },
];

const revenueData = [
    { name: "Paris", revenue: 100000 },
    { name: "Tokyo", revenue: 85000 },
    { name: "Singapore", revenue: 72000 },
    { name: "Sydney", revenue: 50000 },
];

export default function Destinations() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 md:flex-row gap-6 md:p-6">
            {/* Enquiry Chart */}
            <div className="bg-white shadow-lg rounded-lg p-4 w-full">
                <h2 className="text-2xl font-bold">Top Destinations by Enquiry</h2>
                <p className="text-gray-500 text-sm mb-4">Most requested travel destinations</p>

                <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={enquiryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="enquiries" fill="rgba(104, 102, 248, 0.7)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white shadow-lg rounded-lg p-4 w-full">
                <h2 className="text-2xl font-bold">Top Destinations by Revenue</h2>
                <p className="text-gray-500 text-sm mb-4">Destinations generating highest revenue</p>

                <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="rgba(34, 197, 94, 0.7)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
