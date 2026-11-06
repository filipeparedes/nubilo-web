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
