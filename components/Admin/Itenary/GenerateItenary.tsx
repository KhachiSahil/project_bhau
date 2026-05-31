import { differenceInDays } from "date-fns";
import { X, Edit3, Save, Users, Car, Phone, Download, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { DEFAULT_NOTES, buildDays, exportToPDF } from "./Itenary-export-data"

export default function GenerateItenary({ show, onClose, formData }: any) {
  if (!show) return null;

  const { arrivalDate, endDate, destination, pickupPlace, dropPlace } = formData;
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(DEFAULT_NOTES);
  const [editableContent, setEditableContent] = useState({
    adults: "02",
    children: "02",
    childrenAges: "(7,10yrs)",
    transportationCost: "21,000",
    vehicle: "Maruti Dzire/Toyota Etios",
    contactPerson: "Ms Alisha",
    contactNumber: "+91-9805676866",
    greeting: "Dear Sir,",
  });

  const totalDays = differenceInDays(new Date(endDate), new Date(arrivalDate)) + 1;
  const daysData = buildDays(arrivalDate, totalDays, pickupPlace, destination, dropPlace)
  const [itineraryDays, setItineraryDays] = useState(daysData);

  const handleEditChange = (field: string, value: string) =>
    setEditableContent((prev) => ({ ...prev, [field]: value }));

  const updateDay = (index: number, field: string, value: string) =>
    setItineraryDays((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    );

  const addDay = () => {
    const last = itineraryDays[itineraryDays.length - 1];
    setItineraryDays((prev) => [
      ...prev,
      {
        day: prev.length + 1,
        date: last.date,
        title: `${destination} Local Sightseeing`,
        description: `Today after breakfast we will take you to visit famous attractions in ${destination}. Overnight stay at Hotel.`,
      },
    ]);
  };

  const removeDay = (index: number) =>
    setItineraryDays((prev) =>
      prev.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 }))
    );

  const updateNote = (i: number, value: string) =>
    setNotes((prev) => prev.map((n, idx) => (idx === i ? value : n)));

  const handleItinerarySave = async () => {
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}api/Itinerary`,
        {
          method: "POST",
          body: JSON.stringify({
            pickupDate: arrivalDate,
            dropDate: endDate,
            pickupLocation: pickupPlace,
            dropLocation: dropPlace,
            budget: editableContent.transportationCost,
            adults: editableContent.adults,
            kids: editableContent.children,
            vehicle: editableContent.vehicle,
            data: daysData.map(({ date, ...rest }) => rest)
          })
        }
      )
      console.log(data);
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-60 p-4">
      <div className="bg-white text-black max-w-5xl w-full max-h-[90vh] rounded-lg shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-black text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Tour Itinerary & Cost</h2>
            <p className="text-gray-300 mt-1">Himachal Taxi Rental Service</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={()=>{handleItinerarySave(),onClose()}}
              className={`flex items-center gap-2 px-4 py-2  text-white rounded transition-colors text-sm font-medium ${isEditing ? "bg-gray-800 cursor-not-allowed" : "bg-green-900  hover:bg-green-700 "}`}
              disabled={isEditing}
            >
              <><Save size={16} /> Save</>
            </button>
            <button
              onClick={() => exportToPDF(editableContent, itineraryDays, notes)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <Download size={16} /> Export PDF
            </button>
            <button
              onClick={() => setIsEditing((e) => !e)}
              className="flex items-center gap-2 px-3 py-2 bg-white text-black rounded hover:bg-gray-100 transition-colors text-sm"
            >
              {isEditing ? <><Save size={16} /> Save</> : <><Edit3 size={16} /> Edit</>}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">

          {/* Greeting */}
          <div className="text-center">
            {isEditing ? (
              <input
                type="text"
                value={editableContent.greeting}
                onChange={(e) => handleEditChange("greeting", e.target.value)}
                className="font-bold text-lg border-b border-gray-300 text-center outline-none"
              />
            ) : (
              <p className="font-bold text-lg">{editableContent.greeting}</p>
            )}
            <p className="mt-2 font-bold">Greetings from Himachal Taxi Rental Service……</p>
            <p className="mt-2 font-bold">Please find the below Tour Itinerary & Cost:</p>
          </div>

          {/* Itinerary */}
          <div>
            <h3 className="font-bold text-xl mb-4">Itinerary:</h3>
            <div className="space-y-6">
              {itineraryDays.map((day, index) => (
                <div key={index} className="border-l-4 border-black pl-4">
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm shrink-0">
                          Day {String(day.day).padStart(2, "0")}: {day.date} ~
                        </span>
                        <input
                          type="text"
                          value={day.title}
                          onChange={(e) => updateDay(index, "title", e.target.value)}
                          className="flex-1 font-bold border-b border-gray-300 outline-none text-sm"
                        />
                        {itineraryDays.length > 1 && (
                          <button
                            onClick={() => removeDay(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                      <textarea
                        value={day.description}
                        onChange={(e) => updateDay(index, "description", e.target.value)}
                        rows={3}
                        className="w-full text-sm text-gray-800 border border-gray-200 rounded px-2 py-1 outline-none resize-y leading-relaxed"
                      />
                    </div>
                  ) : (
                    <>
                      <h4 className="font-bold text-lg mb-2">
                        Day {String(day.day).padStart(2, "0")}: {day.date} ~ {day.title}
                      </h4>
                      <p className="text-gray-800 leading-relaxed">{day.description}</p>
                    </>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <button
                onClick={addDay}
                className="mt-4 flex items-center gap-1 px-3 py-1.5 text-sm border border-black rounded hover:bg-black hover:text-white transition-colors"
              >
                <Plus size={14} /> Add Day
              </button>
            )}
          </div>

          {/* Transportation */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-xl mb-4">Transportation ({itineraryDays.length - 1} Days)</h3>
            <div className="space-y-3">

              {/* Total Pax */}
              <div className="flex items-center gap-2 flex-wrap">
                <Users size={18} className="text-gray-600 shrink-0" />
                <span className="font-bold">Total Pax:</span>
                {isEditing ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="text"
                      value={editableContent.adults}
                      onChange={(e) => handleEditChange("adults", e.target.value)}
                      className="w-12 px-2 py-1 border rounded text-center outline-none"
                      placeholder="02"
                    />
                    <span>Adults</span>
                    <input
                      type="text"
                      value={editableContent.children}
                      onChange={(e) => handleEditChange("children", e.target.value)}
                      className="w-12 px-2 py-1 border rounded text-center outline-none"
                      placeholder="02"
                    />
                    <span>Child</span>
                    <input
                      type="text"
                      value={editableContent.childrenAges}
                      onChange={(e) => handleEditChange("childrenAges", e.target.value)}
                      className="w-24 px-2 py-1 border rounded outline-none"
                      placeholder="(7,10yrs)"
                    />
                  </div>
                ) : (
                  <span>{editableContent.adults} Adults {editableContent.children} Child{editableContent.childrenAges}</span>
                )}
              </div>

              {/* Cost */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold">Transportation Cost: Rs</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableContent.transportationCost}
                    onChange={(e) => handleEditChange("transportationCost", e.target.value)}
                    className="w-24 px-2 py-1 border rounded outline-none"
                    placeholder="21,000"
                  />
                ) : (
                  <span className="text-xl font-bold text-green-600">{editableContent.transportationCost}/-</span>
                )}
                <span>(Inclusive All Taxes + All Sightseeing).</span>
              </div>

              {/* Vehicle */}
              <div className="flex items-center gap-2 flex-wrap">
                <Car size={18} className="text-gray-600 shrink-0" />
                <span className="font-bold">Vehicle:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableContent.vehicle}
                    onChange={(e) => handleEditChange("vehicle", e.target.value)}
                    className="w-48 px-2 py-1 border rounded outline-none"
                    placeholder="Maruti Dzire/Toyota Etios"
                  />
                ) : (
                  <span>{editableContent.vehicle}</span>
                )}
              </div>

              <p className="text-sm text-gray-600 italic">
                (Inclusive All Taxes, Driver Allowances, Driver Perk, Driver Messing charges, Parking, Fuel, Tolls, Inter State Taxes, No Other Hidden Charges.)
              </p>
            </div>
          </div>

          {/* Notes */}
          <div className="border border-gray-300 p-6 rounded-lg">
            <h3 className="font-bold text-xl mb-4">Also requesting you to:</h3>
            <div className="space-y-3 text-sm">
              {notes.map((note, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="font-bold text-black">{index + 1}.</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => updateNote(index, e.target.value)}
                      className="flex-1 border-b border-gray-200 outline-none text-gray-700"
                    />
                  ) : (
                    <span className="text-gray-700">{note}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-black text-white p-6 rounded-lg text-center">
            <p className="font-bold mb-4">
              We would be pleased to hear from you awaiting your immediate response
            </p>
            <div className="border-t border-gray-600 pt-4">
              <p>With Regards,</p>
              <div className="mt-2 space-y-1">
                {isEditing ? (
                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="text"
                      value={editableContent.contactPerson}
                      onChange={(e) => handleEditChange("contactPerson", e.target.value)}
                      className="px-2 py-1 border rounded text-black text-center outline-none"
                      placeholder="Ms Alisha"
                    />
                  </div>
                ) : (
                  <p className="font-bold">{editableContent.contactPerson}</p>
                )}
                <div className="flex items-center justify-center gap-2">
                  <Phone size={16} />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editableContent.contactNumber}
                      onChange={(e) => handleEditChange("contactNumber", e.target.value)}
                      className="px-2 py-1 border rounded text-black outline-none"
                      placeholder="+91-9805676866"
                    />
                  ) : (
                    <span>{editableContent.contactNumber}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};