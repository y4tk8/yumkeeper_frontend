import React, { useState} from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
  placeholder: string;
  value: string;
}

export default function InputField({
  type,
  placeholder,
  value,
  ...rest
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";
  const hasValue = typeof value === "string" && value.length > 0;

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : type}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-400 px-4 py-2 pr-10"
        value={value}
        {...rest}
      />

      {isPasswordType && hasValue && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
}
