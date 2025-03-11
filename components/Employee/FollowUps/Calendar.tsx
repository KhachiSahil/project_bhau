"use client"
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Define Value type manually
type Value = Date | null | [Date, Date];

export default function CalendarComponent() {
    const [date, setDate] = useState<Value>(new Date()); 

    return (
        <div className="md:p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
            {/* Header */}
            <div className="mb-4">
                <h2 className="text-2xl md:text-4xl font-bold">Calendar</h2>
                <p className="text-gray-600">Select a date to view scheduled follow-ups</p>
            </div>

            {/* Calendar */}
            <div className="flex justify-center">
                <Calendar 
                    onChange={(value) => setDate(value as Value)} 
                    value={date} 
                    className="border border-gray-300 rounded-lg"
                />
            </div>

            {/* Selected Date */}
            <div className="mt-4 text-center text-lg font-medium">
                Selected Date:{" "}
                <span className="text-blue-600">
                    {date 
                        ? (Array.isArray(date) 
                            ? `${date[0].toDateString()} - ${date[1].toDateString()}`
                            : date.toDateString())
                        : "None"}
                </span>
            </div>
        </div>
    );
}
