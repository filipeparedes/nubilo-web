import type { ButtonHTMLAttributes } from "react";

type Tone = "normal" | "danger" | "success" | "muted";
type Size = "sm" | "md";

// On hover and keyboard focus the colors invert (text on a colored
// background). A disabled button does not react.
const TONES: Record<Tone, string> = {
  normal:
    "text-accent enabled:hover:bg-accent enabled:hover:text-bg enabled:focus-visible:bg-accent enabled:focus-visible:text-bg",
  danger:
    "text-error enabled:hover:bg-error enabled:hover:text-bg enabled:focus-visible:bg-error enabled:focus-visible:text-bg",
  success:
    "text-ok enabled:hover:bg-ok enabled:hover:text-bg enabled:focus-visible:bg-ok enabled:focus-visible:text-bg",
  muted:
    "text-muted enabled:hover:bg-muted enabled:hover:text-bg enabled:focus-visible:bg-muted enabled:focus-visible:text-bg",
};

const SIZES: Record<Size, string> = {
  sm: "text-[10px]",
  md: "",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: Tone;
  size?: Size;
  // Stretch to the full width of the container.
  fullWidth?: boolean;
  // Draw the label as "[ label ]". Turn off for a bare text button.
  brackets?: boolean;
}

// The terminal-style button. It is type="button" by default, so only the
// submit button of a form needs type="submit".
export function Button({
  tone = "normal",
  size = "md",
  fullWidth = false,
  brackets = true,
  type = "button",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`cursor-pointer whitespace-nowrap py-0.5 font-medium focus-visible:outline-0 disabled:cursor-not-allowed disabled:text-muted disabled:opacity-50 ${TONES[tone]} ${SIZES[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {brackets ? <>[ {children} ]</> : children}
    </button>
  );
}
