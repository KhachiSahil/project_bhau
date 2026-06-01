import { useEffect, useState } from "react";
import { X, Eye } from "lucide-react";
import ViewItineraryHelper from "./ViewItineraryhelper";

interface ViewItenaryProps {
    onClose: () => void;
    formData: {
        pickupPlace: string;
        dropPlace: string;
        destination: string;
    };
}

export default function ViewItenary({onClose,formData}: ViewItenaryProps) {
    const [itinerary, setItinerary] = useState<any[]>([]);
    const [selectedItinerary, setSelectedItinerary] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleApiRequest = async () => {
            if (!formData) return;

            try {
                setLoading(true);

                const params = new URLSearchParams({
                    pickup: formData.pickupPlace,
                    drop: formData.dropPlace,
                    destination: formData.destination,
                });

                const response = await fetch(
                    `/api/Itinerary?${params}`
                );

                const data = await response.json();

                setItinerary(data.itinerary || []);
                console.log(data)
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        handleApiRequest();
    }, [formData]);

    return (
        <>
            {/* Main Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white text-black max-w-5xl w-full max-h-[90vh] rounded-lg shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-black text-white p-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">
                                Tour Itinerary & Cost
                            </h2>
                            <p className="text-gray-300 mt-1">
                                Himachal Taxi Rental Service
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-800 rounded-full"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 overflow-y-auto max-h-[70vh]">
                        {loading ? (
                            <div className="text-center py-8">
                                Loading itineraries...
                            </div>
                        ) : itinerary.length > 0 ? (
                            <div className="space-y-4">
                                {itinerary.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="border-l-4 rounded-lg p-4 flex justify-between  shadow-sm"
                                    >
                                        <div className="w-full">
                                            <h3 className="font-semibold text-lg">
                                                {item.days} Days Itinerary
                                            </h3>

                                            <div className="text-gray-600 text-sm flex flex-row justify-between px-5">
                                                <div>{formData.pickupPlace}</div>
                                                <div>{formData.destination}</div>
                                                <div>{formData.dropPlace}</div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() =>
                                                setSelectedItinerary(item)
                                            }
                                            className="p-2 rounded-full hover:bg-gray-100 transition"
                                            title="View itinerary"
                                        >
                                            <Eye size={22} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No itinerary found.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            {selectedItinerary && (
                <ViewItineraryHelper onClose={() => setSelectedItinerary(null)} formData={selectedItinerary}/>
            )}
        </>
    );
}