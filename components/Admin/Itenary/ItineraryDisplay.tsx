import React, { useState } from 'react';
import { X, Edit3, Save, Users, Car, Phone, Download } from 'lucide-react';

interface FormData {
  arrivalDate: string;
  endDate: string;
  destination: string;
  pickupPlace: string;
  dropPlace: string;
}

interface ModalProps {
  show: boolean;
  onClose: () => void;
  formData: FormData;
}

interface EditableContent {
  totalPax: string;
  adults: string;
  children: string;
  childrenAges: string;
  transportationCost: string;
  vehicle: string;
  contactPerson: string;
  contactNumber: string;
}

export const ItineraryModal: React.FC<ModalProps> = ({ show, onClose, formData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState<EditableContent>({
    totalPax: '04',
    adults: '02',
    children: '02',
    childrenAges: '(7,10yrs)',
    transportationCost: '21,000',
    vehicle: 'Maruti Dzire/Toyota Etios',
    contactPerson: 'Ms Alisha',
    contactNumber: '+91-9805676866'
  });

  if (!show) return null;

  const {
    arrivalDate,
    endDate,
    destination,
    pickupPlace,
    dropPlace,
  } = formData;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    
    const getOrdinal = (n: number) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    
    return `${getOrdinal(day)} ${month} ${year}`;
  };

  const formattedArrival = formatDate(arrivalDate);
  const formattedEnd = formatDate(endDate);

  const calculateDistance = (from: string, to: string) => {
    // Sample distance calculations - you can replace with actual logic
    const distances: { [key: string]: number } = {
      'amritsar-dalhousie': 202,
      'dalhousie-dharamshala': 130,
      'dharamshala-palampur': 50,
      'dharamshala-amritsar': 202
    };
    
    const key = `${from.toLowerCase()}-${to.toLowerCase()}`;
    return distances[key] || 150;
  };

  const generateDynamicItinerary = () => {
    const startDate = new Date(arrivalDate);
    const endDate = new Date(formData.endDate);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const itinerary = [];
    
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const formattedDate = formatDate(currentDate.toISOString());
      
      if (i === 0) {
        // First day
        const distance = calculateDistance(pickupPlace, destination);
        itinerary.push({
          day: i + 1,
          date: formattedDate,
          title: `${pickupPlace} To ${destination}(${distance} KM, 5-6 HRS)`,
          description: `After arrival at ${pickupPlace} we will drive for ${destination}. Evening is free to Visit Market. Overnight stay at Hotel.`
        });
      } else if (i === totalDays - 1) {
        // Last day
        const distance = calculateDistance(destination, dropPlace);
        itinerary.push({
          day: i + 1,
          date: formattedDate,
          title: `${destination} – ${dropPlace}(${distance} Kms, 5-6 Hours)`,
          description: `Today morning after breakfast we will drive for ${dropPlace}. After reaching check-in the hotel at ${dropPlace}. End of memorable tour and services.`
        });
      } else {
        // Middle days - sightseeing
        itinerary.push({
          day: i + 1,
          date: formattedDate,
          title: `${destination} Local Sightseeing`,
          description: `Today after breakfast we will take you to visit famous attractions in ${destination}. Visit local temples, markets, viewpoints, and cultural sites. Evening free to explore. Overnight stay at Hotel.`
        });
      }
    }
    
    return itinerary;
  };

  const itineraryDays = generateDynamicItinerary();

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleEditChange = (field: keyof EditableContent, value: string) => {
    setEditableContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const totalDays = itineraryDays.length;
    const termsAndConditions = [
      "Kindly carry a valid photo id card along while you will be on tour.",
      "Kindly let us know if any query is there pertaining to the tour itinerary. We have offered you an almost very clear and transparent tour program.",
      "Kindly provide us your Pick up and Dropping Time",
      "We hope the above-mentioned sightseeing is in order as per your requirement.",
      "Rohtang Pass sightseeing as per Govt. & NGT Guidelines. If required payable extra on the spot on a current condition basis, Violation of any rules & regulations is subject to penalty.",
      "A.C services will be switched off on Himachal roads.",
      "A.C charge for a whole day in the hill area will be Rs 1,000/- per day for Tempo Traveller, Rs 700/- per day for Toyota Innova/SUV/MUV, Rs 500/- per day for Toyota Etios/Swift Dzire/Sedan.",
      "Cab operator service hours for local sightseeing from 09 am to 6 pm.",
      "From the safety point of view, you are requested to avoid late-night walks.",
      "You are requested to consider all sightseeing as per the time and travel schedule.",
      "Change/addition in itinerary/sightseeing may increase cost w.r.t distance.",
      "Kindly take Hotel within 7 km from the main city otherwise it may cost extra w.r.t. distance."
    ];

    const html = `
      <html>
        <head>
          <title>Tour Itinerary</title>
          <style>
            body { 
              font-family: 'Segoe UI', Arial, sans-serif; 
              padding: 30px; 
              color: #000; 
              background: #fff; 
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #333;
              margin-bottom: 10px;
            }
            .document-title {
              font-size: 18px;
              color: #666;
            }
            .greeting {
              text-align: center;
              margin: 30px 0;
            }
            .greeting p {
              margin: 15px 0;
              font-weight: bold;
            }
            .section-title {
              font-size: 20px;
              font-weight: bold;
              color: #333;
              margin: 30px 0 15px 0;
              border-bottom: 1px solid #ccc;
              padding-bottom: 5px;
            }
            .day-item {
              margin: 25px 0;
              padding: 15px;
              border-left: 4px solid #333;
              background: #f8f9fa;
            }
            .day-title {
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 10px;
              color: #333;
            }
            .day-description {
              color: #555;
              line-height: 1.6;
            }
            .transport-section {
              background: #f0f0f0;
              padding: 20px;
              border-radius: 8px;
              margin: 30px 0;
            }
            .transport-item {
              margin: 10px 0;
              font-weight: bold;
            }
            .cost-highlight {
              color: #28a745;
              font-size: 18px;
            }
            .terms-section {
              border: 1px solid #ddd;
              padding: 20px;
              border-radius: 8px;
              margin: 30px 0;
            }
            .term-item {
              margin: 12px 0;
              display: flex;
              align-items: flex-start;
            }
            .term-number {
              font-weight: bold;
              margin-right: 10px;
              min-width: 20px;
            }
            .contact-section {
              background: #333;
              color: white;
              padding: 25px;
              text-align: center;
              border-radius: 8px;
              margin-top: 30px;
            }
            .contact-section p {
              margin: 10px 0;
            }
            .signature {
              border-top: 1px solid #666;
              padding-top: 15px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Himachal Taxi Rental Service</div>
            <div class="document-title">Tour Itinerary & Cost</div>
          </div>
          
          <div class="greeting">
            <p><strong>Dear Sir,</strong></p>
            <p><strong>Greetings from Himachal Taxi Rental Service……</strong></p>
            <p><strong>Please find the below Tour Itinerary & Cost:</strong></p>
          </div>

          <div class="section-title">Itinerary:</div>
          ${itineraryDays.map(day => `
            <div class="day-item">
              <div class="day-title">Day ${String(day.day).padStart(2, '0')}: ${day.date} ~ ${day.title}</div>
              <div class="day-description">${day.description}</div>
            </div>
          `).join('')}

          <div class="transport-section">
            <div class="section-title">Transportation (${String(totalDays - 1).padStart(2, '0')} Days)</div>
            <div class="transport-item">
              <strong>Total Pax:</strong> ${editableContent.adults} Adults ${editableContent.children} Child${editableContent.childrenAges}
            </div>
            <div class="transport-item">
              <strong>Transportation Cost:</strong> <span class="cost-highlight">Rs ${editableContent.transportationCost}/-</span> (Inclusive All Taxes + All Sightseeing).
            </div>
            <div class="transport-item">
              <strong>Vehicle:</strong> ${editableContent.vehicle}
            </div>
            <p style="font-style: italic; color: #666; margin-top: 15px;">
              (Inclusive All Taxes, Driver Allowances, Driver Perk, Driver Messing charges, Parking, Fuel, Tolls, Inter State Taxes, No Other Hidden Charges.)
            </p>
          </div>

          <div class="terms-section">
            <div class="section-title">Also requesting you to:</div>
            ${termsAndConditions.map((term, index) => `
              <div class="term-item">
                <span class="term-number">${index + 1}.</span>
                <span>${term}</span>
              </div>
            `).join('')}
          </div>

          <div class="contact-section">
            <p><strong>We would be pleased to hear from you awaiting your immediate response</strong></p>
            <div class="signature">
              <p>With Regards,</p>
              <p><strong>${editableContent.contactPerson}</strong></p>
              <p><strong>${editableContent.contactNumber}</strong></p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

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
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <Download size={16} />
              Export PDF
            </button>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="flex items-center gap-2 px-3 py-2 bg-white text-black rounded hover:bg-gray-100 transition-colors text-sm"
            >
              {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
              {isEditing ? 'Save' : 'Edit'}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
          
          {/* Greeting */}
          <div className="text-center">
            <p className="font-bold text-lg">Dear Sir,</p>
            <p className="mt-2 font-bold">Greetings from Himachal Taxi Rental Service……</p>
            <p className="mt-2 font-bold">Please find the below Tour Itinerary & Cost:</p>
          </div>

          {/* Itinerary Section */}
          <div>
            <h3 className="font-bold text-xl mb-4">Itinerary:</h3>
            <div className="space-y-6">
              {itineraryDays.map((day, index) => (
                <div key={index} className="border-l-4 border-black pl-4">
                  <h4 className="font-bold text-lg mb-2">
                    Day {String(day.day).padStart(2, '0')}: {day.date} ~ {day.title}
                  </h4>
                  <p className="text-gray-800 leading-relaxed">{day.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transportation Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-xl mb-4">Transportation ({itineraryDays.length - 1} Days)</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-gray-600" />
                <span className="font-bold">Total Pax: </span>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editableContent.adults}
                      onChange={(e) => handleEditChange('adults', e.target.value)}
                      className="w-12 px-2 py-1 border rounded text-center"
                      placeholder="02"
                    />
                    <span>Adults</span>
                    <input
                      type="text"
                      value={editableContent.children}
                      onChange={(e) => handleEditChange('children', e.target.value)}
                      className="w-12 px-2 py-1 border rounded text-center"
                      placeholder="02"
                    />
                    <span>Child</span>
                    <input
                      type="text"
                      value={editableContent.childrenAges}
                      onChange={(e) => handleEditChange('childrenAges', e.target.value)}
                      className="w-24 px-2 py-1 border rounded"
                      placeholder="(7,10yrs)"
                    />
                  </div>
                ) : (
                  <span>{editableContent.adults} Adults {editableContent.children} Child{editableContent.childrenAges}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold">Transportation Cost: Rs </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableContent.transportationCost}
                    onChange={(e) => handleEditChange('transportationCost', e.target.value)}
                    className="w-24 px-2 py-1 border rounded"
                    placeholder="21,000"
                  />
                ) : (
                  <span className="text-xl font-bold text-green-600">{editableContent.transportationCost}/-</span>
                )}
                <span>(Inclusive All Taxes + All Sightseeing).</span>
              </div>

              <div className="flex items-center gap-2">
                <Car size={18} className="text-gray-600" />
                <span className="font-bold">Vehicle: </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableContent.vehicle}
                    onChange={(e) => handleEditChange('vehicle', e.target.value)}
                    className="w-48 px-2 py-1 border rounded"
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

          {/* Important Notes */}
          <div className="border border-gray-300 p-6 rounded-lg">
            <h3 className="font-bold text-xl mb-4">Also requesting you to:</h3>
            <div className="space-y-3 text-sm">
              {[
                "Kindly carry a valid photo id card along while you will be on tour.",
                "Kindly let us know if any query is there pertaining to the tour itinerary. We have offered you an almost very clear and transparent tour program.",
                "Kindly provide us your Pick up and Dropping Time",
                "We hope the above-mentioned sightseeing is in order as per your requirement.",
                "Rohtang Pass sightseeing as per Govt. & NGT Guidelines. If required payable extra on the spot on a current condition basis, Violation of any rules & regulations is subject to penalty.",
                "A.C services will be switched off on Himachal roads.",
                "A.C charge for a whole day in the hill area will be Rs 1,000/- per day for Tempo Traveller, Rs 700/- per day for Toyota Innova/SUV/MUV, Rs 500/- per day for Toyota Etios/Swift Dzire/Sedan.",
                "Cab operator service hours for local sightseeing from 09 am to 6 pm.",
                "From the safety point of view, you are requested to avoid late-night walks.",
                "You are requested to consider all sightseeing as per the time and travel schedule.",
                "Change/addition in itinerary/sightseeing may increase cost w.r.t distance.",
                "Kindly take Hotel within 7 km from the main city otherwise it may cost extra w.r.t. distance."
              ].map((note, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="font-bold text-black">{index + 1}.</span>
                  <span className="text-gray-700">{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Closing & Contact */}
          <div className="bg-black text-white p-6 rounded-lg text-center">
            <p className="font-bold mb-4">We would be pleased to hear from you awaiting your immediate response</p>
            <div className="border-t border-gray-600 pt-4">
              <p>With Regards,</p>
              <div className="mt-2 space-y-1">
                {isEditing ? (
                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="text"
                      value={editableContent.contactPerson}
                      onChange={(e) => handleEditChange('contactPerson', e.target.value)}
                      className="px-2 py-1 border rounded text-black text-center"
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
                      onChange={(e) => handleEditChange('contactNumber', e.target.value)}
                      className="px-2 py-1 border rounded text-black"
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