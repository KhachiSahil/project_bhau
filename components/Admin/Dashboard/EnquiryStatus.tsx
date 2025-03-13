import { MessageCircle, ArrowRight } from "lucide-react";

const enquiryData = [
  { status: "New", count: 42, percentage: "27%", change: "+12%", color: "text-gray-900", changeColor: "text-green-600", bg: "bg-gray-200" },
  { status: "In Progress", count: 68, percentage: "44%", change: "+5%", color: "text-gray-900", changeColor: "text-green-600", bg: "bg-gray-200" },
  { status: "Converted", count: 35, percentage: "22%", change: "+18%", color: "text-gray-900", changeColor: "text-green-600", bg: "bg-gray-200" },
  { status: "Lost", count: 11, percentage: "7%", change: "-3%", color: "text-red-600", changeColor: "text-red-600", bg: "bg-red-100" },
];

const EnquiryStatus = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle className="text-purple-500" size={28} />
          Enquiry Status
        </h2>
      </div>
      <p className="text-lg text-gray-500">Current status of all enquiries</p>

      {/* Status List */}
      <div className="mt-6 space-y-6">
        {enquiryData.map((enquiry, index) => (
          <div key={index} className={`flex justify-between items-center p-4 rounded-lg ${enquiry.bg}`}>
            <p className={`${enquiry.color} text-lg font-semibold`}>{enquiry.status}</p>
            <div className="text-right">
              <p className="text-2xl font-bold">{enquiry.count}</p>
              <p className={`text-md ${enquiry.changeColor}`}>{enquiry.change} from last month</p>
            </div>
          </div>
        ))}
      </div>

      {/* View More */}
      <div className="mt-6 flex items-center justify-between text-blue-600 cursor-pointer hover:text-blue-800 transition">
        <p className="text-lg font-medium">View All Enquiries</p>
        <ArrowRight size={20} />
      </div>
    </div>
  );
};

export default EnquiryStatus;
