import { useEffect } from "react";
import type { ReactNode } from "react";
import { Button } from "./Button";

type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-3xl",
};

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: Size;
  // Buttons or text at the bottom, such as the confirm and cancel actions.
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
      className="fixed inset-0 flex items-center justify-center bg-bg/80 p-4"
      role="presentation"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <section
        className={`w-full border border-line bg-bg ${SIZES[size]}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 px-3 py-2 text-accent">
          <span className="min-w-0 overflow-hidden whitespace-nowrap">
            ┌─ {title.toUpperCase()} {"─".repeat(40)}
          </span>
          <Button onClick={onClose} aria-label="Close">
            x
          </Button>
        </div>
        <div className="p-4">{children}</div>
        {footer && <div className="flex justify-end gap-3 px-4 pb-4">{footer}</div>}
        <div
          className="overflow-hidden whitespace-nowrap px-3 py-1 text-line"
          aria-hidden="true"
        >
          └{"─".repeat(60)}┘
        </div>
      </section>
    </div>
  );
}