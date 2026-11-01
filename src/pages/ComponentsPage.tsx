import { useState } from "react";
import { Button } from "../components/Button";
import { Field } from "../components/Field";
import { Modal } from "../components/Modal";
import { RuleTitle } from "../components/RuleTitle";
import { StatusLine } from "../components/StatusLine";
import { Wordmark } from "../components/Wordmark";
import type { Column } from "../components/DataTable";
import { DataTable } from "../components/DataTable";
import { EmptyState } from "../components/EmptyState";

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

// Development-only sandbox: put components here to see how they look.
export default function ComponentsPage() {
  const [open, setOpen] = useState(false);

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
      <Wordmark size="lg" />
      <Wordmark size="lg" cursor={false} />

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
    </main>
  );
}
