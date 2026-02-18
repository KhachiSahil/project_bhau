"use client"
import StatCards from "@/components/Employee/Dashboard/StatCards";
import { Mail, TrendingUp, PhoneCall, IndianRupee } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const statsData = [
  { id: 1, name: "Total Enquiries", total: "124", stats: "+12% from last time", Icon: Mail },
  { id: 2, name: "Conversion Rate", total: "65%", stats: "+5% from last time", Icon: TrendingUp },
  { id: 3, name: "Pending Follow Ups", total: "34", stats: "-3% from last time", Icon: PhoneCall },
  { id: 4, name: "Revenue Generated", total: "₹1,20,000", stats: "+15% from last time", Icon: IndianRupee },
];
export default function Dashboard() {
  const {data : session, status} = useSession();
  const params = useSearchParams();
  useEffect(() => {
    const websiteName = params.get('website')
    console.log(websiteName)
    if (websiteName !== null)
      localStorage.setItem('website', websiteName || "");
  }, [])

  return (
    <div className="md:p-6 space-y-6">
      <div className="text-2xl font-bold mt-2">
        Welcome, {session?.user.name}
      </div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statsData.map((data) => (
          <StatCards key={data.id} name={data.name} total={data.total} stats={data.stats} Icon={data.Icon} />
        ))}
      </div>
    </div>
  );
}
