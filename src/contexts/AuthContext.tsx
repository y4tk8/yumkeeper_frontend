"use client";

import { createContext, useState } from "react";

type AuthContextType = {
  authHeaders: {
    accessToken: string;
    client: string;
    uid: string;
  } | null;
  setAuthHeaders: (headers: AuthContextType["authHeaders"]) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authHeaders, setAuthHeaders] = useState<AuthContextType["authHeaders"]>(null);

  return (
    <AuthContext.Provider value={{ authHeaders, setAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  );
}
