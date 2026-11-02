import { request } from "../client";
import { ENDPOINTS } from "../endpoints";

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
