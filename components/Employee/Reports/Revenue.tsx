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
    ResponsiveContainer 
} from "recharts";

const packageData = [
    { name: "Honeymoon", value: 35, color: "#f97316" }, // Orange
    { name: "Family", value: 25, color: "#10b981" }, // Green
    { name: "Adventure", value: 20, color: "#eab308" }, // Yellow
    { name: "Business", value: 15, color: "#2563eb" }, // Blue
    { name: "Pilgrimage", value: 5, color: "#b91c1c" }, // Red
];

const monthlyRevenue = [
    { month: "Jan", revenue: 40000 },
    { month: "Feb", revenue: 45000 },
    { month: "Mar", revenue: 50000 },
    { month: "Apr", revenue: 55000 },
    { month: "May", revenue: 60000 },
    { month: "Jun", revenue: 65000 },
    { month: "Jul", revenue: 70000 },
    { month: "Aug", revenue: 68000 },
    { month: "Sep", revenue: 62000 },
    { month: "Oct", revenue: 58000 },
    { month: "Nov", revenue: 50000 },
    { month: "Dec", revenue: 52000 },
];

export default function Revenue() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:p-6">
            {/* Revenue by Package Type */}
            <div className="bg-white shadow-lg rounded-lg md:p-4">
                <h2 className="text-lg md:text-2xl font-bold">Revenue by Package Type</h2>
                <p className="text-gray-500 text-sm md:text-base mb-4">Distribution of revenue across package types</p>

                <div className="w-full h-[300px] md:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={packageData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                                {packageData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Monthly Revenue Trend */}
            <div className="bg-white shadow-lg rounded-lg md:p-4">
                <h2 className="text-lg md:text-2xl font-bold">Monthly Revenue Trend</h2>
                <p className="text-gray-500 text-sm md:text-base mb-4">Revenue generated month by month</p>

                <div className="w-full h-[300px] md:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="revenue" fill="rgba(34, 197, 94, 0.7)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
