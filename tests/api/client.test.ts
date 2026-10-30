import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, getToken, request, setToken } from "../../src/api/client";

// The client reads the API address from the loaded configuration.
vi.mock("../../src/api/config", () => ({
  getConfig: () => ({ api: { url: "http://api.test" } }),
}));

const fetchMock = vi.fn();

// Node's own localStorage is not usable without a file, so the tests
// use a plain in-memory replacement.
function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => {
      data.delete(key);
    },
    setItem: (key, value) => {
      data.set(key, String(value));
    },
  };
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("localStorage", memoryStorage());
});

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("request", () => {
  it("sends the token as a Bearer header when there is one", async () => {
    setToken("abc123");
    fetchMock.mockResolvedValue(jsonResponse(200, {}));

    await request("/files");

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBe("Bearer abc123");
  });

  it("sends no Authorization header without a token", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, {}));

    await request("/health");

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBeUndefined();
  });

  it("builds the URL from the API address and the query, skipping undefined values", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, {}));

    await request("/files/1/versions/compare", {
      query: { from: 1, to: 2, ignored: undefined },
    });

    const [url] = fetchMock.mock.calls[0];
    expect(url.toString()).toBe(
      "http://api.test/files/1/versions/compare?from=1&to=2",
    );
  });

  it("sends the body as JSON", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, {}));

    await request("/auth/login", { method: "POST", body: { email: "a@b.c" } });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(init.body).toBe('{"email":"a@b.c"}');
  });

  it("returns the parsed JSON body", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { token: "t" }));

    expect(await request("/auth/login")).toEqual({ token: "t" });
  });

  it("returns undefined for 204 No Content", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    expect(await request("/auth/logout", { method: "POST" })).toBeUndefined();
  });

  it("throws an ApiError built from the backend error body", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(404, { error: { code: "NOT_FOUND", message: "no such file" } }),
    );

    const error = await request("/files/9").catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(404);
    expect(error.code).toBe("NOT_FOUND");
    expect(error.message).toBe("no such file");
  });

  it("falls back to UNKNOWN when the error body is not JSON", async () => {
    fetchMock.mockResolvedValue(
      new Response("<html>bad gateway</html>", {
        status: 502,
        statusText: "Bad Gateway",
      }),
    );

    const error = await request("/files").catch((e) => e);

    expect(error.code).toBe("UNKNOWN");
    expect(error.message).toBe("Bad Gateway");
  });

  it("forgets the token on 401", async () => {
    setToken("expired");
    fetchMock.mockResolvedValue(
      jsonResponse(401, { error: { code: "UNAUTHORIZED", message: "bad token" } }),
    );

    await request("/files").catch(() => {});

    expect(getToken()).toBeNull();
  });
});