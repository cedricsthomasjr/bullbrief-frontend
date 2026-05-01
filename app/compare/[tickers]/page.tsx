"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CompareMetricsGrid from "@/app/components/CompareMetricsGrid";
import CompareCharts from "@/app/components/CompareCharts";
import MasterCompareSummary from "@/app/components/MasterCompareSummary";
import LoadingScreen from "@/app/components/LoadingScreen";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type TickerData = {
  ticker: string;
  company_name: string;
  market_cap: number | null;
  pe_ratio: number | null;
  roe: number | null;
  profit_margin: number | null;
  sector: string | null;
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
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/compare-summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tickers: tickers.split(",") }),
    })
      .then((r) => r.json())
      .then((j: CompareSummaryResponse) => { setData(j); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  }, [tickers]);

  if (loading) return <LoadingScreen />;

  const tickerList = tickers.split(",");

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

        {/* Metrics summary table */}
        <CompareMetricsGrid data={data?.tickers} />

        {data?.master_insight && <MasterCompareSummary summary={data.master_insight} />}

        {/* Interactive charts */}
        <CompareCharts data={data?.tickers} />
      </div>
    </main>
  );
}
