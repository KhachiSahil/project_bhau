export interface Cab {
    id: string;
    ownerId: string;
    model: string;
    plateNumber: string;
    seats: number;
    type: "Sedan" | "SUV" | "Tempo Traveller" | "Hatchback";
}

interface CabFormState {
    model: string;
    plateNumber: string;
    seats: string;
    type: Cab["type"];
}

interface Props {
    form: CabFormState;
    onChange: (form: CabFormState) => void;
    onClose: () => void;
    onSave: () => void;
}

export default function AddCabModal({ form, onChange, onClose, onSave }: Props) {
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Add Cab</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Model (e.g. Toyota Innova Crysta)"
                        value={form.model}
                        onChange={(e) => onChange({ ...form, model: e.target.value })}
                        className="w-full border rounded-lg px-4 py-3"
                    />
                    <input
                        type="text"
                        placeholder="Plate Number"
                        value={form.plateNumber}
                        onChange={(e) => onChange({ ...form, plateNumber: e.target.value })}
                        className="w-full border rounded-lg px-4 py-3"
                    />
                    <div className="flex gap-3">
                        <input
                            type="number"
                            placeholder="Seats"
                            value={form.seats}
                            onChange={(e) => onChange({ ...form, seats: e.target.value })}
                            className="w-1/2 border rounded-lg px-4 py-3"
                        />
                        <select
                            value={form.type}
                            onChange={(e) => onChange({ ...form, type: e.target.value as Cab["type"] })}
                            className="w-1/2 border rounded-lg px-4 py-3"
                        >
                            <option>Sedan</option>
                            <option>SUV</option>
                            <option>Hatchback</option>
                            <option>Tempo Traveller</option>
                        </select>
                    </div>
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