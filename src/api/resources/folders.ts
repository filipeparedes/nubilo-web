import { request } from "../client";
import { ENDPOINTS } from "../endpoints";
import type { FolderContents } from "../types";

// What the root of the user's storage holds.
export function getRootContents() {
  return request<FolderContents>(ENDPOINTS.rootContents);
}

// What a folder holds.
export function getFolderContents(folderId: number) {
  return request<FolderContents>(ENDPOINTS.folder(folderId));
}
