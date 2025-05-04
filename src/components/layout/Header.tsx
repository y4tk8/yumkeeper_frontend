"use client";

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Header() {
  const context = useContext(AuthContext);

  // AuthProvider でのラップ漏れがあった際にエラーを出す
  if (!context) {
    throw new Error("Header must be used within an AuthProvider.");
  }

  const { authHeaders } = context;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-100 shadow-md flex items-center justify-between px-24 py-4">
      <Link href="/">
        <h1 className="text-2xl font-bold">Yum Keeper</h1>
      </Link>
      <nav>
        <ul className="flex items-center gap-4">
          {authHeaders && <li>ログイン中</li>}

          <li>
            <Link href="/signup">
              <button className="px-4 py-2 rounded-full bg-black text-white hover:bg-gray-700 transition">
                登録する
              </button>
            </Link>
          </li>

          <li>
            <Link href="/signin" className="hover:underline">ログイン</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
