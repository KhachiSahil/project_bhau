"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Hammer, Home, FileText, CheckCircle, User, LogOut, Menu,
  ChartLine, SquareUser, CarTaxiFront, Baby, MapPinCheck, HotelIcon, GlobeX, X
} from "lucide-react";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggle-admin-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-admin-sidebar", handleToggle);
  }, []);

  const adminLinks = [
    { name: "Dashboard", path: "/Admin", icon: <Home size={20} /> },
    { name: "Employees", path: "/Admin/Employee", icon: <SquareUser size={20} /> },
    { name: "Enquiries", path: "/Admin/Enquiries", icon: <FileText size={20} /> },
    { name: "Cab", path: "/Admin/Cab", icon: <CarTaxiFront size={20} /> },
    { name: "Follow Ups", path: "/Admin/FollowUps", icon: <CheckCircle size={20} /> },
    { name: "Reports", path: "/Admin/Reports", icon: <ChartLine size={20} /> },
    { name: "Itinerary", path: "/Admin/Itenary", icon: <Hammer size={20} /> },
    { name: "Destination", path: "/Admin/Destination", icon: <MapPinCheck size={20} /> },
    { name: "Website", path: "/Admin/Website", icon: <GlobeX size={20} /> },
    { name: "Hotel", path: "/Admin/Hotel", icon: <HotelIcon size={20} /> },
  ];

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-[#fbfafa] text-black flex flex-col py-4 shadow-md w-72 max-w-[80vw] md:max-w-none md:w-72 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="border-b pb-4 border-gray-300 flex items-center justify-between px-4 mb-4">
          <div className="flex items-center gap-2 text-3xl font-serif font-bold">
            <Baby size={36} /> Bhauu..
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg hover:bg-gray-200 md:hidden"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 flex-1 px-3 overflow-y-auto">
          {adminLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => {
                  router.push(link.path);
                  setIsOpen(false);
                }}
                className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 text-base font-medium transition rounded-xl ${
                  isActive
                    ? "bg-gray-300 text-black font-semibold"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
              >
                {link.icon}
                {link.name}
              </button>
            );
          })}
        </nav>

        {/* Profile & Logout */}
        <div className="mt-auto px-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center px-3 py-2.5 rounded-xl bg-gray-100">
            <button
              onClick={() => {
                router.push("/Employee/Profile");
                setIsOpen(false);
              }}
              className="flex items-center gap-2.5 text-base font-medium text-black hover:text-gray-700"
            >
              <User size={18} />
              Profile
            </button>
            <button
              onClick={() => {
                signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL || ""}/signin` });
              }}
              className="text-red-500 hover:text-red-600 p-1 rounded-md hover:bg-gray-200"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
