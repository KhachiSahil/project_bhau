import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string;
    change: string;
    icon: LucideIcon;
    color: string;
}

export default function StatsCard({ title, value, change, icon: Icon, color }: StatsCardProps) {
    return (
        <div className="bg-white shadow-lg rounded-lg p-4 flex items-center gap-4 w-full">
            <Icon size={24} color={color} />
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <p className="text-2xl font-bold">{value}</p>
                <span className="text-base font-bold text-green-500">↑ {change} from last year</span>
            </div>
        </div>
    );
}
