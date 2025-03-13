"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", luxury: 1300000, adventure: 900000, family: 600000, business: 450000 },
  { month: "Feb", luxury: 1400000, adventure: 950000, family: 650000, business: 500000 },
  { month: "Mar", luxury: 1500000, adventure: 1000000, family: 700000, business: 550000 },
  { month: "Apr", luxury: 1600000, adventure: 1100000, family: 750000, business: 600000 },
  { month: "May", luxury: 1700000, adventure: 1200000, family: 800000, business: 650000 },
  { month: "Jun", luxury: 1800000, adventure: 1300000, family: 850000, business: 700000 },
];

const RevenueOverview = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold">Revenue Overview</h2>
      <p className="text-sm text-gray-500">Monthly revenue breakdown by team</p>
      <ResponsiveContainer width="100%" height={450}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="luxury" stroke="#6366F1" name="Luxury " />
          <Line type="monotone" dataKey="adventure" stroke="#10B981" name="Adventure " />
          <Line type="monotone" dataKey="family" stroke="#FBBF24" name="Family " />
          <Line type="monotone" dataKey="business" stroke="#EF4444" name="Business " />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueOverview;
