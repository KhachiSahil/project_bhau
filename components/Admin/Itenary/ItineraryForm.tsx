import React from 'react';
import InputField from './InputField';

export interface FormData {
  arrivalDate: string;
  endDate: string;
  destination: string;
  pickupPlace: string;
  dropPlace: string;
}

interface ItineraryFormProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const ItineraryForm: React.FC<ItineraryFormProps> = ({ formData, onChange, onSubmit }) => {
  return (
    <div className="space-y-4">
      <InputField
        label="Arrival Date"
        name="arrivalDate"
        value={formData.arrivalDate}
        onChange={onChange}
        type="date"
      />
      <InputField
        label="End Date"
        name="endDate"
        value={formData.endDate}
        onChange={onChange}
        type="date"
      />
      <InputField
        label="Destination"
        name="destination"
        value={formData.destination}
        onChange={onChange}
        placeholder="e.g., Himachal Pradesh"
      />
      <InputField
        label="Pickup Place"
        name="pickupPlace"
        value={formData.pickupPlace}
        onChange={onChange}
        placeholder="e.g., Chandigarh Airport"
      />
      <InputField
        label="Drop Place"
        name="dropPlace"
        value={formData.dropPlace}
        onChange={onChange}
        placeholder="e.g., Chandigarh Railway Station"
      />
      <div className='flex gap-2'>
        <button
          onClick={onSubmit}
          className="w-full mt-4 bg-black text-white font-semibold py-2 px-4 rounded hover:bg-gray-900"
        >
          View Itinerary
        </button>
        <button
          onClick={onSubmit}
          className="w-full mt-4 bg-black text-white font-semibold py-2 px-4 rounded hover:bg-gray-900"
        >
          Generate Itinerary
        </button>
      </div>
    </div>
  );
};

export default ItineraryForm;
