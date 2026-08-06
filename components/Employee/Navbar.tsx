"use client";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, Columns2, Menu, Plus } from "lucide-react";
import NewQueries from "./AddNewEnquiry";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeNavbar() {
    const pathname = usePathname().split("/").filter(Boolean);
    const lastSegment = pathname[pathname.length - 1] || "Dashboard";
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const router = useRouter();

    return (
        <div>
            {/* Navbar */}
            <div className="bg-[#fbfafa] shadow-xs py-3 px-4 md:px-6 flex items-center justify-between w-full">
                {/* Mobile Menu Toggle + Page Title */}
                <div className="flex items-center gap-3 font-bold text-lg md:text-2xl">
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent("toggle-employee-sidebar"))}
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

                {/* Add Enquiry & Switch Portal Buttons */}
                <div className="flex items-center gap-2 md:gap-3">
                    <button
                        onClick={() => router.push('/Website')}
                        className="hover:bg-gray-200 text-gray-700 rounded-lg p-2 transition"
                        title="Switch to Website View"
                    >
                        <ArrowLeftRight size={20} />
                    </button>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-black hover:bg-neutral-800 text-white p-2 md:px-4 md:py-2 rounded-xl text-sm font-semibold flex items-center gap-1 shadow-xs transition"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">New Enquiry</span>
                    </button>
                </div>
            </div>
            {isOpen && <NewQueries onClose={() => setIsOpen(false)} />}
        </div>
    );
}
