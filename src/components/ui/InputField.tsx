import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
  placeholder: string;
}

export default function InputField({
  type,
  placeholder,
  ...rest
}: InputFieldProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-md border border-black px-4 py-2"
      {...rest}
    />
  );
}
