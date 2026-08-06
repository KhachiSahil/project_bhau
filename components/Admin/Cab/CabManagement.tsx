"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import CabPageHeader from "./CabPageHeader";
import OwnerList from "./OwnerList";
import CabCalendar from "./CabCalendar";
import AddOwnerModal from "./AddOwnerModal";
import AddCabModal from "./AddCabModal";
import { Cab, CabOwner } from "@/app/lib/utils/cab";
import { Loader2 } from "lucide-react";

interface Booking {
    id: string;
    cabId: string;
    enquiryLabel: string;
    startDate: string;
    endDate: string;
}

const getApiUrl = (endpoint: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;
    if (!baseUrl) return endpoint;
    return baseUrl.endsWith("/")
        ? `${baseUrl}${endpoint.replace(/^\//, "")}`
        : `${baseUrl}/${endpoint.replace(/^\//, "")}`;
};

/** Flatten the nested prisma shape into the Booking[] that CabCalendar expects */
function extractBookings(owners: CabOwner[]): Booking[] {
    const bookings: Booking[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const owner of owners as any[]) {
        for (const cab of owner.cabs ?? []) {
            for (const booking of cab.bookings ?? []) {
                const dates: string[] = (booking.bookedDates ?? []).map((d: any) =>
                    typeof d.date === "string" ? d.date.slice(0, 10) : new Date(d.date).toISOString().slice(0, 10)
                );
                if (dates.length > 0) {
                    dates.sort();
                    const label = booking.enquiry
                        ? `${booking.enquiry.Customer?.name ?? "Enquiry"} — ${booking.enquiry.destination?.name ?? ""}`
                        : booking.id;
                    bookings.push({
                        id: booking.id,
                        cabId: cab.id,
                        enquiryLabel: label,
                        startDate: dates[0],
                        endDate: dates[dates.length - 1],
                    });
                }
            }
        }
    }
    return bookings;
}

const TODAY_ISO = new Date().toISOString().slice(0, 10);

export default function CabManagement() {
    const [owners, setOwners] = useState<CabOwner[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [expandedOwner, setExpandedOwner] = useState<string | null>(null);
    const [selectedCabFilter, setSelectedCabFilter] = useState<string | null>(null);

    const [isAddOwnerOpen, setIsAddOwnerOpen] = useState(false);
    const [ownerForm, setOwnerForm] = useState({ name: "", phone: "" });
    const [isSavingOwner, setIsSavingOwner] = useState(false);

    const [isAddCabOpen, setIsAddCabOpen] = useState<string | null>(null);
    const [cabForm, setCabForm] = useState({ model: "", plateNumber: "", seats: "4", type: "" });
    const [isSavingCab, setIsSavingCab] = useState(false);

    const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
    const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());

    // ─── Fetch owners + cabs + bookings ────────────────────────────────────
    const fetchOwners = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(getApiUrl("/api/Admin/CabOwner"));
            const json = await res.json();
            if (!res.ok) throw new Error(json?.err || "Failed to fetch");
            const data: CabOwner[] = json.data ?? [];
            setOwners(data);
            setBookings(extractBookings(json.data ?? []));
            if (data.length > 0 && expandedOwner === null) {
                setExpandedOwner(data[0].id);
            }
        } catch (err) {
            console.error("Error fetching cab owners:", err);
        } finally {
            setIsLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchOwners();
    }, [fetchOwners]);

    // ─── Derived data ──────────────────────────────────────────────────────
    const filteredOwners = owners.filter(
        (o) =>
            o.name.toLowerCase().includes(search.toLowerCase()) ||
            o.cabs.some(
                (c) =>
                    c.model.toLowerCase().includes(search.toLowerCase()) ||
                    c.plateNumber.toLowerCase().includes(search.toLowerCase())
            )
    );

    const allCabs = useMemo(() => owners.flatMap((o) => o.cabs), [owners]);
    const visibleBookings = selectedCabFilter
        ? bookings.filter((b) => b.cabId === selectedCabFilter)
        : bookings;

    const cabLabel = (cabId: string) => {
        const cab = allCabs.find((c) => c.id === cabId);
        return cab ? `${cab.model} · ${cab.plateNumber}` : cabId;
    };

    const goMonth = (delta: number) => {
        let m = viewMonth + delta;
        let y = viewYear;
        if (m < 0) { m = 11; y -= 1; }
        else if (m > 11) { m = 0; y += 1; }
        setViewMonth(m);
        setViewYear(y);
    };

    // ─── Add owner ─────────────────────────────────────────────────────────
    const handleAddOwner = async () => {
        if (!ownerForm.name.trim() || isSavingOwner) return;
        setIsSavingOwner(true);
        try {
            const res = await fetch(getApiUrl("/api/Admin/CabOwner"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: ownerForm.name.trim(), phone: ownerForm.phone.trim() }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.err || "Failed to save owner");
            const newOwner: CabOwner = { ...json.data, cabs: json.data.cabs ?? [] };
            setOwners((prev) => [...prev, newOwner]);
            setOwnerForm({ name: "", phone: "" });
            setIsAddOwnerOpen(false);
            setExpandedOwner(newOwner.id);
        } catch (err: any) {
            console.error("Error saving owner:", err);
            alert(err.message || "Failed to save owner.");
        } finally {
            setIsSavingOwner(false);
        }
    };

    // ─── Delete owner ──────────────────────────────────────────────────────
    const handleDeleteOwner = async (ownerId: string) => {
        const owner = owners.find((o) => o.id === ownerId);
        if (!owner) return;
        if (!confirm(`Delete owner "${owner.name}" and all their cabs?`)) return;
        try {
            const res = await fetch(getApiUrl(`/api/Admin/CabOwner?id=${ownerId}`), { method: "DELETE" });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.err || "Failed to delete owner");
            setOwners((prev) => prev.filter((o) => o.id !== ownerId));
            if (expandedOwner === ownerId) setExpandedOwner(null);
        } catch (err: any) {
            console.error("Error deleting owner:", err);
            alert(err.message || "Failed to delete owner.");
        }
    };

    // ─── Add cab ───────────────────────────────────────────────────────────
    const handleAddCab = async (ownerId: string) => {
        if (!cabForm.model.trim() || !cabForm.plateNumber.trim() || isSavingCab) return;
        setIsSavingCab(true);
        try {
            const res = await fetch(getApiUrl("/api/Admin/CabOwner/Cab"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ownerId,
                    model: cabForm.model.trim(),
                    plateNumber: cabForm.plateNumber.trim(),
                    seats: Number(cabForm.seats) || 4,
                    type: cabForm.type,
                }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.err || "Failed to save cab");
            const newCab: Cab = json.data;
            setOwners((prev) =>
                prev.map((o) => (o.id === ownerId ? { ...o, cabs: [...o.cabs, newCab] } : o))
            );
            setCabForm({ model: "", plateNumber: "", seats: "4", type: "" });
            setIsAddCabOpen(null);
        } catch (err: any) {
            console.error("Error saving cab:", err);
            alert(err.message || "Failed to save cab.");
        } finally {
            setIsSavingCab(false);
        }
    };

    // ─── Delete cab ────────────────────────────────────────────────────────
    const handleDeleteCab = async (cabId: string) => {
        const cab = allCabs.find((c) => c.id === cabId);
        if (!cab) return;
        if (!confirm(`Delete cab "${cab.model} (${cab.plateNumber})"?`)) return;
        try {
            const res = await fetch(getApiUrl(`/api/Admin/CabOwner/Cab?id=${cabId}`), { method: "DELETE" });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.err || "Failed to delete cab");
            setOwners((prev) =>
                prev.map((o) => ({ ...o, cabs: o.cabs.filter((c) => c.id !== cabId) }))
            );
            if (selectedCabFilter === cabId) setSelectedCabFilter(null);
        } catch (err: any) {
            console.error("Error deleting cab:", err);
            alert(err.message || "Failed to delete cab.");
        }
    };

    // ─── Render ────────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20 text-gray-400 gap-3">
                <Loader2 className="animate-spin" size={20} />
                <span className="text-sm">Loading cab fleet...</span>
            </div>
        );
    }

    return (
        <div className="bg-white">
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
                            setCabForm({ model: "", plateNumber: "", seats: "4", type: "" });
                            setIsAddCabOpen(ownerId);
                        }}
                        onDeleteOwner={handleDeleteOwner}
                        onDeleteCab={handleDeleteCab}
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

            {isAddOwnerOpen && (
                <AddOwnerModal
                    form={ownerForm}
                    onChange={setOwnerForm}
                    onClose={() => setIsAddOwnerOpen(false)}
                    onSave={handleAddOwner}
                    isSaving={isSavingOwner}
                />
            )}

            {isAddCabOpen && (
                <AddCabModal
                    form={cabForm}
                    onChange={setCabForm}
                    onClose={() => setIsAddCabOpen(null)}
                    onSave={() => handleAddCab(isAddCabOpen)}
                    isSaving={isSavingCab}
                />
            )}
        </div>
    );
}