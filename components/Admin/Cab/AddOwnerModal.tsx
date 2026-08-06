import { Loader2 } from "lucide-react";

interface Props {
    form: { name: string; phone: string };
    onChange: (form: { name: string; phone: string }) => void;
    onClose: () => void;
    onSave: () => void;
    isSaving?: boolean;
}

export default function AddOwnerModal({ form, onChange, onClose, onSave, isSaving = false }: Props) {
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                <h2 className="text-2xl font-bold mb-6">Add Cab Owner</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Owner Name"
                        value={form.name}
                        onChange={(e) => onChange({ ...form, name: e.target.value })}
                        disabled={isSaving}
                        className="w-full border rounded-lg px-4 py-3 text-sm disabled:bg-gray-100"
                    />
                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={(e) => onChange({ ...form, phone: e.target.value })}
                        disabled={isSaving}
                        className="w-full border rounded-lg px-4 py-3 text-sm disabled:bg-gray-100"
                    />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} disabled={isSaving} className="border px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        disabled={isSaving || !form.name.trim()}
                        className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-neutral-800 disabled:opacity-50"
                    >
                        {isSaving && <Loader2 size={14} className="animate-spin" />}
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}