import { API_BASE_URL } from "@/config/api";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export const apiRequest = async <T>(
  path: string,
  method: RequestMethod,
  body?: Record<string, unknown>,
  authHeaders?: {
    accessToken: string;
    client: string;
    uid: string;
  }
): Promise<T> => {

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Devise Token Authの認証ヘッダー
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

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.errors ? data.errors.full_messages.join(", ") : "APIリクエストに失敗しました")
  }

  return data;
};
