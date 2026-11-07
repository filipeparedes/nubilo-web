import { request } from "../client";
import { ENDPOINTS } from "../endpoints";
import type { FolderContents, FolderInfo } from "../types";

// What the root of the user's storage holds.
export function getRootContents() {
  return request<FolderContents>(ENDPOINTS.rootContents);
}

// What a folder holds.
export function getFolderContents(folderId: number) {
  return request<FolderContents>(ENDPOINTS.folder(folderId));
}

// Every folder of the user, at any depth
export function getFolders() {
  return request<FolderInfo[]>(ENDPOINTS.folders);
}

// Creates a folder at a path, together with the parents that do not exist.
// Creating a folder that already exists is not an error: it returns its id.
export function createFolder(path: string) {
  return request<{ id: number }>(ENDPOINTS.folders, {
    method: "POST",
    body: { path },
  });
}

// Deletes a folder together with everything inside it, at any depth. It is
// permanent.
export function deleteFolder(id: number) {
  return request<void>(ENDPOINTS.folder(id), { method: "DELETE" });
}
