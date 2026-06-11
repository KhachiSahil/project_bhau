import { useEffect, useRef, useState } from "react";
import FollowUp from "./FollowUpProps";
import { dataModalProps, ModalProps } from "@/app/lib/utils/types";
import NotificationComponent from "@/components/NotificationComponent";
import DestinationDropbox from "@/components/DestinationDropbox";

export default function Modal({ enquiryId, onClose }: ModalProps) {
  const [data, setData] = useState<dataModalProps>();
  const [originalData, setOriginalData] = useState<dataModalProps>();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState("");
  const hotels = ["N/A", "Oberoi", "Taj", "Cecil"];
  const airports = ["New Delhi Airport", "Mumbai Airport", "Dubai Airport", "Bali International Airport"];
  const status = ["Pending", "Completed", "Cancelled"];

  // Prevents the date-range useEffect from firing on initial data load
  const isDateRangeChange = useRef(false);

  /* ── fetch on mount ── */
  useEffect(() => {
    async function fetchData() {
      if (!enquiryId) return;
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}api/common/Enquiries?enqId=${enquiryId}`
        );
        const EnquiryData = await response.json();
        setData(EnquiryData?.data);
        setOriginalData(EnquiryData?.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [enquiryId]);

  /* ── primitive field change ── */
  const handlePrimitiveChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    field: keyof dataModalProps
  ) => {
    if (field === "pickupDate" || field === "dropDate") {
      isDateRangeChange.current = true;
    }
    const { value } = e.target;
    setData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  /* ── nested section field change ── */
  const handleChange = (
    value: string,
    section: keyof dataModalProps,
    field: string
  ) => {
    setData((prev) => {
      if (!prev) return prev;
      const sectionData = prev[section];
      if (
        typeof sectionData !== "object" ||
        sectionData === null ||
        Array.isArray(sectionData)
      ) {
        console.warn(`Cannot update section ${section} - not an object`);
        return prev;
      }
      return {
        ...prev,
        [section]: { ...sectionData, [field]: value },
      };
    });
  };
  /* ── generate date range ── */
  const generateDates = (): string[] => {
    if (!data?.pickupDate || !data?.dropDate) return [];
    const start = new Date(data.pickupDate.split("T")[0]);
    const end = new Date(data.dropDate.split("T")[0]);
    const dates: string[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split("T")[0]);
    }
    return dates;
  };

  /* ── filter bookings when date range changes ── */
  useEffect(() => {
    if (!isDateRangeChange.current) return;
    isDateRangeChange.current = false;

    if (!data?.pickupDate || !data?.dropDate) return;

    const startDate = data.pickupDate.split("T")[0];
    const endDate = data.dropDate.split("T")[0];

    setData((prev) => {
      if (!prev) return prev;

      const updatedHotels = (prev.hotels ?? [])
        .map((hotel) => ({
          ...hotel,
          bookingDates: hotel.bookingDates.filter((bd) => {
            const d = bd.date.split("T")[0];
            return d >= startDate && d <= endDate;
          }),
        }))
        .filter((hotel) => hotel.bookingDates.length > 0);

      // bookedDates now lives on CabBooking directly (not CabOwner)
      const updatedCabBookings = (prev.cabBookings ?? []).map((cb, idx) => {
        if (idx !== 0) return cb;
        return {
          ...cb,
          bookedDates: cb.bookedDates.filter((bd) => {
            const d = bd.date.split("T")[0];
            return d >= startDate && d <= endDate;
          }),
        };
      });

      return { ...prev, hotels: updatedHotels, cabBookings: updatedCabBookings };
    });
  }, [data?.pickupDate, data?.dropDate]);

  /* ── toggle cab / hotel booking on a date ── */
  const handleToggleBooking = (date: string, type: "cab" | "hotel") => {
    if (!data || !isEditing || !date) return;

    if (type === "cab") {
      const cabBooking = data.cabBookings?.[0];
      if (!cabBooking) return;

      // bookedDates is on cabBooking directly now
      const exists = cabBooking.bookedDates.find(
        (bd) => bd.date.split("T")[0] === date
      );

      const newBookedDates = exists
        ? cabBooking.bookedDates.filter((bd) => bd.date.split("T")[0] !== date)
        : [
          ...cabBooking.bookedDates,
          {
            id: `temp-${Date.now()}`,
            cabBookingId: cabBooking.id,
            date: `${date}T00:00:00.000Z`,
          },
        ];

      setData((prev) => {
        if (!prev) return prev;
        const updatedCabBookings = [...(prev.cabBookings ?? [])];
        updatedCabBookings[0] = {
          ...cabBooking,
          bookedDates: newBookedDates,
        };
        return { ...prev, cabBookings: updatedCabBookings };
      });
    }

    if (type === "hotel") {
      const updatedHotels = [...data.hotels];
      let bookingToMove = null;
      let underWhichHotel = null;

      for (const hotel of updatedHotels) {
        const match = hotel.bookingDates.find(
          (bd) => bd.date.split("T")[0] === date
        );
        if (match) {
          underWhichHotel = hotel;
          bookingToMove = match;
          break;
        }
      }

      if (bookingToMove && underWhichHotel) {
        const updatedBookingDates = underWhichHotel.bookingDates.filter(
          (bd) => bd.date.split("T")[0] !== date
        );
        if (updatedBookingDates.length === 0) {
          setData((prev) =>
            prev
              ? { ...prev, hotels: updatedHotels.filter((h) => h.id !== underWhichHotel!.id) }
              : prev
          );
        } else {
          const hotelIndex = updatedHotels.findIndex((h) => h.id === underWhichHotel!.id);
          updatedHotels[hotelIndex] = {
            ...underWhichHotel,
            bookingDates: updatedBookingDates,
          };
          setData((prev) => (prev ? { ...prev, hotels: updatedHotels } : prev));
        }
      } else {
        const newBooking = {
          id: `temp-booking-${Date.now()}`,
          date: `${date}T00:00:00.000Z`,
          name: "",
        };
        if (updatedHotels.length === 0) {
          updatedHotels.push({
            id: `temp-hotel-${Date.now()}`,
            name: "",
            bookingDates: [newBooking],
          });
        } else {
          updatedHotels[0].bookingDates.push(newBooking);
        }
        setData((prev) => (prev ? { ...prev, hotels: updatedHotels } : prev));
      }
    }
  };

  /* ── hotel name change ── */
  const handleHotelNameChange = (date: string, newName: string) => {
    if (!data || !isEditing || !newName || !date) return;

    const updatedHotels = [...data.hotels];
    let bookingToMove = null;

    for (let i = 0; i < updatedHotels.length; i++) {
      const index = updatedHotels[i].bookingDates.findIndex(
        (bd) => bd.date.split("T")[0] === date
      );
      if (index !== -1) {
        bookingToMove = updatedHotels[i].bookingDates[index];
        updatedHotels[i].bookingDates.splice(index, 1);
        if (updatedHotels[i].bookingDates.length === 0) {
          updatedHotels.splice(i, 1);
        }
        break;
      }
    }

    const newBooking = {
      id: bookingToMove?.id || `temp-${Date.now()}`,
      date: `${date}T00:00:00.000Z`,
      name: newName,
    };

    const toHotel = updatedHotels.find((h) => h.name === newName);
    if (toHotel) {
      toHotel.bookingDates.push(newBooking);
    } else {
      updatedHotels.push({
        id: `temp-hotel-${Date.now()}`,
        name: newName,
        bookingDates: [newBooking],
      });
    }

    setData((prev) => (prev ? { ...prev, hotels: updatedHotels } : prev));
  };

  /* ── quotation handlers ── */
  const handleQuotationChange = (index: number, value: string) => {
    if (!data) return;
    const updated = [...data.quotation];
    updated[index] = value;
    setData((prev) => (prev ? { ...prev, quotation: updated } : prev));
  };

  const addQuotation = () => {
    setData((prev) =>
      prev ? { ...prev, quotation: [...prev.quotation, ""] } : prev
    );
  };

  const removeQuotation = (index: number) => {
    setData((prev) =>
      prev
        ? { ...prev, quotation: prev.quotation.filter((_, i) => i !== index) }
        : prev
    );
  };

  /* ── follow-up handler ── */
  function handleFollowUps(date: string, note: string) {
    const newFollowUp = {
      id: `temp-${Date.now()}`,
      date,
      message: note,
    };
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        followUps: [newFollowUp, ...(prev.followUps || [])],
      };
    });
  }

  /* ── edit mode handlers ── */
  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    setData(originalData); // restore unsaved changes
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    if (!data) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}api/common/Enquiries`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        console.error("Failed to save data:", result?.message || result);
        alert("Failed to save enquiry data.");
      } else {
        setOriginalData(data); // update baseline after successful save
      }
    } catch (err) {
      console.error("Error saving data:", err);
      alert("Something went wrong while saving.");
    } finally {
      setIsEditing(false);
      setIsLoading(false);
    }
  };

  /* ── render ── */
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 transition backdrop-blur-md p-4">
      <div className="relative bg-white rounded-sm shadow-lg w-full md:w-[80vw] lg:w-[80vw] xl:w-[80vw] max-h-[80vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
        >
          ✖
        </button>

        {isLoading ? (
          <div className="overflow-y-auto max-h-[80vh] p-6">Loading...</div>
        ) : (
          <div className="overflow-y-auto max-h-[80vh] p-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
              Booking Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ── Left Side ── */}
              <div className="space-y-4">

                {/* Customer Info */}
                <div className="bg-white p-4 flex gap-5 rounded-sm shadow border border-gray-400">
                  <div className="w-10 h-10 bg-gray-600 rounded-full" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Customer Information</h3>
                    <p className="text-gray-600 text-lg font-semibold">{data?.Customer?.name}</p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={data?.Customer?.email || ""}
                        onChange={(e) => handleChange(e.target.value, "Customer", "email")}
                        className="text-gray-600 border border-gray-600 p-1 rounded-md text-lg font-semibold"
                      />
                    ) : (
                      <p className="text-gray-600 text-lg font-semibold">{data?.Customer?.email}</p>
                    )}
                    <p className="text-gray-500 font-bold">📞 {data?.Customer?.phone}</p>
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
                    <div>
                      <strong className="text-lg underline">Destination:</strong>{" "}
                      {isEditing ? (
                        <DestinationDropbox value={data?.destination?.name || ""} onSelect={(value: string) => handleChange(value, "destination", "name")} />
                      ) : (
                        data?.destination?.name
                      )}
                    </div>
                    <div>
                      <strong className="text-lg underline">Pickup:</strong>{" "}
                      {isEditing ? (
                        <DestinationDropbox value={data?.pickupLocation?.name || ""} onSelect={(value: string) => handleChange(value, "pickupLocation", "name")} />
                      ) : (
                        data?.pickupLocation?.name
                      )}
                    </div>
                    <div>
                      <strong className="text-lg underline">Drop:</strong>{" "}
                      {isEditing ? (
                        <DestinationDropbox value={data?.dropLocation?.name || ""} onSelect={(value: string) => handleChange(value, "destination", "name")} />
                      ) : (
                        data?.dropLocation?.name
                      )}
                    </div>
                    <p>
                      <strong className="text-lg underline">Arrival Date:</strong>{" "}
                      {isEditing ? (
                        <input
                          type="date"
                          value={data?.pickupDate?.split("T")[0] || ""}
                          onChange={(e) => handlePrimitiveChange(e, "pickupDate")}
                          className="w-full border p-2 rounded-md"
                        />
                      ) : (
                        data?.pickupDate?.split("T")[0]
                      )}
                    </p>
                    <p>
                      <strong className="text-lg underline">End Date:</strong>{" "}
                      {isEditing ? (
                        <input
                          type="date"
                          value={data?.dropDate?.split("T")[0] || ""}
                          onChange={(e) => handlePrimitiveChange(e, "dropDate")}
                          className="w-full border p-2 rounded-md"
                        />
                      ) : (
                        data?.dropDate?.split("T")[0]
                      )}
                    </p>
                    <div>
                      <p>
                        <strong className="text-lg underline">Status:</strong>{" "}
                        {isEditing ? (
                          <select
                            value={data?.status || ""}
                            onChange={(e) => handlePrimitiveChange(e, "status")}
                            className="w-full border p-2 rounded-md"
                          >
                            {status.map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        ) : (
                          data?.status
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cab & Hotel Booking Table */}
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
                          cb.bookedDates.some((bd: any) => bd.date.split("T")[0] === date)
                        );

                        const hotelBooking = data?.hotels?.find((hotel) =>
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
                                  onChange={(e) => handleHotelNameChange(date, e.target.value)}
                                  className="w-full border p-1 rounded"
                                >
                                  <option value="">Select hotel</option>
                                  {hotels.map((hotel) => (
                                    <option key={hotel} value={hotel}>{hotel}</option>
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
                <div>
                  <strong className="text-lg underline">Quotations:</strong>
                  <div className="flex flex-col gap-2 mt-2">
                    {data?.quotation?.map((quote, index) => (
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
                          <span className="p-2 bg-gray-200 rounded-md text-gray-700 w-24">
                            {quote}
                          </span>
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

              {/* ── Right Side: FollowUps ── */}
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
      <NotificationComponent pickupLocation={data?.pickupLocation.name} destination={data?.destination.name} dropLocation={data?.dropLocation.name}/>
    </div>
  );
}