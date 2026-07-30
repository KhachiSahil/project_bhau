interface Cab {
    id: string;
    ownerId: string;
    model: string;
    plateNumber: string;
    seats: number;
    type: "Sedan" | "SUV" | "Tempo Traveller" | "Hatchback";
}
 
interface CabOwner {
    id: string;
    name: string;
    phone: string;
    cabs: Cab[];
}

interface Props {
    owner: CabOwner;
    isOpen: boolean;
    selectedCabFilter: string | null;
    onToggle: () => void;
    onSelectCab: (cabId: string) => void;
    onAddCab: () => void;
}

export default function OwnerCard({ owner, isOpen, selectedCabFilter, onToggle, onSelectCab, onAddCab }: Props) {
    const initials = owner.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("");

    return (
        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <button onClick={onToggle} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
                        {initials}
                    </div>
                    <div>
                        <p className="font-semibold text-black">{owner.name}</p>
                        <p className="text-sm text-gray-500">{owner.phone}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                        {owner.cabs.length} {owner.cabs.length === 1 ? "cab" : "cabs"}
                    </span>
                    <span className="text-gray-400">{isOpen ? "\u2212" : "+"}</span>
                </div>
            </button>

            {isOpen && (
                <div className="border-t border-gray-100 p-4 space-y-2 bg-gray-50/50">
                    {owner.cabs.map((cab) => (
                        <button
                            key={cab.id}
                            onClick={() => onSelectCab(cab.id)}
                            className={`w-full text-left flex items-center justify-between p-3 rounded-xl border transition ${
                                selectedCabFilter === cab.id ? "border-black bg-white" : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                        >
                            <div>
                                <p className="font-medium text-black">{cab.model}</p>
                                <p className="text-xs text-gray-500">
                                    {cab.plateNumber} · {cab.seats} seats · {cab.type}
                                </p>
                            </div>
                            {selectedCabFilter === cab.id && <span className="text-xs font-medium text-black">Filtering</span>}
                        </button>
                    ))}

                    <button
                        onClick={onAddCab}
                        className="w-full text-sm border border-dashed border-gray-300 rounded-xl py-2.5 text-gray-500 hover:border-gray-400 hover:text-gray-700"
                    >
                        + Add cab for {owner.name.split(" ")[0]}
                    </button>
                </div>
            )}
        </div>
    );
}