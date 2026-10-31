# auth

The session of the logged-in user: whether there is one, how it starts and ends, and which routes need it. The calls to the backend are in `src/api/auth.ts`, this folder holds what the screens use.

## Structure

| File | Role |
|---|---|
| `AuthContext.ts` | Defines what components can read about the session: `isAuthenticated`, `login()` and `logout()`. |
| `AuthProvider.tsx` | Keeps the session and provides it to the whole app. Mounted once, in `main.tsx`. |
| `useAuth.ts` | The hook components use to read the session. |
| `RequireAuth.tsx` | A route guard: lets the wrapped routes through only when there is a session. |

## How it works

**Session.** The token lives in `localStorage` (see `src/api/client.ts`) so a page refresh keeps the user logged in. `AuthProvider` keeps a copy in state so React re-renders when the session starts or ends. When the app opens it starts logged in if a token is stored.

**Login and logout.** `login(email, password)` calls the backend, stores the token and starts the session. `logout()` calls the backend and always ends the session locally, even if the server cannot be reached.

**Rejected sessions.** When the backend answers `401` (an expired token, for example), the API client forgets the token and notifies the provider through `setUnauthorizedHandler()`. The session ends in the UI and the user is sent to the login page.

**Protected routes.** Routes that need a session are nested inside `RequireAuth` in `App.tsx`. Without a session the user is redirected to `ROUTES.login`. The paths of the pages are defined in `src/routes.ts`, never written by hand.

```tsx
<Routes>
  <Route path={ROUTES.login} element={<LoginPage />} />
  <Route element={<RequireAuth />}>
    <Route path={ROUTES.home} element={<HomePage />} />
  </Route>
</Routes>
```

**Using the session in a component.**
```tsx
const { isAuthenticated, login, logout } = useAuth();
```
`useAuth()` throws if it is used outside `AuthProvider`.

## Not covered yet

The login and register pages, the logout button and the app layout come in their own issues.