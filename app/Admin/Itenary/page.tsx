"use client"
import React, { useState } from 'react';
import ItineraryForm, { FormData } from '@/components/Admin/Itenary/ItineraryForm';
import {ItineraryModal} from '@/components/Admin/Itenary/ItineraryDisplay';

const Itinerary: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    arrivalDate: '',
    endDate: '',
    destination: '',
    pickupPlace: '',
    dropPlace: '',
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const { arrivalDate, endDate, destination, pickupPlace, dropPlace } = formData;
    if (arrivalDate && endDate && destination && pickupPlace && dropPlace) {
      setShowModal(true);
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
      <ItineraryModal show={showModal} onClose={() => setShowModal(false)} formData={formData} />
    </div>
  );
};

export default Itinerary;
