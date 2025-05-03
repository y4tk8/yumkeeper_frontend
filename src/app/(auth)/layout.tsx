import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-2xl rounded-lg border border-gray-300 bg-white p-10 shadow-md">
        {children}
      </div>
    </div>
  );
}
