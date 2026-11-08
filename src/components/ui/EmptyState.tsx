import type { ReactNode } from "react";

// The message of a list with nothing to show. `children` is for an
// action, such as a button.
export function EmptyState({
  message,
  children,
}: {
  message: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-[52px] text-center text-muted">
      <span className="text-base text-accent">[ EMPTY ]</span>
      <p>{message}</p>
      {children}
    </div>
  );
}
