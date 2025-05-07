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
  userRole: string | null;
  setAuthHeaders: (headers: AuthHeaders | null) => void;
  setUserId: (id: number | null) => void;
  setUserRole: (role: string | null) => void;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authHeaders, setAuthHeadersState] = useState<AuthHeaders | null>(null);
  const [userId, setUserIdState] = useState<number | null>(null);
  const [userRole, setUserRoleState] = useState<string | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // State と localStorage に認証情報を保存する関数
  const setAuthHeaders = (headers: AuthHeaders | null) => {
    setAuthHeadersState(headers);
    if (headers) {
      localStorage.setItem("authHeaders", JSON.stringify(headers));
    } else {
      localStorage.removeItem("authHeaders");
    }
  };

  // State と localStorage にユーザーIDを保存する関数
  const setUserId = (id: number | null) => {
    setUserIdState(id);
    if (id !== null) {
      localStorage.setItem("userId", String(id));
    } else {
      localStorage.removeItem("userId");
    }
  };

  // role: "ゲスト" の場合、認証情報 & ユーザーID と共にローカル保存する関数
  const setUserRole = (role: string | null) => {
    setUserRoleState(role);
    if (role !== null) {
      localStorage.setItem("userRole", role);
    } else {
      localStorage.removeItem("userRole");
    }
  };

  // 初回マウント時に localStorage から復元
  useEffect(() => {
    const storedHeaders = localStorage.getItem("authHeaders");
    const storedUserId = localStorage.getItem("userId");
    const storedUserRole = localStorage.getItem("userRole");

    if (storedHeaders) {
      try {
        setAuthHeadersState(JSON.parse(storedHeaders));
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          console.error("認証トークンの読み込みエラー", e);
        }
      }
    }

    if (storedUserId) {
      const id = Number(storedUserId);
      if (!isNaN(id)) {
        setUserIdState(id);
      }
    }

    if (storedUserRole) {
      setUserRoleState(storedUserRole);
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
        userRole,
        setAuthHeaders,
        setUserId,
        setUserRole,
        isAuthenticated,
        isAuthChecked,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
