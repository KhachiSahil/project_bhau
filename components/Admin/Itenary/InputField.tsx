import React from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-black mb-1">{label}:</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-black rounded bg-white text-black focus:outline-none focus:ring-1 focus:ring-black"
      />
    </div>
  );
};

export default InputField;
