import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { login as loginRequest, logout as logoutRequest } from "../api/auth";
import { getToken, setToken, setUnauthorizedHandler } from "../api/client";
import { AuthContext } from "./AuthContext";

// Holds the session for the whole app. The token itself lives in
// localStorage (see api/client.ts). Here we keep a copy in state so
// that React re-renders when the session starts or ends.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(getToken);

  // When the server rejects the token (401), end the session in the UI too.
  useEffect(() => {
    setUnauthorizedHandler(() => setTokenState(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token } = await loginRequest(email, password);
    setToken(token);
    setTokenState(token);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      // Even if the server cannot be reached, the user leaves locally.
      setToken(null);
      setTokenState(null);
    }
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated: token !== null, login, logout }),
    [token, login, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}