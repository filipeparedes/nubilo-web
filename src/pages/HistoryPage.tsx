import { useParams } from "react-router-dom";
import { errorMessage } from "../api/errorMessage";
import { Button } from "../components/ui/Button";
import { StatusLine } from "../components/ui/StatusLine";
import { VersionTable } from "../components/files/VersionTable";
import { useFileVersions } from "../hooks/files/useFileVersions";
import { useGoBack } from "../hooks/app/useGoBack";
import { useDownloadVersion } from "../hooks/files/useDownloadVersion";

// The history of a file: every version it has had, newest first.
export default function HistoryPage() {
  const { fileId: param } = useParams();
  const goBack = useGoBack();
  const fileId = Number(param);
  const { data, isPending, error, refetch } = useFileVersions(fileId);
  const download = useDownloadVersion();

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
        />
      )}
    </>
  );
}
