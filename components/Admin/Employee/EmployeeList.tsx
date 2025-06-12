"use client";
import { LucideSearch, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

interface employeeData {
  name: string;
  phone: string;
  createdAt: Date;
}


export default function EmployeeTable() {
  const [employees, setEmployees] = useState<employeeData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState<employeeData[]>([]);
  const [activeRow, setActiveRow] = useState<number | null>(null);

  useEffect(() => {
    const filtered = employees.filter((emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Admin/Employee`,
          {
            method: "GET",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch Employees");
        const employee = await response.json();
        setEmployees(employee.data);
        setFilteredEmployees(employee.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

      <div className="w-[95vw] md:w-auto">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-base md:text-lg">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 uppercase font-semibold">
                <th className="py-4 px-2 md:px-6 whitespace-nowrap">Employee</th>
                <th className="py-4 px-2 md:px-6 whitespace-nowrap">Phone no.</th>
                <th className="py-4 px-2 md:px-6 whitespace-nowrap">Created At</th>
                <th className="py-4 px-2 md:px-6 whitespace-nowrap">Actions</th>
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
                {filteredEmployees.map((emp, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-4 px-2 md:px-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full" />
                        <div>
                          <p className="font-bold text-lg md:text-xl">{emp.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 md:px-6 font-semibold text-gray-700">
                      {emp.phone}
                    </td>
                    <td className="py-4 px-2 md:px-6 font-semibold text-gray-700">
                      {new Date(emp.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-2 md:px-6 relative">
                      {activeRow === index && (
                        <ModalButton  />
                      )}
                      <MoreHorizontal
                        className="text-gray-500 cursor-pointer"
                        size={26}
                        onClick={() =>
                          setActiveRow((prev) => (prev === index ? null : index))
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

const ModalButton = ({  }) => {
  return (
    <div className="absolute right-0 z-10 bg-white border shadow-md rounded-md p-2 mt-1 w-32">
      <button className="block w-full text-left hover:bg-gray-100 px-3 py-1 text-sm">
        Delete
      </button>
    </div>
  );
};