"use client";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, Bell, BellDot, Columns2, Plus } from "lucide-react";
import NewQueries from "./AddNewEnquiry";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeNavbar() {
    const pathname = usePathname().split("/").filter(Boolean);
    const lastSegment = pathname[pathname.length - 1];
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const router = useRouter()
    return (
        <div>
            {/* Navbar */}
            <div className="bg-[#fbfafa] shadow py-3 px-5 flex  w-full">
                {/* Page Title */}
                <div className="mr-10 flex gap-2 md:text-2xl my-auto font-bold">
                    <Columns2 className="my-auto h-8" /> {lastSegment}
                </div>

                {/* Add Enquiry Button */}
                <div className="justify-end flex w-full mr-10 md:mr-0">
                    <div className="flex gap-3 my-auto mr-3">
                        <div className="hover:bg-gray-400 rounded-md p-2 hover:cursor-pointer"><Bell /> </div>
                        <div onClick={()=>{router.push('/Employee/Website')}} className="hover:bg-gray-400 rounded-md p-2 hover:cursor-pointer"><ArrowLeftRight /></div>
                    </div>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-gray-800 hover:bg-gray-700 hover:cursor-pointer transition duration-150 border border-black text-white p-2 text-sm md:p-3 md:text-lg font-bold rounded-lg"
                    >
                        <Plus/>
                    </button>
                </div>
            </div>
            {isOpen && <NewQueries onClose={() => setIsOpen(false)} />}
        </div>
    );
}
