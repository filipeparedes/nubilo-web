import { useEffect } from "react";
import type { ReactNode } from "react";
import { Button } from "./Button";

type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, string> = {
  sm: "max-w-sm",
  md: "max-w-[520px]",
  lg: "max-w-3xl",
};

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: Size;
  // Buttons at the bottom of the content, such as confirm and cancel.
  footer?: ReactNode;
  // Close when the dimmed background is clicked.
  closeOnBackdrop?: boolean;
  // Close when Escape is pressed.
  closeOnEscape?: boolean;
}

// A dialog drawn as a terminal box over a dimmed background. The caller
// decides when it is shown; the modal asks to be closed through onClose.
export function Modal({
  title,
  onClose,
  children,
  size = "md",
  footer,
  closeOnBackdrop = true,
  closeOnEscape = true,
}: ModalProps) {
  useEffect(() => {
    if (!closeOnEscape) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeOnEscape, onClose]);

  return (
    <div
      className="fixed inset-0 z-20 grid place-items-center bg-black/[.78] p-4"
      role="presentation"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <section
        className={`w-full border border-accent bg-bg ${SIZES[size]}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 bg-panel-alt px-3 py-2 text-accent">
          <span className="min-w-0 flex-1 overflow-hidden whitespace-nowrap">
            ┌─ {title.toUpperCase()} {"─".repeat(100)}
          </span>
          <Button onClick={onClose} aria-label="Close">
            x
          </Button>
        </div>
        <div className="p-6">
          {children}
          {footer && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {footer}
            </div>
          )}
        </div>
        <div
          className="flex items-center bg-panel-alt px-3 py-2 text-accent"
          aria-hidden="true"
        >
          <span>└</span>
          <span className="min-w-0 flex-1 overflow-hidden whitespace-nowrap">
            {"─".repeat(100)}
          </span>
          <span>┘</span>
        </div>
      </section>
    </div>
  );
}
