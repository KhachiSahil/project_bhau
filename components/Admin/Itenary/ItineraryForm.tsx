import React from 'react';
import InputField from './InputField';

export interface FormData {
  days: number;
  destination: string;
  pickupPlace: string;
  dropPlace: string;
}

interface ItineraryFormProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (value : "View" | "Generate") => void;
}

const ItineraryForm: React.FC<ItineraryFormProps> = ({ formData, onChange, onSubmit }) => {
  return (
    <div className="space-y-4">
      <InputField
        label="Days"
        name="days"
        min = {1}
        value={String(formData.days)}
        onChange={onChange}
        type="number"
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
          onClick={()=>onSubmit("View")}
          className="w-full mt-4 bg-black text-white font-semibold py-2 px-4 rounded hover:bg-gray-900"
        >
          View Itinerary
        </button>
        <button
          onClick={()=>onSubmit("Generate")}
          className="w-full mt-4 bg-black text-white font-semibold py-2 px-4 rounded hover:bg-gray-900"
        >
          Generate Itinerary
        </button>
      </div>
    </div>
  );
};

export default ItineraryForm;
