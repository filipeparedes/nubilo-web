import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// Gives access to the session: const { isAuthenticated, login, logout } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}