import { PhoneCall, ArrowRight } from "lucide-react";

const followUps = [
  { name: "Michael Chen", details: "Paris Luxury Tour", time: "3:00 PM", assigned: "Priya Sharma", day: "Today", type: "phone" },
  { name: "Elena Rodriguez", details: "Greece Island Hopping", time: "4:30 PM", assigned: "Rahul Verma", day: "Today", type: "video" },
  { name: "James Wilson", details: "Safari Adventure", time: "11:00 AM", assigned: "Ananya Patel", day: "Tomorrow", type: "phone" },
  { name: "Sarah Johnson", details: "Bali Beach Resort", time: "2:00 PM", assigned: "Vikram Singh", day: "Tomorrow", type: "email" },
];

  
const UpcomingFollowUps = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <PhoneCall className="text-orange-500" size={28} />
          Upcoming Follow-ups
        </h2>
      </div>
      <p className="text-lg text-gray-500">Scheduled follow-ups across all teams</p>

      {/* Follow-ups List */}
      <div className="mt-6 space-y-6">
        {followUps.map((followUp, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm bg-gray-200 px-2 py-1 inline-block rounded-md">{followUp.day}</p>
              <h3 className="text-lg font-semibold">{followUp.name}</h3>
              <p className="text-gray-600">{followUp.details}</p>
              <p className="text-sm text-gray-400">Assigned to: {followUp.assigned}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">{followUp.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* View More */}
      <div className="mt-6 flex items-center justify-center text-blue-600 cursor-pointer hover:text-blue-800 transition">
        <p className="text-lg font-medium">View All Follow-ups</p>
        <ArrowRight size={20} />
      </div>
    </div>
  );
};

export default UpcomingFollowUps;
