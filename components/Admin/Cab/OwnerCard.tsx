import { Trash2 } from "lucide-react";
import { Cab, CabOwner } from "@/app/lib/utils/cab";

interface Props {
    owner: CabOwner;
    isOpen: boolean;
    selectedCabFilter: string | null;
    onToggle: () => void;
    onSelectCab: (cabId: string) => void;
    onAddCab: () => void;
    onDeleteOwner?: (ownerId: string) => void;
    onDeleteCab?: (cabId: string) => void;
}

export default function OwnerCard({
    owner,
    isOpen,
    selectedCabFilter,
    onToggle,
    onSelectCab,
    onAddCab,
    onDeleteOwner,
    onDeleteCab,
}: Props) {
    const initials = owner.name
        .split(" ")
        .map((w) => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
            <div className="flex items-center justify-between p-4 hover:bg-gray-50/80">
                <button onClick={onToggle} className="flex-1 flex items-center gap-3 text-left">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
                        {initials || "O"}
                    </div>
                    <div>
                        <p className="font-semibold text-black">{owner.name}</p>
                        <p className="text-sm text-gray-500">{owner.phone || "No phone"}</p>
                    </div>
                </button>
                <div className="flex items-center gap-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                        {owner.cabs.length} {owner.cabs.length === 1 ? "cab" : "cabs"}
                    </span>
                    {onDeleteOwner && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteOwner(owner.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 transition rounded-md hover:bg-gray-200"
                            title="Delete Owner"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                    <button onClick={onToggle} className="text-gray-400 font-medium px-1">
                        {isOpen ? "−" : "+"}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="border-t border-gray-100 p-4 space-y-2 bg-gray-50/50">
                    {owner.cabs.map((cab) => (
                        <div key={cab.id} className="flex items-center gap-2">
                            <button
                                onClick={() => onSelectCab(cab.id)}
                                className={`flex-1 text-left flex items-center justify-between p-3 rounded-xl border transition ${
                                    selectedCabFilter === cab.id ? "border-black bg-white shadow-xs" : "border-gray-200 bg-white hover:border-gray-300"
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
                            {onDeleteCab && (
                                <button
                                    onClick={() => onDeleteCab(cab.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 transition rounded-xl hover:bg-gray-200 bg-white border border-gray-200"
                                    title="Delete Cab"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        onClick={onAddCab}
                        className="w-full text-sm border border-dashed border-gray-300 rounded-xl py-2.5 text-gray-500 hover:border-gray-400 hover:text-gray-700 bg-white transition"
                    >
                        + Add cab for {owner.name.split(" ")[0]}
                    </button>
                </div>
            )}
        </div>
    );
}