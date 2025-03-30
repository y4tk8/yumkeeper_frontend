interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit";
  fullWidth?: boolean;
  variant?: "primary" | "outline";
}

export default function Button({
  children,
  type = "button",
  fullWidth = false,
  variant = "primary"
}: ButtonProps) {
  const baseStyles = "rounded-md px-4 py-2 font-semibold transition";
  const fullWidthStyle = fullWidth ? "w-full" : "w-auto";
  const variantStyles =
    variant === "primary"
      ? "bg-black text-white hover:bg-gray-800"
      : "border border-gray-400 text-gray-700 hover:bg-gray-100";

  return (
    <button type={type} className={`${baseStyles} ${fullWidthStyle} ${variantStyles}`}>
      {children}
    </button>
  );
}
