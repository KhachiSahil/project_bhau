"use client"
import { UserRoundPlus } from "lucide-react";
import { useState } from "react";
import AddEmployee from "./addEmployee";

export default function TopSegment() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <>
            {isOpen && <AddEmployee onClose = {()=>{setIsOpen(!isOpen)}}/>}
            <div className="flex flex-col gap-3 md:flex-row justify-between md:p-6 mb-3 md:mb-0">
                <div className="text-2xl md:text-4xl font-bold">
                    Employee Management
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className="bg-gray-800 shadow shadow-gray-700 p-3 text-lg text-white hover:bg-gray-500 rounded-md font-bold hover:cursor-pointer flex flex-row gap-4 justify-center"><UserRoundPlus className="my-auto" size={20} />Add Employee</button>
            </div>
        </>
    )
}