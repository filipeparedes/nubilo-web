import type { VersionComparison } from "../../api/types";
import type { VersionDiff } from "../../utils/diff";
import { formatSize } from "../../utils/format";
import { Modal } from "../ui/Modal";
import { StatusLine } from "../ui/StatusLine";
import { DiffView } from "./DiffView";

interface CompareModalProps {
  fileName: string;
  fromVersion: number;
  toVersion: number;
  // The comparison of the text. Missing while it is being loaded.
  diff?: VersionDiff;
  // The chunk-level summary from the server. It is optional: the comparison
  // is shown without it.
  summary?: VersionComparison;
  // The message of a failed load.
  error?: string;
  onClose: () => void;
}

// A box with a message in the middle, for a comparison that cannot be shown.
function Notice({ children }: { children: string }) {
  return (
    <div className="grid min-h-48 place-items-center border border-line text-center text-muted">
      {children}
    </div>
  );
}

// Two versions of a file side by side. It does not load anything: the
// caller gives it the result, and it asks to be closed through onClose.
export function CompareModal({
  fileName,
  fromVersion,
  toVersion,
  diff,
  summary,
  error,
  onClose,
}: CompareModalProps) {
  const identical =
    diff?.kind === "text" && diff.rows.every((row) => row.kind === "same");

  return (
    <Modal title={`compare ${fileName}`} size="xl" onClose={onClose}>
      {summary && (
        <p className="mb-4 text-muted">
          v{summary.fromVersion} {formatSize(summary.fromSize)} → v
          {summary.toVersion} {formatSize(summary.toSize)} ::{" "}
          {summary.changes.length} chunks changed, {summary.unchangedChunks}{" "}
          unchanged
        </p>
      )}
      {error && <StatusLine>{error}</StatusLine>}
      {!diff && !error && <StatusLine tone="muted">loading...</StatusLine>}
      {diff?.kind === "unsupported" && <Notice>Format not supported</Notice>}
      {diff?.kind === "tooLarge" && (
        <Notice>These versions are too large to compare</Notice>
      )}
      {identical && (
        <StatusLine tone="muted">
          These versions have the same content.
        </StatusLine>
      )}
      {diff?.kind === "text" && (
        <DiffView
          rows={diff.rows}
          leftLabel={`v${fromVersion}`}
          rightLabel={`v${toVersion}`}
        />
      )}
    </Modal>
  );
}