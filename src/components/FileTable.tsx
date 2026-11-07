import type { Entry } from "../utils/entries";
import { baseName, formatDate, formatSize } from "../utils/format";
import type { Column } from "./DataTable";
import { DataTable } from "./DataTable";
import { EmptyState } from "./EmptyState";
import type { FileInfo, FolderInfo } from "../api/types";
import { Button } from "./Button";

function baseColumns(
  onOpenFolder?: (folder: FolderInfo) => void,
): Column<Entry>[] {
  return [
    {
      header: "MODE",
      width: "70px",
      render: (entry) => (entry.kind === "folder" ? "drwxr-x" : "-rw-r--"),
    },
    {
      header: "NAME",
      width: "minmax(150px, 1.3fr)",
      render: (entry) => {
        if (entry.kind === "file") return baseName(entry.path);
        const name = `${baseName(entry.path)}/`;
        return onOpenFolder ? (
          <Button
            brackets={false}
            className="font-semibold"
            onClick={() => onOpenFolder(entry)}
          >
            {name}
          </Button>
        ) : (
          <span className="font-semibold text-accent">{name}</span>
        );
      },
    },
    {
      header: "SIZE",
      width: "80px",
      render: (entry) =>
        entry.kind === "folder" ? "—" : formatSize(entry.size),
    },
    {
      header: "CONTENT TYPE",
      width: "minmax(120px, 1fr)",
      render: (entry) =>
        entry.kind === "folder" ? "directory" : entry.contentType,
    },
    {
      header: "UPDATED",
      width: "155px",
      render: (entry) =>
        formatDate(entry.kind === "folder" ? entry.createdAt : entry.updatedAt),
    },
  ];
}

interface FileTableProps {
  entries: Entry[];
  // Called with the folder when its name is pressed. Without it the folder
  // names are plain text.
  onOpenFolder?: (folder: FolderInfo) => void;
  // Called with the file when its get button is pressed.
  onDownload?: (file: FileInfo) => void;
  // Called with the file when its del button is pressed.
  onDelete?: (file: FileInfo) => void;
  // Called with the folder when its del button is pressed.
  onDeleteFolder?: (folder: FolderInfo) => void;
}

// The column with the action buttons. A file has get and del, a folder has
// only del. Only the buttons whose callback was given are drawn.
function actionsColumn({
  onDownload,
  onDelete,
  onDeleteFolder,
}: Pick<
  FileTableProps,
  "onDownload" | "onDelete" | "onDeleteFolder"
>): Column<Entry> {
  return {
    header: "ACTIONS",
    width: "140px",
    render: (entry) => {
      if (entry.kind === "folder") {
        return onDeleteFolder ? (
          <span className="flex gap-4">
            {/* Takes the place of the get button, so the del buttons line up. */}
            {onDownload && (
              <span className="invisible" aria-hidden="true">
                [ get ]
              </span>
            )}
            <Button tone="danger" onClick={() => onDeleteFolder(entry)}>
              del
            </Button>
          </span>
        ) : null;
      }
      return (
        <span className="flex gap-4">
          {onDownload && <Button onClick={() => onDownload(entry)}>get</Button>}
          {onDelete && (
            <Button tone="danger" onClick={() => onDelete(entry)}>
              del
            </Button>
          )}
        </span>
      );
    },
  };
}

// The listing of the files and folders of a directory. Without any
// callback the table has no actions column.
export function FileTable({
  entries,
  onOpenFolder,
  onDownload,
  onDelete,
  onDeleteFolder,
}: FileTableProps) {
  const base = baseColumns(onOpenFolder);
  const columns =
    onDownload || onDelete || onDeleteFolder
      ? [...base, actionsColumn({ onDownload, onDelete, onDeleteFolder })]
      : base;

  return (
    <DataTable
      label="Files"
      columns={columns}
      rows={entries}
      getKey={(entry) => `${entry.kind}-${entry.id}`}
      empty={<EmptyState message="No objects match this path or filter." />}
    />
  );
}
