import OwnerCard from "./OwnerCard";
import { Cab, CabOwner } from "@/app/lib/utils/cab";

interface Props {
    owners: CabOwner[];
    expandedOwner: string | null;
    selectedCabFilter: string | null;
    onToggleOwner: (ownerId: string) => void;
    onSelectCab: (cabId: string) => void;
    onAddCab: (ownerId: string) => void;
    onDeleteOwner?: (ownerId: string) => void;
    onDeleteCab?: (cabId: string) => void;
}

export default function OwnerList({
    owners,
    expandedOwner,
    selectedCabFilter,
    onToggleOwner,
    onSelectCab,
    onAddCab,
    onDeleteOwner,
    onDeleteCab,
}: Props) {
    if (owners.length === 0) {
        return <div className="p-10 text-center text-gray-500 border border-gray-200 rounded-2xl bg-white">No owners found</div>;
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
                    onDeleteOwner={onDeleteOwner}
                    onDeleteCab={onDeleteCab}
                />
            ))}
        </div>
    );
}