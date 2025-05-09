"use client";

import Link from "next/link";
import { Lock, LogOut } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function AccountSettingsPage() {
  useRequireAuth(); // 未認証ならリダイレクト

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-24">アカウント設定</h1>

      <div className="flex flex-col sm:flex-row justify-center gap-40">
        {/* パスワード変更 */}
        <Link href="/password-change" className="group flex flex-col items-center justify-center border border-gray-300 rounded-2xl p-8 w-60 h-60 hover:shadow-md transition">
          <Lock size={96} className="text-gray-700 mb-12" />
          <span className="text-xl text-gray-700 group-hover:underline">パスワード変更</span>
        </Link>

        {/* 退会 */}
        <Link href="/delete-account" className="group flex flex-col items-center justify-center border border-gray-300 rounded-2xl p-8 w-60 h-60 hover:shadow-md transition">
          <LogOut size={96} className="text-gray-700 mb-12" />
          <span className="text-xl ext-gray-700 group-hover:underline">退会</span>
        </Link>
      </div>
    </div>
  );
}
