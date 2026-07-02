// Shared semantic color tokens for data-driven accents (SWOT, metric groups,
// driver signals, etc). Keeping this in one place means a component picks a
// *meaning* ("emerald" = positive, "rose" = negative) instead of every file
// inventing its own rgba() string for the same five colors.

export type Tone = "sky" | "indigo" | "violet" | "emerald" | "rose" | "amber" | "slate";

type ToneClasses = {
  text: string;
  dot: string;
  soft: string; // bg + border + text, for pill/badge use
  border: string;
  bar: string; // solid background, for progress/driver bars
  spinnerBorder: string; // border-t-* for spinner rings
  /** Raw hex, only for the rare case a Tailwind class can't reach (e.g.
   * overriding .bb-card's own border-color via inline style, canvas/SVG fill). */
  hex: string;
};

export const TONE: Record<Tone, ToneClasses> = {
  sky: {
    text: "text-sky-400",
    dot: "bg-sky-400",
    soft: "bg-sky-400/10 border-sky-400/20 text-sky-300",
    border: "border-sky-400/20",
    bar: "bg-sky-400",
    spinnerBorder: "border-t-sky-400",
    hex: "#38bdf8",
  },
  indigo: {
    text: "text-indigo-400",
    dot: "bg-indigo-400",
    soft: "bg-indigo-400/10 border-indigo-400/20 text-indigo-300",
    border: "border-indigo-400/20",
    bar: "bg-indigo-400",
    spinnerBorder: "border-t-indigo-400",
    hex: "#818cf8",
  },
  violet: {
    text: "text-violet-400",
    dot: "bg-violet-400",
    soft: "bg-violet-400/10 border-violet-400/20 text-violet-300",
    border: "border-violet-400/20",
    bar: "bg-violet-400",
    spinnerBorder: "border-t-violet-400",
    hex: "#a78bfa",
  },
  emerald: {
    text: "text-emerald-400",
    dot: "bg-emerald-400",
    soft: "bg-emerald-400/10 border-emerald-400/20 text-emerald-300",
    border: "border-emerald-400/20",
    bar: "bg-emerald-400",
    spinnerBorder: "border-t-emerald-400",
    hex: "#34d399",
  },
  rose: {
    text: "text-rose-400",
    dot: "bg-rose-400",
    soft: "bg-rose-400/10 border-rose-400/20 text-rose-300",
    border: "border-rose-400/20",
    bar: "bg-rose-400",
    spinnerBorder: "border-t-rose-400",
    hex: "#fb7185",
  },
  amber: {
    text: "text-amber-400",
    dot: "bg-amber-400",
    soft: "bg-amber-400/10 border-amber-400/20 text-amber-300",
    border: "border-amber-400/20",
    bar: "bg-amber-400",
    spinnerBorder: "border-t-amber-400",
    hex: "#fbbf24",
  },
  slate: {
    text: "text-slate-400",
    dot: "bg-slate-400",
    soft: "bg-slate-400/10 border-slate-400/20 text-slate-300",
    border: "border-slate-400/20",
    bar: "bg-slate-400",
    spinnerBorder: "border-t-slate-400",
    hex: "#94a3b8",
  },
};
