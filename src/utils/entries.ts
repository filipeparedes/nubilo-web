import type { FileInfo, FolderContents, FolderInfo } from "../api/types";
import { baseName } from "./format";

// A row of the listing: a folder or a file.
export type Entry =
  | ({ kind: "folder" } & FolderInfo)
  | ({ kind: "file" } & FileInfo);

// Joins the folders and the files of a folder into one list: folders
// first, each group sorted by name. A filter keeps only the entries
// whose name contains it, ignoring case.
export function toEntries(contents: FolderContents, filter = ""): Entry[] {
  const byName = (a: Entry, b: Entry) =>
    baseName(a.path).localeCompare(baseName(b.path));

  const folders: Entry[] = contents.folders
    .map((folder) => ({ kind: "folder" as const, ...folder }))
    .sort(byName);
  const files: Entry[] = contents.files
    .map((file) => ({ kind: "file" as const, ...file }))
    .sort(byName);

  const wanted = filter.toLowerCase();
  return [...folders, ...files].filter((entry) =>
    baseName(entry.path).toLowerCase().includes(wanted),
  );
}