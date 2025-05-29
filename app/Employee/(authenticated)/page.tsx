"use client"
import StatCards from "@/components/Employee/Dashboard/StatCards";
import PerformanceChart from "@/components/Employee/Dashboard/PerformanceCharts";
import ConversionRateChart from "@/components/Employee/Dashboard/ConversionRataeChart";
import { Mail, TrendingUp, PhoneCall, IndianRupee } from "lucide-react";
import RecentEnquiries from "@/components/Employee/Dashboard/RecentEnquiries";
import UpcomingFollowUps from "@/components/Employee/Dashboard/UpcomingFollowUps";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
const statsData = [
  { id: 1, name: "Total Enquiries", total: "124", stats: "+12% from last time", Icon: Mail },
  { id: 2, name: "Conversion Rate", total: "65%", stats: "+5% from last time", Icon: TrendingUp },
  { id: 3, name: "Pending Follow Ups", total: "34", stats: "-3% from last time", Icon: PhoneCall },
  { id: 4, name: "Revenue Generated", total: "₹1,20,000", stats: "+15% from last time", Icon: IndianRupee },
];

export default function Dashboard() {
    // const router = useRouter()
    // const {data:session,status} = useSession();
    // if(status === 'unauthenticated'){
    //   router.push('/signin')
    // }
  return (
    <div className="md:p-6 space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((data) => (
          <StatCards key={data.id} name={data.name} total={data.total} stats={data.stats} Icon={data.Icon} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1">
        <RecentEnquiries />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart />
        <ConversionRateChart />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <UpcomingFollowUps />
      </div>
    </div>
  );
}
