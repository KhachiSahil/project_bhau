"use client";
import { usePathname } from "next/navigation";
import { Bell, Columns2 } from "lucide-react";
import { useState } from "react";

export default function EmployeeNavbar() {
    const pathname = usePathname().split("/").filter(Boolean);
    const lastSegment = pathname[pathname.length - 1];
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div>
            {/* Navbar */}
            <div className="bg-[#fbfafa] shadow py-3 px-5 flex md:justify-between w-full">
                {/* Page Title */}
                <div className="mr-10 flex gap-2 md:text-2xl my-auto font-bold">
                    <Columns2 className="my-auto h-8" /> {lastSegment}
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className=" hover:bg-gray-700 hover:cursor-pointer transition duration-150 hover:text-white  p-2 text-sm md:p-3 md:text-lg font-bold rounded-lg"
                >
                    <Bell size={20} />
                </button>
            </div>
        </div>
    );
}
