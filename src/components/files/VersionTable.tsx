import type { VersionInfo } from "../../api/types";
import { formatDate, formatSize } from "../../utils/format";
import { Button } from "../ui/Button";
import type { Column } from "../ui/DataTable";
import { DataTable } from "../ui/DataTable";
import { EmptyState } from "../ui/EmptyState";

interface VersionTableProps {
  versions: VersionInfo[];
  // Called with the version when its get button is pressed. Without it the
  // table has no actions column.
  onDownload?: (version: VersionInfo) => void;
}

// The current version is marked, so the user can tell it from the old ones.
function columns(
  currentVersion: number,
  onDownload?: (version: VersionInfo) => void,
): Column<VersionInfo>[] {
  const base: Column<VersionInfo>[] = [
    {
      header: "VERSION",
      width: "150px",
      render: (version) => (
        <>
          v{version.version}
          {version.version === currentVersion && (
            <span className="ml-2 text-ok">● current</span>
          )}
        </>
      ),
    },
    {
      header: "SIZE",
      width: "90px",
      render: (version) => formatSize(version.size),
    },
    {
      header: "CONTENT TYPE",
      width: "minmax(120px, 1fr)",
      render: (version) => version.contentType,
    },
    {
      header: "CREATED",
      width: "155px",
      render: (version) => formatDate(version.createdAt),
    },
  ];

  if (!onDownload) return base;
  return [
    ...base,
    {
      header: "ACTIONS",
      width: "120px",
      render: (version) => (
        <Button onClick={() => onDownload(version)}>get</Button>
      ),
    },
  ];
}

// The history of a file: one row per version, as the backend sends them,
// newest first. The highest version number is the current one.
export function VersionTable({ versions, onDownload }: VersionTableProps) {
  const current = Math.max(...versions.map((version) => version.version));

  return (
    <DataTable
      label="Versions"
      columns={columns(current, onDownload)}
      rows={versions}
      getKey={(version) => version.version}
      empty={<EmptyState message="This file has no versions." />}
    />
  );
}
