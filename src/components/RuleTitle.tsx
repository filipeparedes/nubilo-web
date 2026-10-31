import type { ReactNode } from "react";

type Tone = "dim" | "accent";

const TONES: Record<Tone, string> = {
  dim: "text-accent-dim",
  accent: "text-accent",
};

interface RuleTitleProps {
  title: string;
  // Something at the end of the line, such as a button or a counter.
  right?: ReactNode;
  uppercase?: boolean;
  tone?: Tone;
}

// A section title drawn as a rule: ┤ TITLE ├──────────────── [right]
export function RuleTitle({
  title,
  right,
  uppercase = true,
  tone = "dim",
}: RuleTitleProps) {
  return (
    <div
      className={`flex min-w-0 items-center gap-2 overflow-hidden whitespace-nowrap text-[10px] font-semibold tracking-[.12em] ${TONES[tone]}`}
    >
      <span>┤ {uppercase ? title.toUpperCase() : title} ├</span>
      <span
        className="flex-1 overflow-hidden tracking-normal text-line"
        aria-hidden="true"
      >
        {"─".repeat(200)}
      </span>
      {right}
    </div>
  );
}
