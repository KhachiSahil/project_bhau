"use client";
import { LucideSearch, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { EmployeeWebsiteModal } from "./EmployeeWebsiteModal";

interface EmployeeWebsite {
  id: string;
  name: string;
}

interface employeeData {
  id: string;
  name: string;
  phone: string;
  createdAt: Date;
  websites?: EmployeeWebsite[];
}

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<employeeData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState<employeeData[]>([]);
  const [activeRow, setActiveRow] = useState<string | null>(null);

  useEffect(() => {
    const filtered = employees.filter((emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Admin/Employee`,
        { method: "GET" }
      );
      if (!response.ok) throw new Error("Failed to fetch Employees");
      const employee = await response.json();
      setEmployees(employee.data);
      console.log(employee.data)
      setFilteredEmployees(employee.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const activeEmployee = employees.find((e) => e.id === activeRow) || null;

  return (
    <div className="md:p-8 bg-white rounded-xl shadow-lg w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Employees</h2>
          <p className="text-gray-500 text-sm md:text-lg">
            Manage your team members and their roles
          </p>
        </div>
        <div className="relative md:w-96">
          <input
            onChange={handleSearch}
            type="text"
            placeholder="Search employees..."
            className="pl-12 pr-4 py-3 w-full text-base md:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
          />
          <LucideSearch className="absolute left-4 top-3 text-gray-400" size={22} />
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-base md:text-lg min-w-[600px]">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase font-semibold">
              <th className="py-4 px-3 md:px-6 whitespace-nowrap">Employee</th>
              <th className="py-4 px-3 md:px-6 whitespace-nowrap">Phone no.</th>
              <th className="py-4 px-3 md:px-6 whitespace-nowrap">Created At</th>
              <th className="py-4 px-3 md:px-6 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan={4} className="py-6 px-4 text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 px-4 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              )}
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="border-t">
                  <td className="py-4 px-3 md:px-6">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="w-9 h-9 md:w-12 md:h-12 bg-gray-200 rounded-full flex-shrink-0" />
                      <div>
                        <p className="font-bold text-base md:text-xl">{emp.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3 md:px-6 font-semibold text-gray-700 whitespace-nowrap">
                    {emp.phone}
                  </td>
                  <td className="py-4 px-3 md:px-6 font-semibold text-gray-700 whitespace-nowrap">
                    {new Date(emp.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-3 md:px-6 relative">
                    <MoreHorizontal
                      className="text-gray-500 cursor-pointer hover:text-black"
                      size={26}
                      onClick={() =>
                        setActiveRow((prev) => (prev === emp.id ? null : emp.id))
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {activeEmployee && (
        <EmployeeWebsiteModal
          employee={activeEmployee}
          onClose={() => setActiveRow(null)}
          onUpdated={() => fetchEmployees()}
        />
      )}
    </div>
  );
}
