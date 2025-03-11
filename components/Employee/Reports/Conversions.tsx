"use client";

import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer 
} from "recharts";

const conversionRateData = [
    { destination: "Bali", rate: 65 },
    { destination: "Paris", rate: 60 },
    { destination: "Tokyo", rate: 55 },
    { destination: "Singapore", rate: 45 },
];

const conversionTimelineData = [
    { package: "Honeymoon", days: 12 },
    { package: "Adventure", days: 18 },
    { package: "Pilgrimage", days: 20 },
    { package: "Business", days: 8 },
];

export default function Conversions() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-6">
            {/* Conversion Rate by Destination */}
            <div className="bg-white shadow-lg rounded-lg p-4">
                <h2 className="text-lg md:text-2xl font-bold">Conversion Rate by Destination</h2>
                <p className="text-gray-500 text-sm md:text-base mb-4">
                    Percentage of enquiries converted by destination
                </p>

                <div className="w-full h-[300px] md:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={conversionRateData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="destination" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="rate" fill="rgba(34, 197, 94, 0.7)" name="Conversion Rate (%)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Conversion Timeline */}
            <div className="bg-white shadow-lg rounded-lg p-4">
                <h2 className="text-lg md:text-2xl font-bold">Conversion Timeline</h2>
                <p className="text-gray-500 text-sm md:text-base mb-4">
                    Average days from enquiry to conversion
                </p>

                <div className="w-full h-[300px] md:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={conversionTimelineData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="package" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="days" fill="rgba(124, 58, 237, 0.7)" name="Days to Convert" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
