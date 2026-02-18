import { differenceInDays, format, addDays } from 'date-fns';
import { useSession } from 'next-auth/react';
import { ChangeEvent, FormEvent, useState } from 'react';
type ButtonClick = {
    onClose: () => void;
};

interface NewQueriesProps {
    pickupDate: string,
    dropDate: string,
    adults: string,
    kids: string,
    requirements: string,
    quotation: string,
    cabOwner: string,
    pickupLocationName: string,
    dropLocationName: string,
    destinationName: string,
    websiteName: string,
    customer: {
        name: string,
        email: string,
        phone: string
    }
}

export default function NewQueries({ onClose }: ButtonClick) {
    const { data: session} = useSession();
    const EmployeeId = session?.user.id

    const [selection, setSelection] = useState<{ [key: string]: { cab: boolean; hotel: boolean } }>({});
    const [hotelSelection, setHotelSelection] = useState<{ [key: string]: string }>({})

    const handleHotelSelection = (date: string, name: string) => {
        setHotelSelection(prev => ({
            ...prev,
            [date]: name
        }))
    }

    const handleSelection = (date: string, type: "cab" | "hotel") => {
        setSelection(prev => ({
            ...prev,
            [date]: {
                ...prev[date],
                [type]: !prev[date]?.[type]
            }
        }))
    }
    const [data, setData] = useState<NewQueriesProps>({
        pickupDate: "",
        dropDate: "",
        adults: "1",
        kids: "0",
        requirements: "",
        quotation: "",
        cabOwner: "",
        pickupLocationName: "",
        dropLocationName: "",
        destinationName: "",
        websiteName: "",
        customer: {
            name: "",
            email: "",
            phone: ""
        }
    })
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (["name", "email", "phone"].includes(name)) {
            setData(prev => ({
                ...prev,
                customer: {
                    ...prev.customer,
                    [name]: value
                }
            }))
        } else {
            setData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const generateDates = () => {
        const pickupDate = new Date(data.pickupDate);
        const dropDate = new Date(data.dropDate);
        const days = differenceInDays(dropDate, pickupDate) + 1
        return Array.from({ length: days }, (_, i) => format(addDays(pickupDate, i), "yyyy-MM-dd"));
    }

    const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
        try {
            e.preventDefault();
            const responnse = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Employee/Enquiry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data,
                    EmployeeId,
                    hotelSelection,
                    selection
                })
            }
            )
        } catch (err) {

        }
    }

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
                                onChange={handleChange}
                                value={data.customer.name}
                                name='name'
                                type="text"
                                placeholder="John Doe"
                                className="input-field border border-gray-500 rounded-lg p-2"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col">
                            <label className="font-medium">Email</label>
                            <input
                                onChange={handleChange}
                                value={data.customer.email}
                                name='email'
                                type="email" placeholder="xyz@gmail.com" className="input-field border border-gray-500 rounded-lg p-2" />
                        </div>

                        {/* Phone Number */}
                        <div className="flex flex-col">
                            <label className="font-medium">Phone No.</label>
                            <input
                                onChange={handleChange}
                                value={data.customer.phone}
                                name='phone'
                                type="text" placeholder="+91 98765-43210" className="input-field border border-gray-500 rounded-lg p-2" />
                        </div>

                        {/* Date of Query */}
                        <div className="flex flex-col">
                            <label className="font-medium">Date of Query</label>
                            <span className="text-gray-700">{new Date().toLocaleDateString("en-GB")}</span>
                        </div>

                        {/* Arrival Date */}
                        <div className="flex flex-col">
                            <label className="font-medium">Pickup Date</label>
                            <input name='pickupDate' onChange={handleChange} value={data.pickupDate} type="date" className="input-field border border-gray-500 rounded-lg p-2" />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium">Drop Date</label>
                            <input name='dropDate' onChange={handleChange} value={data.dropDate} type="date" className="input-field border border-gray-500 rounded-lg p-2" />
                        </div>

                        {/* No. of Persons */}
                        <div className="flex flex-col">
                            <label className="font-medium">No. Of Persons</label>
                            <div className="flex gap-4">
                                <div className="flex flex-col">
                                    <label>Adults</label>
                                    <input
                                        onChange={handleChange}
                                        value={data.adults}
                                        name='adults'
                                        type="number" min={1} className="input-field w-full sm:w-32 border border-gray-500 rounded-lg p-2" />
                                </div>
                                <div className="flex flex-col">
                                    <label>Kids</label>
                                    <input
                                        onChange={handleChange}
                                        value={data.kids}
                                        name='kids'
                                        type="number" min={0} className="input-field w-full sm:w-32 border border-gray-500 rounded-lg p-2" />
                                </div>
                            </div>
                        </div>

                        {/* Travel Destination */}
                        <div className="flex flex-col">
                            <label className="font-medium">Travel Destination</label>
                            <select
                                onChange={handleChange}
                                value={data.destinationName}
                                name='destinationName'
                                className="input-field border border-gray-500 rounded-lg p-2">
                                <option>Dharamshala</option>
                                <option>Shimla</option>
                                <option>Pathankot</option>
                                <option>Kullu</option>
                            </select>
                        </div>

                        {/* Pickup Place */}
                        <div className="flex flex-col">
                            <label className="font-medium">Pickup Place</label>
                            <select
                                onChange={handleChange}
                                value={data.pickupLocationName}
                                name='pickupLocationName'
                                className="input-field border border-gray-500 rounded-lg p-2">
                                <option>Dharamshala</option>
                                <option>Shimla</option>
                                <option>Pathankot</option>
                                <option>Kullu</option>
                            </select>
                        </div>

                        {/* Drop Place */}
                        <div className="flex flex-col">
                            <label className="font-medium">Drop Place</label>
                            <select
                                onChange={handleChange}
                                value={data.dropLocationName}
                                name='dropLocationName'
                                className="input-field border border-gray-500 rounded-lg p-2">
                                <option>Dharamshala</option>
                                <option>Shimla</option>
                                <option>Pathankot</option>
                                <option>Kullu</option>
                            </select>
                        </div>

                        {/* Tour Type */}
                        <div className="flex flex-col">
                            <label className="font-medium">Cab/Hotel selection</label>
                            <div>
                                <table className="w-full border border-gray-300 text-center">
                                    <thead>
                                        <tr className="bg-gray-200 text-gray-800">
                                            <th className="border border-gray-300 px-4 py-2">Date</th>
                                            <th className="border border-gray-300 px-4 py-2">Cab</th>
                                            <th className="border border-gray-300 px-4 py-2">Hotel</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {generateDates().map((date) => (
                                            <tr key={date} className="hover:bg-gray-100 transition">
                                                <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">{date}</td>

                                                {/* Cab Checkbox */}
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <input
                                                        type="checkbox"
                                                        onChange={() => handleSelection(date, "cab")}
                                                        checked={selection[date]?.cab || false}
                                                        className="w-5 h-5 accent-gray-900"
                                                    />
                                                </td>

                                                {/* Hotel Checkbox */}
                                                <td className="flex gap-1 border border-gray-300 px-4 py-2">
                                                    <input
                                                        type="checkbox"
                                                        onChange={() => handleSelection(date, "hotel")}
                                                        checked={selection[date]?.hotel || false}
                                                        className="w-5 h-5 accent-gray-900 my-auto"
                                                    />
                                                    {selection[date]?.hotel && <div className='px-4 py-2'>
                                                        <select
                                                            onChange={(e) => handleHotelSelection(date, e.target.value)}
                                                            value={hotelSelection[date] || ""}
                                                            className="border border-gray-200 input-field rounded-sm p-2">
                                                            <option></option>
                                                            <option>Taj</option>
                                                            <option>Oberoi</option>
                                                            <option>Cecil</option>
                                                        </select>
                                                    </div>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex flex-col mt-2">
                                <label className="font-medium">Driver</label>
                                <select
                                    onChange={handleChange}
                                    value={data.cabOwner}
                                    name='cabOwner'
                                    className="input-field border border-gray-500 rounded-lg p-2">
                                    <option>Chandu</option>
                                    <option>Rahul</option>
                                </select>
                            </div>
                        </div>


                        <div className="">
                        </div>
                        {/* Website */}
                        <div className="flex flex-col">
                            <label className="font-medium">Website</label>
                            <select
                                onChange={handleChange}
                                value={data.websiteName}
                                name='websiteName'
                                className="input-field border border-gray-500 rounded-lg p-2">
                                <option>ABC</option>
                                <option>HIJ</option>
                                <option>XYZ</option>
                                <option>LMN</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium">Quotation</label>
                            <input
                                onChange={handleChange}
                                value={data.quotation}
                                name='quotation'
                                type="text" placeholder="Rs. 20000" className="input-field border border-gray-500 rounded-lg p-2" />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium">Requirements</label>
                            <input
                                onChange={handleChange}
                                value={data.requirements}
                                name='requirements'
                                type="text" placeholder="ex - Travelling only at night" className="input-field border border-gray-500 rounded-lg p-2" />
                        </div>
                    </div>


                    {/* Submit Button */}
                    <div className="mt-6 text-center">
                        <button type='submit' onClick={handleSubmit} className="bg-gray-900 font-bold text-xl hover:cursor-pointer text-white px-6 py-2 rounded-md hover:bg-gray-800 transition">
                            Submit Query
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}
