import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "../components/Button";
import { Field } from "../components/Field";
import { FileDropZone } from "../components/FileDropZone";
import { useUploadFiles } from "../hooks/useUploadFiles";
import type { UploadItem } from "../hooks/useUploadFiles";

const STYLES: Record<UploadItem["status"], string> = {
  pending: "text-accent-dim",
  uploading: "text-accent",
  done: "text-ok",
  error: "text-error",
};

// One line per file: the same terminal style as the StatusLine.
function lineText({ status, path, error }: UploadItem): string {
  if (status === "pending") return `- ${path}`;
  if (status === "uploading") return `> ${path} ...`;
  if (status === "done") return `✓ CREATED :: ${path}`;
  return `! ${path} :: ${error}`;
}

// Uploads one or more files to the storage, optionally inside a folder.
export default function UploadPage() {
  const { items, running, start, reset } = useUploadFiles();
  const [files, setFiles] = useState<File[]>([]);
  const [folder, setFolder] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (files.length > 0) start(files, folder);
  }

  function handleCancel() {
    setFiles([]);
    setFolder("");
    reset();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <h1 className="mb-4 text-lg font-medium text-accent">upload</h1>

      <FileDropZone
        files={files}
        onFilesChange={(next) => {
          setFiles(next);
          reset();
        }}
        disabled={running}
        className="mb-4"
      />
      <Field
        label="target folder (optional)"
        placeholder="docs/2026"
        cursor={false}
        value={folder}
        onChange={(event) => setFolder(event.target.value)}
        disabled={running}
      />
      <p className="mb-4 text-muted">
        Uploading to a path that already has a file adds a new version of it.
      </p>

      {items.length > 0 && (
        <ul className="mb-4" aria-live="polite">
          {items.map((item, index) => (
            <li
              key={`${item.path}-${index}`}
              className={`break-all ${STYLES[item.status]}`}
            >
              {lineText(item)}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex justify-end gap-4">
        <Button tone="muted" onClick={handleCancel} disabled={running}>
          cancel
        </Button>
        <Button type="submit" disabled={files.length === 0 || running}>
          {running ? "uploading..." : "start upload"}
        </Button>
      </div>
    </form>
  );
}
