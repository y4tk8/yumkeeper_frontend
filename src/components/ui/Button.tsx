import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  variant?: "primary" | "outline" | "destructive" | "pagination";
  className?: string;
  disabled?: boolean;
}

export default function Button({
  fullWidth = false,
  variant = "primary",
  className,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const baseStyles = "rounded-md px-4 py-2 font-semibold transition";
  const fullWidthStyle = fullWidth ? "w-full" : "w-auto";

  const variantStyles = (() => {
    switch (variant) {
      case "primary":
        return "bg-black text-white hover:bg-gray-800";
      case "outline":
        return "border border-gray-400 text-gray-700 hover:bg-gray-100";
      case "destructive":
        return "bg-red-600 text-white hover:bg-red-700";
      case "pagination":
        return "border border-gray-300 text-gray-700 hover:bg-gray-100";
      default:
        return "";
    }
  })();

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      className={clsx(baseStyles, fullWidthStyle, variantStyles, disabledStyles, className)}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
