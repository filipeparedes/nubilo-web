import type { InputHTMLAttributes } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  // Text above the input. Leave out for an input without a label.
  label?: string;
  // The character before the text. Use "" to hide it.
  prompt?: string;
  // Show the blinking block cursor after the text.
  cursor?: boolean;
  // Draw the border in the error color.
  invalid?: boolean;
}

// A terminal input. Every other prop (type, value, onChange, autoFocus,
// placeholder...) goes straight to the <input>.
export function Field({
  label,
  prompt = ">",
  cursor = true,
  invalid = false,
  className = "",
  ...props
}: FieldProps) {
  return (
    <label className={`mb-4 block ${className}`}>
      {label && <span className="mb-1 block text-accent-dim">{label}</span>}
      <span
        className={`flex items-center gap-2 border px-2 py-1 ${invalid ? "border-error" : "border-line focus-within:border-accent"}`}
      >
        {prompt && (
          <span className="text-accent" aria-hidden="true">
            {prompt}
          </span>
        )}
        <input
          className="min-w-0 flex-1 bg-transparent text-fg outline-none placeholder:text-accent-dim"
          aria-invalid={invalid}
          {...props}
        />
        {cursor && (
          <span
            className="h-[1em] w-[0.6em] animate-pulse bg-accent"
            aria-hidden="true"
          />
        )}
      </span>
    </label>
  );
}
