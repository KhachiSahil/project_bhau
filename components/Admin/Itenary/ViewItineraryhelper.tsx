import { X, Edit3, Save, Users, Car, Phone, Download, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { DEFAULT_NOTES, exportToPDF, formatDate } from "./Itenary-export-data";

// Guards against real `undefined`, empty strings, and the literal text "undefined"/"null"
// that can leak in when an upstream template string interpolates a missing value.
const isBlank = (value: string | undefined | null) => !value || !value.trim() || value.trim().toLowerCase() === "undefined" || value.trim().toLowerCase() === "null";

const withAirportDefault = (place: string | undefined) => (isBlank(place) ? "Airport/Railway Station" : `${place} Airport/Railway Station`);

interface ItineraryDay {
    day: number;
    date: string;
    title: string;
    description: string;
}

interface EditableItineraryContent {
    adults: string;
    children: string;
    childrenAges: string;
    transportationCost: string;
    vehicle: string;
    contactPerson: string;
    contactNumber: string;
    greeting: string;
}

interface Props {
    onClose: () => void;
    formData: {
        arrivalDate: string;
        endDate: string;
        destination: string;
        pickupPlace: string;
        dropPlace: string;
        description: ItineraryDay[];
    };
    customerName?: string;
}

export default function ViewItineraryHelper({ onClose, formData, customerName }: Props) {
    const { pickupPlace, dropPlace } = formData;

    const [isEditing, setIsEditing] = useState(false);
    const [notes, setNotes] = useState<string[]>(DEFAULT_NOTES);

    const [editableContent, setEditableContent] = useState<EditableItineraryContent>({
        adults: "02",
        children: "02",
        childrenAges: "(7,10yrs)",
        transportationCost: "21,000",
        vehicle: "Maruti Dzire/Toyota Etios",
        contactPerson: "Ms Alisha",
        contactNumber: "+91-9805676866",
        greeting: `Dear ${customerName ? customerName : "Sir/Madam"}`,
    });

    const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>(() =>
        formData.description.map((d, i) => {
            if (!isBlank(d.date)) return d;
            const base = new Date(formData.arrivalDate);
            if (isNaN(base.getTime())) return { ...d, date: "" }; // arrivalDate itself missing/unparseable — leave blank rather than crash
            base.setDate(base.getDate() + i);
            return { ...d, date: formatDate(base.toISOString()) };
        })
    );

    // Pickup/drop default to Airport/Railway Station and live inline on the first/last day,
    // rather than as a standalone block — this is where guests actually expect to see it.
    const [pickupLocation, setPickupLocation] = useState(withAirportDefault(pickupPlace));
    const [dropLocation, setDropLocation] = useState(withAirportDefault(dropPlace));

    // If formData loads/updates after this modal first mounts (e.g. enquiry data arriving async),
    // re-sync the defaults so we don't stay stuck on "undefined Airport/Railway Station".
    useEffect(() => {
        if (!isBlank(pickupPlace)) setPickupLocation(withAirportDefault(pickupPlace));
    }, [pickupPlace]);

    useEffect(() => {
        if (!isBlank(dropPlace)) setDropLocation(withAirportDefault(dropPlace));
    }, [dropPlace]);

    const handleEditChange = (field: keyof EditableItineraryContent, value: string) =>
        setEditableContent((prev) => ({ ...prev, [field]: value }));

    const updateDay = (index: number, field: "title" | "description", value: string) =>
        setItineraryDays((prev) => prev.map((d, i) => (i === index ? { ...d, [field]: value } : d)));

    const updateNote = (index: number, value: string) => setNotes((prev) => prev.map((n, i) => (i === index ? value : n)));

    const handleExport = () => {
        exportToPDF(editableContent, itineraryDays, notes, pickupLocation, dropLocation);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-60 p-4">
            <div className="bg-white text-black max-w-5xl w-full max-h-[90vh] rounded-lg shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-black text-white p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Tour Itinerary & Cost</h2>
                        <p className="text-gray-300 mt-1">Himachal Taxi Rental Service</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                            <Download size={16} /> Export PDF
                        </button>
                        <button
                            onClick={() => setIsEditing((e) => !e)}
                            className="flex items-center gap-2 px-3 py-2 bg-white text-black rounded hover:bg-gray-100 transition-colors text-sm"
                        >
                            {isEditing ? (
                                <>
                                    <Save size={16} /> Save
                                </>
                            ) : (
                                <>
                                    <Edit3 size={16} /> Edit
                                </>
                            )}
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
                    {/* Greeting */}
                    <div className="text-center">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editableContent.greeting}
                                onChange={(e) => handleEditChange("greeting", e.target.value)}
                                className="font-bold text-lg border-b border-gray-300 text-center outline-none"
                            />
                        ) : (
                            <p className="font-bold text-lg">{editableContent.greeting}</p>
                        )}
                        <p className="mt-2 font-bold">Greetings from Himachal Taxi Rental Service……</p>
                        <p className="mt-2 font-bold">Please find the below Tour Itinerary & Cost:</p>
                    </div>

                    {/* Itinerary */}
                    <div>
                        <h3 className="font-bold text-xl mb-4">Itinerary</h3>
                        <div className="space-y-4">
                            {itineraryDays.map((day, index) => {
                                const isFirstDay = index === 0;
                                const isLastDay = index === itineraryDays.length - 1;
                                return (
                                    <div key={index} className="relative pl-10">
                                        {/* Day number badge */}
                                        <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                                            {day.day}
                                        </div>
                                        {/* Connecting line to next day */}
                                        {index < itineraryDays.length - 1 && (
                                            <div className="absolute left-[13px] top-7 bottom-[-16px] w-px bg-gray-200" />
                                        )}

                                        <div className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    <input
                                                        type="text"
                                                        value={day.title}
                                                        onChange={(e) => updateDay(index, "title", e.target.value)}
                                                        className="w-full font-bold border-b border-gray-300 outline-none text-sm pb-1"
                                                        placeholder="Day title"
                                                    />
                                                    <textarea
                                                        value={day.description}
                                                        onChange={(e) => updateDay(index, "description", e.target.value)}
                                                        rows={3}
                                                        className="w-full text-sm text-gray-800 border border-gray-200 rounded px-2 py-1 outline-none resize-y leading-relaxed"
                                                    />
                                                    {isFirstDay && (
                                                        <div className="flex items-center gap-2 pt-1">
                                                            <MapPin size={14} className="text-gray-500 shrink-0" />
                                                            <span className="text-xs font-medium text-gray-500 shrink-0">Pickup:</span>
                                                            <input
                                                                type="text"
                                                                value={pickupLocation}
                                                                onChange={(e) => setPickupLocation(e.target.value)}
                                                                className="flex-1 text-xs px-2 py-1 border rounded outline-none"
                                                            />
                                                        </div>
                                                    )}
                                                    {isLastDay && (
                                                        <div className="flex items-center gap-2 pt-1">
                                                            <MapPin size={14} className="text-gray-500 shrink-0" />
                                                            <span className="text-xs font-medium text-gray-500 shrink-0">Drop:</span>
                                                            <input
                                                                type="text"
                                                                value={dropLocation}
                                                                onChange={(e) => setDropLocation(e.target.value)}
                                                                className="flex-1 text-xs px-2 py-1 border rounded outline-none"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <>
                                                    <h4 className="font-bold text-lg mb-1">{day.title}</h4>
                                                    {day.date && <p className="text-xs text-gray-400 font-medium mb-1.5">{day.date}</p>}
                                                    <p className="text-gray-800 leading-relaxed text-sm">{day.description}</p>
                                                    {(isFirstDay || isLastDay) && (
                                                        <div className="flex items-center gap-1.5 mt-3 text-xs font-medium text-gray-600 bg-gray-50 w-fit px-2.5 py-1 rounded-full">
                                                            <MapPin size={12} />
                                                            {isFirstDay ? `Pickup: ${pickupLocation}` : `Drop: ${dropLocation}`}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Transportation */}
                    <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
                        <h3 className="font-bold text-xl mb-4">Transportation ({itineraryDays.length - 1} Days)</h3>
                        <div className="space-y-3">
                            {/* Total Pax */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <Users size={18} className="text-gray-600 shrink-0" />
                                <span className="font-bold">Total Pax:</span>
                                {isEditing ? (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <input
                                            type="text"
                                            value={editableContent.adults}
                                            onChange={(e) => handleEditChange("adults", e.target.value)}
                                            className="w-12 px-2 py-1 border rounded text-center outline-none"
                                            placeholder="02"
                                        />
                                        <span>Adults</span>
                                        <input
                                            type="text"
                                            value={editableContent.children}
                                            onChange={(e) => handleEditChange("children", e.target.value)}
                                            className="w-12 px-2 py-1 border rounded text-center outline-none"
                                            placeholder="02"
                                        />
                                        <span>Child</span>
                                        <input
                                            type="text"
                                            value={editableContent.childrenAges}
                                            onChange={(e) => handleEditChange("childrenAges", e.target.value)}
                                            className="w-24 px-2 py-1 border rounded outline-none"
                                            placeholder="(7,10yrs)"
                                        />
                                    </div>
                                ) : (
                                    <span>
                                        {editableContent.adults} Adults {editableContent.children} Child{editableContent.childrenAges}
                                    </span>
                                )}
                            </div>

                            {/* Cost */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold">Transportation Cost: Rs</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editableContent.transportationCost}
                                        onChange={(e) => handleEditChange("transportationCost", e.target.value)}
                                        className="w-24 px-2 py-1 border rounded outline-none"
                                        placeholder="21,000"
                                    />
                                ) : (
                                    <span className="text-xl font-bold text-green-600">{editableContent.transportationCost}/-</span>
                                )}
                                <span>(Inclusive All Taxes + All Sightseeing).</span>
                            </div>

                            {/* Vehicle */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <Car size={18} className="text-gray-600 shrink-0" />
                                <span className="font-bold">Vehicle:</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editableContent.vehicle}
                                        onChange={(e) => handleEditChange("vehicle", e.target.value)}
                                        className="w-48 px-2 py-1 border rounded outline-none"
                                        placeholder="Maruti Dzire/Toyota Etios"
                                    />
                                ) : (
                                    <span>{editableContent.vehicle}</span>
                                )}
                            </div>

                            <p className="text-sm text-gray-600 italic">
                                (Inclusive All Taxes, Driver Allowances, Driver Perk, Driver Messing charges, Parking, Fuel, Tolls, Inter
                                State Taxes, No Other Hidden Charges.)
                            </p>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="border border-gray-200 p-6 rounded-xl">
                        <h3 className="font-bold text-xl mb-4">Also requesting you to:</h3>
                        <div className="space-y-3 text-sm">
                            {notes.map((note, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <span className="font-bold text-black">{index + 1}.</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={note}
                                            onChange={(e) => updateNote(index, e.target.value)}
                                            className="flex-1 border-b border-gray-200 outline-none text-gray-700"
                                        />
                                    ) : (
                                        <span className="text-gray-700">{note}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-black text-white p-6 rounded-xl text-center">
                        <p className="font-bold mb-4">
                            We would be pleased to hear from you awaiting your immediate response
                        </p>
                        <div className="border-t border-gray-600 pt-4">
                            <p>With Regards,</p>
                            <div className="mt-2 space-y-1">
                                {isEditing ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <input
                                            type="text"
                                            value={editableContent.contactPerson}
                                            onChange={(e) => handleEditChange("contactPerson", e.target.value)}
                                            className="px-2 py-1 border rounded text-gray-50 text-center outline-none"
                                            placeholder="Ms Alisha"
                                        />
                                    </div>
                                ) : (
                                    <p className="font-bold">{editableContent.contactPerson}</p>
                                )}
                                <div className="flex items-center justify-center gap-2">
                                    <Phone size={16} />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editableContent.contactNumber}
                                            onChange={(e) => handleEditChange("contactNumber", e.target.value)}
                                            className="px-2 py-1 border rounded text-gray-50 outline-none"
                                            placeholder="+91-9805676866"
                                        />
                                    ) : (
                                        <span>{editableContent.contactNumber}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}