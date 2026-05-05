"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpen,
  GitCompare,
  Home,
  Info,
} from "lucide-react";
import { useSideNavContext } from "@/app/context/SideNavContext";

// ── Site-level links (shown when no page sections are registered) ─────────────
const SITE_LINKS = [
  { href: "/",         label: "Home",     Icon: Home,       match: (p: string) => p === "/" },
  { href: "/movers",   label: "Movers",   Icon: Activity,   match: (p: string) => p === "/movers" },
  { href: "/compare",  label: "Compare",  Icon: GitCompare, match: (p: string) => p.startsWith("/compare") },
  { href: "/about",    label: "About",    Icon: Info,       match: (p: string) => p === "/about" },
  { href: "/glossary", label: "Glossary", Icon: BookOpen,   match: (p: string) => p === "/glossary" },
];

const SCROLL_OFFSET = 96; // px to clear sticky header

export default function GlobalSideNav() {
  const pathname = usePathname();
  const { sections, accent } = useSideNavContext();
  const pageMode = sections.length > 0;

  // ── Scrollspy state (page mode only) ────────────────────────────────────────
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!pageMode) { setActiveId(null); return; }

    const scrollTargets = sections.filter((s) => !s.href);
    const elements = scrollTargets
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    setActiveId(elements[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: `-${SCROLL_OFFSET}px 0px -55% 0px`, threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pageMode, sections]);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET, behavior: "smooth" });
    setActiveId(id);
  };

  // ── Shared shell ─────────────────────────────────────────────────────────────
  const containerAccent = pageMode ? accent : "#38bdf8";

  return (
    <nav
      aria-label={pageMode ? "Page sections" : "Site navigation"}
      className="hidden xl:flex fixed left-3 top-1/2 -translate-y-1/2 z-40 group/globalnav"
    >
      <div
        className="rounded-2xl px-2 py-3 flex flex-col gap-0.5 backdrop-blur-xl transition-all duration-300"
        style={{
          backgroundColor: "rgba(8,18,36,0.76)",
          border: `1px solid ${containerAccent}1e`,
          boxShadow: `0 0 36px rgba(8,18,36,0.5), 0 0 24px ${containerAccent}0d, inset 0 1px 0 ${containerAccent}0f`,
        }}
      >
        {/* ── PAGE MODE: in-page scrollspy ─────────────────────────────────── */}
        {pageMode && sections.map((item, idx) => {
          const isActive = item.href ? false : item.id === activeId;
          const num = String(idx + 1).padStart(2, "0");

          const badge = (
            <span
              className="shrink-0 flex items-center justify-center rounded-md text-[9px] font-mono font-bold tabular-nums transition-all duration-200"
              style={{
                width: 22, height: 22,
                color: isActive ? "#06101e" : "#64748b",
                backgroundColor: isActive ? containerAccent : "rgba(15,32,64,0.6)",
                border: `1px solid ${isActive ? containerAccent : "rgba(56,189,248,0.14)"}`,
                boxShadow: isActive ? `0 0 14px ${containerAccent}55` : "none",
              }}
            >
              {num}
            </span>
          );

          const label = (
            <span
              className="whitespace-nowrap text-xs font-medium overflow-hidden max-w-0 opacity-0 -translate-x-1 transition-all duration-300 group-hover/globalnav:max-w-[200px] group-hover/globalnav:opacity-100 group-hover/globalnav:translate-x-0"
              style={{ color: isActive ? "#eff6ff" : "#94a3b8" }}
            >
              {item.label}
            </span>
          );

          const itemClass = "relative flex items-center gap-3 rounded-xl px-2 py-2 transition-all duration-200";
          const itemStyle = { backgroundColor: isActive ? `${containerAccent}14` : "transparent" };
          const onEnter = (e: React.MouseEvent<HTMLElement>) => {
            if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(56,189,248,0.06)";
          };
          const onLeave = (e: React.MouseEvent<HTMLElement>) => {
            if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
          };

          return (
            <div key={item.id}>
              {item.href ? (
                <Link href={item.href} className={itemClass} style={itemStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
                  {badge}{label}
                </Link>
              ) : (
                <a href={`#${item.id}`} onClick={scrollTo(item.id)} className={itemClass} style={itemStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
                  {badge}{label}
                </a>
              )}
            </div>
          );
        })}

        {/* ── SITE MODE: page navigation links ─────────────────────────────── */}
        {!pageMode && SITE_LINKS.map(({ href, label, Icon, match }) => {
          const isActive = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              className="relative flex items-center gap-3 rounded-xl px-2 py-2 transition-all duration-200"
              style={{ backgroundColor: isActive ? `${containerAccent}14` : "transparent" }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(56,189,248,0.06)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              }}
            >
              <span
                className="shrink-0 flex items-center justify-center rounded-lg transition-all duration-200"
                style={{
                  width: 26, height: 26,
                  color: isActive ? containerAccent : "#64748b",
                  backgroundColor: isActive ? `${containerAccent}12` : "rgba(15,32,64,0.6)",
                  border: `1px solid ${isActive ? `${containerAccent}4d` : "rgba(56,189,248,0.1)"}`,
                  boxShadow: isActive ? `0 0 12px ${containerAccent}40` : "none",
                }}
              >
                <Icon className="w-3.5 h-3.5" />
              </span>
              <span
                className="whitespace-nowrap text-xs font-medium overflow-hidden max-w-0 opacity-0 -translate-x-1 transition-all duration-300 group-hover/globalnav:max-w-[150px] group-hover/globalnav:opacity-100 group-hover/globalnav:translate-x-0"
                style={{ color: isActive ? "#eff6ff" : "#94a3b8" }}
              >
                {label}
              </span>
            </Link>
          );
        })}

        {/* Bottom version pill */}
        <div
          className="mt-2 pt-2 overflow-hidden max-w-[26px] transition-all duration-300 group-hover/globalnav:max-w-[150px]"
          style={{ borderTop: `1px solid ${containerAccent}12` }}
        >
          <span
            className="block text-[8px] font-bold font-mono uppercase tracking-widest text-center whitespace-nowrap"
            style={{ color: `${containerAccent}3d` }}
          >
            v0.1
          </span>
        </div>
      </div>
    </nav>
  );
}
