import { ArrowRight, Trophy } from "lucide-react";

const topPerformers = [
  { name: "Priya Sharma", role: "Senior Travel Consultant", revenue: "₹42.8L", conversions: 24 },
  { name: "Rahul Verma", role: "Travel Consultant • Adventure", revenue: "₹38.5L", conversions: 21 },
  { name: "Ananya Patel", role: "Travel Consultant • Family", revenue: "₹35.2L", conversions: 19 },
  { name: "Rahul Verma", role: "Travel Consultant • Adventure", revenue: "₹38.5L", conversions: 21 },
  { name: "Priya Sharma", role: "Senior Travel Consultant", revenue: "₹42.8L", conversions: 24 },
];

const TopPerformers = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="text-yellow-500" size={28} />
          Top Performers
        </h2>
      </div>
      <p className="text-lg text-gray-500">This month&apos;s highest performing employees</p>

      {/* Employee List */}
      <div className="mt-6 space-y-6">
        {topPerformers.map((performer, index) => (
          <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
            <div className="w-12 h-12 rounded-full bg-gray-300"></div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{performer.name}</h3>
              <p className="text-sm text-gray-500">{performer.role}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">{performer.revenue}</p>
              <p className="text-sm text-gray-500">{performer.conversions} conversions</p>
            </div>
          </div>
        ))}
      </div>

      {/* View More */}
      <div className="mt-6 flex items-center text-center gap-2 justify-center text-blue-600 cursor-pointer hover:text-blue-800 transition">
        <p className="text-lg font-medium">View All Employees</p>
        <ArrowRight size={20} />
      </div>
    </div>
  );
};

export default TopPerformers;
