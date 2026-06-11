import { useEffect, useState } from "react";
import { ChevronLeft, X, Eye } from "lucide-react";
import ViewItineraryHelper from "./Admin/Itenary/ViewItineraryhelper";

export default function NotificationComponent({ pickupLocation, destination, dropLocation }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState();
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Itinerary?pickup=delhi&drop=chandigarh&destination=shimla`)
                const renderData = await data.json();
                setData(renderData.itinerary)
            } catch (err) {
                console.log(err)
            }

        }
        fetchData()
    }, [pickupLocation, destination, dropLocation])
    return (
        <>
            {/* Floating Button */}
            <div
                className="fixed top-12 right-0 z-50 bg-amber-500 hover:bg-amber-600 rounded-l-3xl cursor-pointer shadow-lg"
                onClick={() => setIsOpen(true)}
            >
                <div className="flex items-center gap-2 p-3 text-white">
                    <ChevronLeft size={18} />
                    <span className="font-medium">Itinerary</span>
                </div>
            </div>

            {isOpen && <ModalComponent onClose={() => setIsOpen(false)} formData={data} pickupPlace={pickupLocation} destination={destination} dropPlace={dropLocation} />}
        </>
    );
}

type ModalProps = {
    onClose: () => void;
};

function ModalComponent({ onClose, formData, pickupPlace, dropPlace, destination }: any) {
    const [selectedItinerary, setSelectedItinerary] = useState<any>(null);
    console.log(formData)
    return (
        <>
            {/* Side Panel */}
            <div className="fixed inset-0 z-[999]">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/50"
                    onClick={onClose}
                />

                {/* Drawer */}
                <div className="absolute top-0 right-0 h-full w-full max-w-1/2 bg-white shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b p-4">
                        <h2 className="text-lg font-semibold">Available Itineraries</h2>

                        <button
                            onClick={onClose}
                            className="rounded-md p-2 hover:bg-gray-100 cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 overflow-y-auto h-[calc(100%-120px)]">
                        {formData.length > 0 ? (
                            <div className="space-y-4">
                                {formData.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="border-l-4 rounded-lg p-4 flex justify-between  shadow-sm"
                                    >
                                        <div className="w-full">
                                            <h3 className="font-semibold text-lg">
                                                {item.days} Days Itinerary
                                            </h3>

                                            <div className="text-gray-600 text-sm flex flex-row justify-between px-5">
                                                <div>{pickupPlace}</div>
                                                <div>{destination}</div>
                                                <div>{dropPlace}</div>
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
                            <div className="text-center py-10 text-gray-500">
                                No itinerary found.
                            </div>
                        )}
                    </div>
                </div>
                {selectedItinerary && (
                    <ViewItineraryHelper onClose={() => setSelectedItinerary(null)} formData={selectedItinerary} />
                )}
            </div>
        </>
    );
}