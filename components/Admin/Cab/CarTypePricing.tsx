"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2, Check } from "lucide-react";

interface CarType {
  id: string;
  name: string;
  Price: string;
}

export default function CarTypePricing() {
  const [carTypes, setCarTypes] = useState<CarType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newType, setNewType] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Admin/CabOwner/CabTypes`);
        const resolvedResponse = await response.json();
        if (!response.ok) throw new Error(resolvedResponse?.err || "Failed to load car types");
        setCarTypes(resolvedResponse.data ?? []);
        console.log(resolvedResponse.data)
      } catch (err) {
        console.error("Error fetching car types:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAddCarType = async () => {
    if (!newType || !newPrice || isAdding) return;

    setIsAdding(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Admin/CabOwner/CabTypes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newType, price: newPrice }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.err || "Failed to save car type");

      setCarTypes((prev) => [...prev, result.data]);
      setNewType("");
      setNewPrice("");
    } catch (err) {
      console.error("Error saving car type:", err);
      alert("Failed to save car type.");
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Admin/CabOwner/CabTypes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: car.id, name: car.name, price: car.Price }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.err || "Failed to update Price");

      setSavedId(car.id);
      setTimeout(() => setSavedId((prev) => (prev === car.id ? null : prev)), 1500);
    } catch (err) {
      console.error("Error updating Price:", err);
      alert(`Failed to save Price for ${car.name}.`);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="mb-6">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-black">Car Type Pricing</h3>

        <div className="space-y-3">
          {isLoading ? (
            <div className="text-gray-500 text-sm">Loading...</div>
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

                <span className="w-4">
                  {savingId === car.id && <Loader2 size={14} className="animate-spin text-gray-400" />}
                  {savedId === car.id && <Check size={14} className="text-green-600" />}
                </span>
              </div>
            ))
          ) : (
            <div className="text-gray-600 font-bold">No data available...</div>
          )}
        </div>

        <div className="my-4 border-t" />

        <div className="space-y-2">
          <input
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            placeholder="New Car Type"
            disabled={isAdding}
            className="w-full rounded-md border px-2 py-1.5 text-sm disabled:bg-gray-100"
          />

          <div className="flex gap-2">
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="Price"
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