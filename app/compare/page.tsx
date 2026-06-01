"use client";

import TripleTickerCompare from "@/app/components/TripleTickerCompare";

export default function ComparePage() {
  return (
    <main className="min-h-screen pt-[88px]" style={{ backgroundColor: "#060c1a" }}>
      {/* Background glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(56,189,248,0.07) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Deep Compare</p>
          <h1 className="text-4xl font-bold tracking-tighter text-blue-50">Side-by-Side Analysis</h1>
          <p className="text-sm text-slate-500 max-w-lg leading-relaxed">
            Compare up to three companies across fundamentals, valuation, and market positioning. Sector-aligned comparisons yield the clearest signals — try peers, direct competitors, or companies with similar business models.
          </p>
        </div>

        <TripleTickerCompare />
      </div>
    </main>
  );
}
