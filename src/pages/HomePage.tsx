import { useState } from "react";
import { errorMessage } from "../api/errorMessage";
import { Button } from "../components/Button";
import { FileTable } from "../components/FileTable";
import { FilterBar } from "../components/FilterBar";
import { StatusLine } from "../components/StatusLine";
import { useFolderContents } from "../hooks/useFolderContents";
import { toEntries } from "../utils/entries";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";
import { useDownloadFile } from "../hooks/useDownloadFile";
import { useDeleteFile } from "../hooks/useDeleteFile";
import type { FileInfo } from "../api/types";
import { Modal } from "../components/Modal";
import { baseName } from "../utils/format";

// The root of the user's storage.
export default function HomePage() {
  const { data, isPending, error, refetch } = useFolderContents();
  const [filter, setFilter] = useState("");
  const [toDelete, setToDelete] = useState<FileInfo | null>(null); //file waiting to deletion confirmed

  const navigate = useNavigate();
  const download = useDownloadFile();
  const remove = useDeleteFile();

  function confirmDelete() {
    if (!toDelete) return;
    remove.mutate(toDelete.id, { onSettled: () => setToDelete(null) });
  }

  const entries = data ? toEntries(data, filter) : [];

  return (
    <>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[9px] tracking-[.15em] text-accent-dim">
            CURRENT DIRECTORY
          </p>
          <h1 className="text-lg font-medium text-accent">/</h1>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => navigate(ROUTES.upload)}>upload</Button>
          <Button onClick={() => refetch()}>refresh</Button>
        </div>
      </div>

      {isPending && <StatusLine tone="muted">loading...</StatusLine>}
      {error && <StatusLine>{errorMessage(error)}</StatusLine>}
      {download.error && (
        <StatusLine>{errorMessage(download.error)}</StatusLine>
      )}
      {remove.error && <StatusLine>{errorMessage(remove.error)}</StatusLine>}

      {data && (
        <>
          <FilterBar
            value={filter}
            onChange={setFilter}
            count={entries.length}
          />
          <FileTable
            entries={entries}
            onDownload={(file) => download.mutate(file)}
            onDelete={(file) => {
              remove.reset();
              setToDelete(file);
            }}
          />
        </>
      )}
      {toDelete && (
        <Modal
          title="delete file"
          size="sm"
          onClose={() => setToDelete(null)}
          footer={
            <>
              <Button
                tone="muted"
                onClick={() => setToDelete(null)}
                disabled={remove.isPending}
              >
                cancel
              </Button>
              <Button
                tone="danger"
                onClick={confirmDelete}
                disabled={remove.isPending}
              >
                {remove.isPending ? "deleting..." : "delete"}
              </Button>
            </>
          }
        >
          Delete <b className="text-accent">{baseName(toDelete.path)}</b> and
          all its versions? This cannot be undone.
        </Modal>
      )}
    </>
  );
}
