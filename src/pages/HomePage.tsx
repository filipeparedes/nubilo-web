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

// The root of the user's storage.
export default function HomePage() {
  const { data, isPending, error, refetch } = useFolderContents();
  const [filter, setFilter] = useState("");
  
  const navigate = useNavigate();
  const download = useDownloadFile();

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
      {download.error && <StatusLine>{errorMessage(download.error)}</StatusLine>}

      {data && (
        <>
          <FilterBar
            value={filter}
            onChange={setFilter}
            count={entries.length}
          />
          <FileTable entries={entries} onDownload={(file) => download.mutate(file)} />
        </>
      )}
    </>
  );
}
