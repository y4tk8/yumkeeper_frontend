"use client";

import { useEffect } from "react";
import { showErrorToast } from "@/components/ui/shadcn/sonner";

// ステータスコード分岐でエラートーストを表示するフック
export const useErrorToast = () => {
  useEffect(() => {
    if (typeof window === "undefined") return; // SSR対策

    const authError = sessionStorage.getItem("authError");
    const forbiddenError = sessionStorage.getItem("forbiddenError");

    if (authError) {
      showErrorToast(authError);
      sessionStorage.removeItem("authError");
    } else if (forbiddenError) {
      showErrorToast(forbiddenError);
      sessionStorage.removeItem("forbiddenError");
    }
  }, []);
}
