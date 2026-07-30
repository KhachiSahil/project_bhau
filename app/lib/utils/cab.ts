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
 
export const OWNER_COLORS = ["c-teal", "c-coral", "c-purple", "c-pink", "c-blue", "c-amber"] as const;

export function ownerColor(ownerId: string, owners: CabOwner[]) {
    const idx = owners.findIndex((o) => o.id === ownerId);
    return OWNER_COLORS[idx % OWNER_COLORS.length];
}

export function toISODate(d: Date) {
    return d.toISOString().slice(0, 10);
}

export function buildMonthGrid(year: number, month: number) {
    const first = new Date(year, month, 1);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
}