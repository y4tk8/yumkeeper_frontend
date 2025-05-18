import React, { useState} from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
  placeholder: string;
  value: string;
  errorMessages?: string[];
}

export default function InputField({
  type,
  placeholder,
  value,
  errorMessages = [],
  ...rest
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";
  const hasValue = typeof value === "string" && value.trim().length > 0;
  const showToggleButton = isPasswordType && hasValue && (!errorMessages || errorMessages.length === 0);

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : type}
        placeholder={placeholder}
        value={value}
        className={`w-full rounded-md border px-4 py-2 pr-10 ${
          errorMessages.length > 0 ? "border-red-500" : "border-gray-400"
        }`}
        {...rest}
      />
      {errorMessages.length > 0 && (
        <div className="text-sm text-red-600 space-y-1 mt-2">
          {errorMessages.map((msg, idx) => (
            <div key={idx}>{msg}</div>
          ))}
        </div>
      )}

      {showToggleButton && (
        <button
          type="button"
          aria-label="パスワード表示切り替え"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
}
