"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MarketTicker from "./MarketTicker";

const NAV_LINKS = [
  { href: "/",          label: "Home" },
  { href: "/about",     label: "About" },
  { href: "/compare",   label: "Compare" },
  { href: "/glossary",  label: "Glossary" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex flex-col"
      style={{ backgroundColor: "rgba(6, 12, 26, 0.94)", backdropFilter: "blur(20px)" }}
    >
      {/* Market ticker strip - 32px */}
      <MarketTicker />

      {/* Brand + nav - 56px */}
      <div
        className="max-w-7xl mx-auto w-full px-6 h-14 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(56,189,248,0.07)" }}
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-fraunces font-black text-base gradient-text-animated tracking-tight">
            BullBrief
          </span>
          <span
            className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-md"
            style={{
              color: "rgba(56,189,248,0.45)",
              backgroundColor: "rgba(56,189,248,0.05)",
              border: "1px solid rgba(56,189,248,0.1)",
            }}
          >
            v0.1.0
          </span>
        </Link>

        {/* Links */}
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  active ? "text-sky-300" : "text-slate-500 hover:text-slate-300"
                }`}
                style={active ? { backgroundColor: "rgba(56,189,248,0.08)" } : {}}
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
