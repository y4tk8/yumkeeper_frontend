"use client";

import { createContext, useState, useEffect } from "react";

interface AuthHeaders {
  accessToken: string;
  client: string;
  uid: string;
}

type AuthContextType = {
  authHeaders: AuthHeaders | null;
  setAuthHeaders: (headers: AuthHeaders | null) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authHeaders, setAuthHeadersState] = useState<AuthHeaders | null>(null);

  // Context状態 と localStorage の両方に認証情報を保存する関数
  const setAuthHeaders = (headers: AuthHeaders | null) => {
    setAuthHeadersState(headers);
    if (headers) {
      localStorage.setItem("authHeaders", JSON.stringify(headers));
    } else {
      localStorage.removeItem("authHeaders");
    }
  };

  // 初回マウント時に localStorage から認証情報を復元
  useEffect(() => {
    const stored = localStorage.getItem("authHeaders");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthHeaders;
        setAuthHeadersState(parsed);
      } catch (e) {
        console.error("認証情報の読み込みに失敗しました", e);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authHeaders, setAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  );
}
