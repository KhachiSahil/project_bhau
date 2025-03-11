"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import Overview from "@/components/Employee/Reports/Overview";
import Enquiries from "@/components/Employee/Reports/Enquiries";
import Conversions from "@/components/Employee/Reports/Conversions";
import Revenue from "@/components/Employee/Reports/Revenue";
import Destinations from "@/components/Employee/Reports/Destinations";

export default function Reports() {
    const tabs = ["Overview", "Enquiries", "Conversions", "Revenue", "Destinations"];
    const [selectedTab, setSelectedTab] = useState<string>("Overview");
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    const componentsMap: Record<string, React.ReactNode> = {
        Overview: <Overview />,
        Enquiries: <Enquiries />,
        Conversions: <Conversions />,
        Revenue: <Revenue />,
        Destinations: <Destinations />,
    };

    return (
        <div className="p-4 md:p-6 bg-white rounded-lg w-full shadow">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl md:text-4xl font-bold">Reports & Analytics</h2>
                    <p className="text-gray-600 text-sm md:text-lg whitespace-break-spaces">
                        View detailed reports and analytics about your business performance.
                    </p>
                </div>

                {/* Time Period Dropdown */}
                <label className="flex flex-col text-gray-700 font-bold text-lg">
                    Time Period
                    <select className="mt-1 px-3 py-2 border rounded-lg text-gray-600 outline-none focus:ring-2 focus:ring-gray-300">
                        <option value="year">This Year</option>
                        <option value="month">This Month</option>
                        <option value="week">This Week</option>
                        <option value="today">Today</option>
                    </select>
                </label>
            </div>

            {/* Tabs (Desktop) */}
            <div className="hidden md:flex border-b">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`px-6 hover:cursor-pointer  py-3 text-lg font-medium transition ${
                            selectedTab === tab
                                ? "border-b-4 border-black text-black"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tabs (Mobile Dropdown) */}
            <div className="md:hidden relative z-50">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 border rounded-lg text-gray-700 font-medium bg-gray-100"
                >
                    {selectedTab}
                    <Menu size={20} />
                </button>
                {isDropdownOpen && (
                    <div className="absolute w-full bg-white shadow-lg rounded-lg mt-2 border">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setSelectedTab(tab);
                                    setIsDropdownOpen(false);
                                }}
                                className="w-full hover:cursor-pointer text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Render Selected Tab Component */}
            <div className="mt-6">{componentsMap[selectedTab]}</div>
        </div>
    );
}
