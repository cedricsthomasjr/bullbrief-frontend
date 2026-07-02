"use client";

import { useState } from "react";
import SingleTickerSearch from "./SingleTickerSearch";
import VerticalStatCard from "./VerticalStatCard";
import AISummaryBlock from "@/app/components/AISummaryBlock";
import CompareCharts from "@/app/components/CompareCharts";
import { cachedFetch } from "@/app/lib/summaryCache";
import type { SingleSummaryData, InsightSection } from "@/app/types/stock";
import { ArrowRight, Lightbulb, Layers3, Scale } from "lucide-react";
import { Eyebrow, Tag } from "@/app/ui/eyebrow";
import { TONE } from "@/app/lib/tone";

type CompareSummaryResponse = {
  tickers?: SingleSummaryData[];
  insights?: InsightSection[];
  master_insight?: string;
};

export default function TripleTickerCompare() {
  const [tickers, setTickers] = useState(["", "", ""]);
  const [data, setData] = useState<(SingleSummaryData | null)[]>([null, null, null]);
  const [insights, setInsights] = useState<InsightSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState([false, false, false]);

  const validData = data.filter(Boolean) as SingleSummaryData[];
  const sectors = Array.from(new Set(validData.map((item) => item.sector).filter(Boolean)));
  const industries = Array.from(new Set(validData.map((item) => item.industry).filter(Boolean)));
  const sectorAligned = validData.length > 1 && sectors.length === 1;

  const handleChange = (index: number, ticker: string) => {
    const updated = [...tickers];
    updated[index] = ticker.toUpperCase();
    setTickers(updated);
  };

  const handleCompare = async () => {
    const validTickers = tickers.filter((t) => t.trim().length > 0);
    if (validTickers.length === 0) return;
    setLoading(true);
    setLoadingStates([true, true, true]);
    setData([null, null, null]);
    setInsights([]);
    try {
      const json = await cachedFetch<CompareSummaryResponse>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/compare-summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tickers: validTickers }),
      });
      const byTicker = new Map((json.tickers ?? []).map((item) => [item.ticker, item]));
      setData(tickers.map((t) => byTicker.get(t.toUpperCase()) ?? null));
      setInsights(json.insights ?? []);
    } catch (err) {
      console.error("Compare fetch failed:", err);
    } finally {
      setLoading(false);
      setLoadingStates([false, false, false]);
    }
  };

  const hasResults = !loading && (insights.length > 0 || data.some(Boolean));

  return (
    <div className="space-y-8">
      {/* Input panel */}
      <div
        className="bb-card p-3 space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
          <div>
            <Eyebrow tone="sky">Enter up to 3 tickers</Eyebrow>
            <p className="mt-1 text-xs leading-6 text-slate-600">
              Deep Compare works best when the companies share a sector, industry, or business model.
            </p>
          </div>
          <Tag tone="indigo">Try AAPL MSFT GOOGL</Tag>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: <Layers3 className="w-3.5 h-3.5" />, title: "Same Sector", text: "Software vs software reads cleaner than software vs oil." },
            { icon: <Scale className="w-3.5 h-3.5" />, title: "Similar Scale", text: "Mega-cap peers make valuation ratios easier to compare." },
            { icon: <Lightbulb className="w-3.5 h-3.5" />, title: "Clear Question", text: "Use the chart to test valuation, margins, and profitability." },
          ].map((tip) => (
            <div
              key={tip.title}
              className="rounded-lg border border-white/[0.05] bg-[#0f2040]/40 p-3"
            >
              <div className="flex items-center gap-2 text-sky-400">
                {tip.icon}
                <p className="text-xs font-semibold uppercase tracking-wide">{tip.title}</p>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-600">{tip.text}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <SingleTickerSearch
              key={i}
              value={tickers[i]}
              placeholder={`Ticker ${i + 1} - e.g. ${["AAPL", "MSFT", "NVDA"][i]}`}
              onSubmit={(val) => handleChange(i, val)}
            />
          ))}
        </div>

        <div className="flex items-center gap-4 pt-1">
          <button
            onClick={handleCompare}
            disabled={loading || tickers.every((t) => !t.trim())}
            className="btn-gradient flex items-center gap-2 text-white text-sm font-bold px-6 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing..." : "Run Comparison"}
            {!loading && <ArrowRight className="w-3.5 h-3.5" />}
          </button>

          {loading && (
            <div className="flex items-center gap-2.5">
              <div className={`w-4 h-4 rounded-full border-2 border-transparent animate-spin ${TONE.sky.spinnerBorder}`} />
              <p className="text-xs text-slate-600">BullBrief is analyzing...</p>
            </div>
          )}
        </div>
      </div>

      {/* Stat cards fallback */}
      {hasResults && insights.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.map((d, i) => d ? <VerticalStatCard key={i} data={d} loading={loadingStates[i]} /> : null)}
        </div>
      )}

      {/* AI Summaries */}
      {!loading && insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((insight, i) => (
            <AISummaryBlock key={i} insight={insight} />
          ))}
        </div>
      )}

      {!loading && validData.length > 1 && (
        <div
          className="bb-card p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          style={{
            borderColor: sectorAligned ? `${TONE.emerald.hex}2e` : `${TONE.amber.hex}2e`,
            background: sectorAligned
              ? `linear-gradient(135deg, ${TONE.emerald.hex}0f, ${TONE.sky.hex}0a)`
              : `linear-gradient(135deg, ${TONE.amber.hex}0e, ${TONE.sky.hex}09)`,
          }}
        >
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wide ${sectorAligned ? "text-emerald-400" : "text-amber-400"}`}>
              {sectorAligned ? "Strong comparison set" : "Mixed comparison set"}
            </p>
            <p className="mt-1 text-xs leading-6 text-slate-500">
              {sectorAligned
                ? `All selected companies sit in ${sectors[0]}, so the financial chart should be more apples-to-apples.`
                : "These companies appear to span different sectors or missing sector data, so compare ratios with extra context."}
            </p>
          </div>
          {industries.length > 0 && (
            <p className="text-xs font-mono uppercase tracking-wide text-slate-600">
              {industries.slice(0, 3).join(" / ")}
            </p>
          )}
        </div>
      )}

      {/* Graphed financial metrics */}
      {!loading && validData.length > 1 && (
        <CompareCharts data={validData} />
      )}
    </div>
  );
}
