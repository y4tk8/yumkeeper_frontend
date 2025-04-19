"use client";

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/api/apiClient";
import type { RequestMethod } from "@/lib/api/apiClient";

type RequestBody = Record<string, unknown> | undefined;

// カスタムフック
// NOTE: useContext で認証情報（authHeaders）を毎回のAPIリクエストで自動付与するため
export function useApiClient() {
  const context = useContext(AuthContext);

  // AuthProvider でのラップ漏れがあった際にエラーを出す
  if (!context) {
    throw new Error("useApiClient must be used within an AuthProvider.");
  }

  const { authHeaders, userId } = context;

  const request = (
    path: string,
    method: RequestMethod,
    body?: RequestBody,
  ) => {
    return apiRequest(path, method, body, authHeaders ?? undefined);
  };

  return { request, userId };
}
