import { useState } from "react";
import { useParams } from "react-router-dom";
import { errorMessage } from "../api/errorMessage";
import type { VersionInfo } from "../api/types";
import { CompareModal } from "../components/files/CompareModal";
import { VersionTable } from "../components/files/VersionTable";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { StatusLine } from "../components/ui/StatusLine";
import { useGoBack } from "../hooks/app/useGoBack";
import { useCompareVersions } from "../hooks/files/useCompareVersions";
import { useDownloadVersion } from "../hooks/files/useDownloadVersion";
import { useFileVersions } from "../hooks/files/useFileVersions";
import { useRestoreVersion } from "../hooks/files/useRestoreVersion";
import { useVersionDiff } from "../hooks/files/useVersionDiff";
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

  // The versions picked to be compared (at most two), and the pair that is
  // being compared, older first.
  const [picked, setPicked] = useState<number[]>([]);
  const [comparing, setComparing] = useState<{
    from: number;
    to: number;
  } | null>(null);
  const diff = useVersionDiff(
    fileId,
    comparing?.from ?? null,
    comparing?.to ?? null,
  );
  const summary = useCompareVersions(
    fileId,
    comparing?.from ?? null,
    comparing?.to ?? null,
  );

  function confirmRestore() {
    if (!toRestore) return;
    restore.mutate(
      { fileId, version: toRestore.version },
      { onSettled: () => setToRestore(null) },
    );
  }

  // Picking a third version drops the one picked first.
  function togglePick(version: VersionInfo) {
    setPicked((current) =>
      current.includes(version.version)
        ? current.filter((number) => number !== version.version)
        : [...current, version.version].slice(-2),
    );
  }

  function openComparison() {
    const [from, to] = [...picked].sort((a, b) => a - b);
    setComparing({ from, to });
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
          <Button onClick={openComparison} disabled={picked.length !== 2}>
            compare ({picked.length}/2)
          </Button>
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
          selected={picked}
          onToggleSelect={togglePick}
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
      {comparing && data && (
        <CompareModal
          fileName={baseName(data.path)}
          fromVersion={comparing.from}
          toVersion={comparing.to}
          diff={diff.data}
          summary={summary.data}
          error={diff.error ? errorMessage(diff.error) : undefined}
          onClose={() => setComparing(null)}
        />
      )}
    </>
  );
}
