"use client";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { isWithinInterval } from "date-fns";

const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// Sample tour data
const tours = [
    {
        id: 1,
        name: "Manali Getaway",
        startDate: new Date("2025-05-15"),
        endDate: new Date("2025-05-18"),
        customer: {
            name: "Sarah Johnson",
            email: "sarah.j@gmail.com",
            phone: "+91 98765 43210",
        },
        destination: "Bali, Indonesia",
        pickup: "New Delhi Airport",
        drop: "Bali International Airport",
        type: "Cab",
        quotations: {
            cab: 100000,
            hotel: 100000,
        },
        assignedTo: "John Doe",
        enquiryReceived: new Date("2023-03-15"),
    },
    {
        id: 2,
        name: "Shimla Retreat",
        startDate: new Date("2025-05-17"),
        endDate: new Date("2025-05-20"),
        customer: {
            name: "Anita Verma",
            email: "anita.v@gmail.com",
            phone: "+91 91234 56789",
        },
        destination: "Shimla, India",
        pickup: "Chandigarh Airport",
        drop: "Shimla Mall Road",
        type: "SUV",
        quotations: {
            cab: 80000,
            hotel: 120000,
        },
        assignedTo: "Jane Smith",
        enquiryReceived: new Date("2023-04-02"),
    },
];

export default function CalendarWithDetails() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [activeTours, setActiveTours] = useState<typeof tours>([]);
    const [selectedTour, setSelectedTour] = useState<typeof tours[0] | null>(null);
    const [tourColors, setTourColors] = useState<Record<number, string>>({});

    useEffect(() => {
        // Assign a random color to each tour when the component is mounted
        const colors = tours.reduce((acc, tour) => {
            acc[tour.id] = generateRandomColor();
            return acc;
        }, {} as Record<number, string>);

        setTourColors(colors);
    }, []);

    const handleDateClick = (date: Date) => {
        const foundTours = tours.filter(t =>
            isWithinInterval(date, { start: t.startDate, end: t.endDate })
        );
        setSelectedDate(date);
        setActiveTours(foundTours);
        setSelectedTour(null);
    };

    const tileContent = ({ date }: { date: Date }) => {
        const toursOnDate = tours.filter(t =>
            isWithinInterval(date, { start: t.startDate, end: t.endDate })
        );
        return (
            <div className="flex gap-0.5 justify-center mt-1">
                {toursOnDate.map(tour => (
                    <span
                        key={tour.id}
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ backgroundColor: tourColors[tour.id] }}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 p-6">
            {/* Calendar */}
            <div>
                <Calendar
                    onClickDay={handleDateClick}
                    tileContent={tileContent}
                />
                {activeTours.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-semibold">Tours on {selectedDate?.toDateString()}:</h3>
                        <ul className="mt-2 space-y-2">
                            {activeTours.map(tour => (
                                <li
                                    key={tour.id}
                                    className="cursor-pointer text-sm hover:underline"
                                    onClick={() => setSelectedTour(tour)}
                                >
                                    <span
                                        className="inline-block w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: tourColors[tour.id] }}
                                    ></span>
                                    {tour.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Tour Detail Panel */}
            {selectedTour && (
                <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:max-w-lg border border-gray-200">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Booking Details</h2>

                    {/* Customer Info */}
                    <div className="mb-6 bg-gray-50 border border-gray-200 p-4 rounded-lg">
                        <p className="text-lg font-semibold text-gray-700 mb-1">Customer Information</p>
                        <p className="text-gray-800">{selectedTour.customer.name}</p>
                        <p className="text-sm text-gray-500">{selectedTour.customer.email}</p>
                        <p className="text-sm text-blue-600">{selectedTour.customer.phone}</p>
                    </div>

                    {/* Travel Info */}
                    <div className="mb-6 bg-gray-50 border border-gray-200 p-4 rounded-lg">
                        <p className="text-lg font-semibold text-gray-700 mb-2">Travel Information</p>
                        <p><strong>Destination:</strong> {selectedTour.destination}</p>
                        <p><strong>Pickup:</strong> {selectedTour.pickup}</p>
                        <p><strong>Drop:</strong> {selectedTour.drop}</p>
                        <p><strong>Arrival:</strong> {selectedTour.startDate.toDateString()}</p>
                        <p><strong>Departure:</strong> {selectedTour.endDate.toDateString()}</p>
                        <p><strong>Type:</strong> {selectedTour.type}</p>
                    </div>

                    {/* Quotation */}
                    <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                        <div className="bg-gray-100 rounded-lg p-2">
                            <p className="font-semibold text-gray-700">Cab</p>
                            <p className="text-gray-900">₹{selectedTour.quotations.cab.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-2">
                            <p className="font-semibold text-gray-700">Hotel</p>
                            <p className="text-gray-900">₹{selectedTour.quotations.hotel.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-2">
                            <p className="font-semibold text-gray-700">Total</p>
                            <p className="text-gray-900">
                                ₹{(selectedTour.quotations.cab + selectedTour.quotations.hotel).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Enquiry Info */}
                    <div className="border-t pt-4 text-sm text-gray-600">
                        <p><strong>Enquiry Received:</strong> {selectedTour.enquiryReceived.toDateString()}</p>
                        <p><strong>Assigned to:</strong> {selectedTour.assignedTo}</p>
                    </div>
                </div>
            )}

        </div>
    );
}
