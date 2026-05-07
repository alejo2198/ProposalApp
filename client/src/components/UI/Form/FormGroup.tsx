import type { InputHTMLAttributes } from "react";

interface FormGroupProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export default function FormGroup({
  label,
  id,
  className,
  ...inputProps
}: FormGroupProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 block mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className ?? ""}`.trim()}
        {...inputProps}
      />
    </div>
  );
}
