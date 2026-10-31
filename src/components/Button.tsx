import type { ButtonHTMLAttributes } from "react";

type Tone = "normal" | "danger" | "success" | "muted";
type Size = "sm" | "md";

const TONES: Record<Tone, string> = {
  normal: "text-accent hover:bg-accent hover:text-bg",
  danger: "text-error hover:bg-error hover:text-bg",
  success: "text-ok hover:bg-ok hover:text-bg",
  muted: "text-accent-dim hover:bg-accent-dim hover:text-bg",
};

const SIZES: Record<Size, string> = {
  sm: "text-xs",
  md: "text-[13px]",
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
      className={`cursor-pointer whitespace-pre disabled:cursor-not-allowed disabled:opacity-50 ${TONES[tone]} ${SIZES[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {brackets ? <>[ {children} ]</> : children}
    </button>
  );
}
