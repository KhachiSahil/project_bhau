"use client";

import { useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

/* ---------- Types ---------- */
type Value = Date | null | [Date, Date];

export interface FollowUp {
  id: string;
  date: string;       // ISO
  note: string;
  createdAt: string;  // ISO
  updatedAt: string;  // ISO
  employeeId: string;
  enquiryId: string;
}

interface CalendarComponentProps {
  followUps: FollowUp[];
}

/* ---------- Helpers ---------- */
function parseLocalDateOnly(iso: string): Date {
  const [yyyy, mm, dd] = iso.split("T")[0].split("-").map(Number);
  return new Date(yyyy, mm - 1, dd);
}
function dateKey(d: Date) {
  return d.toISOString().split("T")[0];
}

/* ---------- Component ---------- */
export default function CalendarComponent({ followUps }: CalendarComponentProps) {
  const [value, setValue] = useState<Value>(new Date());
  /* group follow‑ups by day once ---------------------------------- */
  const followUpsByDay = useMemo(() => {
    const map = new Map<string, FollowUp[]>();
    for (const fu of followUps) {
      const key = dateKey(parseLocalDateOnly(fu.date));
      (map.get(key) || map.set(key, []).get(key))!.push(fu);
    }
    return map;
  }, [followUps]);

  /* currently selected list --------------------------------------- */
  const selectedDate: Date | null = Array.isArray(value) ? value[0] : value;
  const todays = selectedDate ? followUpsByDay.get(dateKey(selectedDate)) ?? [] : [];

  /* ---------- UI ------------------------------------------------- */
  return (
    <div className="md:p-6 max-w-xl mx-auto bg-white shadow-md rounded-lg">
      {/* heading */}
      <header className="mb-4">
        <h2 className="text-3xl font-bold">Calendar</h2>
        <p className="text-gray-600">Click a date to see its follow‑ups</p>
      </header>

      {/* calendar */}
      <Calendar
        onChange={(v) => setValue(v as Value)}
        value={value}
        className="border rounded-lg w-full"
        tileContent={({ date }) =>
          followUpsByDay.has(dateKey(date)) ? (
            <div className="mt-1 flex justify-center">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />
            </div>
          ) : null
        }
      />

      {/* selected day info */}
      <div className="mt-4 text-center font-medium">
        Selected&nbsp;Date:&nbsp;
        <span className="text-blue-600">
          {selectedDate ? selectedDate.toDateString() : "None"}
        </span>
      </div>

      {/* follow‑up list */}
      <section className="mt-4 p-4 bg-gray-50 border rounded-md max-h-60 overflow-auto">
        {todays.length ? (
          <ul className="space-y-3">
            {todays.map((fu) => (
              <li key={fu.id} className="p-3 bg-white border rounded shadow-sm">
                <p className="text-sm text-gray-500 mb-1">
                  Enquiry&nbsp;ID: <span className="font-mono">{fu.enquiryId}</span>
                </p>
                <p className="text-gray-700">message{fu.note}</p>

                <div className="mt-2 text-xs text-gray-500 space-x-2">
                  <span>Employee: {fu.employeeId}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No follow‑ups for this date.</p>
        )}
      </section>
    </div>
  );
}
