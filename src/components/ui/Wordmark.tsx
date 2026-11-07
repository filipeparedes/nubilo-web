type Size = "md" | "lg";

const SIZES: Record<Size, string> = {
  md: "text-[26px] tracking-[3px]",
  lg: "text-[52px] tracking-[8px]",
};

interface WordmarkProps {
  size?: Size;
  // Show the blinking cursor after the name.
  cursor?: boolean;
}

// The app name, in the display font. "md" is for the top bar, "lg" for
// the login screen.
export function Wordmark({ size = "md", cursor = true }: WordmarkProps) {
  return (
    <div
      className={`font-display leading-none text-accent ${SIZES[size]}`}
      aria-label="Nubilo"
    >
      NUBILO
      {cursor && (
        <span className="animate-blink motion-reduce:animate-none">_</span>
      )}
    </div>
  );
}
