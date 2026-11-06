import { useMemo } from "react";
import type { FolderInfo } from "../api/types";
import { buildTree } from "../utils/tree";
import type { FolderNode } from "../utils/tree";
import { Button } from "./Button";

interface FileExplorerProps {
  folders: FolderInfo[];
  // The folder to highlight: its id, null for the root, or leave it out to
  // highlight nothing.
  activeFolderId?: number | null;
  onOpenRoot: () => void;
  onOpenFolder: (folder: FolderInfo) => void;
}

// One line of the tree: a button indented by its depth.
function Item({
  label,
  depth,
  active,
  onClick,
}: {
  label: string;
  depth: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      brackets={false}
      fullWidth
      aria-current={active ? "page" : undefined}
      className={`truncate text-left ${active ? "bg-accent text-bg" : ""}`}
      style={{ paddingLeft: `${depth * 12}px` }}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

// The folders under a folder, and their own folders, one level deeper each.
function Branch({
  nodes,
  depth,
  activeFolderId,
  onOpenFolder,
}: {
  nodes: FolderNode[];
  depth: number;
  activeFolderId?: number | null;
  onOpenFolder: (folder: FolderInfo) => void;
}) {
  return (
    <ul>
      {nodes.map((node) => (
        <li key={node.folder.id}>
          <Item
            label={`${node.name}/`}
            depth={depth}
            active={node.folder.id === activeFolderId}
            onClick={() => onOpenFolder(node.folder)}
          />
          <Branch
            nodes={node.children}
            depth={depth + 1}
            activeFolderId={activeFolderId}
            onOpenFolder={onOpenFolder}
          />
        </li>
      ))}
    </ul>
  );
}

// The tree of all the folders, starting at the root. It does not load
// anything: the parent gives it the folders and learns which one was pressed.
export function FileExplorer({
  folders,
  activeFolderId,
  onOpenRoot,
  onOpenFolder,
}: FileExplorerProps) {
  const tree = useMemo(() => buildTree(folders), [folders]);

  return (
    <nav aria-label="Folders">
      <Item
        label="/"
        depth={0}
        active={activeFolderId === null}
        onClick={onOpenRoot}
      />
      <Branch
        nodes={tree}
        depth={1}
        activeFolderId={activeFolderId}
        onOpenFolder={onOpenFolder}
      />
    </nav>
  );
}