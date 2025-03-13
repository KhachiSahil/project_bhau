type funType = {
    onClose: () => void;
};

export default function AddEmployee({ onClose }: funType) {
    return (
        <div className="fixed overflow-y-auto pt-56 md:pt-0 inset-0 flex items-center justify-center bg-black/70 bg-opacity-50 z-50 p-4">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl p-8 md:p-10">
                {/* Header */}
                <div className="flex justify-between items-center ">
                    <h2 className="text-2xl md:text-3xl font-semibold">Add New Employee</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900 text-3xl font-bold hover:cursor-pointer">&times;</button>
                </div>

                <p className="text-gray-500 text-sm md:text-lg font-semibold">
                    Enter employee details to add them to the system
                </p>

                {/* Form */}
                <form className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="font-semibold text-lg">First Name</label>
                            <input type="text" placeholder="Enter first name" className="border border-gray-400 p-2 rounded-md font-semibold" />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold text-lg">First Name</label>
                            <input type="text" placeholder="Enter last name" className="border border-gray-400 p-2 rounded-md font-semibold" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="font-semibold text-lg">Email</label>
                            <input type="email" placeholder="Enter email" className="border border-gray-400 p-2 rounded-md font-semibold" />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold text-lg">Phone no.</label>
                            <input type="text" placeholder="Enter phone no." className="border border-gray-400 p-2 rounded-md font-semibold" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="font-bold text-lg">Role</label>
                            <select className="text-lg border border-gray-500 p-2 rounded-md font-semibold">
                                <option>Sale</option>
                                <option>Maarketing</option>
                                <option>Optimization</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="font-bold text-lg">Website</label>
                            <select className="text-lg border border-gray-500 p-2 rounded-md font-semibold">
                                <option>Abc</option>
                                <option>XYZ</option>
                                <option>HHI</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="font-semibold text-lg">Phone no.</label>
                            <input type="text" placeholder="Enter phone no." className="border border-gray-400 p-2 rounded-md font-semibold" />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4 pt-6 mt-4">
                        <button type="button" className="font-bold text-xl border-2 border-gray-600 p-3 rounded-md hover:scale-105 hover:cursor-pointer duration-200" onClick={onClose}>Cancel</button>
                        <button type="submit" className="font-bold text-xl bg-black text-white border-2 p-3 rounded-md hover:scale-105 hover:cursor-pointer duration-200">Add Employee</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
