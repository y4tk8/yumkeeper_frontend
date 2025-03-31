import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-400">
      <div className="w-full max-w-xl rounded-lg border border-gray-300 bg-white p-6 shadow-md">
        {children}
      </div>
    </div>
  );
}
