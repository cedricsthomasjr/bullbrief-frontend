"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowLeft, ArrowUpRight, BarChart3, Database } from "lucide-react";
import { cachedFetch } from "@/app/lib/summaryCache";
import LoadingScreen from "@/app/components/LoadingScreen";
import { useSideNavSections } from "@/app/hooks/useSideNavSections";
import DataSourceNote from "@/app/components/DataSourceNote";
import BusinessEngineCylinder, {
  formatCurrencyCompact,
  type RevenueBreakdownData,
} from "@/app/components/BusinessEngineCylinder";

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span
        className="text-[10px] font-mono font-bold tabular-nums px-2 py-0.5 rounded"
        style={{
          color: "#a5b4fc",
          backgroundColor: "rgba(129,140,248,0.08)",
          border: "1px solid rgba(129,140,248,0.18)",
        }}
      >
        {num}
      </span>
      <h2 className="text-lg font-bold text-blue-50 tracking-tight">{title}</h2>
      <div className="flex-1 h-px" style={{ background: "rgba(129,140,248,0.08)" }} />
    </div>
  );
}

function sourceKind(data: RevenueBreakdownData) {
  const sourcePrefix = data.source_name?.toLowerCase().includes("fmp") ? "FMP" : "SEC";
  const dimension = data.dimension?.toLowerCase() ?? "";
  if (!data.has_segments) return `${sourcePrefix} total revenue`;
  if (dimension.includes("geograph")) return `${sourcePrefix} geography revenue`;
  if (dimension.includes("product") || dimension.includes("service")) return `${sourcePrefix} product/service revenue`;
  return `${sourcePrefix} business segment revenue`;
}

type TooltipPayload = {
  name?: string | number;
  value?: string | number;
  fill?: string;
  color?: string;
};

function asNumber(value: string | number | undefined) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function RevenueTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;

  const rows = payload
    .map((item) => ({
      name: String(item.name ?? "Revenue"),
      value: asNumber(item.value),
      color: item.fill ?? item.color ?? "#38bdf8",
    }))
    .filter((item) => item.value > 0)
    .reverse();
  const total = rows.reduce((sum, row) => sum + row.value, 0);

  return (
    <div
      className="rounded-xl p-3 space-y-2 text-xs min-w-[180px]"
      style={{
        backgroundColor: "#060c1a",
        border: "1px solid rgba(129,140,248,0.24)",
        boxShadow: "0 0 28px rgba(129,140,248,0.14)",
      }}
    >
      <p className="font-bold text-blue-50">FY{label}</p>
      <p className="text-[10px] uppercase tracking-widest text-slate-500">
        Total: {formatCurrencyCompact(total)}
      </p>
      {rows.map((row) => (
        <div key={row.name} className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
            <span className="max-w-[120px] truncate text-slate-400">{row.name}</span>
          </div>
          <span className="shrink-0 tabular-nums font-semibold text-blue-50">
            {formatCurrencyCompact(row.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - 96;
  window.scrollTo({ top, behavior: "smooth" });
}

export default function BusinessEnginePage() {
  const { ticker } = useParams() as { ticker: string };
  const [data, setData] = useState<RevenueBreakdownData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) return;
    let active = true;
    const symbol = ticker.toUpperCase();

    setLoading(true);
    setError(null);
    setData(null);

    cachedFetch<RevenueBreakdownData & { error?: string }>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/revenue-breakdown/${encodeURIComponent(symbol)}`,
    )
      .then((json) => {
        if (!active) return;
        if (json.error) throw new Error(json.error);
        setData(json);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load revenue segmentation");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [ticker]);

  const latest = data?.years[data.years.length - 1] ?? null;
  const prior = data && data.years.length > 1 ? data.years[data.years.length - 2] : null;

  const segmentRows = useMemo(() => {
    if (!data || !latest) return [];
    return data.segments
      .map((segment) => {
        const value = latest.breakdown[segment.name] ?? 0;
        const priorValue = prior?.breakdown[segment.name] ?? 0;
        const share = latest.total > 0 ? (value / latest.total) * 100 : 0;
        const yoy = priorValue > 0 ? ((value - priorValue) / priorValue) * 100 : null;
        return { ...segment, value, priorValue, share, yoy };
      })
      .filter((segment) => segment.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [data, latest, prior]);

  const chartData = useMemo(
    () => data?.years.map((year) => ({ year: year.year, ...year.breakdown })) ?? [],
    [data],
  );

  useSideNavSections(
    [
      { id: "revenue-engine", label: "Revenue Engine" },
      { id: "annual-history", label: "Annual History" },
      { id: "latest-mix", label: "Latest Mix" },
      { id: "source", label: "Data Source" },
      { id: "summary-page", label: "Summary", href: `/summary/${ticker}` },
    ],
    "#a5b4fc",
  );

  if (loading) return <LoadingScreen isLoading />;

  if (error || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#060c1a" }}>
        <div className="text-center space-y-3">
          <p className="text-rose-400 text-sm font-medium">Could not load business engine</p>
          <p className="text-slate-600 text-xs">{error}</p>
          <Link href={`/summary/${ticker}`} className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-400 transition-colors mt-2">
            <ArrowLeft className="w-3 h-3" /> Back to Summary
          </Link>
        </div>
      </main>
    );
  }

  const sectionNum = (n: number) => String(n).padStart(2, "0");

  const isFmpSource = data.source_name?.toLowerCase().includes("fmp") ?? false;
  const primarySourceLabel =
    isFmpSource && data.source_url !== data.filing_url ? "FMP Source" : "SEC 10-K Filings";

  return (
    <main className="min-h-screen pt-[88px]" style={{ backgroundColor: "#060c1a" }}>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        <div className="space-y-5 pt-4">
          <Link href={`/summary/${ticker}`} className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-sky-400 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Summary
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                {data.ticker} - {sourceKind(data)}
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-blue-50 leading-none">
                Business Engine
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-500">
                {data.company_name} revenue segmentation from {data.source_name ?? "SEC EDGAR company facts"}.
              </p>
            </div>

            {latest && (
              <div
                className="self-start sm:self-auto rounded-xl px-4 py-3"
                style={{ backgroundColor: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.18)" }}
              >
                <p className="text-[10px] uppercase tracking-widest text-slate-600">Latest Total - FY{latest.year}</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-blue-50">
                  {formatCurrencyCompact(latest.total)}
                </p>
              </div>
            )}
          </div>
        </div>

        <section id="revenue-engine" className="scroll-mt-24">
          <SectionHeader num={sectionNum(1)} title="Revenue Engine" />
          <BusinessEngineCylinder
            data={data}
            loading={false}
            error={null}
            onOpenDeepDive={() => scrollToSection("annual-history")}
          />
        </section>

        <section id="annual-history" className="scroll-mt-24">
          <SectionHeader num={sectionNum(2)} title="Annual History" />
          <div className="bb-card p-3 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.18)" }}
                >
                  <BarChart3 className="w-4 h-4 text-sky-400" />
                </span>
                <div>
                  <p className="text-sm font-bold text-blue-50">
                    {data.has_segments ? "Revenue by Segment" : "Total Revenue"}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-600">
                    Annual fiscal years
                  </p>
                </div>
              </div>
              <span
                className="self-start rounded-lg px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500"
                style={{ backgroundColor: "rgba(15,32,64,0.58)", border: "1px solid rgba(56,189,248,0.1)" }}
              >
                {data.years.length} years
              </span>
            </div>

            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,189,248,0.07)" vertical={false} />
                  <XAxis
                    dataKey="year"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `FY${value}`}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={64}
                    tickFormatter={(value: number) => formatCurrencyCompact(value)}
                  />
                  <Tooltip content={<RevenueTooltip />} cursor={{ fill: "rgba(129,140,248,0.05)" }} />
                  {data.segments.map((segment) => (
                    <Bar
                      key={segment.name}
                      dataKey={segment.name}
                      stackId="revenue"
                      fill={segment.color}
                      fillOpacity={0.86}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <DataSourceNote
              label={data.source_name ?? "SEC EDGAR Company Facts XBRL API"}
              href={data.source_url}
            />
          </div>
        </section>

        <section id="latest-mix" className="scroll-mt-24">
          <SectionHeader num={sectionNum(3)} title="Latest Mix" />
          <div className="bb-card p-3 space-y-3">
            {segmentRows.map((segment) => (
              <div
                key={segment.name}
                className="rounded-lg p-3"
                style={{ backgroundColor: `${segment.color}0f`, border: `1px solid ${segment.color}24` }}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: segment.color }} />
                      <p className="truncate text-sm font-bold text-blue-50">{segment.name}</p>
                    </div>
                    <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-600">
                      {segment.share.toFixed(1)}% of FY{latest?.year} revenue
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-slate-600">Revenue</p>
                      <p className="text-sm font-bold tabular-nums text-blue-50">
                        {formatCurrencyCompact(segment.value)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-slate-600">YoY</p>
                      <p
                        className="text-sm font-bold tabular-nums"
                        style={{ color: segment.yoy === null ? "#94a3b8" : segment.yoy >= 0 ? "#34d399" : "#fb7185" }}
                      >
                        {segment.yoy === null ? "N/A" : `${segment.yoy >= 0 ? "+" : ""}${segment.yoy.toFixed(1)}%`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full" style={{ backgroundColor: "rgba(15,23,42,0.85)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(1, segment.share))}%`,
                      backgroundColor: segment.color,
                    }}
                  />
                </div>
              </div>
            ))}
            <DataSourceNote
              label={data.source_name ?? "SEC EDGAR Company Facts XBRL API"}
              href={data.source_url}
            />
          </div>
        </section>

        <section id="source" className="scroll-mt-24">
          <SectionHeader num={sectionNum(4)} title="Data Source" />
          <div className="bb-card p-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-center">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)" }}
                  >
                    <Database className="w-4 h-4 text-emerald-400" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-blue-50">{data.source_name ?? "SEC EDGAR Company Facts XBRL API"}</p>
                    <p className="text-[10px] uppercase tracking-widest text-slate-600">
                      {data.concept_label ?? data.concept ?? "Revenue"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="rounded-lg p-2.5" style={{ backgroundColor: "rgba(15,32,64,0.5)", border: "1px solid rgba(56,189,248,0.08)" }}>
                    <p className="text-[9px] uppercase tracking-widest text-slate-600">XBRL Dimension</p>
                    <p className="mt-1 truncate text-xs font-semibold text-slate-300">
                      {data.dimension ?? "Total revenue only"}
                    </p>
                  </div>
                  <div className="rounded-lg p-2.5" style={{ backgroundColor: "rgba(15,32,64,0.5)", border: "1px solid rgba(56,189,248,0.08)" }}>
                    <p className="text-[9px] uppercase tracking-widest text-slate-600">Coverage</p>
                    <p className="mt-1 text-xs font-semibold text-slate-300">
                      {data.years.length} fiscal years - {data.segments.length} reported lines
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
                <a
                  href={data.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition hover:-translate-y-0.5"
                  style={{
                    color: "#38bdf8",
                    backgroundColor: "rgba(56,189,248,0.07)",
                    border: "1px solid rgba(56,189,248,0.16)",
                  }}
                >
                  {primarySourceLabel}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                {data.filing_url && data.filing_url !== data.source_url && (
                  <a
                    href={data.filing_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition hover:-translate-y-0.5"
                    style={{
                      color: "#a5b4fc",
                      backgroundColor: "rgba(129,140,248,0.08)",
                      border: "1px solid rgba(129,140,248,0.18)",
                    }}
                  >
                    SEC 10-K Filings
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
