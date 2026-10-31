import { request } from "./client";
import { ENDPOINTS } from "./endpoints";

// Creates an account. Doesn't log the user in.
export function register(email: string, password: string) {
  return request<unknown>(ENDPOINTS.register, {
    method: "POST",
    body: { email, password },
  });
}

// Returns the session token. The caller stores it with setToken().
export function login(email: string, password: string) {
  return request<{ token: string }>(ENDPOINTS.login, {
    method: "POST",
    body: { email, password },
  });
}

// Ends the session on the server. The caller clears the local token.
export function logout() {
  return request<void>(ENDPOINTS.logout, { method: "POST" });
}
