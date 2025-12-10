'use client';

interface FormInputProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function registrationForm({
  label,
  id,
  type = "text",
  value,
  onChange,
  required = false,
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
      />
    </div>
  );
}
