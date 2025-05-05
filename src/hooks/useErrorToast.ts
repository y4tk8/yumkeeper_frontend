"use client";

import { useEffect, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { showErrorToast } from "@/components/ui/shadcn/sonner";

// ステータスコード分岐でエラートーストを表示するフック
export const useErrorToast = () => {
  const context = useContext(AuthContext);

  // AuthProvider のラップ漏れチェック
  if (!context) {
    throw new Error("useErrorToast must be used within an AuthProvider");
  }

  const { isAuthenticated } = context;

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR対策

    const authError = sessionStorage.getItem("authError");
    const forbiddenError = sessionStorage.getItem("forbiddenError");

    if (!isAuthenticated && authError) {
      showErrorToast(authError);
      sessionStorage.removeItem("authError");
    }

    // 認証済み & authError有り ならセッションストレージから削除
    // NOTE: 初回マウントでAPIリクエストがある場合、`認証判定前` にauthErrorがセットされるため
    if (isAuthenticated && authError) {
      sessionStorage.removeItem("authError");
    }

    if (forbiddenError) {
      showErrorToast(forbiddenError);
      sessionStorage.removeItem("forbiddenError");
    }
  }, [isAuthenticated]);
};
