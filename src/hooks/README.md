# hooks

The custom hooks of the app. Hooks that read data from the server use TanStack Query on top of the calls in `src/api/resources`, which gives them cache, loading and error states and repeated checks.

## Structure

| File                   | Role                                                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `useAuth.ts`           | Reads the session (`isAuthenticated`, `email`, `login()`, `logout()`) from the context provided by `AuthProvider`.                    |
| `useHealth.ts`         | The state of the API, checked every 10 seconds. `isSuccess` is online, `isError` is offline and `data.latencyMs` is the last latency. |
| `useFolderContents.ts` | The contents of a folder, or of the root with no id. Its query key starts with "folder", so one invalidation refreshes every listing. |
