"use client";

import ModalEnquiries from "@/components/Employee/Enquiries/modalEnquiries";
import { Filter, Eye } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect, useMemo, useRef } from "react";

type StatusType = "Pending"  | "Completed" | "Cancelled";

const statusColors: Record<StatusType, string> = {
  Pending: "bg-gray-100 text-gray-700",
  Completed: "bg-black text-white",
  Cancelled: "bg-red-500 text-white",
};

const tabs: { label: string; status?: StatusType }[] = [
  { label: "All" },
  { label: "Pending", status: "Pending" },
  { label: "Completed", status: "Completed" },
  { label: "Cancelled", status: "Cancelled" },
];

export default function Enquiries() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModal, setIsModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [enqNumber, setEnqNumber] = useState<number | null>(null);
  const initialFetchDone = useRef(false);

  // Fetch paginated data
  useEffect(() => {
    async function fetchData() {
      if (!session?.user?.id || !localStorage.getItem("website") || status !== "authenticated") return;
      if (initialFetchDone.current && page === 1) return; // Skip if already fetched initial data

      setLoading(true);
      try {
        const websiteName = localStorage.getItem("website");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Employee/Enquiry?websiteName=${websiteName}&employeeId=${session.user.id}&page=${page}&limit=10`
        );
        const data = await res.json();
        const newEnquiries = data.enquiries || [];

        setEnquiries(prev => {
          // For page 1, replace all data
          if (page === 1) return newEnquiries;
          // For subsequent pages, append new data
          return [...prev, ...newEnquiries];
        });
        
        setHasNextPage(data.hasNextPage);
        initialFetchDone.current = true;
      } catch (error) {
        console.error("Error fetching enquiries:", error);
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    }

    fetchData();
  }, [page, status, session?.user?.id]);

  // Reset data when component unmounts or when user changes
  useEffect(() => {
    return () => {
      initialFetchDone.current = false;
      setEnquiries([]);
      setPage(1);
    };
  }, [status]);
  console.log(enquiries)
  // Filtered Enquiries Based on Tab & Search
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((enquiry) => {
      const matchStatus = selectedTab === "All" || enquiry.status === selectedTab;
      const matchSearch =
        enquiry.id.toLowerCase().includes(searchQuery.toLowerCase())||
        enquiry.Customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enquiry.Customer?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enquiry.Customer?.phone?.includes(searchQuery);
      return matchStatus && matchSearch;
    });
  }, [enquiries, selectedTab, searchQuery]);

  return (
    <div className="bg-white shadow-md rounded-lg p-0 md:p-6 w-full">
      {isModal && <ModalEnquiries enquiryId={enqNumber} onClose={() => setIsModal(false)} />}

      {/* Header */}
      <div className="flex md:flex-row flex-col justify-start md:justify-between items-start gap-3 md:items-center mb-4">
        <div>
          <h3 className="text-xl md:text-3xl font-semibold">Enquiries</h3>
          <p className="text-gray-500 text-sm md:text-xl">Manage your customer enquiries</p>
        </div>

        {/* Search Bar and Filter */}
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search enquiries..."
            className="border z-0 rounded-md w-36 pl-2 md:px-4 py-2 text-sm md:text-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex items-center gap-2 border px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100">
            <Filter size={20} />
            <select
              className="text-sm md:text-lg font-bold bg-transparent border-none outline-none cursor-pointer"
              value={selectedTab}
              onChange={(e) => setSelectedTab(e.target.value)}
            >
              {tabs.map((tab) => (
                <option key={tab.label} value={tab.label}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading && page === 1 ? (
        <div className="flex justify-center">
          <div className="mx-auto my-5 text-gray-500 font-bold text-xl">Loading your enquiries...</div>
        </div>
      ) : (
        <div className="w-[95vw] md:w-auto">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-black text-sm md:text-xl border-b p-2 border-gray-300">
                  <th className="py-4 px-4">Customer</th>
                  <th className="py-4 px-4">Destination</th>
                  <th className="py-4 px-4">Quotation</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="border-b last:border-none text-sm md:text-lg">
                    <td className="py-4 md:py-2 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold">{enquiry.Customer.name}</span>
                        <span className="font-medium text-sm">{enquiry.Customer.email}</span>
                        <span className="text-sm font-medium">{enquiry.Customer.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 md:py-2 px-4">
                      <div className="flex flex-col">
                        <span>{enquiry.pickupLocation.name}</span>
                        <span>{enquiry.dropLocation.name}</span>
                      </div>
                    </td>
                    <td className="py-4 md:py-2 px-4">{enquiry.quotation}</td>
                    <td className="py-4 md:py-2 px-4 whitespace-nowrap">
                      <span>{enquiry.pickupDate.split("T")[0]}</span>
                      <span className="block">{enquiry.dropDate.split("T")[0]}</span>
                    </td>
                    <td className="py-4 md:py-2 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs md:text-lg font-bold ${statusColors[enquiry.status as StatusType]}`}
                      >
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="py-4 md:py-2 px-4 h-full align-middle">
                      <div className="flex justify-center gap-3 h-full">
                        <button 
                          onClick={() => {
                            setIsModal(true);
                            setEnqNumber(enquiry.id);
                          }} 
                          className="hover:text-gray-600"
                        >
                          <Eye size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View More Button */}
      {hasNextPage && !loading && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => {
              setIsFetchingMore(true);
              setPage((prev) => prev + 1);
            }}
            className="px-6 py-2 bg-black text-white font-semibold rounded hover:bg-gray-900 transition"
            disabled={isFetchingMore}
          >
            {isFetchingMore ? "Loading..." : "View More"}
          </button>
        </div>
      )}
    </div>
  );
}