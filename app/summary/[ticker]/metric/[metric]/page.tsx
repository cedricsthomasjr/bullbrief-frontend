"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { cachedFetch } from "@/app/lib/summaryCache";
import MetricChart from "@/app/components/MetricChart";
import LoadingScreen from "@/app/components/LoadingScreen";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const FINANCIAL_METRICS = new Set([
  "revenue",
  "gross-profit",
  "operating-income",
  "net-income",
  "ebitda",
  "eps",
]);

export default function MetricDetailPage() {
  const { ticker, metric } = useParams() as { ticker: string; metric: string };
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [data, setData] = useState<{ year: number; value: number }[] | null>(null);
  const [quarterlyData, setQuarterlyData] = useState<{ year: number; quarter?: number; date?: string; label?: string; value: number }[] | null>(null);
  const [source, setSource] = useState("Financial Modeling Prep income statements");
  const [quarterlySource, setQuarterlySource] = useState<string | undefined>(undefined);
  const lastGoodData = useRef<{ year: number; value: number }[] | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const bulletPoints = aiSummary
    ?.split("\n")
    .filter((line) => line.trim().startsWith("-"))
    .map((line) => line.replace(/^- /, "").trim());

  useEffect(() => {
    if (!ticker || !metric) return;
    const fetchData = async () => {
      setDataLoading(true);
      setQuarterlyData(null);
      setQuarterlySource(undefined);
      try {
        const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
        const normalizedMetric = metric.toLowerCase();
        const endpoint = FINANCIAL_METRICS.has(normalizedMetric)
          ? `${baseURL}/metric/${ticker}/${metric}`
          : `${baseURL}/macrotrends/${ticker}`;
        type MetricRow = { year: number; value: number };
        type QuarterlyMetricRow = MetricRow & { quarter?: number; date?: string; label?: string };
        const json = await cachedFetch<{
          data: MetricRow[] | Record<string, unknown>;
          quarterly_data?: QuarterlyMetricRow[];
          source?: { historical?: string; historical_quarterly?: string | null };
        }>(endpoint);
        let extracted: MetricRow[] | null = null;
        if (FINANCIAL_METRICS.has(normalizedMetric)) {
          extracted = Array.isArray(json.data) ? json.data : null;
          setSource(
            json.source?.historical === "yfinance"
              ? "Yahoo Finance via yfinance income statements"
              : "Financial Modeling Prep income statements"
          );
          setQuarterlyData(Array.isArray(json.quarterly_data) ? json.quarterly_data : null);
          setQuarterlySource(
            json.source?.historical_quarterly === "yfinance"
              ? "Yahoo Finance via yfinance income statements"
              : json.source?.historical_quarterly === "financialmodelingprep"
                ? "Financial Modeling Prep income statements"
                : undefined
          );
        } else {
          const metricData = json.data as Record<string, unknown>;
          const key = Object.keys(metricData).find((k) => k.toLowerCase() === metric.toLowerCase());
          extracted = key && Array.isArray(metricData[key]) ? (metricData[key] as MetricRow[]) : null;
          setSource("Macrotrends historical fundamentals");
          setQuarterlyData(null);
          setQuarterlySource(undefined);
        }
        if (extracted) { lastGoodData.current = extracted; setData(extracted); }
        else setData(lastGoodData.current);
      } catch { setData(lastGoodData.current); }
      finally { setDataLoading(false); }
    };
    fetchData();
  }, [ticker, metric]);

  useEffect(() => {
    if (!ticker || !metric) return;
    const fetchAI = async () => {
      setSummaryLoading(true);
      try {
        const json = await cachedFetch<{ analysis?: string }>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/interpret/${ticker}?metric=${metric}`
        );
        setAiSummary(json.analysis ?? null);
      } finally { setSummaryLoading(false); }
    };
    fetchAI();
  }, [ticker, metric]);

  if (dataLoading) return <LoadingScreen />;

  return (
    <main className="min-h-screen pt-[88px]" style={{ backgroundColor: "#060c1a" }}>
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Header */}
        <div className="space-y-3 pt-2">
          <Link href={`/summary/${ticker}`} className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-sky-400 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to {ticker}
          </Link>
          <div>
            <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-1">{ticker}</p>
            <h1 className="text-4xl font-bold tracking-tighter text-blue-50 capitalize">{metric}</h1>
          </div>
        </div>

        {/* Chart */}
        <section>
          <MetricChart
            data={data}
            quarterlyData={quarterlyData}
            title={metric}
            source={source}
            quarterlySource={quarterlySource}
          />
        </section>

        {/* AI Interpretation */}
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <span
              className="text-[10px] font-mono font-bold tabular-nums px-2 py-0.5 rounded"
              style={{ color: "#818cf8", backgroundColor: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.2)" }}
            >
              AI
            </span>
            <h2 className="text-lg font-bold text-blue-50">AI Interpretation</h2>
            <div className="flex-1 h-px" style={{ background: "rgba(56,189,248,0.07)" }} />
          </div>

          {summaryLoading ? (
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full animate-spin"
                style={{ borderTop: "2px solid #818cf8", borderRight: "2px solid transparent", borderBottom: "2px solid transparent", borderLeft: "2px solid transparent" }}
              />
              <p className="text-xs text-slate-600">Generating analysis...</p>
            </div>
          ) : bulletPoints && bulletPoints.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bulletPoints.map((point, idx) => {
                const [title, ...rest] = point.split(":");
                return (
                  <div
                    key={idx}
                    className="bb-card bb-card-hover p-3 space-y-1.5"
                    style={{ borderColor: "rgba(129,140,248,0.15)" }}
                  >
                    <p className="text-xs font-bold text-indigo-400">{title}</p>
                    <p className="text-sm text-slate-400 leading-relaxed">{rest.join(":").trim()}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-rose-400 text-sm italic">Could not generate summary.</p>
          )}
        </section>
      </div>
    </main>
  );
}
