"use client";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

const enquirySourcesData = [
    { name: "Website", value: 35, color: "#A78BFA" },
    { name: "Referrals", value: 25, color: "#60A5FA" },
    { name: "Social Media", value: 20, color: "#34D399" },
    { name: "Direct", value: 15, color: "#A3E635" },
    { name: "Other", value: 5, color: "#FCD34D" },
];

const enquiryStatusData = [
    { status: "New", count: 120 },
    { status: "In Progress", count: 90 },
    { status: "Follow-up", count: 65 },
    { status: "Converted", count: 100 },
    { status: "Lost", count: 40 },
];

export default function Enquiries() {
    return (
        <div className="flex flex-col lg:flex-row gap-6 p-0 md:p-6">
            {/* Enquiry Sources - Pie Chart */}
            <div className="bg-white shadow-lg rounded-lg p-4 w-full lg:w-1/2">
                <h2 className="text-xl md:text-2xl font-bold">Enquiry Sources</h2>
                <p className="text-gray-500 text-sm mb-4">Distribution of enquiries by source</p>

                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={enquirySourcesData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                        >
                            {enquirySourcesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Enquiry Status Distribution - Bar Chart */}
            <div className="bg-white shadow-lg rounded-lg p-4 w-full lg:w-1/2">
                <h2 className="text-xl md:text-2xl font-bold">Enquiry Status Distribution</h2>
                <p className="text-gray-500 text-sm mb-4">Current status of all enquiries</p>

                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={enquiryStatusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="rgba(124, 58, 237, 0.7)" name="Enquiries" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
