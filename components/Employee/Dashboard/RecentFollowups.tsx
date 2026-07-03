import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function RecentFollowups() {
    const [enquiries, setEnquiries] = useState([]);
    const { data: session } = useSession();
    useEffect(() => {
        if (!session?.user?.id) return;
        async function fetchFollowups() {
            const fetchedData = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Employee/Dashboard?type=Enquiries&empId=${session?.user.id}`);
            const resolvedData = await fetchedData.json();
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
            <div className="w-[90vw] md:w-full">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-600 text-base border-b-2 border-gray-400">
                                <th className="pb-2 px-2 sm:px-6">ID</th>
                                <th className="pb-2 px-2 sm:px-6">Customer</th>
                                <th className="pb-2 px-2 sm:px-6">Destination</th>
                                <th className="pb-2 px-2 sm:px-6">Date</th>
                                <th className="pb-2 px-2 sm:px-6">Follow-up</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enquiries.map((item: any, index) => (
                                <tr key={index} className="border-b last:border-none md:text-lg">
                                    <td className="py-3 px-2 sm:px-6 font-semibold text-xs">{item.enquiry.id}</td>
                                    <td className="py-3 px-2 sm:px-6">{item.enquiry.Customer.name}</td>
                                    <td className="py-3 px-2 sm:px-6">{item.enquiry.destination.name}</td>
                                    <td className="py-3 px-2 sm:px-6">{new Date(item.date).toISOString().split("T")[0]}</td>
                                    <td className="py-3 px-2 sm:px-6"> {item.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex justify-end mt-4">
                <button onClick={() => { }} className="border-2 hover:cursor-pointer px-4 py-2 font-bold rounded-lg hover:bg-gray-100">
                    Show More
                </button>
            </div>
        </div>
    );
}
