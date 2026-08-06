import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export interface Cab {
    id: string;
    ownerId: string;
    model: string;
    plateNumber: string;
    seats: number;
    type: string;
}

interface CabFormState {
    model: string;
    plateNumber: string;
    seats: string;
    type: string;
}

interface CarTypeOption {
    id: string;
    name: string;
}

interface Props {
    form: CabFormState;
    onChange: (form: CabFormState) => void;
    onClose: () => void;
    onSave: () => void;
    isSaving?: boolean;
    carTypes?: CarTypeOption[];
}

const getApiUrl = (endpoint: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;
    if (!baseUrl) return endpoint;
    return baseUrl.endsWith("/") ? `${baseUrl}${endpoint.replace(/^\//, "")}` : `${baseUrl}/${endpoint.replace(/^\//, "")}`;
};

export default function AddCabModal({ form, onChange, onClose, onSave, isSaving = false, carTypes: propCarTypes }: Props) {
    const [fetchedCarTypes, setFetchedCarTypes] = useState<CarTypeOption[]>([]);
    const [isLoadingTypes, setIsLoadingTypes] = useState(false);

    useEffect(() => {
        if (propCarTypes && propCarTypes.length > 0) {
            setFetchedCarTypes(propCarTypes);
            return;
        }

        async function fetchTypes() {
            setIsLoadingTypes(true);
            try {
                const res = await fetch(getApiUrl("/api/Admin/CabOwner/CabTypes"));
                const data = await res.json();
                if (res.ok && Array.isArray(data.data)) {
                    setFetchedCarTypes(data.data);
                    if (data.data.length > 0 && !form.type) {
                        onChange({ ...form, type: data.data[0].name });
                    }
                }
            } catch (err) {
                console.error("Failed to load car types in AddCabModal:", err);
            } finally {
                setIsLoadingTypes(false);
            }
        }

        fetchTypes();
    }, [propCarTypes]);

    const defaultTypes = ["Sedan", "SUV", "Hatchback", "Tempo Traveller"];
    const displayTypes = fetchedCarTypes.length > 0 ? fetchedCarTypes.map((t) => t.name) : defaultTypes;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                <h2 className="text-2xl font-bold mb-6">Add Cab</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Model (e.g. Toyota Innova Crysta)"
                        value={form.model}
                        onChange={(e) => onChange({ ...form, model: e.target.value })}
                        disabled={isSaving}
                        className="w-full border rounded-lg px-4 py-3 text-sm disabled:bg-gray-100"
                    />
                    <input
                        type="text"
                        placeholder="Plate Number (e.g. HP-01-A-1234)"
                        value={form.plateNumber}
                        onChange={(e) => onChange({ ...form, plateNumber: e.target.value })}
                        disabled={isSaving}
                        className="w-full border rounded-lg px-4 py-3 text-sm disabled:bg-gray-100"
                    />
                    <div className="flex gap-3">
                        <input
                            type="number"
                            placeholder="Seats"
                            value={form.seats}
                            onChange={(e) => onChange({ ...form, seats: e.target.value })}
                            disabled={isSaving}
                            className="w-1/2 border rounded-lg px-4 py-3 text-sm disabled:bg-gray-100"
                        />
                        <select
                            value={form.type}
                            onChange={(e) => onChange({ ...form, type: e.target.value })}
                            disabled={isSaving || isLoadingTypes}
                            className="w-1/2 border rounded-lg px-4 py-3 text-sm disabled:bg-gray-100"
                        >
                            {displayTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} disabled={isSaving} className="border px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        disabled={isSaving || !form.model.trim() || !form.plateNumber.trim()}
                        className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-neutral-800 disabled:opacity-60"
                    >
                        {isSaving && <Loader2 size={14} className="animate-spin" />}
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}