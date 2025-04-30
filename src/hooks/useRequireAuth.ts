"use client";

import { useEffect, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { handleClientError } from "@/utils/handleClientError";

// 認証チェック用のフック
export function useRequireAuth() {
  const context = useContext(AuthContext);

  // AuthProvider でのラップ漏れがあった際にエラーを出す
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
