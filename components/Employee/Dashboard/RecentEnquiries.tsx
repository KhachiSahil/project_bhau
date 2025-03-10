"use client";

import { useRouter } from "next/navigation";

const enquiries: {
  id: string;
  customer: string;
  destination: string;
  date: string;
  status: "Pending" | "Follow-up" | "Completed" | "Cancelled";
}[] = [
  { id: "ENQ-1234", customer: "Sarah Johnson", destination: "Bali, Indonesia", date: "2 hours ago", status: "Pending" },
  { id: "ENQ-1235", customer: "Michael Chen", destination: "Paris, France", date: "5 hours ago", status: "Follow-up" },
  { id: "ENQ-1236", customer: "Priya Sharma", destination: "Tokyo, Japan", date: "1 day ago", status: "Pending" },
  { id: "ENQ-1237", customer: "James Wilson", destination: "Cape Town, S. Africa", date: "1 day ago", status: "Completed" },
  { id: "ENQ-1238", customer: "Ananya Patel", destination: "Sydney, Australia", date: "2 days ago", status: "Cancelled" },
];

const statusColors: Record<"Pending" | "Follow-up" | "Completed" | "Cancelled", string> = {
  Pending: "bg-gray-100 text-gray-700",
  "Follow-up": "bg-gray-200 text-gray-600",
  Completed: "bg-black text-white",
  Cancelled: "bg-red-500 text-white",
};

export default function RecentEnquiries() {
    const router = useRouter();
  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      {/* Header */}
      <h3 className="text-xl font-semibold">Recent Enquiries</h3>
      <p className="text-gray-500 text-sm mb-4">Your most recent customer enquiries</p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-600 text-base border-b-2 border-gray-400">
              <th className="pb-2 px-2 sm:px-6">ID</th>
              <th className="pb-2 px-2 sm:px-6">Customer</th>
              <th className="pb-2 px-2 sm:px-6">Destination</th>
              <th className="pb-2 px-2 sm:px-6">Date</th>
              <th className="pb-2 px-2 sm:px-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry, index) => (
              <tr key={index} className="border-b last:border-none md:text-lg">
                <td className="py-3 px-2 sm:px-6 font-semibold">{enquiry.id}</td>
                <td className="py-3 px-2 sm:px-6">{enquiry.customer}</td>
                <td className="py-3 px-2 sm:px-6">{enquiry.destination}</td>
                <td className="py-3 px-2 sm:px-6">{enquiry.date}</td>
                <td className="py-3 px-2 sm:px-6">
                  <span className={`px-3 py-1 rounded-full text-base font-bold ${statusColors[enquiry.status]}`}>
                    {enquiry.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View All Button */}
      <div className="flex justify-end mt-4">
        <button onClick={()=>router.push("/Employee/Enquiries")} className="border-2 hover:cursor-pointer px-4 py-2 font-bold rounded-lg hover:bg-gray-100">
          View All Enquiries
        </button>
      </div>
    </div>
  );
}
