# utils

Small functions with no React in them. Most are pure; `saveBlob` uses the browser.

| File          | Role                                                                                                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `format.ts`   | `baseName` (the last part of a path), `formatSize` (bytes as `18.4 KB`), `formatDate`, `joinPath` (a folder and a name as one path) and `versionedName` (a file name with the version in it, `notes-v2.txt`). |
| `entries.ts`  | `toEntries` joins the folders and files of a folder into one list, folders first, sorted by name, with an optional filter.                                                                                    |
| `download.ts` | `saveBlob` saves a `Blob` as a file on the user's computer.                                                                                                                                                   |
| `tree.ts`     | `buildTree` turns the flat list of folders into a tree sorted by name, and `ancestorIds` gives the folders that contain a folder.                                                                             |
