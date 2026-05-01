"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CompareMetricsGrid from "@/app/components/CompareMetricsGrid";
import CompareCharts from "@/app/components/CompareCharts";
import LoadingScreen from "@/app/components/LoadingScreen";
import { cachedFetch } from "@/app/lib/summaryCache";
import Link from "next/link";
import { ArrowLeft, Lightbulb, Layers3, Scale } from "lucide-react";

type TickerData = {
  ticker: string;
  company_name: string;
  market_cap: number | null;
  pe_ratio: number | null;
  roe: number | null;
  profit_margin: number | null;
  sector: string | null;
  industry?: string | null;
};

type CompareSummaryResponse = {
  tickers: TickerData[];
  master_insight?: string;
};

export default function ComparePage() {
  const { tickers } = useParams() as { tickers: string };
  const [data, setData] = useState<CompareSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tickers) return;
    cachedFetch<CompareSummaryResponse>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/compare-summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tickers: tickers.split(",") }),
    })
      .then((j) => { setData(j); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  }, [tickers]);

  if (loading) return <LoadingScreen />;

  const tickerList = tickers.split(",");
  const sectors = Array.from(new Set((data?.tickers ?? []).map((item) => item.sector).filter(Boolean)));
  const industries = Array.from(new Set((data?.tickers ?? []).map((item) => item.industry).filter(Boolean)));
  const sectorAligned = (data?.tickers?.length ?? 0) > 1 && sectors.length === 1;

  return (
    <main className="min-h-screen pt-[88px]" style={{ backgroundColor: "#060c1a" }}>
      {/* Background orb */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(56,189,248,0.07) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <Link
            href="/compare"
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-sky-400 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Compare
          </Link>
          <div className="flex items-end gap-4 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-blue-50">
              {tickerList.join(" vs ")}
            </h1>
            <div className="flex gap-2 pb-1">
              {tickerList.map((t, i) => {
                const colors = ["#38bdf8", "#818cf8", "#10b981"];
                return (
                  <span
                    key={t}
                    className="text-[10px] font-black font-mono px-2 py-0.5 rounded-md"
                    style={{
                      color: colors[i % colors.length],
                      backgroundColor: `${colors[i % colors.length]}12`,
                      border: `1px solid ${colors[i % colors.length]}25`,
                    }}
                  >
                    {t}
                  </span>
                );
              })}
            </div>
          </div>
          <p className="text-sm text-slate-500">
            Side-by-side financial comparison across key metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: <Layers3 className="w-3.5 h-3.5" />, title: "Same Sector", text: "Comparisons are cleaner when business models rhyme." },
            { icon: <Scale className="w-3.5 h-3.5" />, title: "Similar Scale", text: "Market cap context keeps valuation spreads honest." },
            { icon: <Lightbulb className="w-3.5 h-3.5" />, title: "Use The Toggles", text: "Switch metrics and hide tickers to isolate the signal." },
          ].map((tip) => (
            <div
              key={tip.title}
              className="bb-card p-3"
              style={{ backgroundColor: "rgba(15,32,64,0.36)", borderColor: "rgba(56,189,248,0.08)" }}
            >
              <div className="flex items-center gap-2 text-sky-400">
                {tip.icon}
                <p className="text-[10px] font-bold uppercase tracking-widest">{tip.title}</p>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-600">{tip.text}</p>
            </div>
          ))}
        </div>

        {(data?.tickers?.length ?? 0) > 1 && (
          <div
            className="bb-card p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            style={{
              borderColor: sectorAligned ? "rgba(16,185,129,0.18)" : "rgba(245,158,11,0.18)",
              background: sectorAligned
                ? "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(56,189,248,0.04))"
                : "linear-gradient(135deg, rgba(245,158,11,0.055), rgba(56,189,248,0.035))",
            }}
          >
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${sectorAligned ? "text-emerald-400" : "text-amber-400"}`}>
                {sectorAligned ? "Strong comparison set" : "Mixed comparison set"}
              </p>
              <p className="mt-1 text-xs leading-6 text-slate-500">
                {sectorAligned
                  ? `All selected companies sit in ${sectors[0]}, so the chart is more apples-to-apples.`
                  : "These companies appear to span different sectors or missing sector data, so compare ratios with extra context."}
              </p>
            </div>
            {industries.length > 0 && (
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600">
                {industries.slice(0, 3).join(" / ")}
              </p>
            )}
          </div>
        )}

        {/* Metrics summary table */}
        <CompareMetricsGrid data={data?.tickers} />

        {/* Interactive charts */}
        <CompareCharts data={data?.tickers} />
      </div>
    </main>
  );
}
