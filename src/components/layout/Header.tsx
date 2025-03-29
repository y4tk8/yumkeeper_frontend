"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-100 shadow-md">
      <Link href="/">
        <h1 className="text-xl font-bold">Yum Keeper</h1>
      </Link>
      <nav>
        <ul className="flex gap-4">
          <li><Link href="/signin">サインイン</Link></li>
        </ul>
      </nav>
    </header>
  );
}
