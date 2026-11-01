import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../routes";
import { useAuth } from "../hooks/useAuth";

// Wraps the routes that need a session. Without one, the user goes to
// the login page. <Outlet /> is where the wrapped pages are drawn.
export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.login} replace />;
}
