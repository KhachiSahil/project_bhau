import Navbar from "@/components/Admin/Navbar";
import Sidebar from "@/components/Admin/Sidebar";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex h-screen">
            <div className="">
                <Sidebar />
            </div>
            <div className="flex flex-col flex-1">
                <Navbar />
                <main className="flex-1 p-2 md:p-6 overflow-y-auto">
                    {children}
                </main>

            </div>
        </div>
    )
}