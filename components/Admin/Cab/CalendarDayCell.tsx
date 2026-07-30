import { ownerColor, toISODate } from "@/app/lib/utils/cab";

interface Props {
    date: Date;
    isToday: boolean;
    dayBookings: Booking[];
    allCabs: Cab[];
    owners: CabOwner[];
}
export interface Cab {
    id: string;
    ownerId: string;
    model: string;
    plateNumber: string;
    seats: number;
    type: "Sedan" | "SUV" | "Tempo Traveller" | "Hatchback";
}
 
export interface CabOwner {
    id: string;
    name: string;
    phone: string;
    cabs: Cab[];
}
 
export interface Booking {
    id: string;
    cabId: string;
    enquiryLabel: string;
    startDate: string;
    endDate: string;
}

export default function CalendarDayCell({ date, isToday, dayBookings, allCabs, owners }: Props) {
    return (
        <div className={`min-h-[84px] rounded-lg border p-1.5 ${isToday ? "border-black" : "border-gray-100"}`}>
            <p className={`text-xs mb-1 ${isToday ? "font-bold text-black" : "text-gray-400"}`}>{date.getDate()}</p>
            <div className="space-y-1">
                {dayBookings.slice(0, 2).map((b) => {
                    const cab = allCabs.find((c) => c.id === b.cabId);
                    const color = cab ? ownerColor(cab.ownerId, owners) : "c-gray";
                    const isStart = toISODate(date) === b.startDate;
                    const isEnd = toISODate(date) === b.endDate;
                    return (
                        <div
                            key={b.id}
                            title={`${b.enquiryLabel} (${b.startDate} to ${b.endDate})`}
                            className={`text-[10px] leading-tight px-1 py-0.5 truncate ${color} ${isStart ? "rounded-l-md" : ""} ${
                                isEnd ? "rounded-r-md" : ""
                            }`}
                            style={{
                                marginLeft: isStart ? 0 : -6,
                                marginRight: isEnd ? 0 : -6,
                                paddingLeft: isStart ? 4 : 8,
                                paddingRight: isEnd ? 4 : 8,
                            }}
                        >
                            {isStart ? b.enquiryLabel : "\u00A0"}
                        </div>
                    );
                })}
                {dayBookings.length > 2 && <p className="text-[10px] text-gray-400">+{dayBookings.length - 2} more</p>}
            </div>
        </div>
    );
}