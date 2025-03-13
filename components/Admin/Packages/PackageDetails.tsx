import React, { useState } from "react";

interface PackageDetailsModalProps {
    onClose: () => void;
}

export default function PackageDetailsModal({ onClose }: PackageDetailsModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [packageData, setPackageData] = useState({
        name: "Bali Honeymoon Special",
        destination: "Bali, Indonesia",
        category: "Honeymoon",
        duration: "7 days",
        price: "₹250,000",
        rating: 4.8,
        description: "A romantic 7-day getaway to the beautiful beaches of Bali with luxury accommodations and private experiences."
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPackageData({ ...packageData, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4 sm:px-6">
            <div className="bg-white shadow-lg rounded-lg p-4 md:p-8 max-h-screen overflow-auto sm:max-w-md md:max-w-3xl lg:max-w-5xl w-full">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 md:mb-6">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-bold">Package Details</h2>
                        <p className="text-gray-500 text-sm md:text-lg">View and manage package information</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-700 text-2xl md:text-3xl font-semibold hover:text-gray-900 hover:cursor-pointer transition-all duration-300"
                    >
                        &times;
                    </button>
                </div>

                {/* Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {/* Left Section */}
                    <div className="bg-gray-100 p-4 md:p-6 rounded-lg">
                        <h3 className="text-2xl md:text-3xl font-semibold mb-3 md:mb-4">Package Information</h3>

                        {isEditing ? (
                            <>
                                <input type="text" name="name" value={packageData.name} onChange={handleChange} className="w-full border p-2 md:p-3 mt-2 rounded-md text-base md:text-xl" />
                                <input type="text" name="destination" value={packageData.destination} onChange={handleChange} className="w-full border p-2 md:p-3 mt-2 rounded-md text-base md:text-xl" />
                                <input type="text" name="category" value={packageData.category} onChange={handleChange} className="w-full border p-2 md:p-3 mt-2 rounded-md text-base md:text-xl" />
                                <input type="text" name="duration" value={packageData.duration} onChange={handleChange} className="w-full border p-2 md:p-3 mt-2 rounded-md text-base md:text-xl" />
                                <input type="text" name="price" value={packageData.price} onChange={handleChange} className="w-full border p-2 md:p-3 mt-2 rounded-md text-base md:text-xl" />
                                <input type="number" name="rating" value={packageData.rating} onChange={handleChange} className="w-full border p-2 md:p-3 mt-2 rounded-md text-base md:text-xl" />
                                <textarea name="description" value={packageData.description} onChange={handleChange} className="w-full border p-2 md:p-3 mt-2 rounded-md h-20 md:h-28 text-base md:text-xl" />
                            </>
                        ) : (
                            <>
                                <h4 className="text-2xl md:text-3xl font-bold mt-1">{packageData.name}</h4>
                                <p className="text-gray-700 text-base md:text-xl">{packageData.destination}</p>
                                <p className="mt-2 text-base md:text-xl">
                                    <strong>Category:</strong> <span className="bg-gray-200 px-2 md:px-3 py-1 rounded-lg">{packageData.category}</span>
                                </p>
                                <p className="mt-1 text-base md:text-xl"><strong>Duration:</strong> {packageData.duration}</p>
                                <p className="mt-1 text-base md:text-xl"><strong>Price:</strong> {packageData.price}</p>
                                <p className="mt-1 text-base md:text-xl"><strong>Rating:</strong> {packageData.rating}/5</p>
                                <p className="mt-4 text-gray-700 text-sm md:text-lg"><strong>Description:</strong> {packageData.description}</p>
                            </>
                        )}
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col justify-between bg-gray-100 p-4 md:p-6 rounded-lg">
                        {/* Performance Metrics */}
                        <div>
                            <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">Performance Metrics</h3>
                            <p className="text-gray-700 text-base md:text-xl"><strong>Total Bookings:</strong> 24</p>
                            <p className="text-gray-700 text-base md:text-xl"><strong>Total Revenue:</strong> ₹60,00,000</p>
                        </div>

                        {/* Actions */}
                        <div className="mt-4 md:mt-6">
                            <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">Actions</h3>
                            <button className="bg-black text-white w-full py-2 md:py-3 rounded-md text-base md:text-lg font-semibold hover:bg-gray-800 transition-all duration-300">View Bookings</button>
                            <button className="border w-full py-2 md:py-3 rounded-md mt-2 text-base md:text-lg font-semibold hover:bg-gray-200 transition-all duration-300">Generate Report</button>

                            {/* Edit & Delete Buttons */}
                            <div className="mt-3 md:mt-4 flex flex-col space-y-2">
                                {isEditing ? (
                                    <>
                                        <button onClick={() => setIsEditing(false)} className="bg-green-500 text-white px-4 py-2 md:py-3 rounded-md text-base md:text-lg font-semibold hover:bg-green-600 transition-all duration-300">Save</button>
                                        <button onClick={() => setIsEditing(false)} className="border px-4 py-2 md:py-3 rounded-md text-base md:text-lg font-semibold hover:bg-gray-200 transition-all duration-300">Cancel</button>
                                    </>
                                ) : (
                                    <button onClick={() => setIsEditing(true)} className="border px-4 py-2 md:py-3 rounded-md text-base md:text-lg font-semibold hover:bg-gray-200 transition-all duration-300">Edit Package</button>
                                )}
                                <button className="bg-red-500 text-white px-4 py-2 md:py-3 rounded-md text-base md:text-lg font-semibold hover:bg-red-600 transition-all duration-300">Delete Package</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
