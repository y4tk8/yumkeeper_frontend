"use client";

import { useRouter } from "next/navigation";
import { showErrorToast } from "@/components/ui/shadcn/sonner";

export function useClientErrorHandler() {
  const router = useRouter();

  // `4xx系` のエラーハンドリング関数
  function handleClientError(status: number, message?: string) {
    switch(status) {
      case 401:
        sessionStorage.setItem("authError", "ログインが必要です");
        router.push("/signin");
        break;

      case 403:
        sessionStorage.setItem("forbiddenError", "アクセス権限がありません");
        router.push("/recipes/index");
        break;

      case 422:
        showErrorToast(message || "入力内容に不備があります");
        break;

      default:
        if (process.env.NODE_ENV !== "production") {
          console.warn(`Unhandled status: ${status}`);
        }
        showErrorToast("予期せぬエラーが発生しました");
        break;
    }
  }

  return { handleClientError };
}
