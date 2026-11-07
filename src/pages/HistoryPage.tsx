import { useParams } from "react-router-dom";
import { errorMessage } from "../api/errorMessage";
import { Button } from "../components/Button";
import { StatusLine } from "../components/StatusLine";
import { VersionTable } from "../components/VersionTable";
import { useFileVersions } from "../hooks/useFileVersions";
import { useGoBack } from "../hooks/useGoBack";

// The history of a file: every version it has had, newest first.
export default function HistoryPage() {
  const { fileId: param } = useParams();
  const goBack = useGoBack();
  const { data, isPending, error, refetch } = useFileVersions(Number(param));

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
      {data && <VersionTable versions={data.versions} />}
    </>
  );
}