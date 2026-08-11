"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  CircleHelp,
  Landmark,
  Scale,
  Shield,
  Target,
  TrendingDown,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { cachedFetch } from "@/app/lib/summaryCache";
import LoadingScreen from "@/app/components/LoadingScreen";
import DataSourceNote from "@/app/components/DataSourceNote";
import { useSideNavSections } from "@/app/hooks/useSideNavSections";

type OverallSignal = "Bullish" | "Neutral" | "Bearish";
type Confidence = "Low" | "Medium" | "High";

type PiotroskiTest = {
  key: string;
  label: string;
  passed: boolean | null;
  available: boolean;
  evidence: string;
};

type Pillars = {
  schema?: string;
  piotroski: {
    score: number;
    max_score: number;
    display: string;
    tests: PiotroskiTest[];
    coverage: number;
  };
  altman: {
    applicable: boolean;
    skipped_reason?: string | null;
    band?: string | null;
    z?: number | null;
    components?: Record<string, number | null>;
    formula?: string;
    notes?: string[];
    bands?: Record<string, string>;
  };
  valuation: {
    forward_pe?: number | null;
    price_to_sales?: number | null;
    fcf_yield?: number | null;
    peer_percentiles?: Record<string, number | null | number>;
    history_percentiles?: Record<string, number | null | number>;
    composite_percentile?: number | null;
    label?: string;
    coverage?: number;
    notes?: string[];
  };
  signal: {
    overall_signal: OverallSignal | string;
    signal_label: string;
    confidence: Confidence | string;
    coverage: number;
    suppressed?: boolean;
    reasons?: string[];
  };
};

type MetricPeer = {
  company?: string;
  ticker?: string;
  market_cap?: string;
  revenue_growth?: string;
  profit_margin?: string;
  forward_pe?: string;
  price_to_sales?: string;
  fcf_yield?: string;
};

type RiskFactor = {
  title: string;
  evidence: string;
};

type AnalystReport = {
  schema?: string;
  company_name: string;
  ticker: string;
  sector: string;
  industry: string;
  current_price?: number | null;
  market_cap?: number | null;
  wk52_low?: number | null;
  wk52_high?: number | null;
  overall_signal: OverallSignal | string;
  signal_label: string;
  confidence: Confidence | string;
  coverage?: number;
  summary: string;
  why_signal_appears: string[];
  what_could_change_signal: string[];
  pillars: Pillars;
  peers: MetricPeer[];
  risk_factors: RiskFactor[];
  uncertainty: string[];
  disclaimer: string;
  source?: {
    market_data?: string;
    segment_data?: string | null;
    ai?: string;
    schema?: string;
  };
};

const SIGNAL_CONFIG: Record<OverallSignal, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
  Bullish: {
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.34)",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  Neutral: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.09)",
    border: "rgba(245,158,11,0.3)",
    icon: <Scale className="w-4 h-4" />,
  },
  Bearish: {
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.09)",
    border: "rgba(244,63,94,0.32)",
    icon: <TrendingDown className="w-4 h-4" />,
  },
};

function normalizeOverallSignal(value?: string | null): OverallSignal {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized.includes("bear") || normalized.includes("risk-off")) return "Bearish";
  if (normalized.includes("bull")) return "Bullish";
  return "Neutral";
}

function normalizeConfidence(value?: string | number | null): Confidence {
  if (typeof value === "number") {
    if (value >= 75) return "High";
    if (value >= 45) return "Medium";
    return "Low";
  }
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "high") return "High";
  if (normalized === "medium") return "Medium";
  return "Low";
}

function fmtMoney(value?: number | null) {
  if (value == null) return "N/A";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  return `${sign}$${abs.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function fmtPrice(value?: number | null) {
  if (value == null) return "N/A";
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtPct(value?: number | null) {
  if (value == null || Number.isNaN(value)) return "N/A";
  return `${(value * 100).toFixed(1)}%`;
}

function fmtRatio(value?: number | null) {
  if (value == null || Number.isNaN(value)) return "N/A";
  return `${value.toFixed(1)}x`;
}

function SectionTitle({ icon, title, kicker }: { icon: React.ReactNode; title: string; kicker?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-3" style={{ borderBottom: "1px solid rgba(56,189,248,0.08)" }}>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sky-400 shrink-0">{icon}</span>
        <p className="text-sm font-bold text-blue-50 truncate">{title}</p>
      </div>
      {kicker && <p className="text-[10px] uppercase tracking-widest text-slate-600 shrink-0">{kicker}</p>}
    </div>
  );
}

function CompactList({ items, color = "#38bdf8" }: { items: string[]; color?: string }) {
  const list = items.length ? items : ["Data unavailable."];
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {list.map((item, idx) => (
        <div
          key={idx}
          className="rounded-lg border px-3 py-2.5"
          style={{ backgroundColor: "rgba(15,32,64,0.42)", borderColor: "rgba(56,189,248,0.09)" }}
        >
          <div className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
            <p className="text-xs leading-5 text-slate-400">{item}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function bandColor(band?: string | null) {
  if (band === "safe") return "#10b981";
  if (band === "grey") return "#f59e0b";
  if (band === "distress") return "#f43f5e";
  return "#94a3b8";
}

export default function AnalystReportPage() {
  const { ticker } = useParams() as { ticker: string };
  const [report, setReport] = useState<AnalystReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) return;
    setLoading(true);
    setError(null);
    setReport(null);
    cachedFetch<AnalystReport & { error?: string }>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/analyst/${encodeURIComponent(ticker)}?schema=market-signal-v5`,
    )
      .then((json) => {
        if (json.error) setError(json.error);
        else setReport(json);
      })
      .catch(() => setError("Failed to generate AI research snapshot."))
      .finally(() => setLoading(false));
  }, [ticker]);

  const signal = normalizeOverallSignal(report?.overall_signal);
  const signalCfg = SIGNAL_CONFIG[signal];

  useSideNavSections(
    [
      { id: "overview", label: "Overview" },
      { id: "pillars", label: "Pillars" },
      { id: "peers", label: "Peers" },
      { id: "risks", label: "SEC Risks" },
      { id: "uncertainty", label: "Uncertainty" },
    ],
    signalCfg.color,
  );

  if (loading) return <LoadingScreen isLoading />;

  if (error || !report || !report.pillars) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#060c1a" }}>
        <div className="bb-card-danger max-w-md p-5 text-center">
          <p className="text-sm font-semibold text-rose-400">Research snapshot unavailable</p>
          <p className="mt-2 text-xs leading-6 text-slate-500">{error ?? "No pillar report returned."}</p>
          <Link href={`/summary/${ticker}`} className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-400 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Summary
          </Link>
        </div>
      </main>
    );
  }

  const confidence = normalizeConfidence(report.confidence);
  const { piotroski, altman, valuation } = report.pillars;
  const peers = report.peers ?? [];
  const risks = report.risk_factors ?? [];

  return (
    <main className="min-h-screen pt-[88px]" style={{ backgroundColor: "#060c1a" }}>
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href={`/summary/${ticker}`} className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-sky-400 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Summary
          </Link>
          <p className="text-[10px] uppercase tracking-widest text-slate-600">market-signal-v5 · inspectable pillars</p>
        </div>

        <motion.section
          id="overview"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="bb-card scroll-mt-24 overflow-hidden"
        >
          <div className="p-3 sm:p-4 space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {report.sector} · {report.industry}
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter text-blue-50 leading-none">
                  {report.company_name}
                </h1>
                <p className="text-sm font-mono text-slate-500">{report.ticker}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-widest"
                  style={{ color: signalCfg.color, backgroundColor: signalCfg.bg, border: `1px solid ${signalCfg.border}` }}
                >
                  {signalCfg.icon}
                  {report.signal_label || signal}
                </span>
                <span className="rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400"
                  style={{ backgroundColor: "rgba(15,32,64,0.6)", border: "1px solid rgba(56,189,248,0.1)" }}>
                  Confidence {confidence}
                </span>
                <span className="rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400"
                  style={{ backgroundColor: "rgba(15,32,64,0.6)", border: "1px solid rgba(56,189,248,0.1)" }}>
                  Coverage {Math.round((report.coverage ?? report.pillars.signal.coverage ?? 0) * 100)}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Price", value: fmtPrice(report.current_price) },
                { label: "Market Cap", value: fmtMoney(report.market_cap) },
                { label: "52W Low", value: fmtPrice(report.wk52_low) },
                { label: "52W High", value: fmtPrice(report.wk52_high) },
              ].map((item) => (
                <div key={item.label} className="rounded-lg px-3 py-2" style={{ backgroundColor: "rgba(15,32,64,0.5)", border: "1px solid rgba(56,189,248,0.08)" }}>
                  <p className="text-[10px] uppercase tracking-widest text-slate-600">{item.label}</p>
                  <p className="text-sm font-bold tabular-nums text-blue-50 mt-1">{item.value}</p>
                </div>
              ))}
            </div>

            <p className="text-sm leading-7 text-slate-400">{report.summary}</p>
            <CompactList items={report.why_signal_appears} color={signalCfg.color} />
            <DataSourceNote
              label={`${report.source?.market_data ?? "Yahoo Finance via yfinance"}; pillar math + AI narrative`}
            />
          </div>
        </motion.section>

        <motion.section id="pillars" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="scroll-mt-24 space-y-4">
          <div className="bb-card overflow-hidden">
            <SectionTitle icon={<CheckCircle2 className="w-4 h-4" />} title="Piotroski F-Score" kicker={piotroski.display} />
            <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              {piotroski.tests.map((test) => {
                const ok = test.available && test.passed;
                const fail = test.available && test.passed === false;
                const color = ok ? "#10b981" : fail ? "#f43f5e" : "#64748b";
                return (
                  <div key={test.key} className="rounded-lg border px-3 py-2.5" style={{ borderColor: `${color}33`, backgroundColor: `${color}0d` }}>
                    <div className="flex items-start gap-2">
                      {ok ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color }} /> :
                        fail ? <XCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color }} /> :
                        <CircleHelp className="w-4 h-4 shrink-0 mt-0.5" style={{ color }} />}
                      <div>
                        <p className="text-xs font-semibold text-blue-50">{test.label}</p>
                        <p className="text-[11px] leading-5 text-slate-500 mt-1">{test.evidence}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bb-card overflow-hidden">
              <SectionTitle icon={<Landmark className="w-4 h-4" />} title="Altman Z″" kicker={altman.applicable ? (altman.band || "n/a") : "skipped"} />
              <div className="p-3 space-y-3">
                {!altman.applicable ? (
                  <p className="text-sm text-slate-400">{altman.skipped_reason}</p>
                ) : (
                  <>
                    <div className="flex items-end gap-3">
                      <p className="text-3xl font-bold tabular-nums" style={{ color: bandColor(altman.band) }}>
                        {altman.z != null ? altman.z.toFixed(2) : "N/A"}
                      </p>
                      <p className="text-xs uppercase tracking-widest mb-1" style={{ color: bandColor(altman.band) }}>
                        {altman.band || "insufficient_data"}
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">{altman.formula}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(altman.components || {}).map(([key, value]) => (
                        <div key={key} className="rounded-lg px-2.5 py-2" style={{ backgroundColor: "rgba(15,32,64,0.5)", border: "1px solid rgba(56,189,248,0.08)" }}>
                          <p className="text-[9px] uppercase tracking-widest text-slate-600">{key}</p>
                          <p className="text-xs font-semibold tabular-nums text-blue-50 mt-1">
                            {value == null ? "N/A" : Number(value).toFixed(3)}
                          </p>
                        </div>
                      ))}
                    </div>
                    {(altman.notes || []).map((note, idx) => (
                      <p key={idx} className="text-[11px] text-slate-600">{note}</p>
                    ))}
                  </>
                )}
              </div>
            </div>

            <div className="bb-card overflow-hidden">
              <SectionTitle icon={<Target className="w-4 h-4" />} title="Relative Valuation" kicker={valuation.label || "unknown"} />
              <div className="p-3 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg px-2.5 py-2" style={{ backgroundColor: "rgba(15,32,64,0.5)", border: "1px solid rgba(56,189,248,0.08)" }}>
                    <p className="text-[9px] uppercase tracking-widest text-slate-600">Fwd P/E</p>
                    <p className="text-sm font-bold tabular-nums text-blue-50 mt-1">{fmtRatio(valuation.forward_pe)}</p>
                  </div>
                  <div className="rounded-lg px-2.5 py-2" style={{ backgroundColor: "rgba(15,32,64,0.5)", border: "1px solid rgba(56,189,248,0.08)" }}>
                    <p className="text-[9px] uppercase tracking-widest text-slate-600">P/S</p>
                    <p className="text-sm font-bold tabular-nums text-blue-50 mt-1">{fmtRatio(valuation.price_to_sales)}</p>
                  </div>
                  <div className="rounded-lg px-2.5 py-2" style={{ backgroundColor: "rgba(15,32,64,0.5)", border: "1px solid rgba(56,189,248,0.08)" }}>
                    <p className="text-[9px] uppercase tracking-widest text-slate-600">FCF Yield</p>
                    <p className="text-sm font-bold tabular-nums text-blue-50 mt-1">{fmtPct(valuation.fcf_yield)}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Composite richness percentile:{" "}
                  <span className="font-semibold text-blue-50">
                    {valuation.composite_percentile != null ? `${valuation.composite_percentile}th` : "N/A"}
                  </span>
                  {" "}(lower = cheaper vs peers/history)
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                  <p>Peer Fwd PE pct: {valuation.peer_percentiles?.forward_pe ?? "N/A"}</p>
                  <p>Peer P/S pct: {valuation.peer_percentiles?.price_to_sales ?? "N/A"}</p>
                  <p>Hist PE pct: {valuation.history_percentiles?.forward_pe ?? "N/A"}</p>
                  <p>Peer count: {valuation.peer_percentiles?.peer_count ?? 0}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section id="peers" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="bb-card scroll-mt-24 overflow-hidden">
          <SectionTitle icon={<Shield className="w-4 h-4" />} title="Cap-Banded Peers" kicker="0.25x–4x market cap" />
          <div className="overflow-x-auto">
            {peers.length === 0 ? (
              <p className="p-4 text-sm text-slate-500">Peer metrics unavailable for this ticker.</p>
            ) : (
              <table className="min-w-[760px] w-full text-left text-xs">
                <thead style={{ backgroundColor: "rgba(15,32,64,0.7)" }}>
                  <tr className="text-[10px] uppercase tracking-widest text-slate-600">
                    <th className="px-3 py-3">Company</th>
                    <th className="px-3 py-3">Ticker</th>
                    <th className="px-3 py-3">Market Cap</th>
                    <th className="px-3 py-3">Growth</th>
                    <th className="px-3 py-3">Margin</th>
                    <th className="px-3 py-3">Fwd P/E</th>
                    <th className="px-3 py-3">P/S</th>
                    <th className="px-3 py-3">FCF Yield</th>
                  </tr>
                </thead>
                <tbody>
                  {peers.map((peer, idx) => (
                    <tr key={`${peer.ticker}-${idx}`} style={{ borderTop: "1px solid rgba(56,189,248,0.07)" }}>
                      <td className="px-3 py-3 font-semibold text-blue-50">{peer.company || "N/A"}</td>
                      <td className="px-3 py-3 font-mono text-sky-400">{peer.ticker || "N/A"}</td>
                      <td className="px-3 py-3 text-slate-400">{peer.market_cap || "N/A"}</td>
                      <td className="px-3 py-3 text-slate-400">{peer.revenue_growth || "N/A"}</td>
                      <td className="px-3 py-3 text-slate-400">{peer.profit_margin || "N/A"}</td>
                      <td className="px-3 py-3 text-slate-400">{peer.forward_pe || "N/A"}</td>
                      <td className="px-3 py-3 text-slate-400">{peer.price_to_sales || "N/A"}</td>
                      <td className="px-3 py-3 text-slate-400">{peer.fcf_yield || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.section>

        <motion.section id="risks" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="bb-card scroll-mt-24 overflow-hidden">
          <SectionTitle icon={<AlertTriangle className="w-4 h-4" />} title="SEC Item 1A Risks" kicker="filing-grounded" />
          <div className="p-3 space-y-2">
            {risks.length === 0 ? (
              <p className="text-sm text-slate-500">No Item 1A risk factors extracted for this ticker.</p>
            ) : (
              risks.map((risk, idx) => (
                <div key={idx} className="rounded-lg border px-3 py-3" style={{ borderColor: "rgba(244,63,94,0.18)", backgroundColor: "rgba(244,63,94,0.05)" }}>
                  <p className="text-sm font-semibold text-blue-50">{risk.title}</p>
                  <p className="text-xs leading-6 text-slate-400 mt-1">{risk.evidence}</p>
                </div>
              ))
            )}
          </div>
        </motion.section>

        <motion.section id="uncertainty" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="bb-card scroll-mt-24 overflow-hidden">
          <SectionTitle icon={<CircleHelp className="w-4 h-4" />} title="What Could Change / Uncertainty" />
          <div className="p-3 space-y-4">
            <CompactList items={report.what_could_change_signal} />
            <CompactList items={report.uncertainty} color="#94a3b8" />
            <p className="text-[11px] text-slate-600">{report.disclaimer}</p>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
