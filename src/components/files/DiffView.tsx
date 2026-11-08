import type { DiffLine, DiffRow } from "../../utils/diff";
import { EmptyState } from "../ui/EmptyState";

interface DiffViewProps {
  rows: DiffRow[];
  // What is written above each side, such as "v1" and "v3".
  leftLabel: string;
  rightLabel: string;
}

// The background and the sign of a side, by the kind of its row. A side with
// no line (the other side was added or removed) is drawn dimmed and empty.
function sideStyle(
  kind: DiffRow["kind"],
  side: "left" | "right",
): { background: string; sign: string } {
  if (kind === "same") return { background: "", sign: " " };
  if (side === "left") {
    return kind === "added"
      ? { background: "bg-panel-alt", sign: " " }
      : { background: "bg-error/15", sign: "-" };
  }
  return kind === "removed"
    ? { background: "bg-panel-alt", sign: " " }
    : { background: "bg-ok/15", sign: "+" };
}

function Side({
  line,
  kind,
  side,
}: {
  line: DiffLine | null;
  kind: DiffRow["kind"];
  side: "left" | "right";
}) {
  const { background, sign } = sideStyle(kind, side);
  const signColor = sign === "-" ? "text-error" : "text-ok";

  return (
    <div
      role="cell"
      className={`flex min-w-0 gap-2 px-2 ${background} ${
        side === "right" ? "border-l border-line" : ""
      }`}
    >
      <span className="w-10 shrink-0 select-none text-right text-muted">
        {line?.number}
      </span>
      <span className={`w-3 shrink-0 select-none ${signColor}`}>{sign}</span>
      <span className="min-w-0 flex-1 whitespace-pre-wrap break-words">
        {line?.text}
      </span>
    </div>
  );
}

// Two versions of a text side by side, line by line. The older version is on
// the left, with the removed lines in red, and the newer one on the right,
// with the added lines in green. Both sides of a row are as tall as the
// taller one, so the lines stay lined up.
export function DiffView({ rows, leftLabel, rightLabel }: DiffViewProps) {
  if (rows.length === 0) {
    return <EmptyState message="Both versions are empty." />;
  }

  return (
    <div
      className="border border-line"
      role="table"
      aria-label="Comparison of versions"
    >
      <div className="grid grid-cols-2 bg-panel-alt text-accent" role="row">
        <span role="columnheader" className="px-2 py-1">
          {leftLabel}
        </span>
        <span role="columnheader" className="border-l border-line px-2 py-1">
          {rightLabel}
        </span>
      </div>
      <div className="max-h-[60vh] overflow-auto">
        {rows.map((row, index) => (
          <div key={index} className="grid grid-cols-2" role="row">
            <Side line={row.left} kind={row.kind} side="left" />
            <Side line={row.right} kind={row.kind} side="right" />
          </div>
        ))}
      </div>
    </div>
  );
}
