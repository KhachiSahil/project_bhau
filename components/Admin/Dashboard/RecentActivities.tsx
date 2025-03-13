import { Activity, ArrowRight } from "lucide-react";

const activities = [
  { name: "Priya Sharma", action: "converted", details: "Luxury Bali Package (₹4.5L)", time: "10 minutes ago", color: "bg-black text-white" },
  { name: "Rahul Verma", action: "added", details: "New enquiry for Paris", time: "25 minutes ago", color: "bg-gray-200 text-black" },
  { name: "Ananya Patel", action: "scheduled", details: "Follow-up with Michael Chen", time: "1 hour ago", color: "bg-yellow-200 text-black" },
  { name: "Vikram Singh", action: "updated", details: "Tokyo Adventure Package", time: "2 hours ago", color: "bg-blue-200 text-black" },
  { name: "Neha Gupta", action: "completed", details: "Follow-up with Sarah Johnson", time: "3 hours ago", color: "bg-green-200 text-black" },
];

const RecentActivities = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="text-green-500" size={28} />
          Recent Activities
        </h2>
      </div>
      <p className="text-lg text-gray-500">Latest actions across the company</p>

      {/* Activity List */}
      <div className="mt-6 space-y-6">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-300"></div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                {activity.name}{" "}
                <span className={`px-2 py-1 text-sm rounded-md ${activity.color}`}>
                  {activity.action}
                </span>
              </h3>
              <p className="text-gray-600">{activity.details}</p>
              <p className="text-sm text-gray-400">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* View More */}
      <div className="mt-6 flex items-center justify-center text-blue-600 cursor-pointer hover:text-blue-800 transition">
        <p className="text-lg font-medium">View All Activities</p>
        <ArrowRight size={20} />
      </div>
    </div>
  );
};

export default RecentActivities;
