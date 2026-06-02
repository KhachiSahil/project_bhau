import { useEffect, useState } from "react";
import FollowUp from "./FollowUpProps";
import { dataModalProps, ModalProps } from "@/app/lib/utils/types";

export default function Modal({ enquiryId, onClose }: ModalProps) {
  const [data, setData] = useState<dataModalProps>();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [followUps, setFollowUps] = useState<Array<{ id: string; date: string; message: string }>>([])

  // Example hotel options
  const hotels = ["N/A", "Oberoi", "Taj", "Cecil"];
  const destinations = ["Bali, Indonesia", "Maldives", "Thailand", "Paris, France"];
  const airports = ["New Delhi Airport", "Mumbai Airport", "Dubai Airport", "Bali International Airport"];
  const status = ["Pending", "Completed", "Cancelled"];
  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      if (!enquiryId) return;
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}api/common/Enquiries?enqId=${enquiryId}`
        );
        const EnquiryData = await response.json();
        console.log(EnquiryData?.data);
        setData(EnquiryData?.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [enquiryId]);

  // Primitive field changes (string, number, status, requirements, etc)
  const handlePrimitiveChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    field: keyof dataModalProps
  ) => {
    const { value } = e.target;
    console.log(field, value);
    setData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  // Nested section field changes like Customer email, destination name, etc
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    section: keyof dataModalProps,
    field: string
  ) => {
    setData((prev) => {
      if (!prev) return prev;

      const sectionData = prev[section];
      if (typeof sectionData !== "object" || sectionData === null || Array.isArray(sectionData)) {
        console.warn(`Cannot update section ${section} - not an object`);
        return prev;
      }

      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: e.target.value,
        },
      };
    });
  };

  // Generate date strings between pickupDate and dropDate
  const generateDates = (): string[] => {
    if (!data) return [];
    const start = new Date(data.pickupDate.split("T")[0]);
    const end = new Date(data.dropDate.split("T")[0]);

    const dates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  };

  useEffect(() => {
    if (!data?.pickupDate || !data?.dropDate || !data.hotels) return;

    const startDate = data.pickupDate.split("T")[0];
    const endDate = data.dropDate.split("T")[0];

    const updatedHotels = data.hotels
      .map(hotel => {
        const filteredBookingDates = hotel.bookingDates.filter(bd => {
          const dateOnly = bd.date.split("T")[0];
          return dateOnly >= startDate && dateOnly <= endDate;
        });

        return {
          ...hotel,
          bookingDates: filteredBookingDates,
        };
      })
      .filter(hotel => hotel.bookingDates.length > 0); // Remove hotels with no dates

    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        hotels: updatedHotels,
      };
    });
  }, [data?.pickupDate, data?.dropDate, data?.hotels]);


  //to maintain data between bounds
  useEffect(() => {
    const newDates = data?.cabBookings?.[0];
    if (newDates) {
      const cabBooking = newDates;
      const newBookedDates = cabBooking.CabOwner.bookedDates.filter((bd) => {
        return bd.date.split("T")[0] >= data.pickupDate.split("T")[0] &&
          bd.date.split("T")[0] <= data.dropDate.split("T")[0]
      });
      setData((prev) => {
        if (!prev) return prev;

        const updatedCabBookings = [...(prev.cabBookings || [])];
        updatedCabBookings[0] = {
          ...cabBooking,
          CabOwner: {
            ...cabBooking.CabOwner,
            bookedDates: newBookedDates,
          },
        };

        return { ...prev, cabBookings: updatedCabBookings };
      });
    }

  }, [data?.pickupDate, data?.dropDate, data?.cabBookings]);

  // Toggle cab or hotel booking on a date
  const handleToggleBooking = (date: string, type: "cab" | "hotel") => {
    if (!data || !isEditing) return;

    if (type === "cab") {
      const cabBooking = data.cabBookings?.[0];
      if (!cabBooking) return;
      //find if date exists to delete that
      const exists = cabBooking.CabOwner.bookedDates.find(
        (bd) => bd.date.split("T")[0] === date
      );

      let newBookedDates = [...cabBooking.CabOwner.bookedDates];

      if (exists) {
        // Remove date
        newBookedDates = newBookedDates.filter(
          (bd) => bd.date.split("T")[0] !== date
        );
      } else {
        // Add date with temp id
        newBookedDates.push({
          id: `temp-${Date.now()}`,
          cabBookingId: cabBooking.id,
          cabOwnerId: cabBooking.CabOwner.id,
          date: `${date}T00:00:00.000Z`,
        });
      }

      setData((prev) => {
        if (!prev) return prev;

        const updatedCabBookings = [...(prev.cabBookings || [])];
        updatedCabBookings[0] = {
          ...cabBooking,
          CabOwner: {
            ...cabBooking.CabOwner,
            bookedDates: newBookedDates,
          },
        };

        return { ...prev, cabBookings: updatedCabBookings };
      });
    }

    if (type === "hotel") {
      if (!date) return;

      let underWhichHotel = null;
      let dateFound = null;

      // Step 1: Find which hotel has the date
      for (const hotel of data.hotels) {
        const match = hotel.bookingDates.find(
          (booking) => booking.date.split("T")[0] === date.split("T")[0]
        );
        if (match) {
          underWhichHotel = hotel;
          dateFound = match;
          break;
        }
      }

      const updatedHotels = [...data.hotels];

      if (dateFound && underWhichHotel) {
        // Step 2: Remove the booking
        const updatedBookingDates = underWhichHotel.bookingDates.filter(
          (bd) => bd.date.split("T")[0] !== date.split("T")[0]
        );

        if (updatedBookingDates.length === 0) {
          // Step 3: Remove the whole hotel entry if no bookings left
          const remainingHotels = updatedHotels.filter(
            (h) => h.id !== underWhichHotel.id
          );
          setData((prev) => prev ? { ...prev, hotels: remainingHotels } : prev);
        } else {
          // Step 4: Update that hotel's bookingDates
          const hotelIndex = updatedHotels.findIndex(
            (h) => h.id === underWhichHotel.id
          );
          updatedHotels[hotelIndex] = {
            ...underWhichHotel,
            bookingDates: updatedBookingDates,
          };
          setData((prev) => prev ? { ...prev, hotels: updatedHotels } : prev);
        }
      } else {
        // Step 5: Add new booking to first hotel (or create a new one)
        const newBooking = {
          id: `temp-booking-${Date.now()}`,
          date: `${date}T00:00:00.000Z`,
          name: "", // No prefilled hotel name as requested
        };

        if (updatedHotels.length === 0) {
          // No hotel exists, create new hotel entry
          updatedHotels.push({
            id: `temp-hotel-${Date.now()}`,
            name: "",
            bookingDates: [newBooking],
          });
        } else {
          // Add new booking to first existing hotel
          updatedHotels[0].bookingDates.push(newBooking);
        }

        setData((prev) => prev ? { ...prev, hotels: updatedHotels } : prev);
      }
    }
  };

  // Change hotel name for a booking date
  const handleHotelNameChange = (date: string, newName: string) => {
    if (!data || !isEditing || !newName || !date) return;

    const updatedHotels = [...data.hotels];

    // Step 1: Find the hotel and booking that currently holds the date
    let bookingToMove = null;

    for (let i = 0; i < updatedHotels.length; i++) {
      const index = updatedHotels[i].bookingDates.findIndex(
        (bd) => bd.date.split("T")[0] === date
      );
      if (index !== -1) {
        bookingToMove = updatedHotels[i].bookingDates[index];
        // Step 2: Remove the booking from this hotel
        updatedHotels[i].bookingDates.splice(index, 1);

        // If hotel now has 0 bookings, remove the whole hotel
        if (updatedHotels[i].bookingDates.length === 0) {
          updatedHotels.splice(i, 1);
        }
        break;
      }
    }

    // Step 3: Add this booking to the target hotel (by name)
    const toHotel = updatedHotels.find((h) => h.name === newName);

    const newBooking = {
      id: bookingToMove?.id || `temp-${Date.now()}`,
      date: `${date}T00:00:00.000Z`,
      name: newName,
    };

    if (toHotel) {
      toHotel.bookingDates.push(newBooking);
    } else {
      updatedHotels.push({
        id: `temp-hotel-${Date.now()}`,
        name: newName,
        bookingDates: [newBooking],
      });
    }

    // Step 4: Update state
    setData((prev) => prev ? { ...prev, hotels: updatedHotels } : prev);
  };


  // Quotation handlers
  const handleQuotationChange = (index: number, value: string) => {
    if (!data) return;
    const updated = [...data.quotation];
    updated[index] = value;
    setData((prev) => (prev ? { ...prev, quotation: updated } : prev));
  };

  const addQuotation = () => {
    if (!data) return;
    setData((prev) => (prev ? { ...prev, quotation: [...prev.quotation, ""] } : prev));
  };

  const removeQuotation = (index: number) => {
    if (!data) return;
    setData((prev) =>
      prev
        ? {
          ...prev,
          quotation: prev.quotation.filter((_, i) => i !== index),
        }
        : prev
    );
  };
  //Handle the follow up part 
  function handleFollowUps(date: string, note: string) {
    const newFollowUp = {
      id: `${Date.now()}`, // Use timestamp as ID
      date,
      message : note,
    };
    
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        followUps: [newFollowUp, ...(prev.followUps || [])], // prepend new follow-up
      };
    });
    setFollowUps(prev => [newFollowUp, ...prev]);
  }

  // Edit mode handlers
  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => setIsEditing(false);
  const handleSaveClick = async () => {
    if (!data) return;

    console.log("Saving data:", data);
    setIsLoading(true); // optional: add loading feedback

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}api/common/Enquiries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data,followUps }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Failed to save data:", result?.message || result);
        alert("Failed to save enquiry data.");
      } else {
        console.log(" Data saved successfully:", result);
      }
    } catch (err) {
      console.error("Error saving data:", err);
      alert(" Something went wrong while saving.");
    } finally {
      setIsEditing(false);
      setIsLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 transition backdrop-blur-md p-4">
      <div className="relative bg-white rounded-sm shadow-lg w-full md:w-[80vw] lg:w-[80vw] xl:w-[80vw] max-h-[80vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
        >
          ✖
        </button>

        {/* Content */}
        {isLoading ? (
          <div className="overflow-y-auto max-h-[80vh] p-6">Loading...</div>
        ) : (
          <div className="overflow-y-auto max-h-[80vh] p-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">Booking Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Side */}
              <div className="space-y-4">
                {/* Customer Info */}
                <div className="bg-white p-4 flex gap-5 rounded-sm shadow border border-gray-400">
                  <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Customer Information</h3>
                    <p className="text-gray-600 text-lg font-semibold">{data?.Customer?.name}</p>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={data?.Customer?.email || ""}
                        onChange={(e) => handleChange(e, "Customer", "email")}
                        className="text-gray-600 border border-gray-600 p-1 rounded-md text-lg font-semibold"
                      />
                    ) : (
                      <p className="text-gray-600 text-lg font-semibold">{data?.Customer?.email}</p>
                    )}
                    <p className="text-gray-500 font-bold">📞 {data?.Customer.phone}</p>
                  </div>
                </div>

                {/* Travel Info */}
                <div className="bg-white p-4 rounded-sm shadow border border-gray-400">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Travel Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <p>
                      <strong className="text-lg underline">Adults:</strong>{" "}
                      {isEditing ? (
                        <input
                          type="number"
                          value={data?.adults || 0}
                          onChange={(e) => handlePrimitiveChange(e, "adults")}
                          className="w-full border p-2 rounded-md"
                        />
                      ) : (
                        data?.adults
                      )}
                    </p>
                    <p>
                      <strong className="text-lg underline">Kids:</strong>{" "}
                      {isEditing ? (
                        <input
                          type="number"
                          value={data?.kids || 0}
                          onChange={(e) => handlePrimitiveChange(e, "kids")}
                          className="w-full border p-2 rounded-md"
                        />
                      ) : (
                        data?.kids
                      )}
                    </p>
                    <p>
                      <strong className="text-lg underline">Destination:</strong>{" "}
                      {isEditing ? (
                        <select
                          name="destination"
                          value={data?.destination.name || ""}
                          onChange={(e) => handleChange(e, "destination", "name")}
                          className="w-full border p-2 rounded-md"
                        >
                          {destinations.map((dest) => (
                            <option key={dest} value={dest}>
                              {dest}
                            </option>
                          ))}
                        </select>
                      ) : (
                        data?.destination?.name
                      )}
                    </p>
                    <p>
                      <strong className="text-lg underline">Pickup:</strong>{" "}
                      {isEditing ? (
                        <select
                          name="pickup"
                          value={data?.pickupLocation.name || ""}
                          onChange={(e) => handleChange(e, "pickupLocation", "name")}
                          className="w-full border p-2 rounded-md"
                        >
                          {airports.map((airport) => (
                            <option key={airport} value={airport}>
                              {airport}
                            </option>
                          ))}
                        </select>
                      ) : (
                        data?.pickupLocation.name
                      )}
                    </p>
                    <p>
                      <strong className="text-lg underline">Drop:</strong>{" "}
                      {isEditing ? (
                        <select
                          name="drop"
                          value={data?.dropLocation.name || ""}
                          onChange={(e) => handleChange(e, "dropLocation", "name")}
                          className="w-full border p-2 rounded-md"
                        >
                          {airports.map((airport) => (
                            <option key={airport} value={airport}>
                              {airport}
                            </option>
                          ))}
                        </select>
                      ) : (
                        data?.dropLocation.name
                      )}
                    </p>
                    <p>
                      <strong className="text-lg underline">Arrival Date:</strong>{" "}
                      {isEditing ? (
                        <input
                          type="date"
                          name="arrivalDate"
                          value={data?.pickupDate.split("T")[0] || ""}
                          onChange={(e) => {
                            handlePrimitiveChange(e, "pickupDate");
                            handleToggleBooking("", "cab")
                          }}
                          className="w-full border p-2 rounded-md"
                        />
                      ) : (
                        data?.pickupDate.split("T")[0]
                      )}
                    </p>
                    <p>
                      <strong className="text-lg underline">End Date:</strong>{" "}
                      {isEditing ? (
                        <input
                          type="date"
                          name="EndDate"
                          value={data?.dropDate.split("T")[0] || ""}
                          onChange={(e) => {
                            handlePrimitiveChange(e, "dropDate");
                            handleToggleBooking("", "cab")
                          }}
                          className="w-full border p-2 rounded-md"
                        />
                      ) : (
                        data?.dropDate.split("T")[0]
                      )}
                    </p>
                    <div>
                      <div>
                        <p>
                          <strong className="text-lg underline">Status:</strong>{" "}
                          {isEditing ? (
                            <select
                              name="status"
                              value={data?.status || ""}
                              onChange={(e) => handlePrimitiveChange(e, "status")}
                              className="w-full border p-2 rounded-md"
                            >
                              {status.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                          ) : (
                            data?.status
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cab & Hotel Booking Selection */}
                <div className="mb-6 bg-white p-4 rounded-sm shadow border border-gray-400">
                  <h3 className="text-xl font-bold mb-2">Cab / Hotel Booking Dates</h3>

                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">Date</th>
                        <th className="border border-gray-300 p-2">Cab Required</th>
                        <th className="border border-gray-300 p-2">Hotel Required</th>
                        <th className="border border-gray-300 p-2">Hotel Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generateDates().map((date) => {
                        const cabBooked = data?.cabBookings?.some((cb) =>
                          cb.CabOwner.bookedDates.some(
                            (bd) => bd.date.split("T")[0] === date
                          )
                        );

                        const hotelBooking = data?.hotels.find((hotel) =>
                          hotel.bookingDates.some((bd) => bd.date.split("T")[0] === date)
                        );

                        return (
                          <tr key={date} className="text-center">
                            <td className="border border-gray-300 p-2">{date}</td>

                            <td className="border border-gray-300 p-2">
                              <input
                                type="checkbox"
                                checked={!!cabBooked}
                                disabled={!isEditing}
                                onChange={() => handleToggleBooking(date, "cab")}
                                className="w-5 h-5"
                              />
                            </td>

                            <td className="border border-gray-300 p-2">
                              <input
                                type="checkbox"
                                checked={!!hotelBooking}
                                disabled={!isEditing}
                                onChange={() => handleToggleBooking(date, "hotel")}
                                className="w-5 h-5"
                              />
                            </td>

                            <td className="border border-gray-300 p-2">
                              {isEditing ? (
                                <select
                                  disabled={!hotelBooking}
                                  value={hotelBooking?.name || ""}
                                  onChange={(e) =>
                                    handleHotelNameChange(date, e.target.value)
                                  }
                                  className="w-full border p-1 rounded"
                                >
                                  <option value="">Select hotel</option>
                                  {hotels.map((hotel) => (
                                    <option key={hotel} value={hotel}>
                                      {hotel}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                hotelBooking?.name || ""
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Quotations */}
                <div className="">
                  <strong className="text-lg underline">Quotations:</strong>
                  <div className="flex flex-col gap-2 mt-2">
                    {data?.quotation.map((quote, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              value={quote}
                              onChange={(e) => handleQuotationChange(index, e.target.value)}
                              className="p-1 border border-gray-400 rounded-md w-32"
                              placeholder="Enter quotation"
                            />
                            <button
                              onClick={() => removeQuotation(index)}
                              className="text-red-500 font-bold"
                            >
                              ✖
                            </button>
                          </>
                        ) : (
                          <span className="p-2 bg-gray-200 rounded-md text-gray-700 w-24">{quote}</span>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <button
                        onClick={addQuotation}
                        className="mt-2 px-3 py-1 rounded-sm bg-blue-600 text-white text-sm"
                      >
                        + Add Quotation
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side: FollowUps */}
              <div className="bg-white p-4 rounded-sm shadow border border-gray-400 max-h-[65vh] overflow-y-auto">
                <FollowUp
                  FollowUpsData={data?.followUps || []}
                  handleFollowUps={handleFollowUps}
                  isEditing={isEditing}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-4">
              {!isEditing ? (
                <button
                  onClick={handleEditClick}
                  className="rounded-md border border-black px-3 py-1 hover:bg-black hover:text-white"
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancelClick}
                    className="rounded-md border border-black px-3 py-1 hover:bg-black hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveClick}
                    className="rounded-md border border-black px-3 py-1 hover:bg-black hover:text-white"
                  >
                    Save
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
