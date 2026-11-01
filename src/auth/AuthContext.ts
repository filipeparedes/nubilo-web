import { createContext } from "react";

// What every component can read about the session.
export interface AuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  email: string | null; // Email of the logged-in user, null without a session
}

// null means "no provider above": useAuth() turns that into a clear error.
export const AuthContext = createContext<AuthContextValue | null>(null);
