import { ownerColor } from "@/app/lib/utils/cab";

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
    owners: CabOwner[];
}

export default function CalendarLegend({ owners }: Props) {
    return (
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
            {owners.map((o) => (
                <div key={o.id} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className={`w-2.5 h-2.5 rounded-full ${ownerColor(o.id, owners)}`} />
                    {o.name}
                </div>
            ))}
        </div>
    );
}