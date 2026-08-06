import Navbar from "@/components/Admin/Navbar";
import Sidebar from "@/components/Admin/Sidebar";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50/30">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
                <Navbar />
                <main className="flex-1 p-3 md:p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}