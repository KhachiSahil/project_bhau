import { useState } from "react";
import { format, differenceInDays, addDays } from "date-fns";
import FollowUp from "./FollowUpProps";
type ModalProps = {
    onClose: () => void;
};

export default function Modal({ onClose }: ModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        email: "sarah.j@gmail.com",
        destination: "Bali, Indonesia",
        pickup: "New Delhi Airport",
        drop: "Bali International Airport",
        budget: [{ cab: "100000", hotel: "100000" }],
        arrivalDate: "2023-06-10",
        EndDate: "2023-06-15",
        travelers: "2 Adults, 1 Kid",
        tourType: "Cab",
        carType: "SUV",
    });

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selection, setSelection] = useState<{ [key: string]: { cab: boolean; hotel: boolean } }>({});
    const destinations = ["Bali, Indonesia", "Maldives", "Thailand", "Paris, France"];
    const airports = ["New Delhi Airport", "Mumbai Airport", "Dubai Airport", "Bali International Airport"];
    const tourType = ["Cab", "Cab + Hotels", "Hotels"];
    const carType = ["Sedan", "Ertiga", "Crysta", "Old Innova", "SUV", "Traveller"]

    const handleEditClick = () => setIsEditing(true);
    const handleCancelClick = () => setIsEditing(false);
    const handleSaveClick = () => setIsEditing(false);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Generate dates between arrival and end date
    const generateDates = () => {
        const startDate = new Date(formData.arrivalDate);
        const endDate = new Date(formData.EndDate);
        const days = differenceInDays(endDate, startDate) + 1;
        return Array.from({ length: days }, (_, i) => format(addDays(startDate, i), "yyyy-MM-dd"));
    };

    // Handle checkbox selection
    const handleSelectionChange = (date: string, type: "cab" | "hotel") => {
        setSelection((prev) => ({
            ...prev,
            [date]: {
                ...prev[date],
                [type]: !prev[date]?.[type],
            },
        }));
    };

    // Function to handle quotation input changes and calculate total
    const handleQuotationChange = (index: number, field: "cab" | "hotel", value: string) => {
        const newBudget = [...formData.budget];
        newBudget[index] = {
            ...newBudget[index],
            [field]: value,
        };
        setFormData({ ...formData, budget: newBudget });
    };

    // Function to add a new quotation
    const addQuotation = () => {
        setFormData({
            ...formData,
            budget: [...formData.budget, { cab: "", hotel: "" }],
        });
    };

    // Function to remove a quotation
    const removeQuotation = (index: number) => {
        const newBudget = formData.budget.filter((_, i) => i !== index);
        setFormData({ ...formData, budget: newBudget });
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 transition backdrop-blur-md p-4">
            <div className="relative bg-white rounded-sm shadow-lg w-full md:w-[80vw] lg:w-[60vw] xl:w-[50vw] max-h-[80vh]">

                {/* Fixed Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
                >
                    ✖
                </button>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[80vh] p-6">
                    {/* Header */}
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">Booking Details</h2>

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
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email" // need this to make email editable
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="text-gray-600 border border-gray-600 p-1 rounded-md text-lg font-semibold"
                                        />
                                    ) : (
                                        <p className="text-gray-600 text-lg font-semibold">{formData.email}</p>
                                    )}

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
                                        <strong className="text-lg underline">Arrival Date:</strong>{" "}
                                        {isEditing ? (
                                            <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} className="w-full border p-2 rounded-md" />
                                        ) : (
                                            formData.arrivalDate
                                        )}
                                    </p>

                                    <p>
                                        <strong className="text-lg underline">End Date:</strong>{" "}
                                        {isEditing ? (
                                            <input type="date" name="EndDate" value={formData.EndDate} onChange={handleChange} className="w-full border p-2 rounded-md" />
                                        ) : (
                                            formData.EndDate
                                        )}
                                    </p>

                                    <p>
                                        <strong className="text-lg underline">Type:</strong>{" "}
                                        {isEditing ? (
                                            <>
                                                <select name="tourType" value={formData.tourType} onChange={handleChange} className="w-full border p-2 rounded-md">
                                                    {tourType.map((tourType) => (
                                                        <option key={tourType} value={tourType}>{tourType}</option>
                                                    ))}
                                                </select>
                                                {(formData.tourType === "Cab" || formData.tourType === "Cab + Hotels")? (<select className="w-full border p-2 rounded-md" name="carType" value={formData.carType} onChange={handleChange}>
                                                    {carType.map((carType) => <option key={carType} value={carType}>{carType}</option>)}
                                                </select>):<></>}
                                            </>

                                        ) : (
                                            <div className="flex flex-col">
                                                <span className="border rounded-md p-1">
                                                    {formData.tourType}
                                                </span>
                                                {(formData.tourType === "Cab" || formData.tourType === "Cab + Hotels") && (
                                                    <span className="border rounded-md p-1 mt-1">
                                                        {formData.carType}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </p>
                                </div>
                                <p className="border rounded-md mt-2">
                                    <div className="hover:bg-gray-200 p-1 roundex-md hover:cursor-pointer flex justify-between"
                                        onClick={toggleDropdown}>
                                        <div className="text-lg font-bold text-gray-800">Cab/Hotel Selection</div>
                                        <button
                                            onClick={toggleDropdown}
                                            className="text-gray-600 hover:text-gray-900 text-xl"
                                        >
                                            {isDropdownOpen ? "▲" : "▼"}
                                        </button>
                                    </div>
                                    {isDropdownOpen && (
                                        <div className="overflow-x-auto mt-4">
                                            <table className="w-full border-collapse border border-gray-300">
                                                <thead>
                                                    <tr className="bg-gray-200">
                                                        <th className="border border-gray-300 p-2">Date</th>
                                                        <th className="border border-gray-300 p-2">Cab Required</th>
                                                        <th className="border border-gray-300 p-2">Hotel Required</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {generateDates().map((date) => (
                                                        <tr key={date} className="text-center">
                                                            <td className="border border-gray-300 p-2">{date}</td>
                                                            <td className="border border-gray-300 p-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selection[date]?.cab || false}
                                                                    onChange={() => handleSelectionChange(date, "cab")}
                                                                    className="w-5 h-5"
                                                                />
                                                            </td>
                                                            <td className="border border-gray-300 p-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selection[date]?.hotel || false}
                                                                    onChange={() => handleSelectionChange(date, "hotel")}
                                                                    className="w-5 h-5"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </p>
                                <div className="mt-4">
                                    <strong className="text-lg underline">Quotations:</strong>
                                    <div className="flex gap-4 w-full justify-between flex-wrap">
                                        {/* Column Headers */}
                                        <div className="flex flex-col mt-1">
                                            <span className="font-bold text-gray-800">Cab</span>
                                            {formData.budget.map((quote, index) => (
                                                isEditing ? (
                                                    <input
                                                        key={`cab-${index}`}
                                                        type="text"
                                                        value={quote.cab}
                                                        onChange={(e) => handleQuotationChange(index, "cab", e.target.value)}
                                                        className="border p-2 rounded-md border-gray-300 w-24"
                                                        placeholder="Cab Price"
                                                    />
                                                ) : (
                                                    <span key={`cab-${index}`} className="p-2 bg-gray-200 rounded-md text-gray-700 w-24">{quote.cab}</span>
                                                )
                                            ))}
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800">Hotel</span>
                                            {formData.budget.map((quote, index) => (
                                                isEditing ? (
                                                    <input
                                                        key={`hotel-${index}`}
                                                        type="text"
                                                        value={quote.hotel}
                                                        onChange={(e) => handleQuotationChange(index, "hotel", e.target.value)}
                                                        className="border p-2 rounded-md border-gray-300 w-24"
                                                        placeholder="Hotel Price"
                                                    />
                                                ) : (
                                                    <span key={`hotel-${index}`} className="p-2 bg-gray-200 rounded-md text-gray-700 w-24">{quote.hotel}</span>
                                                )
                                            ))}
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800">Total</span>
                                            {formData.budget.map((quote, index) => (
                                                <span key={`total-${index}`} className="p-2 bg-gray-200 rounded-md text-gray-700 w-24">
                                                    {Number(quote.cab || 0) + Number(quote.hotel || 0)}
                                                </span>
                                            ))}
                                        </div>

                                        {isEditing && (
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800">Actions</span>
                                                {formData.budget.map((_, index) => (
                                                    <button
                                                        key={`remove-${index}`}
                                                        onClick={() => removeQuotation(index)}
                                                        className="text-red-500 font-bold my-auto"
                                                    >
                                                        ✖
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {isEditing && (
                                        <button onClick={addQuotation} className="mt-2 px-3 py-1 bg-green-500 text-white rounded-md">
                                            + Add Quotation
                                        </button>
                                    )}
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
                            <div>
                                <FollowUp/>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap mt-6 gap-2">
                        {isEditing ? (
                            <>
                                <button onClick={handleSaveClick} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700">Save</button>
                                <button onClick={handleCancelClick} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700">Cancel</button>
                            </>
                        ) : (
                            <button onClick={handleEditClick} className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-100">Edit</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
