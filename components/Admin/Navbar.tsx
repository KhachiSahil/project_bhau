"use client";
import { usePathname } from "next/navigation";
import { Columns2, Menu } from "lucide-react";
import { useState } from "react";
import NotificationComponent from "../NotificationComponent";

export default function AdminNavbar() {
    const pathname = usePathname().split("/").filter(Boolean);
    const lastSegment = pathname[pathname.length - 1] || "Dashboard";
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div>
            {/* Navbar */}
            <div className="bg-[#fbfafa] shadow-xs py-3 px-4 md:px-6 flex items-center justify-between w-full">
                {/* Mobile Menu Toggle + Page Title */}
                <div className="flex items-center gap-3 font-bold text-lg md:text-2xl">
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent("toggle-admin-sidebar"))}
                        className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-200 md:hidden"
                        aria-label="Toggle Sidebar"
                    >
                        <Menu size={22} />
                    </button>
                    <div className="flex items-center gap-2 capitalize">
                        <Columns2 className="h-6 w-6 md:h-8 md:w-8 text-black" />
                        <span>{lastSegment}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Placeholder for future action buttons or notifications */}
                </div>
            </div>
            {isOpen && <NotificationComponent onClose={() => setIsOpen(false)} />}
        </div>
    );
}
