"use client";

import { useEffect, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useClientErrorHandler } from "@/hooks/useClientErrorHandler";

// 認証チェック用のフック
export function useRequireAuth() {
  const context = useContext(AuthContext);
  const { handleClientError } = useClientErrorHandler();

  // AuthProvider のラップ漏れチェック
  if (!context) {
    throw new Error("useRequireAuth must be used within an AuthProvider");
  }

  const { isAuthenticated, isAuthChecked } = context;

  useEffect(() => {
    if (!isAuthChecked) return;

    if (!isAuthenticated) {
      handleClientError(401);
    }
  }, [isAuthenticated, isAuthChecked]);
};
