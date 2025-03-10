"use client"
import { usePathname } from "next/navigation"
import { Columns2 } from "lucide-react";
export default function EmployeeNavbar() {
    const pathname = usePathname().split("/").filter(Boolean);
    const lastSegment = pathname[pathname.length - 1];

    return (
        <div className="bg-[#fbfafa] shadow py-3 px-5 flex md:justify-between w-full">
            <div className="mr-10 flex gap-2 md:text-2xl my-auto font-bold">
            <Columns2 className="my-auto h-8" />{lastSegment}
            </div>
            <div className="bg-gray-800 hover:bg-gray-200 hover:text-black transition duration-150 border-2 hover:cursor-pointer border-black text-white p-2 text-sm md:p-3 md:text-lg font-bold rounded-lg">
                Add New Enquiry
            </div>
        </div>
    )
}