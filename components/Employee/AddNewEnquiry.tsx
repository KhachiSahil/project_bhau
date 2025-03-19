type ButtonClick = {
    onClose: () => void;
};

export default function NewQueries({ onClose }: ButtonClick) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            {/* Modal Container */}
            <div className="bg-white shadow-lg rounded-lg w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl relative">
                
                {/* Close Button (Fixed Position) */}
                <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl hover:cursor-pointer"
                    onClick={onClose}
                >
                    ✖
                </button>

                {/* Modal Content (Scrollable) */}
                <div className="max-h-[90vh] overflow-y-auto p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <h3 className="text-2xl sm:text-3xl font-bold">Add New Query</h3>
                        <p className="text-gray-500 text-base sm:text-lg font-medium">
                            Enter customer details and travel requirements to create a new enquiry.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base sm:text-lg">
                        {/* Name */}
                        <div className="flex flex-col">
                            <label className="font-medium">Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="input-field border border-gray-500 rounded-lg p-2"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col">
                            <label className="font-medium">Email</label>
                            <input type="email" placeholder="xyz@gmail.com" className="input-field border border-gray-500 rounded-lg p-2" />
                        </div>

                        {/* Phone Number */}
                        <div className="flex flex-col">
                            <label className="font-medium">Phone No.</label>
                            <input type="text" placeholder="+91 98765-43210" className="input-field border border-gray-500 rounded-lg p-2" />
                        </div>

                        {/* Date of Query */}
                        <div className="flex flex-col">
                            <label className="font-medium">Date of Query</label>
                            <span className="text-gray-700">{new Date().toLocaleDateString("en-GB")}</span>
                        </div>

                        {/* Arrival Date */}
                        <div className="flex flex-col">
                            <label className="font-medium">Arrival Date</label>
                            <input type="date" className="input-field border border-gray-500 rounded-lg p-2" />
                        </div>

                        {/* No. of Persons */}
                        <div className="flex flex-col">
                            <label className="font-medium">No. Of Persons</label>
                            <div className="flex gap-4">
                                <div className="flex flex-col">
                                    <label>Adults</label>
                                    <input type="number" value={1} min={1} className="input-field w-full sm:w-32 border border-gray-500 rounded-lg p-2" />
                                </div>
                                <div className="flex flex-col">
                                    <label>Kids</label>
                                    <input type="number" value={0} min={0} className="input-field w-full sm:w-32 border border-gray-500 rounded-lg p-2" />
                                </div>
                            </div>
                        </div>

                        {/* Travel Destination */}
                        <div className="flex flex-col">
                            <label className="font-medium">Travel Destination</label>
                            <select className="input-field border border-gray-500 rounded-lg p-2">
                                <option>Dharamshala</option>
                                <option>Shimla</option>
                                <option>Pathankot</option>
                                <option>Kullu</option>
                            </select>
                        </div>

                        {/* Pickup Place */}
                        <div className="flex flex-col">
                            <label className="font-medium">Pickup Place</label>
                            <select className="input-field border border-gray-500 rounded-lg p-2">
                                <option>Dharamshala</option>
                                <option>Shimla</option>
                                <option>Pathankot</option>
                                <option>Kullu</option>
                            </select>
                        </div>

                        {/* Drop Place */}
                        <div className="flex flex-col">
                            <label className="font-medium">Drop Place</label>
                            <select className="input-field border border-gray-500 rounded-lg p-2">
                                <option>Dharamshala</option>
                                <option>Shimla</option>
                                <option>Pathankot</option>
                                <option>Kullu</option>
                            </select>
                        </div>

                        {/* Tour Type */}
                        <div className="flex flex-col">
                            <label className="font-medium">Tour Type</label>
                            <select className="input-field border border-gray-500 rounded-lg p-2">
                                <option>Cab</option>
                                <option>Bus</option>
                                <option>Plane</option>
                            </select>
                        </div>

                        {/* Enquired On */}
                        <div className="flex flex-col">
                            <label className="font-medium">Enquired On</label>
                            <select className="input-field border border-gray-500 rounded-lg p-2">
                                <option>Email</option>
                                <option>Call</option>
                                <option>Whatsapp</option>
                                <option>Online</option>
                            </select>
                        </div>

                        {/* Website */}
                        <div className="flex flex-col">
                            <label className="font-medium">Website</label>
                            <select className="input-field border border-gray-500 rounded-lg p-2">
                                <option>ABC</option>
                                <option>HIJ</option>
                                <option>XYZ</option>
                                <option>LMN</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 text-center">
                        <button className="bg-gray-900 font-bold text-xl hover:cursor-pointer text-white px-6 py-2 rounded-md hover:bg-gray-800 transition">
                            Submit Query
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
