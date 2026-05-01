"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(56, 189, 248, 0.07)", backgroundColor: "#060c1a" }}>
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Brand */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm gradient-text-animated tracking-tight">BullBrief</span>
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
              style={{
                color: "rgba(56,189,248,0.45)",
                backgroundColor: "rgba(56,189,248,0.05)",
                border: "1px solid rgba(56,189,248,0.1)",
              }}
            >
              v0.1.0
            </span>
          </div>
          <p className="text-xs text-slate-600">
            AI-powered stock intelligence for modern investors.
          </p>
          <p className="text-xs text-slate-700">Not financial advice.</p>
        </div>

        {/* Links */}
        <div className="flex items-start gap-12 text-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-widest font-medium text-slate-700">Navigate</span>
            <Link href="/" className="text-slate-500 hover:text-sky-400 transition-colors text-xs">Home</Link>
            <Link href="/compare" className="text-slate-500 hover:text-sky-400 transition-colors text-xs">Compare</Link>
            <Link href="/glossary" className="text-slate-500 hover:text-sky-400 transition-colors text-xs">Glossary</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-widest font-medium text-slate-700">Connect</span>
            <a href="https://github.com/cedricsthomasjr" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-400 transition-colors text-xs">GitHub</a>
            <a href="https://www.linkedin.com/in/cedric-thomas-jr/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-400 transition-colors text-xs">LinkedIn</a>
          </div>
        </div>
      </div>

      <div
        className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between"
        style={{ borderTop: "1px solid rgba(56, 189, 248, 0.04)" }}
      >
        <p className="text-xs text-slate-700">
          © {new Date().getFullYear()} BullBrief - Built by CJ Thomas
        </p>
        <p className="text-[10px] text-slate-800 font-mono">v0.1.0</p>
      </div>
    </footer>
  );
}
