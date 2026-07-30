import { buildMonthGrid, toISODate } from "@/app/lib/utils/cab";
import CalendarHeader from "./CalendarHeader";
import CalendarDayCell from "./CalendarDayCell";
import CalendarLegend from "./CalendarLegend";

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
 
interface Booking {
    id: string;
    cabId: string;
    enquiryLabel: string;
    startDate: string;
    endDate: string;
}

interface Props {
    owners: CabOwner[];
    allCabs: Cab[];
    bookings: Booking[];
    viewYear: number;
    viewMonth: number;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    selectedCabFilter: string | null;
    onClearFilter: () => void;
    cabLabel: (cabId: string) => string;
    todayISO: string;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CabCalendar({
    owners,
    allCabs,
    bookings,
    viewYear,
    viewMonth,
    onPrevMonth,
    onNextMonth,
    selectedCabFilter,
    onClearFilter,
    cabLabel,
    todayISO,
}: Props) {
    const monthCells = buildMonthGrid(viewYear, viewMonth);
    const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

    const bookingsForDate = (date: Date) => {
        const iso = toISODate(date);
        return bookings.filter((b) => iso >= b.startDate && iso <= b.endDate);
    };

    return (
        <div className="border border-gray-200 rounded-2xl shadow-sm p-5">
            <CalendarHeader
                monthLabel={monthLabel}
                onPrevMonth={onPrevMonth}
                onNextMonth={onNextMonth}
                activeCabLabel={selectedCabFilter ? cabLabel(selectedCabFilter) : null}
                onClearFilter={onClearFilter}
            />

            <div className="grid grid-cols-7 mb-1">
                {WEEKDAYS.map((d) => (
                    <div key={d} className="text-xs font-medium text-gray-400 text-center py-2">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {monthCells.map((date, i) =>
                    date ? (
                        <CalendarDayCell
                            key={i}
                            date={date}
                            isToday={toISODate(date) === todayISO}
                            dayBookings={bookingsForDate(date)}
                            allCabs={allCabs}
                            owners={owners}
                        />
                    ) : (
                        <div key={i} className="min-h-[84px]" />
                    )
                )}
            </div>

            <CalendarLegend owners={owners} />
        </div>
    );
}