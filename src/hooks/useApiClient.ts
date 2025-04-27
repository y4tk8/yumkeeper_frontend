"use client";

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/apiClient";
import type { RequestMethod } from "@/lib/apiClient";

type RequestBody = Record<string, unknown> | undefined;

// 認証情報（authHeaders）を毎回のAPIリクエストで自動付与するためのフック
export function useApiClient() {
  const context = useContext(AuthContext);

  // AuthProvider でのラップ漏れがあった際にエラーを出す
  if (!context) {
    throw new Error("useApiClient must be used within an AuthProvider");
  }

  const { authHeaders, userId } = context;

  const request = <T = Record<string, unknown>>(
    path: string,
    method: RequestMethod,
    body?: RequestBody,
  ) => {
    return apiRequest<T>(path, method, body, authHeaders ?? undefined);
  };

  return { request, userId };
}
