import { useState,useEffect } from "react";
interface ModalButtonProps {
  employee: employeeData;
  onClose: () => void;
  onUpdated: () => void;
}

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

export const EmployeeWebsiteModal = ({ employee, onClose, onUpdated }: ModalButtonProps) => {
  const [assignedWebsites, setAssignedWebsites] = useState<EmployeeWebsite[]>(employee.websites ?? []);
  const [availableWebsites, setAvailableWebsites] = useState<EmployeeWebsite[]>([]);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedToAssign, setSelectedToAssign] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch the FULL website list once. This must be the global list, not this employee's
  // own assignments -- the picker's job is to offer everything NOT yet assigned, so its
  // source data has to be a superset of assignedWebsites, not the same set.
  useEffect(() => {
    async function fetchWebsites() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Admin/Website?request=dropdown`);
        const json = await res.json();
        setAvailableWebsites(json.data || []);
      } catch (err) {
        console.error("Error fetching websites:", err);
      }
    }
    fetchWebsites();
  }, []);

  // Now a real subtraction: full list minus whatever's already assigned to this employee.
  const unassignedWebsites = availableWebsites.filter(
    (w) => !assignedWebsites.some((a) => a.id === w.id)
  );

  const handleAssign = () => {
    if (!selectedToAssign) return;
    const website = availableWebsites.find((w) => w.id === selectedToAssign);
    if (!website) return;
    setAssignedWebsites((prev) => [...prev, website]);
    setSelectedToAssign("");
    setIsAssignOpen(false);
  };

  const handleRemove = (websiteId: string) => {
    setAssignedWebsites((prev) => prev.filter((w) => w.id !== websiteId));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Admin/Website/WebsiteAccess`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId: employee.id,
            websiteIds: assignedWebsites.map((w) => w.id),
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to save employee changes");
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Error saving employee changes:", err);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-black">{employee.name}</h2>
            <p className="text-sm text-gray-500">
              Manage websites and employee status.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Assigned Websites */}
        <div className="space-y-4 px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-black">Assigned Websites</h3>

            <div className="relative">
              <button
                onClick={() => setIsAssignOpen((prev) => !prev)}
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                + Assign Website
              </button>

              {isAssignOpen && (
                <div className="absolute right-0 z-10 mt-2 w-64 rounded-md border border-gray-200 bg-white p-3 shadow-lg">
                  {unassignedWebsites.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      {availableWebsites.length === 0
                        ? "No websites exist yet"
                        : "All websites already assigned"}
                    </p>
                  ) : (
                    <>
                      <select
                        value={selectedToAssign}
                        onChange={(e) => setSelectedToAssign(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2 text-sm"
                      >
                        <option value="">Select a website</option>
                        {unassignedWebsites.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleAssign}
                        disabled={!selectedToAssign}
                        className="mt-2 w-full rounded-md bg-black px-3 py-1.5 text-sm text-white disabled:opacity-40"
                      >
                        Add
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {assignedWebsites.length ? (
            <div className="flex flex-wrap gap-2">
              {assignedWebsites.map((website) => (
                <span
                  key={website.id}
                  className="flex items-center gap-2 rounded-md border border-gray-300 bg-gray-100 px-3 py-1 text-sm text-gray-800"
                >
                  {website.name}
                  <button
                    onClick={() => handleRemove(website.id)}
                    className="text-gray-500 hover:text-black"
                    title="Remove"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-gray-300 py-6 text-center text-sm text-gray-500">
              No websites assigned
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-black transition hover:bg-gray-100"
          >
            Close
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-md bg-black px-4 py-2 text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};