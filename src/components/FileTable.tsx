import type { Entry } from "../utils/entries";
import { baseName, formatDate, formatSize } from "../utils/format";
import type { Column } from "./DataTable";
import { DataTable } from "./DataTable";
import { EmptyState } from "./EmptyState";

const columns: Column<Entry>[] = [
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
        <span className="font-semibold text-accent">{baseName(entry.path)}/</span>
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
    render: (entry) => (entry.kind === "folder" ? "directory" : entry.contentType),
  },
  {
    header: "UPDATED",
    width: "155px",
    render: (entry) =>
      formatDate(entry.kind === "folder" ? entry.createdAt : entry.updatedAt),
  },
];

// The listing of the files and folders of a directory.
export function FileTable({ entries }: { entries: Entry[] }) {
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