"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

/* -------------------------------------------------- *
 * Types
 * -------------------------------------------------- */
interface FollowUp {
  id: string;
  date: string;            // ISO‑8601
  message: string;
  createdAt: string;
  updatedAt: string;
  employeeId: string;
  enquiryId: string;
}

interface FollowUpsProps {
  followUps: FollowUp[];
}

/* -------------------------------------------------- *
 * Date helpers – always compare in UTC
 * -------------------------------------------------- */
function startOfTodayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function isUpcomingUTC(dateISO: string): boolean {
  return new Date(dateISO).getTime() > startOfTodayUTC().getTime(); // strictly after “today”
}

/* -------------------------------------------------- *
 * Component
 * -------------------------------------------------- */
export default function FollowUps({ followUps }: FollowUpsProps) {
  const [activeTab, setActiveTab] = useState<"All" | "Upcoming">("All");
  const [search, setSearch] = useState("");

  /* ---------- pre‑process list once ------------- */
  const processed = useMemo(
    () =>
      followUps.map((fu) => ({
        ...fu,
        dateOnly: fu.date.split("T")[0],       // 2025‑06‑29
        upcoming: isUpcomingUTC(fu.date),
      })),
    [followUps],
  );

  /* ---------- tab + search filtering ------------ */
  const visible = useMemo(() => {
    return processed.filter((fu) => {
      const tabOk = activeTab === "All" ? true : fu.upcoming;
      if (!tabOk) return false;

      if (!search.trim()) return true;

      const q = search.toLowerCase();
      return (
        fu.message.toLowerCase().includes(q) ||
        fu.enquiryId.toLowerCase().includes(q)
      );
    });
  }, [processed, activeTab, search]);

  /* ---------- UI -------------------------------- */
  return (
    <div className="w-full p-4 md:p-6 bg-white shadow rounded-lg">
      {/* header + search */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold">Follow‑ups</h2>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search message / enquiry…"
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-600 outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
      </div>

      {/* tabs */}
      <div className="flex space-x-4 border-b mb-4">
        {(["All", "Upcoming"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-lg font-semibold ${
              activeTab === tab
                ? "border-b-2 border-black text-black"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* list */}
      <div className="border rounded-lg overflow-hidden">
        {visible.length ? (
          visible.map((fu) => (
            <div
              key={fu.id}
              className="flex flex-col sm:flex-row gap-y-1 sm:gap-0 sm:items-center justify-between p-4 border-b last:border-none hover:bg-gray-50"
            >
              <p className="font-bold text-gray-800">{fu.dateOnly}</p>

              <p className="text-gray-700 sm:w-1/2">{fu.message}</p>

              <p className="text-gray-500 text-sm sm:text-base">{fu.enquiryId}</p>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">No follow‑ups found.</div>
        )}
      </div>
    </div>
  );
}
