type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, string> = {
  sm: "text-[13px]",
  md: "text-lg",
  lg: "text-2xl",
};

interface WordmarkProps {
  size?: Size;
  // Show the blinking cursor after the name.
  cursor?: boolean;
}

// The app name.
export function Wordmark({ size = "md", cursor = true }: WordmarkProps) {
  return (
    <div className={`text-accent ${SIZES[size]}`} aria-label="Nubilo">
      NUBILO
      {cursor && <span className="animate-pulse">_</span>}
    </div>
  );
}