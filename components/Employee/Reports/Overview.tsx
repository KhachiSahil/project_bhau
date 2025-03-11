import { User, TrendingUp, DollarSign, ShoppingBag } from "lucide-react";
import StatsCard from "@/components/Employee/Reports/StatCards";
import EnquiriesVsConversions from "@/components/Employee/Reports/EnquiriesConversions";
import TopDestinations from "./TopDestinations";

export default function Overview() {
    return (
        <div className="md:p-6 space-y-6">
            {/* Stats Cards */}
            <div className="md:grid md:grid-cols-4 flex flex-col gap-6">
                <StatsCard title="Total Enquiries" value="820" change="+15.3%" icon={User} color="#4F46E5" />
                <StatsCard title="Conversion Rate" value="48.2%" change="+5.3%" icon={TrendingUp} color="#16A34A" />
                <StatsCard title="Total Revenue" value="₹1.24Cr" change="+18.7%" icon={DollarSign} color="#FACC15" />
                <StatsCard title="Avg. Deal Size" value="₹3.15L" change="+7.2%" icon={ShoppingBag} color="#F97316" />
            </div>

            {/* Charts Section */}
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                <div className="">
                    <EnquiriesVsConversions />
                </div>
                <div>
                    <TopDestinations />
                </div>
            </div>
        </div>
    );
}
