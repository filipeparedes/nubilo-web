# hooks

The custom hooks of the app. Hooks that read data from the server use TanStack Query on top of the calls in `src/api/resources`, which gives them cache, loading and error states and repeated checks. The ones that change data are mutations, and refresh the listings when they succeed.

## Structure

| Folder     | What it holds                                              |
| ---------- | ---------------------------------------------------------- |
| `app/`     | The hooks of the app itself: the session, the API and the navigation. |
| `files/`   | The hooks that work on files and on their versions.        |
| `folders/` | The hooks that work on folders.                            |

### app/

| File           | Role                                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `useAuth.ts`   | Reads the session (`isAuthenticated`, `email`, `login()`, `logout()`) from the context provided by `AuthProvider`.                    |
| `useHealth.ts` | The state of the API, checked every 10 seconds. `isSuccess` is online, `isError` is offline and `data.latencyMs` is the last latency. |
| `useGoBack.ts` | Returns a function that goes back to the previous page, or to the home page when the current one was opened directly.                 |

### files/

| File                    | Role                                                                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useUploadFile.ts`      | Uploads one file to a path. When it succeeds it refreshes every listing.                                                                          |
| `useUploadFiles.ts`     | Uploads several files, one request per file and one after the other. Each file keeps its own status: pending, uploading, done or error.           |
| `useDownloadFile.ts`    | Downloads a file and saves it on the user's computer under its own name.                                                                          |
| `useDownloadVersion.ts` | Downloads one version of a file and saves it with the version in the name, for example `notes-v2.txt`.                                            |
| `useDeleteFile.ts`      | Deletes a file with all its versions. When it succeeds it refreshes every listing.                                                                |
| `useFileVersions.ts`    | The history of a file: its path and its versions, newest first. Its query key starts with "versions", so the restore of a version can refresh it. |

### folders/

| File                   | Role                                                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useFolderContents.ts` | The contents of a folder, or of the root with no id. Its query key starts with "folder", so one invalidation refreshes every listing.             |
| `useFolders.ts`        | Every folder of the user, at any depth, for the folder tree. Its query key also starts with "folder", so it refreshes together with the listings. |
| `useCreateFolder.ts`   | Creates a folder at a path. When it succeeds every listing and the folder tree are refreshed.                                                     |
| `useDeleteFolder.ts`   | Deletes a folder with everything inside it. When it succeeds every listing and the folder tree are refreshed.                                     |