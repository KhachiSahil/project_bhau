import { differenceInDays, format, addDays } from 'date-fns';
import { useSession } from 'next-auth/react';
import {FormEvent, useState } from 'react';
import DestinationDropbox from '../DestinationDropbox';

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
    const { data: session } = useSession();
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
    const handleChange = (value : string, name : string) => {
        console.log(value)
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Employee/Enquiry`, {
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
            });
            onClose();
        } catch (err) {
            alert(err);
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-3 sm:p-4 overflow-y-auto">
            {/* Modal Container */}
            <div className="bg-white shadow-2xl rounded-2xl w-full max-w-3xl relative max-h-[90vh] overflow-hidden flex flex-col">

                {/* Close Button (Fixed Position) */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold hover:cursor-pointer z-10"
                    onClick={onClose}
                >
                    &times;
                </button>

                {/* Modal Content (Scrollable) */}
                <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
                    {/* Header */}
                    <div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Add New Query</h3>
                        <p className="text-gray-500 text-sm sm:text-base font-medium mt-1">
                            Enter customer details and travel requirements to create a new enquiry.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base">
                        {/* Name */}
                        <div className="flex flex-col">
                            <label className="font-medium mb-1">Name</label>
                            <input
                                onChange={(e)=>handleChange(e.target.value,"name")}
                                value={data.customer.name}
                                name='name'
                                type="text"
                                placeholder="John Doe"
                                className="input-field border border-gray-300 rounded-xl p-2.5"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col">
                            <label className="font-medium mb-1">Email</label>
                            <input
                                onChange={(e)=>handleChange(e.target.value,"email")}
                                value={data.customer.email}
                                name='email'
                                type="email" placeholder="xyz@gmail.com" className="input-field border border-gray-300 rounded-xl p-2.5" />
                        </div>

                        {/* Phone Number */}
                        <div className="flex flex-col">
                            <label className="font-medium mb-1">Phone No.</label>
                            <input
                                onChange={(e)=>handleChange(e.target.value,"phone")}
                                value={data.customer.phone}
                                name='phone'
                                type="text" placeholder="+91 98765-43210" className="input-field border border-gray-300 rounded-xl p-2.5" />
                        </div>

                        {/* Date of Query */}
                        <div className="flex flex-col">
                            <label className="font-medium mb-1">Date of Query</label>
                            <span className="text-gray-700 p-2.5 bg-gray-100 rounded-xl font-medium">{new Date().toLocaleDateString("en-GB")}</span>
                        </div>

                        {/* Arrival Date */}
                        <div className="flex flex-col">
                            <label className="font-medium mb-1">Pickup Date</label>
                            <input name='pickupDate' onChange={(e)=>handleChange(e.target.value,"pickupDate")} value={data.pickupDate} type="date" className="input-field border border-gray-300 rounded-xl p-2.5" />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium mb-1">Drop Date</label>
                            <input name='dropDate' onChange={(e)=>handleChange(e.target.value,"dropDate")} value={data.dropDate} type="date" className="input-field border border-gray-300 rounded-xl p-2.5" />
                        </div>

                        {/* No. of Persons */}
                        <div className="flex flex-col sm:col-span-2">
                            <label className="font-medium mb-1">No. Of Persons</label>
                            <div className="flex gap-4">
                                <div className="flex flex-col flex-1">
                                    <label className="text-xs text-gray-500">Adults</label>
                                    <input
                                        onChange={(e)=>handleChange(e.target.value,"adults")}
                                        value={data.adults}
                                        name='adults'
                                        type="number" min={1} className="input-field w-full border border-gray-300 rounded-xl p-2.5" />
                                </div>
                                <div className="flex flex-col flex-1">
                                    <label className="text-xs text-gray-500">Kids</label>
                                    <input
                                        onChange={(e)=>handleChange(e.target.value,"kids")}
                                        value={data.kids}
                                        name='kids'
                                        type="number" min={0} className="input-field w-full border border-gray-300 rounded-xl p-2.5" />
                                </div>
                            </div>
                        </div>

                        {/* Travel Destination */}
                        <div className="flex flex-col">
                            <label className="font-medium mb-1">Travel Destination</label>
                            <DestinationDropbox value={data.destinationName || ""} onSelect={(value: string) => handleChange(value,"destinationName")} />
                        </div>

                        {/* Pickup Place */}
                        <div className="flex flex-col">
                            <label className="font-medium mb-1">Pickup Place</label>
                            <DestinationDropbox value={data.pickupLocationName || ""} onSelect={(value: string) => handleChange(value,"pickupLocationName")} />
                        </div>

                        {/* Drop Place */}
                        <div className="flex flex-col">
                            <label className="font-medium mb-1">Drop Place</label>
                            <DestinationDropbox value={data.dropLocationName || ""} onSelect={(value: string) => handleChange(value,"dropLocationName")} />
                        </div>

                        {/* Tour Type */}
                        <div className="flex flex-col sm:col-span-2">
                            <label className="font-medium mb-2">Cab/Hotel selection</label>
                            <div className="w-full overflow-x-auto border border-gray-200 rounded-xl">
                                <table className="w-full text-center text-sm min-w-[340px]">
                                    <thead>
                                        <tr className="bg-gray-100 text-gray-800">
                                            <th className="border-b border-gray-200 px-3 py-2">Date</th>
                                            <th className="border-b border-gray-200 px-3 py-2">Cab</th>
                                            <th className="border-b border-gray-200 px-3 py-2">Hotel</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {generateDates().map((date) => (
                                            <tr key={date} className="hover:bg-gray-50 transition">
                                                <td className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap">{date}</td>

                                                {/* Cab Checkbox */}
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="checkbox"
                                                        onChange={() => handleSelection(date, "cab")}
                                                        checked={selection[date]?.cab || false}
                                                        className="w-4 h-4 accent-black"
                                                    />
                                                </td>

                                                {/* Hotel Checkbox */}
                                                <td className="px-3 py-2">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            onChange={() => handleSelection(date, "hotel")}
                                                            checked={selection[date]?.hotel || false}
                                                            className="w-4 h-4 accent-black"
                                                        />
                                                        {selection[date]?.hotel && (
                                                            <select
                                                                onChange={(e) => handleHotelSelection(date, e.target.value)}
                                                                value={hotelSelection[date] || ""}
                                                                className="border border-gray-300 rounded-md p-1 text-xs"
                                                            >
                                                                <option value=""></option>
                                                                <option value="Taj">Taj</option>
                                                                <option value="Oberoi">Oberoi</option>
                                                                <option value="Cecil">Cecil</option>
                                                            </select>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-col mt-3">
                                <label className="font-medium mb-1">Driver</label>
                                <select
                                    onChange={(e)=>handleChange(e.target.value,"cabOwner")}
                                    value={data.cabOwner}
                                    name='cabOwner'
                                    className="input-field border border-gray-300 rounded-xl p-2.5">
                                    <option value="Chandu">Chandu</option>
                                    <option value="Rahul">Rahul</option>
                                </select>
                            </div>
                        </div>

                        {/* Website */}
                        <div className="flex flex-col">
                            <label className="font-medium mb-1">Website</label>
                            <select
                                onChange={(e)=>handleChange(e.target.value,"websiteName")}
                                value={data.websiteName}
                                name='websiteName'
                                className="input-field border border-gray-300 rounded-xl p-2.5">
                                <option value="TravelHangouts">TravelHangouts</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium mb-1">Quotation</label>
                            <input
                                onChange={(e)=>handleChange(e.target.value,"quotation")}
                                value={data.quotation}
                                name='quotation'
                                type="text" placeholder="Rs. 20000" className="input-field border border-gray-300 rounded-xl p-2.5" />
                        </div>
                        <div className="flex flex-col sm:col-span-2">
                            <label className="font-medium mb-1">Requirements</label>
                            <input
                                onChange={(e)=>handleChange(e.target.value,"requirements")}
                                value={data.requirements}
                                name='requirements'
                                type="text" placeholder="ex - Travelling only at night" className="input-field border border-gray-300 rounded-xl p-2.5" />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 text-center">
                        <button type='submit' onClick={handleSubmit} className="bg-black font-bold text-lg hover:cursor-pointer text-white px-8 py-3 rounded-xl hover:bg-neutral-800 transition shadow-xs">
                            Submit Query
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
