"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const conversionData = {
  weekly: [
    { label: "Mon", rate: 45 },
    { label: "Tue", rate: 50 },
    { label: "Wed", rate: 48 },
    { label: "Thu", rate: 52 },
    { label: "Fri", rate: 55 },
    { label: "Sat", rate: 60 },
    { label: "Sun", rate: 58 },
  ],
  monthly: [
    { label: "Week 1", rate: 50 },
    { label: "Week 2", rate: 55 },
    { label: "Week 3", rate: 53 },
    { label: "Week 4", rate: 57 },
  ],
  yearly: [
    { label: "Jan", rate: 48 },
    { label: "Feb", rate: 52 },
    { label: "Mar", rate: 55 },
    { label: "Apr", rate: 60 },
    { label: "May", rate: 62 },
    { label: "Jun", rate: 65 },
  ],
};

export default function ConversionRateChart() {
  const [filter, setFilter] = useState<"weekly" | "monthly" | "yearly">(
    "monthly"
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
      {/* Header & Filter */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg md:text-xl font-semibold">Conversion Rate Stats</h3>
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

      {/*Line Chart */}
      <div className="w-full h-[250px] md:h-[400px] lg:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={conversionData[filter]}>
            <XAxis dataKey="label" />
            <YAxis domain={[40, 70]} tickFormatter={(tick) => `${tick}%`} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#4F46E5"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
