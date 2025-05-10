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

  const {
    isAuthenticated,
    isAuthChecked,
    hasSignedOutOrDeleted,
    setHasSignedOutOrDeleted
  } = context;

  useEffect(() => {
    if (!isAuthChecked) return;

    if (!isAuthenticated) {
      // サインアウト直後 or 退会直後 は認証エラー扱いにしない
      if (hasSignedOutOrDeleted) {
        setHasSignedOutOrDeleted(false);
      } else {
        handleClientError(401);
      }
    }
  }, [isAuthenticated, isAuthChecked]);
};
