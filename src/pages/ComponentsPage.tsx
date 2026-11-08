import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Field } from "../components/ui/Field";
import { Modal } from "../components/ui/Modal";
import { RuleTitle } from "../components/ui/RuleTitle";
import { StatusLine } from "../components/ui/StatusLine";
import { Wordmark } from "../components/ui/Wordmark";
import type { Column } from "../components/ui/DataTable";
import { DataTable } from "../components/ui/DataTable";
import { EmptyState } from "../components/ui/EmptyState";
import { FileTable } from "../components/files/FileTable";
import type { Entry } from "../utils/entries";
import { FileDropZone } from "../components/files/FileDropZone";
import { FileExplorer } from "../components/files/FileExplorer";
import { VersionTable } from "../components/files/VersionTable";

interface Row {
  id: number;
  name: string;
  size: string;
  type: string;
}

const columns: Column<Row>[] = [
  { header: "ID", width: "60px", render: (row) => row.id },
  { header: "NAME", width: "minmax(150px, 1.3fr)", render: (row) => row.name },
  { header: "SIZE", width: "80px", render: (row) => row.size },
  { header: "TYPE", width: "minmax(120px, 1fr)", render: (row) => row.type },
  {
    header: "ACTIONS",
    width: "120px",
    render: () => <Button tone="danger">del</Button>,
  },
];

const rows: Row[] = [
  { id: 1, name: "notes.txt", size: "18.4 KB", type: "text/plain" },
  { id: 2, name: "project-brief.md", size: "6.8 KB", type: "text/markdown" },
  { id: 3, name: "roadmap.csv", size: "42.1 KB", type: "text/csv" },
];

const entries: Entry[] = [
  {
    kind: "folder",
    id: 1,
    path: "docs",
    createdAt: "2026-04-02 14:08:00",
  },
  {
    kind: "folder",
    id: 2,
    path: "images",
    createdAt: "2026-03-30 09:16:00",
  },
  {
    kind: "file",
    id: 3,
    path: "notes.txt",
    size: 18841,
    contentType: "text/plain",
    createdAt: "2026-04-01 10:00:00",
    updatedAt: "2026-04-08 16:42:00",
  },
  {
    kind: "file",
    id: 4,
    path: "project-brief.md",
    size: 6963,
    contentType: "text/markdown",
    createdAt: "2026-04-01 10:00:00",
    updatedAt: "2026-04-07 11:20:00",
  },
];

// Development-only sandbox: put components here to see how they look.
export default function ComponentsPage() {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  return (
    <main className="flex flex-col gap-6 p-10">
      <Button className="self-start" onClick={() => setOpen(true)}>
        open modal
      </Button>
      <RuleTitle title="button" />
      <Field label="test field" />

      {open && (
        <Modal
          title="delete file"
          size="sm"
          onClose={() => setOpen(false)}
          footer={<Button onClick={() => setOpen(false)}>confirm</Button>}
        >
          Are you sure?
        </Modal>
      )}

      <StatusLine tone="success">file uploaded</StatusLine>

      <Wordmark size="md" />

      <DataTable
        label="Test table"
        columns={columns}
        rows={rows}
        getKey={(row) => row.id}
      />

      <DataTable
        label="Empty table"
        columns={columns}
        rows={[]}
        getKey={(row) => row.id}
        empty={<EmptyState message="Nothing here yet." />}
      />

      <FileTable entries={entries} onDownload={() => {}} onDelete={() => {}} />
      <FileTable entries={[]} />

      <FileDropZone files={files} onFilesChange={setFiles} />

      <FileExplorer
        folders={[
          { id: 1, path: "docs", createdAt: "2026-04-02T14:08:00Z" },
          { id: 2, path: "docs/2026", createdAt: "2026-04-02T14:08:00Z" },
          { id: 3, path: "images", createdAt: "2026-03-30T09:16:00Z" },
        ]}
        activeFolderId={2}
        onOpenRoot={() => {}}
        onOpenFolder={() => {}}
      />

      <VersionTable
        versions={[
          {
            version: 3,
            size: 18841,
            contentType: "text/plain",
            createdAt: "2026-04-08T16:42:00Z",
          },
          {
            version: 2,
            size: 18102,
            contentType: "text/plain",
            createdAt: "2026-04-05T11:20:00Z",
          },
          {
            version: 1,
            size: 9120,
            contentType: "text/plain",
            createdAt: "2026-04-01T10:00:00Z",
          },
        ]}
      />
    </main>
  );
}
