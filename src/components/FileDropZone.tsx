import { useRef, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { formatSize } from "../utils/format";

interface FileDropZoneProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "multiple"
> {
  // The chosen files. An empty list means there is none.
  files: File[];
  onFilesChange: (files: File[]) => void;
}

// A box to drop files on, or to click (or press Enter) to browse. It does
// not upload anything: it only tells the parent which files were chosen.
// Choosing again replaces the list. Every other prop (accept, disabled...)
// goes to the hidden <input>.
export function FileDropZone({
  files,
  onFilesChange,
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
    onFilesChange(Array.from(event.dataTransfer.files));
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

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
        multiple
        className="hidden"
        disabled={disabled}
        onChange={(event) =>
          onFilesChange(Array.from(event.target.files ?? []))
        }
        {...props}
      />
      {files.length === 0 ? (
        <>
          <span className="text-accent">[ drop files here ]</span>
          <span className="text-muted">or click to browse</span>
        </>
      ) : (
        <>
          <ul className="max-h-40 w-full overflow-y-auto text-accent">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`} className="truncate">
                {file.name}
              </li>
            ))}
          </ul>
          <span className="text-muted">
            {files.length === 1 ? "1 file" : `${files.length} files`},{" "}
            {formatSize(totalSize)}
          </span>
        </>
      )}
    </div>
  );
}
