import StatCards from "@/components/Admin/Dashboard/Cards";
import EnquiryDistributin from "@/components/Admin/Dashboard/EnquiryDistribution";
import EnquiryStatus from "@/components/Admin/Dashboard/EnquiryStatus";
import UpcomingFollowUps from "@/components/Admin/Dashboard/FollowUps";
import RecentActivities from "@/components/Admin/Dashboard/RecentActivities";
import RevenueOverview from "@/components/Admin/Dashboard/RevenueOverview";
import TopPerformers from "@/components/Admin/Dashboard/Topperformers";
import { TrendingUp, PhoneCall, IndianRupee, User } from "lucide-react";

const statsData = [
    { id: 1, name: "Total Employees", total: "124", stats: "+12 from last time", Icon: User },
    { id: 2, name: "Conversion Rate", total: "65%", stats: "+5% from last time", Icon: TrendingUp },
    { id: 3, name: "Active Enquiries", total: "34", stats: "-3% from last time", Icon: PhoneCall },
    { id: 4, name: "Revenue Generated", total: "₹1,20,000", stats: "+15% from last time", Icon: IndianRupee },
];

export default function Dashboard() {
    return (
        <>
            <div className="flex w-full md:justify-end">
                <div className="flex flex-col md:flex-row bg-gray-300 p-2 rounded-lg w-full md:w-fit">
                    <button className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-500 hover:cursor-pointer  hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black">
                        This year
                    </button>
                    <button className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-500 hover:cursor-pointer  hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black">
                        This month
                    </button>
                    <button className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-500 hover:cursor-pointer  hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black">
                        This week
                    </button>
                    <button className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-500 hover:cursor-pointer  hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black">
                        Today
                    </button>
                </div>
            </div>
            <div className="md:p-6 space-y-6">
                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statsData.map((data) => (
                        <StatCards key={data.id} name={data.name} total={data.total} stats={data.stats} Icon={data.Icon} />
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RevenueOverview />
                    <EnquiryDistributin />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TopPerformers />
                    <EnquiryStatus />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RecentActivities />
                    <UpcomingFollowUps />
                </div>
            </div>
        </>
    );
}
