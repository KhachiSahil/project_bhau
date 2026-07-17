"use client"
import RecentFollowups from "@/components/Admin/Dashboard/RecentFollowups";
import StatCards from "@/components/StatCards";
import { Mail, TrendingUp, PhoneCall, IndianRupee } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: session } = useSession();
  const params = useSearchParams();
  const [statsData, setStatsData] = useState({
    totalEnquiries: 0,
    conversionRate: 0,
    pendingFollowups: 0,
    revenueGenerated: 0,
  });

  const cards = [
    {
      name: "Total Enquiries",
      value: statsData.totalEnquiries,
      Icon: Mail,
    },
    { 
      name: "Conversion Rate", 
      value: statsData.conversionRate,
      Icon: TrendingUp,
    },
    {
      name: "Pending Follow Ups",
      value: statsData.pendingFollowups,
      Icon: PhoneCall,
    },
    {
      name: "Revenue Generated",
      value: statsData.revenueGenerated,
      Icon: IndianRupee,
    },
  ];

  useEffect(() => {
    const websiteName = params.get('website')
    if (websiteName !== null)
      localStorage.setItem('website', websiteName || "");

    async function fetchData() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Admin/Dashboard?type=Stats&empId=${session?.user.id}`)
      const newData = await response.json();
      setStatsData(newData);
      console.log(statsData)
    }

    if (session?.user.id) {
      fetchData()
    }
  }, [session, params])

  return (
    <div className="md:p-6 space-y-6">
      <div className="text-2xl font-bold mt-2">
        Welcome, {session?.user.name}
      </div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card) => (
          <StatCards
            key={card.name}
            name={card.name}
            total={card.value}
            Icon={card.Icon}
          />
        ))}
      </div>
      <div>
        <RecentFollowups />
      </div>
    </div>
  );
}
