"use client";
import { useEffect, useState } from "react";

interface Website {
    id?: string;
    name: string;
    url: string;
    status: "Active" | "Inactive";
    description: string;
}

export default function Website() {
    const [websites, setWebsites] = useState<Website[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Website | null>(null);

    const [form, setForm] = useState({
        name: "",
        url: "",
        status: "Active",
        description: "",
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Admin/Website?request=page`);
                const data = await response.json();
                setWebsites(data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const filteredWebsites = websites.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.url.toLowerCase().includes(search.toLowerCase())
    );

    const resetForm = () => {
        setForm({
            name: "",
            url: "",
            status: "Active",
            description: "",
        });
    };

    const handleAdd = async () => {
        try {
            const payload: Website = {
                id: crypto.randomUUID(),
                name: form.name,
                url: form.url,
                status: form.status as "Active" | "Inactive",
                description: form.description,
            };

            await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Admin/Website`, {
                method: "POST",
                body: JSON.stringify(payload),
            });

            setWebsites((prev) => [payload, ...prev]);

            resetForm();
            setIsAddOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (item: Website) => {
        setEditingItem(item);

        setForm({
            name: item.name,
            url: item.url,
            status: item.status,
            description: item.description,
        });
    };

    const handleUpdate = async () => {
        if (!editingItem) return;

        try {
            const updated: Website = {
                ...editingItem,
                name: form.name,
                url: form.url,
                status: form.status as "Active" | "Inactive",
                description: form.description,
            };

            await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Admin/Website`, {
                method: "POST",
                body: JSON.stringify(updated),
            });

            setWebsites((prev) =>
                prev.map((item) => (item.id === updated.id ? updated : item))
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
                            Website Management
                        </h1>

                        <p className="text-gray-500">
                            Manage linked websites, statuses and details
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Search website..."
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
                            + Add Website
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="p-10 text-center">
                            Loading websites...
                        </div>
                    ) : filteredWebsites.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="text-left p-4">Name</th>
                                        <th className="text-left p-4">URL</th>
                                        <th className="text-left p-4">Status</th>
                                        <th className="text-left p-4">Description</th>
                                        <th className="text-left p-4">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredWebsites.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-t hover:bg-gray-50"
                                        >
                                            <td className="p-4 font-medium">
                                                {item.name}
                                            </td>

                                            <td className="p-4">
                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {item.url}
                                                </a>
                                            </td>

                                            <td className="p-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        item.status === "Active"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-200 text-gray-600"
                                                    }`}
                                                >
                                                    {item.status}
                                                </span>
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
                            No websites found
                        </div>
                    )}
                </div>
            </div>

            {/* Add Modal */}
            {isAddOpen && (
                <WebsiteModal
                    title="Add Website"
                    form={form}
                    setForm={setForm}
                    onClose={() => setIsAddOpen(false)}
                    onSave={handleAdd}
                />
            )}

            {/* Edit Modal */}
            {editingItem && (
                <WebsiteModal
                    title="Edit Website"
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

function WebsiteModal({ title, form, setForm, onClose, onSave }: any) {
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-xl">
                <h2 className="text-2xl font-bold mb-6">{title}</h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Website Name"
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
                        type="url"
                        placeholder="https://example.com"
                        value={form.url}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                url: e.target.value,
                            })
                        }
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <select
                        value={form.status}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                status: e.target.value,
                            })
                        }
                        className="w-full border rounded-lg px-4 py-3"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>

                    <textarea
                        rows={5}
                        placeholder="Description / Notes"
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