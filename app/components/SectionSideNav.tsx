"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type SectionNavItem = {
  id: string;
  label: string;
  href?: string;
};

type Props = {
  items: SectionNavItem[];
  accent?: string;
  /** Offset in px subtracted from scroll target to clear sticky headers. */
  offset?: number;
};

export default function SectionSideNav({
  items,
  accent = "#38bdf8",
  offset = 96,
}: Props) {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState<string | null>(
    items.find((item) => !item.href)?.id ?? items[0]?.id ?? null,
  );

  useEffect(() => {
    if (typeof window === "undefined" || items.length === 0) return;

    const elements = items
      .filter((item) => !item.href)
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: `-${offset}px 0px -55% 0px`,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items, offset]);

  const handleClick = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveId(id);
  };

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Section navigation"
      className="hidden xl:flex fixed left-5 top-1/2 -translate-y-1/2 z-30 group"
    >
      <div
        className="rounded-2xl px-2 py-3 backdrop-blur-xl"
        style={{
          backgroundColor: "rgba(8, 18, 36, 0.72)",
          border: "1px solid rgba(56, 189, 248, 0.12)",
          boxShadow: `0 0 32px rgba(8, 18, 36, 0.4), 0 0 24px ${accent}10`,
        }}
      >
        <p
          className="px-2 mb-3 text-[9px] font-bold uppercase tracking-widest text-slate-600 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 hidden group-hover:block"
        >
          On this page
        </p>

        <ul className="flex flex-col">
          {items.map((item, idx) => {
            const isActive = item.href ? pathname === item.href : item.id === activeId;
            const num = String(idx + 1).padStart(2, "0");
            const commonClassName = "relative flex items-center gap-3 rounded-xl px-2 py-2 transition-all duration-200";
            const commonStyle = {
              backgroundColor: isActive ? `${accent}14` : "transparent",
            };
            const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
              if (!isActive) {
                event.currentTarget.style.backgroundColor = "rgba(56,189,248,0.06)";
              }
            };
            const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
              if (!isActive) {
                event.currentTarget.style.backgroundColor = "transparent";
              }
            };
            const content = (
              <>
                <span
                  className="shrink-0 flex items-center justify-center rounded-md text-[9px] font-mono font-bold tabular-nums transition-all duration-200"
                  style={{
                    width: 22,
                    height: 22,
                    color: isActive ? "#06101e" : "#64748b",
                    backgroundColor: isActive ? accent : "rgba(15, 32, 64, 0.6)",
                    border: `1px solid ${isActive ? accent : "rgba(56,189,248,0.14)"}`,
                    boxShadow: isActive ? `0 0 14px ${accent}55` : "none",
                  }}
                >
                  {num}
                </span>

                <span
                  className="whitespace-nowrap text-xs font-medium overflow-hidden max-w-0 opacity-0 -translate-x-1 transition-all duration-300 group-hover:max-w-[220px] group-hover:opacity-100 group-hover:translate-x-0"
                  style={{ color: isActive ? "#eff6ff" : "#94a3b8" }}
                >
                  {item.label}
                </span>
              </>
            );

            return (
              <li key={item.id} className="relative">
                {item.href ? (
                  <Link
                    href={item.href}
                    className={commonClassName}
                    style={commonStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {content}
                  </Link>
                ) : (
                  <a
                    href={`#${item.id}`}
                    onClick={handleClick(item.id)}
                    className={commonClassName}
                    style={commonStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {content}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
