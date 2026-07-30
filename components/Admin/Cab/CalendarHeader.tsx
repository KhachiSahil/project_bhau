interface Props {
    monthLabel: string;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    activeCabLabel: string | null;
    onClearFilter: () => void;
}

export default function CalendarHeader({ monthLabel, onPrevMonth, onNextMonth, activeCabLabel, onClearFilter }: Props) {
    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <button onClick={onPrevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50">
                    ‹
                </button>
                <h2 className="text-lg font-semibold text-black w-40 text-center">{monthLabel}</h2>
                <button onClick={onNextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50">
                    ›
                </button>
            </div>

            {activeCabLabel && (
                <button onClick={onClearFilter} className="text-xs bg-black text-white px-3 py-1.5 rounded-full">
                    {activeCabLabel} ✕
                </button>
            )}
        </div>
    );
}