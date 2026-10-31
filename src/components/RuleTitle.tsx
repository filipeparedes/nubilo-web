import type { ReactNode } from "react";

type Tone = "accent" | "muted";

const TONES: Record<Tone, string> = {
  accent: "text-accent",
  muted: "text-accent-dim",
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
  tone = "accent",
}: RuleTitleProps) {
  return (
    <div className={`flex items-center gap-2 ${TONES[tone]}`}>
      <span className="whitespace-nowrap">
        ┤ {uppercase ? title.toUpperCase() : title} ├
      </span>
      <span
        className="min-w-0 flex-1 overflow-hidden whitespace-nowrap text-line"
        aria-hidden="true"
      >
        {"─".repeat(200)}
      </span>
      {right}
    </div>
  );
}
