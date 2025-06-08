import EmployeeSideBar from "@/components/Employee/Sidebar";
import EmployeeNavbar from "@/components/Employee/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next"
export default function EmployeeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen">
      <EmployeeSideBar />

      <div className="flex flex-col flex-1">
        <EmployeeNavbar />

        {/* Page content */}
        <main className="flex-1 p-2 md:p-6 overflow-y-auto">{children} <SpeedInsights /></main>
      </div>
    </div>
  );
}
