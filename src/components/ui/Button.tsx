import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  variant?: "primary" | "outline";
}

export default function Button({
  fullWidth = false,
  variant = "primary",
  children,
  ...rest
}: ButtonProps) {
  const baseStyles = "rounded-md px-4 py-2 font-semibold transition";
  const fullWidthStyle = fullWidth ? "w-full" : "w-auto";
  const variantStyles =
    variant === "primary"
      ? "bg-black text-white hover:bg-gray-800"
      : "border border-gray-400 text-gray-700 hover:bg-gray-100";

  return (
    <button
      className={`${baseStyles} ${fullWidthStyle} ${variantStyles}`}
      {...rest}
    >
      {children}
    </button>
  );
}
