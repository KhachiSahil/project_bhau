"use client";

import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer, 
    Legend, 
    CartesianGrid 
} from "recharts";

const data = [
    { month: "Jan", enquiries: 50, conversions: 15 },
    { month: "Feb", enquiries: 60, conversions: 20 },
    { month: "Mar", enquiries: 70, conversions: 25 },
    { month: "Apr", enquiries: 80, conversions: 30 },
    { month: "May", enquiries: 85, conversions: 40 },
    { month: "Jun", enquiries: 90, conversions: 50 },
    { month: "Jul", enquiries: 95, conversions: 55 },
    { month: "Aug", enquiries: 85, conversions: 45 },
    { month: "Sep", enquiries: 80, conversions: 40 },
    { month: "Oct", enquiries: 70, conversions: 30 },
    { month: "Nov", enquiries: 60, conversions: 20 },
    { month: "Dec", enquiries: 55, conversions: 25 },
];

export default function EnquiriesVsConversions() {
    return (
        <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 w-full">
            <h2 className="text-lg md:text-2xl font-bold">Enquiries vs Conversions</h2>
            <p className="text-gray-500 text-sm md:text-base mb-4">
                Monthly comparison of enquiries received and conversions.
            </p>

            <div className="w-full h-[300px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="enquiries" fill="rgba(124, 58, 237, 0.7)" name="Enquiries" />
                        <Bar dataKey="conversions" fill="rgba(34, 197, 94, 0.7)" name="Conversions" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
