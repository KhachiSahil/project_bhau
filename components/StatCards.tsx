import { LucideIcon } from "lucide-react";

interface StatCards {
    name : string,
    total : number,
    Icon : LucideIcon
}

export default function StatCards({ name, total, Icon }: StatCards) {
    return (
      <div className="bg-white shadow-xs border border-gray-200/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:shadow-md transition-all duration-200">
        <div className="flex justify-between items-center gap-2">
          <span className="text-sm sm:text-base font-medium text-gray-600 truncate">{name}</span>
          <div className="bg-black text-white p-2.5 rounded-xl shrink-0">
            <Icon size={18} />
          </div>
        </div>
  
        <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-4 tracking-tight">
          {total}
        </div>
      </div>
    );
}
  