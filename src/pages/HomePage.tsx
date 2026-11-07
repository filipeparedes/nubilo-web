import { useState } from "react";
import { errorMessage } from "../api/errorMessage";
import { Button } from "../components/Button";
import { FileTable } from "../components/FileTable";
import { FilterBar } from "../components/FilterBar";
import { StatusLine } from "../components/StatusLine";
import { useFolderContents } from "../hooks/useFolderContents";
import { toEntries } from "../utils/entries";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES, routeTo } from "../routes";
import { useDownloadFile } from "../hooks/useDownloadFile";
import { useDeleteFile } from "../hooks/useDeleteFile";
import type { FileInfo, FolderInfo } from "../api/types";
import { Modal } from "../components/Modal";
import { baseName, joinPath } from "../utils/format";
import type { FormEvent } from "react";
import { Field } from "../components/Field";
import { useCreateFolder } from "../hooks/useCreateFolder";
import { useDeleteFolder } from "../hooks/useDeleteFolder";

// The root of the user's storage.
export default function HomePage() {
  const { folderId: param } = useParams();
  const folderId = param === undefined ? undefined : Number(param);

  const { data, isPending, error, refetch } = useFolderContents(folderId);
  // The filter belongs to the folder where it was typed, so it does not
  // follow the user into the next folder.
  const [typed, setTyped] = useState({ folderId, text: "" });
  const filter = typed.folderId === folderId ? typed.text : "";
  const [toDelete, setToDelete] = useState<FileInfo | null>(null); //file waiting to deletion confirmed
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [folderToDelete, setFolderToDelete] = useState<FolderInfo | null>(null);

  const navigate = useNavigate();
  const download = useDownloadFile();
  const remove = useDeleteFile();
  const create = useCreateFolder();
  const removeFolder = useDeleteFolder();

  function openCreate() {
    create.reset();
    setName("");
    setCreating(true);
  }

  // The name is created inside the folder being shown. The backend also
  // creates the parents of a name such as "reports/2026".
  function submitCreate(event: FormEvent) {
    event.preventDefault();
    if (!data || name.trim() === "") return;
    create.mutate(joinPath(data.path, name.trim()), {
      onSuccess: () => setCreating(false),
    });
  }

  function confirmDelete() {
    if (!toDelete) return;
    remove.mutate(toDelete.id, { onSettled: () => setToDelete(null) });
  }

  function confirmDeleteFolder() {
    if (!folderToDelete) return;
    removeFolder.mutate(folderToDelete.id, {
      onSettled: () => setFolderToDelete(null),
    });
  }

  const entries = data ? toEntries(data, filter) : [];

  return (
    <>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[9px] tracking-[.15em] text-accent-dim">
            CURRENT DIRECTORY
          </p>
          <h1 className="text-lg font-medium text-accent">
            {data ? `/${data.path}` : "..."}
          </h1>
        </div>
        <div className="flex gap-4">
          <Button onClick={openCreate} disabled={!data}>
            new dir
          </Button>
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
      {removeFolder.error && (
        <StatusLine>{errorMessage(removeFolder.error)}</StatusLine>
      )}

      {data && (
        <>
          <FilterBar
            value={filter}
            onChange={(text) => setTyped({ folderId, text })}
            count={entries.length}
          />
          <FileTable
            entries={entries}
            onOpenFolder={(folder) => navigate(routeTo.folder(folder.id))}
            onDownload={(file) => download.mutate(file)}
            onDelete={(file) => {
              remove.reset();
              setToDelete(file);
            }}
            onDeleteFolder={(folder) => {
              removeFolder.reset();
              setFolderToDelete(folder);
            }}
            onHistory={(file) => navigate(routeTo.history(file.id))}
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
      {creating && data && (
        <Modal
          title="new folder"
          size="sm"
          onClose={() => setCreating(false)}
          footer={
            <>
              <Button
                tone="muted"
                onClick={() => setCreating(false)}
                disabled={create.isPending}
              >
                cancel
              </Button>
              <Button
                type="submit"
                form="new-folder"
                disabled={name.trim() === "" || create.isPending}
              >
                {create.isPending ? "creating..." : "create"}
              </Button>
            </>
          }
        >
          <form id="new-folder" onSubmit={submitCreate}>
            <p className="mb-4 text-muted">
              Creates the folder inside{" "}
              <b className="text-accent">{`/${data.path}`}</b>.
            </p>
            <Field
              label="folder name"
              placeholder="reports"
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={create.isPending}
            />
            {create.error && (
              <StatusLine>{errorMessage(create.error)}</StatusLine>
            )}
          </form>
        </Modal>
      )}
      {folderToDelete && (
        <Modal
          title="delete folder"
          size="sm"
          onClose={() => setFolderToDelete(null)}
          footer={
            <>
              <Button
                tone="muted"
                onClick={() => setFolderToDelete(null)}
                disabled={removeFolder.isPending}
              >
                cancel
              </Button>
              <Button
                tone="danger"
                onClick={confirmDeleteFolder}
                disabled={removeFolder.isPending}
              >
                {removeFolder.isPending ? "deleting..." : "delete"}
              </Button>
            </>
          }
        >
          Delete <b className="text-accent">{baseName(folderToDelete.path)}/</b>{" "}
          and everything inside it: its folders, files and all their versions?
          This cannot be undone.
        </Modal>
      )}
    </>
  );
}
