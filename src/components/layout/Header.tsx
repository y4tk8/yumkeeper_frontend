"use client";

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Header() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useApiClient must be used within an AuthProvider.");
  }

  const { authHeaders } = context;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-100 shadow-md flex items-center justify-between p-4">
      <Link href="/">
        <h1 className="text-xl font-bold">Yum Keeper</h1>
      </Link>
      <nav>
        <ul className="flex gap-4">
          {authHeaders ? "サインイン中" : ""}
          <li><Link href="/signin">サインイン</Link></li>
        </ul>
      </nav>
    </header>
  );
}
