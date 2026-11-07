# hooks

The custom hooks of the app. Hooks that read data from the server use TanStack Query on top of the calls in `src/api/resources`, which gives them cache, loading and error states and repeated checks.

## Structure

| File                   | Role                                                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useAuth.ts`           | Reads the session (`isAuthenticated`, `email`, `login()`, `logout()`) from the context provided by `AuthProvider`.                                |
| `useHealth.ts`         | The state of the API, checked every 10 seconds. `isSuccess` is online, `isError` is offline and `data.latencyMs` is the last latency.             |
| `useFolderContents.ts` | The contents of a folder, or of the root with no id. Its query key starts with "folder", so one invalidation refreshes every listing.             |
| `useUploadFile.ts`     | Uploads one file to a path. When it succeeds it refreshes every listing.                                                                          |
| `useUploadFiles.ts`    | Uploads several files, one request per file and one after the other. Each file keeps its own status: pending, uploading, done or error.           |
| `useDownloadFile.ts`   | Downloads a file and saves it on the user's computer under its own name.                                                                          |
| `useDeleteFile.ts`     | Deletes a file with all its versions. When it succeeds it refreshes every listing.                                                                |
| `useFolders.ts`        | Every folder of the user, at any depth, for the folder tree. Its query key also starts with "folder", so it refreshes together with the listings. |
| `useCreateFolder.ts`   | Creates a folder at a path. When it succeeds every listing and the folder tree are refreshed. |
| `useDeleteFolder.ts`   | Deletes a folder with everything inside it. When it succeeds every listing and the folder tree are refreshed. |
