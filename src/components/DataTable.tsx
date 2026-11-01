import type { ReactNode } from "react";

export interface Column<T> {
  header: string;
  // A CSS grid track: "70px", "1fr", "minmax(150px, 1.3fr)"...
  width: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getKey: (row: T) => string | number;
  // Accessible name of the table.
  label: string;
  // Drawn instead of the rows when there are none.
  empty?: ReactNode;
}

// A table drawn with a CSS grid, driven by column definitions. It scrolls
// sideways on small screens instead of squeezing the columns.
export function DataTable<T>({
  columns,
  rows,
  getKey,
  label,
  empty,
}: DataTableProps<T>) {
  const template = columns.map((column) => column.width).join(" ");

  return (
    <div className="overflow-x-auto">
      <div
        className="min-w-[760px] border border-line"
        role="table"
        aria-label={label}
      >
        <div
          className="grid min-h-[29px] items-center border-b border-line bg-panel-alt px-2 text-[9px] tracking-[.08em] text-accent-dim"
          style={{ gridTemplateColumns: template }}
          role="row"
        >
          {columns.map((column) => (
            <span key={column.header} role="columnheader">
              {column.header}
            </span>
          ))}
        </div>
        {rows.map((row) => (
          <div
            key={getKey(row)}
            className="grid min-h-[37px] items-center border-b border-[#2e281e] px-2 last:border-b-0 hover:bg-[#1d180f]"
            style={{ gridTemplateColumns: template }}
            role="row"
          >
            {columns.map((column) => (
              <span key={column.header} role="cell">
                {column.render(row)}
              </span>
            ))}
          </div>
        ))}
        {rows.length === 0 && empty}
      </div>
    </div>
  );
}
