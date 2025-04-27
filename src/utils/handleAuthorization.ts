"use client";

import { redirect } from "next/navigation";
import { showErrorToast } from "@/components/ui/shadcn/sonner";

// 認証・認可のエラーハンドリング関数
export function handleAuthorization(status: number, message?: string) {
  if (typeof window === "undefined") return; // SSR対策

  switch (status) {
    case 401:
      sessionStorage.setItem("authError", "ログインが必要です");
      redirect("/signin");

    case 403:
      sessionStorage.setItem("forbiddenError", message || "アクセス権限がありません");
      redirect("/");

    case 422:
      showErrorToast(message || "入力内容に不備があります");
      break;

    default:
      console.warn(`Unhandled status: ${status}`);
      showErrorToast("予期せぬエラーが発生しました");
      break;
  }
}
