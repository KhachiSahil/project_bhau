"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
    { name: "Bali", value: 25, color: "#A78BFA" },
    { name: "Paris", value: 18, color: "#60A5FA" },
    { name: "Tokyo", value: 15, color: "#34D399" },
    { name: "Maldives", value: 12, color: "#A3E635" },
    { name: "Singapore", value: 11, color: "#FCD34D" },
    { name: "Others", value: 19, color: "#F87171" },
];

export default function TopDestinations() {
    return (
        <div className="bg-white shadow-lg rounded-lg p-4 w-full">
            <h2 className="text-xl font-bold">Top Destinations</h2>
            <p className="text-gray-500 text-sm mb-4">Most popular travel destinations by enquiry volume</p>

            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
