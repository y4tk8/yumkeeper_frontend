"use client";

import { createContext, useState, useEffect } from "react";

interface AuthHeaders {
  accessToken: string;
  client: string;
  uid: string;
}

interface AuthContextType {
  authHeaders: AuthHeaders | null;
  userId: number | null;
  setAuthHeaders: (headers: AuthHeaders | null) => void;
  setUserId: (id: number | null) => void;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authHeaders, setAuthHeadersState] = useState<AuthHeaders | null>(null);
  const [userId, setUserIdState] = useState<number | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Context と localStorage に認証情報を保存する関数
  const setAuthHeaders = (headers: AuthHeaders | null) => {
    setAuthHeadersState(headers);
    if (headers) {
      localStorage.setItem("authHeaders", JSON.stringify(headers));
    } else {
      localStorage.removeItem("authHeaders");
    }
  };

  // Context と localStorage にユーザーIDを保存する関数
  const setUserId = (id: number | null) => {
    setUserIdState(id);
    if (id !== null) {
      localStorage.setItem("authUserId", String(id));
    } else {
      localStorage.removeItem("authUserId");
    }
  };

  // 初回マウント時に localStorage から認証情報とユーザーIDを復元
  useEffect(() => {
    const storedHeaders = localStorage.getItem("authHeaders");
    const storedUserId = localStorage.getItem("authUserId");

    if (storedHeaders) {
      try {
        setAuthHeadersState(JSON.parse(storedHeaders));
      } catch (e) {
        console.error("認証情報の読み込みに失敗しました", e);
      }
    }

    if (storedUserId) {
      const id = Number(storedUserId);
      if (!isNaN(id)) {
        setUserIdState(id);
      }
    }

    setIsAuthChecked(true);
  }, []);

  // 認証情報とユーザーIDがtrue -> サインイン済み
  const isAuthenticated = !!authHeaders && !!userId;

  return (
    <AuthContext.Provider
      value={{
        authHeaders,
        userId,
        setAuthHeaders,
        setUserId,
        isAuthenticated,
        isAuthChecked,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
