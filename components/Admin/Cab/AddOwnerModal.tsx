interface Props {
    form: { name: string; phone: string };
    onChange: (form: { name: string; phone: string }) => void;
    onClose: () => void;
    onSave: () => void;
}

export default function AddOwnerModal({ form, onChange, onClose, onSave }: Props) {
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Add Cab Owner</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Owner Name"
                        value={form.name}
                        onChange={(e) => onChange({ ...form, name: e.target.value })}
                        className="w-full border rounded-lg px-4 py-3"
                    />
                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={(e) => onChange({ ...form, phone: e.target.value })}
                        className="w-full border rounded-lg px-4 py-3"
                    />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="border px-4 py-2 rounded-lg">
                        Cancel
                    </button>
                    <button onClick={onSave} className="bg-black text-white px-5 py-2 rounded-lg">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}