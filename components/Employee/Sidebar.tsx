"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, FileText, CheckCircle, User, LogOut, Menu,Baby } from "lucide-react";
import { useState } from "react";

export default function EmployeeSideBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const employeeLinks = [
    { name: "Dashboard", path: "/Employee", icon: <Home size={20} /> },
    { name: "Enquiries", path: "/Employee/Enquiries", icon: <FileText size={20} /> },
    { name: "Follow Ups", path: "/Employee/FollowUps", icon: <CheckCircle size={20} /> },
  ];

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        className="absolute top-2 right-1 z-50 p-2 rounded-md md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`h-screen bg-[#fbfafa] text-black flex flex-col py-4 shadow-md absolute md:relative ${
          isOpen ? "w-screen" : "w-0"
        } md:w-80 transition-all duration-300 overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="border-b pb-4 border-gray-300 flex text-4xl px-4 font-serif font-bold mb-6"><Baby size={38}/>Bhauu..</div>

        {/* Navigation Links */}
        <nav className="space-y-2 flex-1">
          {employeeLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => {router.push(link.path);
                setIsOpen(!isOpen);
              }}
              className={`w-full hover:cursor-pointer flex items-center gap-3 px-4 py-3 text-lg font-medium transition rounded-lg ${
                pathname === link.path
                  ? "bg-gray-300 text-black"
                  : "hover:bg-gray-200 text-black"
              }`}
            >
              {link.icon}
              {link.name}
            </button>
          ))}
        </nav>

        {/* Profile & Logout */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center px-4 py-3 rounded-lg bg-gray-100">
          <button
            onClick={() => router.push("/Employee/Profile")}
            className="flex items-center gap-3 text-lg font-medium"
          >
            <User size={20} />
            Profile
          </button>
          <button className="text-red-500 hover:text-red-600">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </>
  );
}
