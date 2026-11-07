import { request } from "../client";
import { ENDPOINTS } from "../endpoints";
import type { FileVersions } from "../types";

// Stores a file at a path. If the path already holds a file, the content
// becomes a new version of it.
export function uploadFile(file: File, path: string) {
  const body = new FormData();
  body.append("file", file);
  return request<{ id: number }>(ENDPOINTS.files, {
    method: "POST",
    body,
    query: { path },
  });
}

// Downloads the latest content of a file.
export function downloadFile(id: number) {
  return request<Blob>(ENDPOINTS.file(id), { as: "blob" });
}

// Deletes a file together with all its versions.
export function deleteFile(id: number) {
  return request<void>(ENDPOINTS.file(id), { method: "DELETE" });
}

// The versions of a file, newest first, with the path of the file.
export function getVersions(fileId: number) {
  return request<FileVersions>(ENDPOINTS.versions(fileId));
}
