interface Props {
    search: string;
    onSearchChange: (value: string) => void;
    onAddOwner: () => void;
}

export default function CabPageHeader({ search, onSearchChange, onAddOwner }: Props) {
    return (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <div>
                <h1 className="text-3xl font-bold text-black">Cab Fleet Management</h1>
                <p className="text-gray-500">Owners, their cabs, and where each one is booked</p>
            </div>

            <div className="flex gap-3">
                <input
                    type="text"
                    placeholder="Search owner, model, or plate..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="border border-gray-300 rounded-xl px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                    onClick={onAddOwner}
                    className="bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-800 whitespace-nowrap"
                >
                    + Add Owner
                </button>
            </div>
        </div>
    );
}