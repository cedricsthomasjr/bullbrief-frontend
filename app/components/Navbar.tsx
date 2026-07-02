"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MarketTicker from "./MarketTicker";

const NAV_LINKS = [
  { href: "/",          label: "Home" },
  { href: "/about",     label: "About" },
  { href: "/movers",    label: "Movers" },
  { href: "/compare",   label: "Compare" },
  { href: "/glossary",  label: "Glossary" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col bg-[#060c1a]/95 backdrop-blur-md">
      {/* Market ticker strip - 32px */}
      <MarketTicker />

      {/* Brand + nav - 56px */}
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 h-14 flex items-center justify-between gap-3 border-b border-white/[0.06]">
        {/* Brand */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="font-fraunces font-bold text-base gradient-text tracking-tight">
            BullBrief
          </span>
          <span className="hidden text-[10px] font-medium font-mono px-1.5 py-0.5 rounded-md sm:inline-block text-slate-600 bg-white/[0.03] border border-white/[0.06]">
            v0.1
          </span>
        </Link>

        {/* Links */}
        <nav className="flex min-w-0 items-center gap-0.5 overflow-x-auto sm:gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 px-2 py-1.5 text-xs rounded-lg font-medium transition-colors duration-150 sm:px-3 sm:text-sm ${
                  active ? "text-sky-300 bg-sky-400/10" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
