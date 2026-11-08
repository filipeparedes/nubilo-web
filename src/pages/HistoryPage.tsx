import { useParams } from "react-router-dom";
import { errorMessage } from "../api/errorMessage";
import { Button } from "../components/ui/Button";
import { StatusLine } from "../components/ui/StatusLine";
import { VersionTable } from "../components/files/VersionTable";
import { useFileVersions } from "../hooks/files/useFileVersions";
import { useGoBack } from "../hooks/app/useGoBack";
import { useDownloadVersion } from "../hooks/files/useDownloadVersion";
import { useRestoreVersion } from "../hooks/files/useRestoreVersion";
import { useState } from "react";
import type { VersionInfo } from "../api/types";
import { Modal } from "../components/ui/Modal";
import { baseName } from "../utils/format";

// The history of a file: every version it has had, newest first.
export default function HistoryPage() {
  const { fileId: param } = useParams();
  const goBack = useGoBack();
  const fileId = Number(param);
  const { data, isPending, error, refetch } = useFileVersions(fileId);
  const download = useDownloadVersion();
  const restore = useRestoreVersion();

  // The version waiting for the user to confirm its restore.
  const [toRestore, setToRestore] = useState<VersionInfo | null>(null);

  function confirmRestore() {
    if (!toRestore) return;
    restore.mutate(
      { fileId, version: toRestore.version },
      { onSettled: () => setToRestore(null) },
    );
  }

  return (
    <>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[9px] tracking-[.15em] text-accent-dim">
            FILE HISTORY
          </p>
          <h1 className="break-all text-lg font-medium text-accent">
            {data ? `/${data.path}` : "..."}
          </h1>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => refetch()}>refresh</Button>
          <Button tone="muted" onClick={goBack}>
            back
          </Button>
        </div>
      </div>

      {isPending && <StatusLine tone="muted">loading...</StatusLine>}
      {error && <StatusLine>{errorMessage(error)}</StatusLine>}
      {download.error && (
        <StatusLine>{errorMessage(download.error)}</StatusLine>
      )}
      {restore.error && <StatusLine>{errorMessage(restore.error)}</StatusLine>}
      {restore.isSuccess && (
        <StatusLine tone="success">
          RESTORED :: v{restore.variables.version} is now the current version,
          as v{restore.data.version}
        </StatusLine>
      )}
      {data && (
        <VersionTable
          versions={data.versions}
          onDownload={(version) =>
            download.mutate({
              fileId,
              path: data.path,
              version: version.version,
            })
          }
          onRestore={(version) => {
            restore.reset();
            setToRestore(version);
          }}
        />
      )}
      {toRestore && data && (
        <Modal
          title="restore version"
          size="sm"
          onClose={() => setToRestore(null)}
          footer={
            <>
              <Button
                tone="muted"
                onClick={() => setToRestore(null)}
                disabled={restore.isPending}
              >
                cancel
              </Button>
              <Button onClick={confirmRestore} disabled={restore.isPending}>
                {restore.isPending ? "restoring..." : "restore"}
              </Button>
            </>
          }
        >
          Restore <b className="text-accent">v{toRestore.version}</b> of{" "}
          <b className="text-accent">{baseName(data.path)}</b>? A new version is
          added with its content, and no version is deleted.
        </Modal>
      )}
    </>
  );
}
