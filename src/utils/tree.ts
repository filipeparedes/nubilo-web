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
