import { useMemo, useState } from "react";
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

// One line of the tree, indented by its depth. With `onToggle` it starts
// with an arrow that opens or closes the folder; without it, an empty space
// of the same width keeps the names aligned.
function Item({
  label,
  depth,
  active,
  onClick,
  expanded = false,
  onToggle,
}: {
  label: string;
  depth: number;
  active: boolean;
  onClick: () => void;
  expanded?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div
      className="flex items-center"
      style={{ paddingLeft: `${depth * 16}px` }}
    >
      {onToggle ? (
        <button
          type="button"
          aria-label={expanded ? "Collapse" : "Expand"}
          aria-expanded={expanded}
          onClick={onToggle}
          className="w-5 shrink-0 cursor-pointer text-base leading-none text-muted hover:text-fg focus-visible:text-fg focus-visible:outline-0"
        >
          <span
            className={`inline-block transition-transform motion-reduce:transition-none ${expanded ? "rotate-90" : ""}`}
          >
            ▸
          </span>
        </button>
      ) : (
        <span className="w-5 shrink-0" aria-hidden="true" />
      )}
      <Button
        brackets={false}
        aria-current={active ? "page" : undefined}
        className={`min-w-0 flex-1 truncate text-left ${active ? "bg-accent text-bg" : ""}`}
        onClick={onClick}
      >
        {label}
      </Button>
    </div>
  );
}

// The folders under a folder, and their own folders, one level deeper each.
// A closed folder does not draw its children, so the lines below it move up.
function Branch({
  nodes,
  depth,
  activeFolderId,
  closed,
  onToggle,
  onOpenFolder,
}: {
  nodes: FolderNode[];
  depth: number;
  activeFolderId?: number | null;
  closed: Set<number>;
  onToggle: (folderId: number) => void;
  onOpenFolder: (folder: FolderInfo) => void;
}) {
  return (
    <ul>
      {nodes.map((node) => {
        const hasChildren = node.children.length > 0;
        const expanded = !closed.has(node.folder.id);
        return (
          <li key={node.folder.id}>
            <Item
              label={`${node.name}/`}
              depth={depth}
              active={node.folder.id === activeFolderId}
              onClick={() => onOpenFolder(node.folder)}
              expanded={expanded}
              onToggle={
                hasChildren ? () => onToggle(node.folder.id) : undefined
              }
            />
            {hasChildren && expanded && (
              <Branch
                nodes={node.children}
                depth={depth + 1}
                activeFolderId={activeFolderId}
                closed={closed}
                onToggle={onToggle}
                onOpenFolder={onOpenFolder}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

// The tree of all the folders, starting at the root. It does not load
// anything: the parent gives it the folders and learns which one was pressed.
// Every folder starts open, and the ones the user closes are remembered here.
export function FileExplorer({
  folders,
  activeFolderId,
  onOpenRoot,
  onOpenFolder,
}: FileExplorerProps) {
  const tree = useMemo(() => buildTree(folders), [folders]);
  const [closed, setClosed] = useState<Set<number>>(new Set());

  function toggle(folderId: number) {
    setClosed((current) => {
      const next = new Set(current);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  }

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
        closed={closed}
        onToggle={toggle}
        onOpenFolder={onOpenFolder}
      />
    </nav>
  );
}
