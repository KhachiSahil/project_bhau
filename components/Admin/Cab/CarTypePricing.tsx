"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2, Check, Trash2 } from "lucide-react";

interface CarType {
  id: string;
  name: string;
  Price: string;
}

const getApiUrl = (endpoint: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;
  if (!baseUrl) return endpoint;
  return baseUrl.endsWith("/") ? `${baseUrl}${endpoint.replace(/^\//, "")}` : `${baseUrl}/${endpoint.replace(/^\//, "")}`;
};

export default function CarTypePricing() {
  const [carTypes, setCarTypes] = useState<CarType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newType, setNewType] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch(getApiUrl("/api/Admin/CabOwner/CabTypes"));
      const resolvedResponse = await response.json();
      if (!response.ok) throw new Error(resolvedResponse?.err || "Failed to load car types");
      setCarTypes(resolvedResponse.data ?? []);
    } catch (err) {
      console.error("Error fetching car types:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCarType = async () => {
    if (!newType.trim() || !newPrice.trim() || isAdding) return;

    setIsAdding(true);
    try {
      const response = await fetch(getApiUrl("/api/Admin/CabOwner/CabTypes"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newType.trim(), price: newPrice.trim() }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.err || "Failed to save car type");

      setCarTypes((prev) => {
        const exists = prev.some((item) => item.id === result.data.id || item.name === result.data.name);
        if (exists) {
          return prev.map((item) => (item.id === result.data.id || item.name === result.data.name ? result.data : item));
        }
        return [...prev, result.data];
      });
      setNewType("");
      setNewPrice("");
    } catch (err: any) {
      console.error("Error saving car type:", err);
      alert(err.message || "Failed to save car type.");
    } finally {
      setIsAdding(false);
    }
  };

  const updatePrice = (id: string, Price: string) => {
    setCarTypes((prev) => prev.map((item) => (item.id === id ? { ...item, Price } : item)));
  };

  const savePrice = async (car: CarType) => {
    setSavingId(car.id);
    try {
      const response = await fetch(getApiUrl("/api/Admin/CabOwner/CabTypes"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: car.id, name: car.name, price: car.Price }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.err || "Failed to update Price");

      setSavedId(car.id);
      setTimeout(() => setSavedId((prev) => (prev === car.id ? null : prev)), 1500);
    } catch (err: any) {
      console.error("Error updating Price:", err);
      alert(err.message || `Failed to save Price for ${car.name}.`);
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteCarType = async (car: CarType) => {
    if (!confirm(`Are you sure you want to delete ${car.name}?`)) return;

    setDeletingId(car.id);
    try {
      const response = await fetch(getApiUrl(`/api/Admin/CabOwner/CabTypes?id=${car.id}`), {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.err || "Failed to delete car type");

      setCarTypes((prev) => prev.filter((item) => item.id !== car.id));
    } catch (err: any) {
      console.error("Error deleting car type:", err);
      alert(err.message || `Failed to delete ${car.name}.`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mb-6">
      <div className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-black">Car Type Pricing</h3>

        <div className="space-y-3">
          {isLoading ? (
            <div className="text-gray-500 text-sm flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Loading car types...
            </div>
          ) : carTypes.length !== 0 ? (
            carTypes.map((car) => (
              <div key={car.id} className="flex items-center gap-2">
                <input
                  disabled
                  value={car.name}
                  className="w-32 rounded-md border bg-gray-100 px-2 py-1.5 text-sm"
                />

                <input
                  type="number"
                  value={car.Price}
                  onChange={(e) => updatePrice(car.id, e.target.value)}
                  onBlur={() => savePrice(car)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                  className="w-20 rounded-md border px-2 py-1.5 text-sm"
                />

                <span className="text-xs text-gray-500 w-12">₹/km</span>

                <span className="w-4 flex items-center justify-center">
                  {savingId === car.id && <Loader2 size={14} className="animate-spin text-gray-400" />}
                  {savedId === car.id && <Check size={14} className="text-green-600" />}
                </span>

                <button
                  type="button"
                  onClick={() => handleDeleteCarType(car)}
                  disabled={deletingId === car.id}
                  className="p-1 text-gray-400 hover:text-red-600 transition rounded-md hover:bg-gray-100 disabled:opacity-50"
                  title="Delete Car Type"
                >
                  {deletingId === car.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            ))
          ) : (
            <div className="text-gray-600 text-sm italic">No car types available. Add one below.</div>
          )}
        </div>

        <div className="my-4 border-t" />

        <div className="space-y-2">
          <input
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            placeholder="New Car Type (e.g. SUV)"
            disabled={isAdding}
            className="w-full rounded-md border px-2 py-1.5 text-sm disabled:bg-gray-100"
          />

          <div className="flex gap-2">
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="Price per km"
              disabled={isAdding}
              className="flex-1 rounded-md border px-2 py-1.5 text-sm disabled:bg-gray-100"
            />

            <button
              onClick={handleAddCarType}
              disabled={isAdding}
              className="flex items-center gap-1 rounded-md bg-black px-3 py-1.5 text-sm text-white hover:bg-neutral-800 disabled:opacity-60"
            >
              {isAdding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              {isAdding ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}