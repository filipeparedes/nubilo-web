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
      {label && (
        <span className="mb-1 block text-[10px] uppercase tracking-[.1em] text-accent-dim">
          {label}
        </span>
      )}
      <span
        className={`flex h-[34px] items-center gap-2 border bg-panel px-2 ${invalid ? "border-error" : "border-line focus-within:border-accent"}`}
      >
        {prompt && (
          <span className="text-accent" aria-hidden="true">
            {prompt}
          </span>
        )}
        <input
          className="min-w-0 flex-1 border-0 bg-transparent text-fg outline-0"
          aria-invalid={invalid}
          {...props}
        />
        {cursor && (
          <span
            className="inline-block h-3.5 w-[7px] animate-blink bg-accent motion-reduce:animate-none"
            aria-hidden="true"
          />
        )}
      </span>
    </label>
  );
}
