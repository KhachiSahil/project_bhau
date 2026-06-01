"use client"
import React, { useEffect, useState } from 'react';
import ItineraryForm, { FormData } from '@/components/Admin/Itenary/ItineraryForm';
import GenerateItenary from '@/components/Admin/Itenary/GenerateItenary';
import ViewItenary from '@/components/Admin/Itenary/ViewItenary';

const Itinerary: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    arrivalDate: '',
    endDate: '',
    destination: '',
    pickupPlace: '',
    dropPlace: '',
  });

  const [showGenerateItenary, setShowGenerateItenary] = useState(false);
  const [Itenary, setItenary] = useState<"View" | "Generate"| undefined>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (value: "View" | "Generate") => {
    const { arrivalDate, endDate, destination, pickupPlace, dropPlace } = formData;
    if (arrivalDate && endDate && destination && pickupPlace && dropPlace) {
      setItenary(value)
      setShowGenerateItenary(true);
    } else {
      alert('Please fill all fields.');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-start justify-center py-10">
      <div className="w-full max-w-xl p-6 border border-black rounded">
        <h1 className="text-2xl font-bold mb-6 text-center">Itinerary Builder</h1>
        <ItineraryForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} />
      </div>

      {/* Modal for displaying the final itinerary */}
      {(Itenary == "Generate") && showGenerateItenary && <GenerateItenary onClose={() => setShowGenerateItenary(false)} formData={formData} />}
      {(Itenary == "View") && showGenerateItenary && <ViewItenary onClose={() => setShowGenerateItenary(false)} formData={formData} />}
    </div>
  );
};

export default Itinerary;