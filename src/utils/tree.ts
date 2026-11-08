import type { FolderInfo } from "../api/types";
import { baseName } from "./format";

// A folder with the folders directly inside it.
export interface FolderNode {
  folder: FolderInfo;
  // The last part of the path: "docs/2026" has the name "2026".
  name: string;
  children: FolderNode[];
}

// Turns the flat list of folders into a tree. Each folder goes under the
// folder whose path is its parent path, and siblings are sorted by name. A
// folder whose parent is not in the list goes to the top level.
export function buildTree(folders: FolderInfo[]): FolderNode[] {
  const sorted = [...folders].sort((a, b) => a.path.localeCompare(b.path));

  const nodes = new Map<string, FolderNode>();
  for (const folder of sorted) {
    nodes.set(folder.path, {
      folder,
      name: baseName(folder.path),
      children: [],
    });
  }

  const top: FolderNode[] = [];
  for (const node of nodes.values()) {
    const slash = node.folder.path.lastIndexOf("/");
    const parent =
      slash === -1 ? undefined : nodes.get(node.folder.path.slice(0, slash));
    (parent ? parent.children : top).push(node);
  }
  return top;
}

// The ids of the folders that contain a folder, from the top level down to
// its parent. It is empty for a top-level folder or an unknown id.
export function ancestorIds(folders: FolderInfo[], folderId: number): number[] {
  const target = folders.find((folder) => folder.id === folderId);
  if (!target) return [];

  const idByPath = new Map(folders.map((folder) => [folder.path, folder.id]));
  const parts = target.path.split("/");
  const ids: number[] = [];
  for (let i = 1; i < parts.length; i++) {
    const id = idByPath.get(parts.slice(0, i).join("/"));
    if (id !== undefined) ids.push(id);
  }
  return ids;
}

// The path shown for the open folder: "/" for the root, "/docs/2026" for a
// folder, "..." while the folders are loading and "-" on a page that is not
// a folder. activeFolderId is null for the root and undefined when no folder
// is open.
export function displayPath(
  folders: FolderInfo[] | undefined,
  activeFolderId: number | null | undefined,
): string {
  if (activeFolderId === undefined) return "-";
  if (activeFolderId === null) return "/";
  const folder = folders?.find((candidate) => candidate.id === activeFolderId);
  return folder ? `/${folder.path}` : "...";
}
