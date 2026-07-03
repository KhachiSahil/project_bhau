import { LucideIcon } from "lucide-react";

interface StatCards {
    name : string,
    total : number,
    Icon : LucideIcon
}

export default function StatCards({ name, total, Icon }:StatCards) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 flex flex-col">

        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">{name}</div>
          <div className="bg-blue-500 text-white p-2 rounded-full">
            <Icon size={20} />
          </div>
        </div>
  
        <div className="text-3xl font-bold mt-3">{total}</div>
      </div>
    );
  }
  