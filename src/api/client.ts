import { getConfig } from "./config";

// Key under which the session token is kept in the browser, so that a
// page refresh does not log the user out.
const TOKEN_KEY = "nubilo.token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// Pass null to forget the token (logout, or the server rejected it).
export function setToken(token: string | null): void {
  if (token === null) localStorage.removeItem(TOKEN_KEY);
  else localStorage.setItem(TOKEN_KEY, token);
}

// Thrown for every non-2xx response. It mirrors the backend error body
// {"error": {"code", "message"}}, so the UI can react to the code
// (UNAUTHORIZED, NOT_FOUND, INVALID_REQUEST, INVALID_PATH, PATH_CONFLICT)
// instead of parsing text.
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

interface RequestOptions {
  method?: string;
  // Sent as JSON. Leave undefined for requests without a body.
  body?: unknown;
  // Appended to the URL as ?key=value. Undefined values are skipped.
  query?: Record<string, string | number | undefined>;
}

// Single entry point for every JSON call to the backend. It builds the
// URL from the configured API address, attaches the token when there is
// one, and turns error responses into ApiError.
export async function request<T>(
  path: string,
  { method = "GET", body, query }: RequestOptions = {},
): Promise<T> {
  const url = new URL(path, getConfig().api.url);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!res.ok) {
    // The session is invalid or expired: forget the token. Sending the
    // user to the login page is the job of the auth context, not of
    // this layer.
    if (res.status === 401) setToken(null);

    // The body may not be JSON (a proxy error page, for example), so
    // fall back to the HTTP status text.
    const data = await res.json().catch(() => null);
    throw new ApiError(
      res.status,
      data?.error?.code ?? "UNKNOWN",
      data?.error?.message ?? res.statusText,
    );
  }

  // 204 No Content has no body to parse.
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}