import type { Entry } from "../utils/entries";
import { baseName, formatDate, formatSize } from "../utils/format";
import type { Column } from "./DataTable";
import { DataTable } from "./DataTable";
import { EmptyState } from "./EmptyState";
import type { FileInfo } from "../api/types";
import { Button } from "./Button";

const baseColumns: Column<Entry>[] = [
  {
    header: "MODE",
    width: "70px",
    render: (entry) => (entry.kind === "folder" ? "drwxr-x" : "-rw-r--"),
  },
  {
    header: "NAME",
    width: "minmax(150px, 1.3fr)",
    render: (entry) =>
      entry.kind === "folder" ? (
        <span className="font-semibold text-accent">
          {baseName(entry.path)}/
        </span>
      ) : (
        baseName(entry.path)
      ),
  },
  {
    header: "SIZE",
    width: "80px",
    render: (entry) => (entry.kind === "folder" ? "—" : formatSize(entry.size)),
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

interface FileTableProps {
  entries: Entry[];
  // Called with the file when its get button is pressed.
  onDownload?: (file: FileInfo) => void;
  // Called with the file when its del button is pressed.
  onDelete?: (file: FileInfo) => void;
}

// The column with the action buttons. Folders have no action yet. Only
// the buttons whose callback was given are drawn.
function actionsColumn({
  onDownload,
  onDelete,
}: Pick<FileTableProps, "onDownload" | "onDelete">): Column<Entry> {
  return {
    header: "ACTIONS",
    width: "140px",
    render: (entry) =>
      entry.kind === "file" ? (
        <span className="flex gap-4">
          {onDownload && (
            <Button onClick={() => onDownload(entry)}>get</Button>
          )}
          {onDelete && (
            <Button tone="danger" onClick={() => onDelete(entry)}>
              del
            </Button>
          )}
        </span>
      ) : null,
  };
}

// The listing of the files and folders of a directory. Without any
// callback the table has no actions column.
export function FileTable({ entries, onDownload, onDelete }: FileTableProps) {
  const columns =
    onDownload || onDelete
      ? [...baseColumns, actionsColumn({ onDownload, onDelete })]
      : baseColumns;

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
