import { useRef, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { formatSize } from "../utils/format";

interface FileDropZoneProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> {
  // The chosen file, or null when there is none.
  file: File | null;
  onFileChange: (file: File | null) => void;
}

// A box to drop a file on, or to click (or press Enter) to browse. It does
// not upload anything: it only tells the parent which file was chosen. Every
// other prop (accept, disabled...) goes to the hidden <input>.
export function FileDropZone({
  file,
  onFileChange,
  disabled = false,
  className = "",
  ...props
}: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragging(false);
    if (disabled) return;
    onFileChange(event.dataTransfer.files[0] ?? null);
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (!disabled) inputRef.current?.click();
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`flex cursor-pointer flex-col items-center gap-1 border border-dashed px-4 py-10 text-center focus-visible:border-accent focus-visible:outline-0 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 ${dragging ? "border-accent bg-panel-alt" : "border-line bg-panel"} ${className}`}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        disabled={disabled}
        onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        {...props}
      />
      {file ? (
        <>
          <span className="text-accent">{file.name}</span>
          <span className="text-muted">{formatSize(file.size)}</span>
        </>
      ) : (
        <>
          <span className="text-accent">[ drop a file here ]</span>
          <span className="text-muted">or click to browse</span>
        </>
      )}
    </div>
  );
}
