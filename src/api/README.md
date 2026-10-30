# api

The layer that talks to the Nubilo backend. Pages and hooks never call `fetch` directly, they go through the functions here, so the address, the session token and the error handling live in one place.

## Structure

| File        | Role                                                                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config.ts` | Loads `public/config.json` once at startup (`loadConfig()`) and exposes it through `getConfig()`. It holds the API address.                       |
| `client.ts` | The JSON client. `request()` makes a call to the backend, `ApiError` is what it throws, and `getToken()` / `setToken()` manage the session token. |

## How it works

**Configuration.** The API address is not compiled into the app. `main.tsx` calls `loadConfig()` before rendering anything, so the address comes from `public/config.json` and can change without rebuilding. If the file is missing or invalid the app shows the error instead of a blank page. `getConfig()` throws if it is called before the configuration has loaded.

**Requests.** `request<T>(path, options)` builds the URL from the configured address, adds `Authorization: Bearer <token>` when a token is stored, sends `body` as JSON and returns the parsed response (`undefined` for `204 No Content`). `query` values are added to the URL, and `undefined` ones are skipped.

```ts
const versions = await request<Version[]>("/files/1/versions");
const diff = await request<Diff>("/files/1/versions/compare", {
  query: { from: 1, to: 2 },
});
await request("/folders", { method: "POST", body: { path: "docs" } });
```

**Errors.** Any non-2xx response throws an `ApiError` with the HTTP `status`, the backend error `code` (`UNAUTHORIZED`, `NOT_FOUND`, `INVALID_REQUEST`, `INVALID_PATH`, `PATH_CONFLICT`) and the `message`. Screens decide what to do from the `code`, not by parsing text. If the body is not the expected JSON (a proxy error page, for example) the code is `UNKNOWN` and the message is the HTTP status text.

**Session token.** The token is kept in `localStorage`, so a page refresh does not log the user out. On a `401` the client forgets the token and throws, and it is up to the auth context to send the user to the login page.

## Not covered yet

`request()` only handles JSON. File upload (`multipart/form-data`) and download (binary) will have their own functions when those features are built.

## Tests

The client is covered by `tests/api/client.test.ts` (Vitest, with `fetch` and `localStorage` replaced by test doubles). Run them with `npm test`.
