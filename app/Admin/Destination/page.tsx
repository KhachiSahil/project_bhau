"use client";
import { useEffect, useState } from "react";
interface Destination {
    id?: string,
    name: string;
    price: number;
    description: string;
}

export default function Destination() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Destination | null>(null);

    const [form, setForm] = useState({
        name: "",
        price: "",
        description: "",
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Admin/Destination`);
                const data = await response.json();
                setDestinations(data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const filteredDestinations = destinations.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const resetForm = () => {
        setForm({
            name: "",
            price: "",
            description: "",
        });
    };

    const handleAdd = async () => {
        try {
            const payload: Destination = {
                id :crypto.randomUUID(),
                name: form.name,
                price: Number(form.price),
                description: form.description,
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Admin/Destination`, {
                method: "POST",
                body: JSON.stringify(payload)
            })

            setDestinations((prev) => [payload, ...prev]);

            resetForm();
            setIsAddOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (item: Destination) => {
        setEditingItem(item);

        setForm({
            name: item.name,
            price: item.price.toString(),
            description: item.description,
        });
    };

    const handleUpdate = async () => {
        if (!editingItem) return;

        try {
            const updated: Destination = {
                ...editingItem,
                name: form.name,
                price: Number(form.price),
                description: form.description,
            };

           const response = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Admin/Destination`, {
                method: "POST",
                body: JSON.stringify(updated)
            })

            setDestinations((prev) =>
                prev.map((item) =>
                    item.id === updated.id ? updated : item
                )
            );

            setEditingItem(null);
            resetForm();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-black">
                            Destination Management
                        </h1>

                        <p className="text-gray-500">
                            Manage destinations, pricing and itineraries
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Search destination..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-gray-300 rounded-xl px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-black"
                        />

                        <button
                            onClick={() => {
                                resetForm();
                                setIsAddOpen(true);
                            }}
                            className="bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-800"
                        >
                            + Add Destination
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="p-10 text-center">
                            Loading destinations...
                        </div>
                    ) : filteredDestinations.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="text-left p-4">Destination</th>
                                        <th className="text-left p-4">Price</th>
                                        <th className="text-left p-4">Itinerary</th>
                                        <th className="text-left p-4">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredDestinations.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-t hover:bg-gray-50"
                                        >
                                            <td className="p-4 font-medium">
                                                {item.name}
                                            </td>

                                            <td className="p-4">
                                                ₹{item.price.toLocaleString("en-IN")}
                                            </td>

                                            <td className="p-4 max-w-md">
                                                <p className="text-gray-600 line-clamp-2">
                                                    {item.description}
                                                </p>
                                            </td>

                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="bg-black text-white px-4 py-2 rounded-lg"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-10 text-center text-gray-500">
                            No destinations found
                        </div>
                    )}
                </div>
            </div>

            {/* Add Modal */}
            {isAddOpen && (
                <DestinationModal
                    title="Add Destination"
                    form={form}
                    setForm={setForm}
                    onClose={() => setIsAddOpen(false)}
                    onSave={handleAdd}
                />
            )}

            {/* Edit Modal */}
            {editingItem && (
                <DestinationModal
                    title="Edit Destination"
                    form={form}
                    setForm={setForm}
                    onClose={() => {
                        setEditingItem(null);
                        resetForm();
                    }}
                    onSave={handleUpdate}
                />
            )}
        </div>
    );
}

function DestinationModal({ title, form, setForm, onClose, onSave, }: any) {
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-xl">
                <h2 className="text-2xl font-bold mb-6">{title}</h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Destination Name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                name: e.target.value,
                            })
                        }
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <input
                        type="number"
                        placeholder="Price"
                        value={form.price}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                price: e.target.value,
                            })
                        }
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <textarea
                        rows={5}
                        placeholder="Itinerary / Description"
                        value={form.description}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                description: e.target.value,
                            })
                        }
                        className="w-full border rounded-lg px-4 py-3"
                    />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="border px-4 py-2 rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onSave}
                        className="bg-black text-white px-5 py-2 rounded-lg"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}