import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getToken, setToken, setUnauthorizedHandler } from "../api/client";
import {
  login as loginRequest,
  logout as logoutRequest,
} from "../api/resources/auth";
import { AuthContext } from "./AuthContext";

const EMAIL_KEY = "nubilo.email";

// Holds the session for the whole app. The token itself lives in
// localStorage (see api/client.ts). Here we keep a copy in state so
// that React re-renders when the session starts or ends.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(getToken);
  const [email, setEmail] = useState<string | null>(() =>
    localStorage.getItem(EMAIL_KEY),
  );

  // The email is only kept while there is a session.
  const forgetEmail = useCallback(() => {
    localStorage.removeItem(EMAIL_KEY);
    setEmail(null);
  }, []);

  // When the server rejects the token (401), end the session in the UI too.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setTokenState(null);
      forgetEmail();
    });
    return () => setUnauthorizedHandler(null);
  }, [forgetEmail]);

  const login = useCallback(async (userEmail: string, password: string) => {
    const { token } = await loginRequest(userEmail, password);
    setToken(token);
    setTokenState(token);
    localStorage.setItem(EMAIL_KEY, userEmail);
    setEmail(userEmail);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      // Even if the server cannot be reached, the user leaves locally.
      setToken(null);
      setTokenState(null);
      forgetEmail();
    }
  }, [forgetEmail]);

  const value = useMemo(
    () => ({ isAuthenticated: token !== null, email, login, logout }),
    [token, email, login, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
