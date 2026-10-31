import type { ReactNode } from "react";

type Tone = "error" | "success" | "muted";

const TONES: Record<Tone, string> = {
  error: "text-error",
  success: "text-ok",
  muted: "text-accent-dim",
};

const PREFIXES: Record<Tone, string> = {
  error: "!",
  success: "✓",
  muted: "-",
};

interface StatusLineProps {
  children: ReactNode;
  tone?: Tone;
  // Overrides the default symbol of the tone.
  prefix?: string;
}

// A one-line message in the terminal style. Errors use role="alert", so
// screen readers announce them when they appear.
export function StatusLine({
  children,
  tone = "error",
  prefix,
}: StatusLineProps) {
  return (
    <div
      className={`mb-4 ${TONES[tone]}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {prefix ?? PREFIXES[tone]} {children}
    </div>
  );
}
