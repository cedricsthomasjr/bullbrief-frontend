"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, Loader2, X } from "lucide-react";

type Segment = {
  name: string;
  color: string;
};

type YearEntry = {
  year: number;
  total: number;
  breakdown: Record<string, number>;
};

type RevenueBreakdownData = {
  ticker: string;
  company_name: string;
  concept: string;
  concept_label: string;
  segments: Segment[];
  years: YearEntry[];
  source_url: string;
  has_segments: boolean;
};

function fmt(v: number): string {
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  return `${sign}$${abs.toLocaleString()}`;
}

function fmtShort(v: number): string {
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(1)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(0)}M`;
  return `${sign}$${abs.toLocaleString()}`;
}

type CustomTooltipProps = {
  active?: boolean;
  payload?: { name: string; value: number; fill: string }[];
  label?: string | number;
};

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const total = payload.reduce((sum, p) => sum + (p.value || 0), 0);

  return (
    <div
      className="rounded-xl p-3 space-y-2 text-xs min-w-[160px]"
      style={{
        backgroundColor: "#060c1a",
        border: "1px solid rgba(56,189,248,0.2)",
        boxShadow: "0 0 28px rgba(56,189,248,0.12)",
      }}
    >
      <p className="font-bold text-blue-50">FY{label}</p>
      <p className="text-[10px] uppercase tracking-widest text-slate-500">
        Total: {fmt(total)}
      </p>
      {[...payload].reverse().map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: p.fill }}
            />
            <span className="text-slate-400 truncate max-w-[120px]">{p.name}</span>
          </div>
          <span className="tabular-nums font-semibold text-blue-50 shrink-0">
            {fmtShort(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

type Props = {
  ticker: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function RevenueBreakdownModal({ ticker, isOpen, onClose }: Props) {
  const [data, setData] = useState<RevenueBreakdownData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !ticker) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(null);

    const base = process.env.NEXT_PUBLIC_BACKEND_URL;
    fetch(`${base}/revenue-breakdown/${encodeURIComponent(ticker.toUpperCase())}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.error) throw new Error(json.error);
        setData(json as RevenueBreakdownData);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Failed to load revenue data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, ticker]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const latest = data?.years?.[data.years.length - 1];

  const chartData = data?.years.map((y) => ({
    year: y.year,
    ...y.breakdown,
  })) ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{
          backgroundColor: "#060c1a",
          border: "1px solid rgba(56,189,248,0.12)",
          boxShadow: "0 0 80px rgba(56,189,248,0.08)",
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
          style={{
            backgroundColor: "#060c1a",
            borderBottom: "1px solid rgba(56,189,248,0.08)",
          }}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded tabular-nums"
                style={{
                  color: "#38bdf8",
                  backgroundColor: "rgba(56,189,248,0.08)",
                  border: "1px solid rgba(56,189,248,0.15)",
                }}
              >
                {ticker.toUpperCase()}
              </span>
              <h2 className="text-base font-bold text-blue-50">Revenue Breakdown</h2>
            </div>
            <p className="mt-0.5 text-[10px] uppercase tracking-widest text-slate-600">
              SEC 10-K XBRL Data Only
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors shrink-0"
            style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#64748b" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {loading && (
            <div className="flex items-center gap-3 py-12 justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
              <p className="text-sm text-slate-500">Fetching SEC EDGAR XBRL data...</p>
            </div>
          )}

          {error && (
            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.2)" }}
            >
              <p className="text-sm font-semibold text-rose-400">Could not load revenue data</p>
              <p className="mt-1 text-xs text-slate-600">{error}</p>
            </div>
          )}

          {data && (
            <>
              {/* Latest year totals */}
              {latest && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div
                    className="rounded-xl p-3"
                    style={{ backgroundColor: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.14)" }}
                  >
                    <p className="text-[10px] uppercase tracking-widest text-slate-600">Latest Total (FY{latest.year})</p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-blue-50">{fmt(latest.total)}</p>
                  </div>
                  <div
                    className="rounded-xl p-3"
                    style={{ backgroundColor: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.14)" }}
                  >
                    <p className="text-[10px] uppercase tracking-widest text-slate-600">Segments Reported</p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-blue-50">{data.segments.length}</p>
                  </div>
                  <div
                    className="rounded-xl p-3 col-span-2 sm:col-span-1"
                    style={{ backgroundColor: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.14)" }}
                  >
                    <p className="text-[10px] uppercase tracking-widest text-slate-600">Years of Data</p>
                    <p className="mt-1 text-xl font-bold tabular-nums text-blue-50">{data.years.length}</p>
                  </div>
                </div>
              )}

              {/* Stacked bar chart */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                  {data.has_segments ? "Revenue by Segment" : "Total Revenue"} — Annual (FY)
                </p>
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(56,189,248,0.07)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="year"
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `FY${v}`}
                      />
                      <YAxis
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        width={62}
                        tickFormatter={(v: number) => fmtShort(v)}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(56,189,248,0.04)" }} />
                      {data.segments.map((seg) => (
                        <Bar
                          key={seg.name}
                          dataKey={seg.name}
                          stackId="rev"
                          radius={[0, 0, 0, 0]}
                        >
                          {chartData.map((_, i) => (
                            <Cell key={i} fill={seg.color} fillOpacity={0.85} />
                          ))}
                        </Bar>
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Segment legend */}
              {data.has_segments && (
                <div className="flex flex-wrap gap-2">
                  {data.segments.map((seg) => (
                    <span
                      key={seg.name}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium"
                      style={{
                        color: seg.color,
                        backgroundColor: `${seg.color}12`,
                        border: `1px solid ${seg.color}28`,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: seg.color }}
                      />
                      {seg.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Latest year breakdown rows */}
              {latest && data.has_segments && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                    FY{latest.year} Breakdown
                  </p>
                  <div className="space-y-2">
                    {data.segments.map((seg) => {
                      const val = latest.breakdown[seg.name] ?? 0;
                      const pct = latest.total > 0 ? (val / latest.total) * 100 : 0;
                      return (
                        <div key={seg.name} className="space-y-1">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: seg.color }}
                              />
                              <span className="text-xs font-medium text-slate-400 truncate">{seg.name}</span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-[10px] text-slate-600 tabular-nums">
                                {pct.toFixed(1)}%
                              </span>
                              <span className="text-xs font-bold tabular-nums text-blue-50 min-w-[60px] text-right">
                                {fmt(val)}
                              </span>
                            </div>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(15,23,42,0.8)" }}>
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${pct}%`, backgroundColor: seg.color, opacity: 0.8 }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Source footer */}
              <div
                className="flex items-center justify-between gap-4 rounded-xl px-4 py-3"
                style={{ backgroundColor: "rgba(15,32,64,0.5)", border: "1px solid rgba(56,189,248,0.08)" }}
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Data Source</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    SEC EDGAR XBRL · {data.concept_label ?? data.concept}
                  </p>
                </div>
                <a
                  href={data.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg shrink-0 transition hover:-translate-y-0.5"
                  style={{ color: "#38bdf8", backgroundColor: "rgba(56,189,248,0.07)", border: "1px solid rgba(56,189,248,0.16)" }}
                >
                  SEC Filing <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
