import { useState } from "react";
import LoadingButton from "@/components/loadingButton"
type funType = {
  onClose: () => void;
};

export default function AddEmployee({ onClose }: funType) {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
    console.log(process.env.NEXT_PUBLIC_WEBSITE_URL);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Admin/Employee`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, password, phone }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setStatus("Employee added successfully");
        setName("");
        setPassword("");
        setPhone("");
      } else {
        setStatus(result.error || "Failed to add employee");
      }
    } catch (err) {
      setStatus("Something went wrong");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed overflow-y-auto pt-56 md:pt-0 inset-0 flex items-center justify-center bg-black/70 bg-opacity-50 z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl p-8 md:p-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-semibold">
            Add New Employee
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-3xl font-bold hover:cursor-pointer"
          >
            &times;
          </button>
        </div>

        <p className="text-gray-500 text-sm md:text-lg font-semibold">
          Enter employee details to add them to the system
        </p>

        {/* Form */}
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="font-semibold text-lg">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Enter name"
                className="border border-gray-400 p-2 rounded-md font-semibold"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold text-lg">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="text"
                placeholder="Enter password"
                className="border border-gray-400 p-2 rounded-md font-semibold"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold text-lg">Phone no.</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="text"
                placeholder="Enter phone no."
                className="border border-gray-400 p-2 rounded-md font-semibold"
              />
            </div>
          </div>

          {/* Status message */}
          {status && (
            <p className="text-sm text-red-600 font-medium pt-2">{status}</p>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-6 mt-4">
            <button
              type="button"
              className="font-bold text-xl border-2 border-gray-600 p-3 rounded-md hover:scale-105 hover:cursor-pointer duration-200"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`font-bold text-xl bg-black text-white border-2 p-3 rounded-md duration-200 flex items-center justify-center gap-2 ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:scale-105 hover:cursor-pointer"
              }`}
            >
              {loading ? (
                <LoadingButton/>
              ) : (
                "Add Employee"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
