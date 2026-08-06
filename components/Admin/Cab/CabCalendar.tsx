import { buildMonthGrid, toISODate, Cab, CabOwner } from "@/app/lib/utils/cab";
import CalendarHeader from "./CalendarHeader";
import CalendarDayCell from "./CalendarDayCell";
import CalendarLegend from "./CalendarLegend";
 
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
                        <span className="hidden sm:inline">{d}</span>
                        <span className="sm:hidden">{d[0]}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
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
                        <div key={i} className="min-h-[48px] sm:min-h-[72px]" />
                    )
                )}
            </div>

            <CalendarLegend owners={owners} />
        </div>
    );
}