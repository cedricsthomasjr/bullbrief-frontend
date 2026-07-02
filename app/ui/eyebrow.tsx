import { cn } from "@/app/lib/utils";
import { TONE, type Tone } from "@/app/lib/tone";

// Small caps section label, e.g. "How it works", "Valuation". One place to
// tune the treatment instead of repeating text-[10px] uppercase tracking-widest
// on every heading across the app.
export function Eyebrow({
  children,
  tone = "sky",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <p className={cn("text-xs font-semibold uppercase tracking-wide", TONE[tone].text, className)}>
      {children}
    </p>
  );
}

// Small colored pill, e.g. metric group headers, status badges.
export function Tag({
  children,
  tone = "slate",
  icon,
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium",
        TONE[tone].soft,
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
