import type { VersionInfo } from "../../api/types";
import { formatDate, formatSize } from "../../utils/format";
import type { Column } from "../ui/DataTable";
import { DataTable } from "../ui/DataTable";
import { EmptyState } from "../ui/EmptyState";

// The current version is marked, so the user can tell it from the old ones.
function columns(currentVersion: number): Column<VersionInfo>[] {
  return [
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
}

// The history of a file: one row per version, as the backend sends them,
// newest first. The highest version number is the current one.
export function VersionTable({ versions }: { versions: VersionInfo[] }) {
  const current = Math.max(...versions.map((version) => version.version));

  return (
    <DataTable
      label="Versions"
      columns={columns(current)}
      rows={versions}
      getKey={(version) => version.version}
      empty={<EmptyState message="This file has no versions." />}
    />
  );
}
