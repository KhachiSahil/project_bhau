"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface CarType {
  id: number;
  name: string;
  price: string;
}

export default function CarTypePricing() {
  const [carTypes, setCarTypes] = useState<CarType[]>([
    { id: 1, name: "Hatchback", price: "12" },
    { id: 2, name: "Sedan", price: "15" },
    { id: 3, name: "SUV", price: "20" },
  ]);

  const [newType, setNewType] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const addCarType = () => {
    if (!newType || !newPrice) return;

    setCarTypes([
      ...carTypes,
      {
        id: Date.now(),
        name: newType,
        price: newPrice,
      },
    ]);

    setNewType("");
    setNewPrice("");
  };

  const updatePrice = (id: number, price: string) => {
    setCarTypes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, price } : item
      )
    );
  };

 return (
  <div className="mb-6">
    <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-black">
        Car Type Pricing
      </h3>

      <div className="space-y-3">
        {carTypes.map((car) => (
          <div key={car.id} className="flex items-center gap-2">
            <input
              disabled
              value={car.name}
              className="w-32 rounded-md border bg-gray-100 px-2 py-1.5 text-sm"
            />

            <input
              type="number"
              value={car.price}
              onChange={(e) => updatePrice(car.id, e.target.value)}
              className="w-20 rounded-md border px-2 py-1.5 text-sm"
            />

            <span className="text-xs text-gray-500">₹/km</span>
          </div>
        ))}
      </div>

      <div className="my-4 border-t" />

      <div className="space-y-2">
        <input
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          placeholder="New Car Type"
          className="w-full rounded-md border px-2 py-1.5 text-sm"
        />

        <div className="flex gap-2">
          <input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="Price"
            className="flex-1 rounded-md border px-2 py-1.5 text-sm"
          />

          <button
            onClick={addCarType}
            className="flex items-center gap-1 rounded-md bg-black px-3 py-1.5 text-sm text-white hover:bg-neutral-800"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>

      <button
        onClick={() => console.log(carTypes)} // Replace with your API call
        className="mt-4 w-full rounded-md bg-black py-2 text-sm font-medium text-white hover:bg-neutral-800"
      >
        Save Changes
      </button>
    </div>
  </div>
);

}