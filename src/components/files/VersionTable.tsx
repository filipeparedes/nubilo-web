import type { VersionInfo } from "../../api/types";
import { formatDate, formatSize } from "../../utils/format";
import { Button } from "../ui/Button";
import type { Column } from "../ui/DataTable";
import { DataTable } from "../ui/DataTable";
import { EmptyState } from "../ui/EmptyState";

interface VersionTableProps {
  versions: VersionInfo[];
  // Called with the version when its get button is pressed.
  onDownload?: (version: VersionInfo) => void;
  // Called with the version when its restore button is pressed. The current
  // version has no restore button.
  onRestore?: (version: VersionInfo) => void;
  // The numbers of the versions that are picked, and the function called
  // when the box of a version is clicked. With onToggleSelect every row has a
  // box to pick it, such as to compare two versions.
  selected?: number[];
  onToggleSelect?: (version: VersionInfo) => void;
}

// The current version is marked, so the user can tell it from the old ones.
// Without any callback the table has no actions column.
function columns(
  currentVersion: number,
  {
    onDownload,
    onRestore,
    selected = [],
    onToggleSelect,
  }: Omit<VersionTableProps, "versions">,
): Column<VersionInfo>[] {
  const pick: Column<VersionInfo>[] = onToggleSelect
    ? [
        {
          header: "SEL",
          width: "60px",
          render: (version) => (
            <input
              type="checkbox"
              className="terminal-check"
              checked={selected.includes(version.version)}
              onChange={() => onToggleSelect(version)}
              aria-label={`Pick v${version.version}`}
            />
          ),
        },
      ]
    : [];

  const base: Column<VersionInfo>[] = [
    ...pick,
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

  if (!onDownload && !onRestore) return base;
  return [
    ...base,
    {
      header: "ACTIONS",
      width: "200px",
      render: (version) => (
        <span className="flex gap-4">
          {onDownload && (
            <Button onClick={() => onDownload(version)}>get</Button>
          )}
          {onRestore && version.version !== currentVersion && (
            <Button onClick={() => onRestore(version)}>restore</Button>
          )}
        </span>
      ),
    },
  ];
}

// The history of a file: one row per version, as the backend sends them,
// newest first. The highest version number is the current one.
export function VersionTable({
  versions,
  onDownload,
  onRestore,
  selected,
  onToggleSelect,
}: VersionTableProps) {
  const current = Math.max(...versions.map((version) => version.version));

  return (
    <DataTable
      label="Versions"
      columns={columns(current, {
        onDownload,
        onRestore,
        selected,
        onToggleSelect,
      })}
      rows={versions}
      getKey={(version) => version.version}
      empty={<EmptyState message="This file has no versions." />}
    />
  );
}
