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

const itemClass =
  "relative flex items-center gap-3 rounded-xl px-2 py-2 transition-colors duration-150 hover:bg-white/[0.05]";
const activeItemClass = "bg-sky-400/[0.08] hover:bg-sky-400/[0.08]";
const labelClass =
  "whitespace-nowrap text-xs font-medium overflow-hidden max-w-0 opacity-0 -translate-x-1 transition-all duration-300 group-hover/globalnav:max-w-[200px] group-hover/globalnav:opacity-100 group-hover/globalnav:translate-x-0";

export default function GlobalSideNav() {
  const pathname = usePathname();
  const { sections } = useSideNavContext();
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

  return (
    <nav
      aria-label={pageMode ? "Page sections" : "Site navigation"}
      className="hidden xl:flex fixed left-3 top-1/2 -translate-y-1/2 z-40 group/globalnav"
    >
      <div className="rounded-2xl px-2 py-3 flex flex-col gap-0.5 bg-[#0c1829]/90 backdrop-blur-xl border border-white/[0.08] shadow-[0_0_36px_rgba(0,0,0,0.4)]">
        {/* ── PAGE MODE: in-page scrollspy ─────────────────────────────────── */}
        {pageMode && sections.map((item, idx) => {
          const isActive = item.href ? false : item.id === activeId;
          const num = String(idx + 1).padStart(2, "0");

          const badge = (
            <span
              className={`shrink-0 flex h-[22px] w-[22px] items-center justify-center rounded-md text-[10px] font-mono font-bold tabular-nums border transition-colors duration-150 ${
                isActive
                  ? "bg-sky-400 border-sky-400 text-[#06101e]"
                  : "bg-white/[0.05] border-white/[0.08] text-slate-500"
              }`}
            >
              {num}
            </span>
          );

          const label = (
            <span className={`${labelClass} ${isActive ? "text-blue-50" : "text-slate-400"}`}>
              {item.label}
            </span>
          );

          return (
            <div key={item.id}>
              {item.href ? (
                <Link href={item.href} className={`${itemClass} ${isActive ? activeItemClass : ""}`}>
                  {badge}{label}
                </Link>
              ) : (
                <a href={`#${item.id}`} onClick={scrollTo(item.id)} className={`${itemClass} ${isActive ? activeItemClass : ""}`}>
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
            <Link key={href} href={href} className={`${itemClass} ${isActive ? activeItemClass : ""}`}>
              <span
                className={`shrink-0 flex h-[26px] w-[26px] items-center justify-center rounded-lg border transition-colors duration-150 ${
                  isActive
                    ? "bg-sky-400/10 border-sky-400/30 text-sky-300"
                    : "bg-white/[0.05] border-white/[0.08] text-slate-500"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </span>
              <span className={`${labelClass} ${isActive ? "text-blue-50" : "text-slate-400"}`}>
                {label}
              </span>
            </Link>
          );
        })}

        {/* Bottom version pill */}
        <div className="mt-2 pt-2 overflow-hidden max-w-[26px] transition-all duration-300 group-hover/globalnav:max-w-[150px] border-t border-white/[0.06]">
          <span className="block text-[9px] font-medium font-mono uppercase tracking-wide text-center whitespace-nowrap text-slate-700">
            v0.1
          </span>
        </div>
      </div>
    </nav>
  );
}
