import { API_BASE_URL } from "@/config/api";

export type RequestMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export interface ApiResponse<T = Record<string, unknown>> {
  ok: boolean;
  status: number;
  data: T;
  headers: Headers;
}

interface AuthHeaders {
  accessToken: string;
  client: string;
  uid: string;
}

export const apiRequest = async <T = Record<string, unknown>>(
  path: string,
  method: RequestMethod,
  body?: Record<string, unknown>,
  authHeaders?: AuthHeaders,
): Promise<ApiResponse<T>> => {

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Devise Token Auth の認証情報をリクエストヘッダーに付与
  if (authHeaders) {
    headers["access-token"] = authHeaders.accessToken;
    headers["client"] = authHeaders.client;
    headers["uid"] = authHeaders.uid;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get("content-type");
  let data: T;

  // レスポンスが JSON 以外の場合の保険
  if (contentType?.includes("application/json")) {
    data = await response.json();
  } else {
    data = {} as T;
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
    headers: response.headers,
  };
};
