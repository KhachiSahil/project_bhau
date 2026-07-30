import OwnerCard from "./OwnerCard";

interface Props {
    owners: CabOwner[];
    expandedOwner: string | null;
    selectedCabFilter: string | null;
    onToggleOwner: (ownerId: string) => void;
    onSelectCab: (cabId: string) => void;
    onAddCab: (ownerId: string) => void;
}

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

export default function OwnerList({ owners, expandedOwner, selectedCabFilter, onToggleOwner, onSelectCab, onAddCab }: Props) {
    if (owners.length === 0) {
        return <div className="p-10 text-center text-gray-500 border border-gray-200 rounded-2xl">No owners found</div>;
    }

    return (
        <div className="space-y-3">
            {owners.map((owner) => (
                <OwnerCard
                    key={owner.id}
                    owner={owner}
                    isOpen={expandedOwner === owner.id}
                    selectedCabFilter={selectedCabFilter}
                    onToggle={() => onToggleOwner(owner.id)}
                    onSelectCab={onSelectCab}
                    onAddCab={() => onAddCab(owner.id)}
                />
            ))}
        </div>
    );
}