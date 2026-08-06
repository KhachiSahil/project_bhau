import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function RecentFollowups() {
    const [enquiries, setEnquiries] = useState([]);
    const { data: session } = useSession();
    useEffect(() => {
        if (!session?.user?.id) return;
        async function fetchFollowups() {
            const fetchedData = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Admin/Dashboard?type=Enquiries&empId=${session?.user.id}`);
            const resolvedData = await fetchedData.json();
            console.log(resolvedData)
            setEnquiries(resolvedData);
        }
        fetchFollowups();
    }, [session])
    return (
        <div className="bg-white shadow-md rounded-lg md:p-6 w-full">
            {/* Header */}
            <h3 className="text-xl font-semibold">Recent Enquiries</h3>
            <p className="text-gray-500 text-sm mb-4">Your most recent customer enquiries</p>

            {/* Table */}
            <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[500px] text-left">
                    <thead>
                        <tr className="text-gray-600 text-sm md:text-base border-b-2 border-gray-300">
                            <th className="pb-3 px-3">ID</th>
                            <th className="pb-3 px-3">Customer</th>
                            <th className="pb-3 px-3">Destination</th>
                            <th className="pb-3 px-3">Date</th>
                            <th className="pb-3 px-3">Follow-up</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {enquiries.map((item: any, index) => (
                            <tr key={index} className="hover:bg-gray-50/50 text-sm md:text-base">
                                <td className="py-3 px-3 font-mono text-xs text-gray-500">{item.enquiry?.id?.slice(0, 8)}...</td>
                                <td className="py-3 px-3 font-medium text-gray-900">{item.enquiry?.Customer?.name || "N/A"}</td>
                                <td className="py-3 px-3 text-gray-700">{item.enquiry?.destination?.name || "N/A"}</td>
                                <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{item.date ? new Date(item.date).toISOString().split("T")[0] : "N/A"}</td>
                                <td className="py-3 px-3 text-gray-600 truncate max-w-xs">{item.message || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end mt-4">
                <button onClick={() => { }} className="border-2 hover:cursor-pointer px-4 py-2 font-bold rounded-lg hover:bg-gray-100">
                    Show More
                </button>
            </div>
        </div>
    );
}
