"use client";
import { useMemo, useState } from "react";
import CabPageHeader from "./CabPageHeader";
import OwnerList from "./OwnerList";
import CabCalendar from "./CabCalendar";
import AddOwnerModal from "./AddOwnerModal";
import AddCabModal from "./AddCabModal";


const seedOwners: CabOwner[] = [
    {
        id: "o1",
        name: "Rakesh Thakur",
        phone: "98160 22341",
        cabs: [
            { id: "c1", ownerId: "o1", model: "Toyota Innova Crysta", plateNumber: "HP-01-A-4521", seats: 7, type: "SUV" },
            { id: "c2", ownerId: "o1", model: "Maruti Dzire", plateNumber: "HP-01-A-7789", seats: 4, type: "Sedan" },
        ],
    },
    {
        id: "o2",
        name: "Vikram Chauhan",
        phone: "94180 55612",
        cabs: [
            { id: "c3", ownerId: "o2", model: "Force Tempo Traveller", plateNumber: "HP-02-B-1103", seats: 12, type: "Tempo Traveller" },
        ],
    },
    {
        id: "o3",
        name: "Sunil Verma",
        phone: "97361 44890",
        cabs: [
            { id: "c4", ownerId: "o3", model: "Maruti Swift", plateNumber: "HP-03-C-9042", seats: 4, type: "Hatchback" },
            { id: "c5", ownerId: "o3", model: "Mahindra Scorpio", plateNumber: "HP-03-C-2214", seats: 7, type: "SUV" },
        ],
    },
];
 
const seedBookings: Booking[] = [
    { id: "b1", cabId: "c1", enquiryLabel: "Sharma family — Manali", startDate: "2026-07-31", endDate: "2026-08-04" },
    { id: "b2", cabId: "c3", enquiryLabel: "Corporate offsite — Kasol", startDate: "2026-08-02", endDate: "2026-08-03" },
    { id: "b3", cabId: "c1", enquiryLabel: "Gupta honeymoon — Shimla", startDate: "2026-08-10", endDate: "2026-08-13" },
    { id: "b4", cabId: "c4", enquiryLabel: "Solo trekker — Kasauli", startDate: "2026-08-05", endDate: "2026-08-06" },
    { id: "b5", cabId: "c5", enquiryLabel: "Malhotra reunion — Dharamshala", startDate: "2026-07-29", endDate: "2026-08-01" },
];


interface Cab {
    id: string;
    ownerId: string;
    model: string;
    plateNumber: string;
    seats: number;
    type: "Sedan" | "SUV" | "Tempo Traveller" | "Hatchback";
}
 interface Booking {
    id: string;
    cabId: string;
    enquiryLabel: string;
    startDate: string;
    endDate: string;
}

interface CabOwner {
    id: string;
    name: string;
    phone: string;
    cabs: Cab[];
}
export const OWNER_COLORS = ["c-teal", "c-coral", "c-purple", "c-pink", "c-blue", "c-amber"] as const;
 

const TODAY_ISO = "2026-07-29";

export default function CabManagement() {
    const [owners, setOwners] = useState<CabOwner[]>(seedOwners);
    const [bookings] = useState(seedBookings);
    const [search, setSearch] = useState("");
    const [expandedOwner, setExpandedOwner] = useState<string | null>("o1");
    const [selectedCabFilter, setSelectedCabFilter] = useState<string | null>(null);

    const [isAddOwnerOpen, setIsAddOwnerOpen] = useState(false);
    const [ownerForm, setOwnerForm] = useState({ name: "", phone: "" });

    const [isAddCabOpen, setIsAddCabOpen] = useState<string | null>(null);
    const [cabForm, setCabForm] = useState({ model: "", plateNumber: "", seats: "4", type: "Sedan" as Cab["type"] });

    const [viewYear, setViewYear] = useState(2026);
    const [viewMonth, setViewMonth] = useState(7); // 0-indexed, 7 = August

    const filteredOwners = owners.filter(
        (o) =>
            o.name.toLowerCase().includes(search.toLowerCase()) ||
            o.cabs.some((c) => c.model.toLowerCase().includes(search.toLowerCase()) || c.plateNumber.toLowerCase().includes(search.toLowerCase()))
    );

    const allCabs = useMemo(() => owners.flatMap((o) => o.cabs), [owners]);
    const visibleBookings = selectedCabFilter ? bookings.filter((b) => b.cabId === selectedCabFilter) : bookings;

    const cabLabel = (cabId: string) => {
        const cab = allCabs.find((c) => c.id === cabId);
        return cab ? `${cab.model} · ${cab.plateNumber}` : cabId;
    };

    const goMonth = (delta: number) => {
        let m = viewMonth + delta;
        let y = viewYear;
        if (m < 0) {
            m = 11;
            y -= 1;
        } else if (m > 11) {
            m = 0;
            y += 1;
        }
        setViewMonth(m);
        setViewYear(y);
    };

    const handleAddOwner = () => {
        if (!ownerForm.name.trim()) return;
        const newOwner: CabOwner = {
            id: crypto.randomUUID(),
            name: ownerForm.name,
            phone: ownerForm.phone,
            cabs: [],
        };
        setOwners((prev) => [...prev, newOwner]);
        setOwnerForm({ name: "", phone: "" });
        setIsAddOwnerOpen(false);
        setExpandedOwner(newOwner.id);
    };

    const handleAddCab = (ownerId: string) => {
        if (!cabForm.model.trim() || !cabForm.plateNumber.trim()) return;
        const newCab: Cab = {
            id: crypto.randomUUID(),
            ownerId,
            model: cabForm.model,
            plateNumber: cabForm.plateNumber,
            seats: Number(cabForm.seats) || 4,
            type: cabForm.type,
        };
        setOwners((prev) => prev.map((o) => (o.id === ownerId ? { ...o, cabs: [...o.cabs, newCab] } : o)));
        setCabForm({ model: "", plateNumber: "", seats: "4", type: "Sedan" });
        setIsAddCabOpen(null);
    };

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="max-w-7xl mx-auto">
                <CabPageHeader
                    search={search}
                    onSearchChange={setSearch}
                    onAddOwner={() => {
                        setOwnerForm({ name: "", phone: "" });
                        setIsAddOwnerOpen(true);
                    }}
                />

                <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                    <div className="xl:col-span-2">
                        <OwnerList
                            owners={filteredOwners}
                            expandedOwner={expandedOwner}
                            selectedCabFilter={selectedCabFilter}
                            onToggleOwner={(id) => setExpandedOwner(expandedOwner === id ? null : id)}
                            onSelectCab={(cabId) => setSelectedCabFilter(selectedCabFilter === cabId ? null : cabId)}
                            onAddCab={(ownerId) => {
                                setCabForm({ model: "", plateNumber: "", seats: "4", type: "Sedan" });
                                setIsAddCabOpen(ownerId);
                            }}
                        />
                    </div>

                    <div className="xl:col-span-3">
                        <CabCalendar
                            owners={owners}
                            allCabs={allCabs}
                            bookings={visibleBookings}
                            viewYear={viewYear}
                            viewMonth={viewMonth}
                            onPrevMonth={() => goMonth(-1)}
                            onNextMonth={() => goMonth(1)}
                            selectedCabFilter={selectedCabFilter}
                            onClearFilter={() => setSelectedCabFilter(null)}
                            cabLabel={cabLabel}
                            todayISO={TODAY_ISO}
                        />
                    </div>
                </div>
            </div>

            {isAddOwnerOpen && (
                <AddOwnerModal form={ownerForm} onChange={setOwnerForm} onClose={() => setIsAddOwnerOpen(false)} onSave={handleAddOwner} />
            )}

            {isAddCabOpen && (
                <AddCabModal form={cabForm} onChange={setCabForm} onClose={() => setIsAddCabOpen(null)} onSave={() => handleAddCab(isAddCabOpen)} />
            )}
        </div>
    );
}