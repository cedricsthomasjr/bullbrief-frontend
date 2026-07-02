"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#060c1a]">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Brand */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-fraunces font-bold text-sm gradient-text tracking-tight">BullBrief</span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md text-slate-600 bg-white/[0.03] border border-white/[0.06]">
              v0.1
            </span>
          </div>
          <p className="text-xs text-slate-600">
            AI-powered stock research for individual investors.
          </p>
          <p className="max-w-sm text-xs leading-6 text-slate-700">
            Educational research only. BullBrief is not investment advice and is not a registered investment adviser or broker-dealer.
          </p>
        </div>

        {/* Links */}
        <div className="flex items-start gap-12 text-sm">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">Navigate</span>
            <Link href="/" className="text-slate-500 hover:text-sky-400 transition-colors text-xs">Home</Link>
            <Link href="/about" className="text-slate-500 hover:text-sky-400 transition-colors text-xs">About</Link>
            <Link href="/compare" className="text-slate-500 hover:text-sky-400 transition-colors text-xs">Compare</Link>
            <Link href="/glossary" className="text-slate-500 hover:text-sky-400 transition-colors text-xs">Glossary</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">Connect</span>
            <a href="https://github.com/cedricsthomasjr" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-400 transition-colors text-xs">GitHub</a>
            <a href="https://www.linkedin.com/in/cedric-thomas-jr/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-400 transition-colors text-xs">LinkedIn</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">Legal</span>
            <Link href="/terms" className="text-slate-500 hover:text-sky-400 transition-colors text-xs">Terms</Link>
            <Link href="/disclaimer" className="text-slate-500 hover:text-sky-400 transition-colors text-xs">Disclaimer</Link>
            <Link href="/privacy" className="text-slate-500 hover:text-sky-400 transition-colors text-xs">Privacy</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-t border-white/[0.04]">
        <p className="text-xs text-slate-700">
          &copy; {new Date().getFullYear()} BullBrief &mdash; Built by CJ Thomas
        </p>
        <Link href="/disclaimer" className="text-xs text-slate-800 hover:text-sky-500 transition-colors font-mono">
          Not investment advice
        </Link>
      </div>
    </footer>
  );
}
