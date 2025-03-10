"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = {
  weekly: [
    { label: "Mon", revenue: 1200, enquiries: 300 },
    { label: "Tue", revenue: 1800, enquiries: 400 },
    { label: "Wed", revenue: 1500, enquiries: 350 },
    { label: "Thu", revenue: 2200, enquiries: 450 },
    { label: "Fri", revenue: 2800, enquiries: 500 },
    { label: "Sat", revenue: 3000, enquiries: 550 },
    { label: "Sun", revenue: 3200, enquiries: 600 },
  ],
  monthly: [
    { label: "Week 1", revenue: 8000, enquiries: 2400 },
    { label: "Week 2", revenue: 9200, enquiries: 2600 },
    { label: "Week 3", revenue: 8800, enquiries: 2500 },
    { label: "Week 4", revenue: 9500, enquiries: 2700 },
  ],
  yearly: [
    { label: "Jan", revenue: 30000, enquiries: 8000 },
    { label: "Feb", revenue: 28000, enquiries: 7500 },
    { label: "Mar", revenue: 32000, enquiries: 8500 },
    { label: "Apr", revenue: 35000, enquiries: 9000 },
    { label: "May", revenue: 37000, enquiries: 9200 },
    { label: "Jun", revenue: 40000, enquiries: 9500 },
  ],
};

export default function PerformanceChart() {
  const [filter, setFilter] = useState<"weekly" | "monthly" | "yearly">(
    "monthly"
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
      {/* Header and Filter */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg md:text-xl font-semibold">Performance Overview</h3>
        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "weekly" | "monthly" | "yearly")
          }
          className="border rounded-lg px-3 py-1"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Responsive Bar Chart */}
      <div className="w-full h-[250px] md:h-[400px] lg:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData[filter]}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#4CAF50" name="Revenue" radius={[6, 6, 0, 0]} />
            <Bar dataKey="enquiries" fill="#2196F3" name="Enquiries" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
