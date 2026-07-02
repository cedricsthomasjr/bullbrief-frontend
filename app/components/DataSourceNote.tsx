"use client";

type Props = {
  label: string;
  href?: string | null;
  className?: string;
  align?: "left" | "right";
};

export default function DataSourceNote({
  label,
  href,
  className = "",
  align = "right",
}: Props) {
  const classes = [
    "mt-2 flex",
    align === "right" ? "justify-end" : "justify-start",
    className,
  ].join(" ");

  const content = (
    <>
      <span className="text-slate-700">Source:</span>
      <span className="text-slate-600">{label}</span>
    </>
  );

  return (
    <div className={classes}>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={`Source: ${label}`}
          className="inline-flex max-w-full items-center gap-1.5 truncate rounded-md border border-white/[0.06] bg-black/20 px-2 py-1 text-[10px] tracking-wide transition-colors hover:border-white/20 hover:text-slate-500"
        >
          {content}
        </a>
      ) : (
        <span
          title={`Source: ${label}`}
          className="inline-flex max-w-full items-center gap-1.5 truncate rounded-md border border-white/[0.06] bg-black/20 px-2 py-1 text-[10px] tracking-wide"
        >
          {content}
        </span>
      )}
    </div>
  );
}
