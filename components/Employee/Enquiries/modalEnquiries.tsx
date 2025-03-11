import { useState } from "react";
import { Download } from "lucide-react";

type ModalProps = {
    onClose: () => void;
};

export default function Modal({ onClose }: ModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        destination: "Bali, Indonesia",
        pickup: "New Delhi Airport",
        drop: "Bali International Airport",
        budget: "₹250,000",
        arrivalDate: "2023-06-10",
        travelPeriod: "7 Days, 6 Nights",
        travelers: "2 Adults, 1 Kid",
        specialRequirements: "Luxury beach resort with spa facilities",
    });

    const destinations = ["Bali, Indonesia", "Maldives", "Thailand", "Paris, France"];
    const airports = ["New Delhi Airport", "Mumbai Airport", "Dubai Airport", "Bali International Airport"];

    const handleEditClick = () => setIsEditing(true);
    const handleCancelClick = () => setIsEditing(false);
    const handleSaveClick = () => setIsEditing(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 overflow-y-auto transition backdrop-blur-md p-4">
            <div className="bg-white rounded-sm shadow-lg p-6 w-full md:w-[80vw] mt-auto md:mt-0 lg:w-[60vw] xl:w-[50vw]">
                {/* Header & Close Button */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Booking Details</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900 text-xl">✖</button>
                </div>

                {/* Grid Layout for Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Side */}
                    <div className="space-y-4">
                        {/* Customer Information */}
                        <div className="bg-white p-4 flex gap-5 rounded-sm shadow border border-gray-400">
                            <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Customer Information</h3>
                                <p className="text-gray-600 text-lg font-semibold">Sarah Johnson</p>
                                <p className="text-gray-500 font-bold">📧 sarah.j@example.com</p>
                                <p className="text-gray-500 font-bold">📞 +91 98765 43210</p>
                            </div>
                        </div>

                        {/* Travel Information */}
                        <div className="bg-white p-4 rounded-sm shadow border border-gray-400">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Travel Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <p>
                                    <strong className="text-lg underline">Destination:</strong>{" "}
                                    {isEditing ? (
                                        <select name="destination" value={formData.destination} onChange={handleChange} className="w-full border p-2 rounded-md">
                                            {destinations.map((dest) => (
                                                <option key={dest} value={dest}>{dest}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        formData.destination
                                    )}
                                </p>

                                <p>
                                    <strong className="text-lg underline">Pickup:</strong>{" "}
                                    {isEditing ? (
                                        <select name="pickup" value={formData.pickup} onChange={handleChange} className="w-full border p-2 rounded-md">
                                            {airports.map((airport) => (
                                                <option key={airport} value={airport}>{airport}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        formData.pickup
                                    )}
                                </p>

                                <p>
                                    <strong className="text-lg underline">Drop:</strong>{" "}
                                    {isEditing ? (
                                        <select name="drop" value={formData.drop} onChange={handleChange} className="w-full border p-2 rounded-md">
                                            {airports.map((airport) => (
                                                <option key={airport} value={airport}>{airport}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        formData.drop
                                    )}
                                </p>

                                <p>
                                    <strong className="text-lg underline">Budget:</strong>{" "}
                                    {isEditing ? (
                                        <input type="text" name="budget" value={formData.budget} onChange={handleChange} className="w-full border p-2 rounded-md" />
                                    ) : (
                                        formData.budget
                                    )}
                                </p>

                                <p>
                                    <strong className="text-lg underline">Arrival Date:</strong>{" "}
                                    {isEditing ? (
                                        <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} className="w-full border p-2 rounded-md" />
                                    ) : (
                                        formData.arrivalDate
                                    )}
                                </p>

                                <p>
                                    <strong className="text-lg underline">Travel Period:</strong>{" "}
                                    {isEditing ? (
                                        <input type="text" name="travelPeriod" value={formData.travelPeriod} onChange={handleChange} className="w-full border p-2 rounded-md" />
                                    ) : (
                                        formData.travelPeriod
                                    )}
                                </p>
                                <p>
                                    <strong className="text-lg underline">Special Requirements:</strong>{" "}
                                    {isEditing ? (
                                        <input type="text" name="travelPeriod" value={formData.specialRequirements} onChange={handleChange} className="w-full border p-2 rounded-md" />
                                    ) : (
                                        formData.specialRequirements
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="space-y-4">
                        {/* Enquiry Timeline */}
                        <div className="bg-white p-4 rounded-sm shadow border border-gray-400">
                            <h3 className="text-2xl font-bold text-gray-800">Enquiry Timeline</h3>
                            <p className="text-gray-600">📅 <strong className="text-lg underline">Enquiry Received:</strong> Mar 15, 2023</p>
                            <p className="text-gray-600">👤 <strong className="text-lg underline">Assigned to:</strong> John Doe</p>
                        </div>

                        {/* Notes & Communication */}
                        <div className="bg-white p-4 rounded-sm shadow border border-gray-400">
                            <h3 className="text-2xl font-bold text-gray-800">Notes & Communication</h3>
                            <textarea className="w-full p-2 border rounded-md mt-2 text-gray-600" placeholder="Add a note..."></textarea>
                            <button className="mt-2 font-bold bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700">Add Note</button>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap  mt-6 gap-2">
                    {isEditing ? (
                        <>
                            <button onClick={handleSaveClick} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700">Save</button>
                            <button onClick={handleCancelClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700">Cancel</button>
                        </>
                    ) : (
                        <button onClick={handleEditClick} className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-100">Edit</button>
                    )}
                    <button className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-100">
                        <Download />
                    </button>
                </div>
            </div>
        </div>
    );
}
