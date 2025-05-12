import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  variant?: "primary" | "secondary" | "outline" | "destructive" | "guest" | "pagination";
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
        return disabled
          ? "bg-red-800 text-white"
          : "bg-red-800 hover:bg-red-900 text-white";
      case "secondary":
        return disabled
          ? "bg-gray-700 text-white"
          : "bg-gray-700 hover:bg-gray-800 text-white";
      case "outline":
        return disabled
          ? "border border-gray-400 text-gray-400"
          : "border border-gray-400 text-gray-700 hover:bg-gray-100";
      case "destructive":
        return disabled
          ? "bg-gray-400 text-white"
          : "bg-red-600 hover:bg-red-700 text-white";
      case "guest":
        return disabled
          ? "border border-emerald-500 text-emerald-500"
          : "border border-emerald-500 text-emerald-500 hover:bg-emerald-50"
      case "pagination":
        return disabled
        ? "border border-gray-300 text-gray-400"
        : "border border-gray-400 text-gray-700 hover:bg-gray-100";
      default:
        return "";
    }
  })();

  const disabledStyles = disabled ? "opacity-70 cursor-not-allowed" : "";

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
