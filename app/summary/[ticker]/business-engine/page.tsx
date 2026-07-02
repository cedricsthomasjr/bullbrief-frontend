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
      <span className="text-xs font-mono font-bold tabular-nums px-2 py-0.5 rounded border border-indigo-400/20 bg-indigo-400/10 text-indigo-300">
        {num}
      </span>
      <h2 className="text-lg font-bold text-blue-50 tracking-tight">{title}</h2>
      <div className="flex-1 h-px bg-indigo-400/10" />
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

type PeriodMode = "annual" | "quarterly";

function periodEntryLabel(entry: { year: number; label?: string; fiscal_period?: string } | null | undefined, period: PeriodMode) {
  if (!entry) return "N/A";
  if (period === "quarterly") {
    return entry.label ?? (entry.fiscal_period ? `FY${String(entry.year).slice(-2)} ${entry.fiscal_period}` : String(entry.year));
  }
  return `FY${entry.year}`;
}

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
    <div className="rounded-xl border border-indigo-400/24 bg-[#060c1a] p-3 space-y-2 text-xs min-w-[180px] shadow-lg shadow-black/40">
      <p className="font-bold text-blue-50">{label}</p>
      <p className="text-xs uppercase tracking-wide text-slate-500">
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
  const [period, setPeriod] = useState<PeriodMode>("annual");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) return;
    let active = true;
    const symbol = ticker.toUpperCase();

    setLoading(true);
    setError(null);
    setData(null);
    setPeriod("annual");

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

  const hasQuarterly = (data?.quarters?.length ?? 0) > 0;
  const activePeriod = hasQuarterly ? period : "annual";
  const activeData = useMemo<RevenueBreakdownData | null>(() => {
    if (!data) return null;
    if (activePeriod === "quarterly") {
      const segments = data.quarterly_segments?.length ? data.quarterly_segments : data.segments;
      return {
        ...data,
        segments,
        years: data.quarters ?? [],
        concept: data.quarterly_concept ?? data.concept,
        concept_label: data.quarterly_concept_label ?? data.concept_label,
        dimension: data.quarterly_dimension ?? data.dimension,
        source_name: data.quarterly_source_name ?? data.source_name,
        has_segments: !(segments.length === 1 && segments[0].name === "Total Revenue"),
      };
    }
    return data;
  }, [activePeriod, data]);

  const latest = activeData?.years[activeData.years.length - 1] ?? null;
  const prior = activeData && activeData.years.length > 1 ? activeData.years[activeData.years.length - 2] : null;

  const segmentRows = useMemo(() => {
    if (!activeData || !latest) return [];
    return activeData.segments
      .map((segment) => {
        const value = latest.breakdown[segment.name] ?? 0;
        const priorValue = prior?.breakdown[segment.name] ?? 0;
        const share = latest.total > 0 ? (value / latest.total) * 100 : 0;
        const yoy = priorValue > 0 ? ((value - priorValue) / priorValue) * 100 : null;
        return { ...segment, value, priorValue, share, yoy };
      })
      .filter((segment) => segment.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [activeData, latest, prior]);

  const chartData = useMemo(
    () => activeData?.years.map((entry) => ({
      periodLabel: periodEntryLabel(entry, activePeriod),
      ...entry.breakdown,
    })) ?? [],
    [activeData, activePeriod],
  );

  useSideNavSections(
    [
      { id: "revenue-engine", label: "Revenue Engine" },
      { id: "annual-history", label: activePeriod === "quarterly" ? "Quarterly History" : "Annual History" },
      { id: "latest-mix", label: "Latest Mix" },
      { id: "source", label: "Data Source" },
      { id: "summary-page", label: "Summary", href: `/summary/${ticker}` },
    ],
    "#a5b4fc",
  );

  if (loading) return <LoadingScreen isLoading />;

  if (error || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#060c1a]">
        <div className="text-center space-y-3">
          <p className="text-rose-400 text-sm font-medium">Revenue data unavailable for this ticker</p>
          <p className="text-slate-600 text-xs">{error}</p>
          <Link href={`/summary/${ticker}`} className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-400 transition-colors mt-2">
            <ArrowLeft className="w-3 h-3" /> Back to Summary
          </Link>
        </div>
      </main>
    );
  }

  const sectionNum = (n: number) => String(n).padStart(2, "0");
  const viewData = activeData ?? data;
  const latestLabel = periodEntryLabel(latest, activePeriod);
  const changeLabel = activePeriod === "quarterly" ? "QoQ" : "YoY";

  const isFmpSource = viewData.source_name?.toLowerCase().includes("fmp") ?? false;
  const primarySourceLabel =
    isFmpSource && viewData.source_url !== viewData.filing_url
      ? "FMP Source"
      : activePeriod === "quarterly"
        ? "SEC Filings"
        : "SEC 10-K Filings";

  return (
    <main className="min-h-screen pt-[88px] bg-[#060c1a]">

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        <div className="space-y-5 pt-4">
          <Link href={`/summary/${ticker}`} className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-sky-400 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Summary
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wide text-indigo-300">
                {viewData.ticker} - {sourceKind(viewData)}
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-blue-50 leading-none">
                Business Engine
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-500">
                How {viewData.company_name} generates revenue — broken down by segment{viewData.has_segments ? ", with fiscal-period history and year-over-year changes" : " and fiscal period"}.
              </p>
            </div>

            {latest && (
              <div className="self-start sm:self-auto rounded-xl border border-indigo-400/18 bg-indigo-400/8 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-600">Latest Total - {latestLabel}</p>
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
            data={viewData}
            loading={false}
            error={null}
            onOpenDeepDive={() => scrollToSection("annual-history")}
            period={activePeriod}
          />
        </section>

        <section id="annual-history" className="scroll-mt-24">
          <SectionHeader num={sectionNum(2)} title={activePeriod === "quarterly" ? "Quarterly History" : "Annual History"} />
          <div className="bb-card p-3 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-sky-400/10 border border-sky-400/18">
                  <BarChart3 className="w-4 h-4 text-sky-400" />
                </span>
                <div>
                  <p className="text-sm font-bold text-blue-50">
                    {viewData.has_segments ? "Revenue by Segment" : "Total Revenue"}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-slate-600">
                    {activePeriod === "quarterly" ? "Quarterly fiscal periods" : "Annual fiscal years"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {hasQuarterly && (
                  <div className="inline-flex rounded-lg border border-sky-400/10 bg-[#0f2040]/58 p-1">
                    {(["annual", "quarterly"] as PeriodMode[]).map((option) => {
                      const active = activePeriod === option;
                      return (
                        <button
                          key={option}
                          onClick={() => setPeriod(option)}
                          className={`rounded-md px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                            active ? "bg-sky-400/12 text-blue-50" : "text-slate-500"
                          }`}
                        >
                          {option === "annual" ? "Annual" : "Quarterly"}
                        </button>
                      );
                    })}
                  </div>
                )}
                <span className="self-start rounded-lg border border-sky-400/10 bg-[#0f2040]/58 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {viewData.years.length} {activePeriod === "quarterly" ? "quarters" : "years"}
                </span>
              </div>
            </div>

            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,189,248,0.07)" vertical={false} />
                  <XAxis
                    dataKey="periodLabel"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => String(value)}
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
                  {viewData.segments.map((segment) => (
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
              label={viewData.source_name ?? "SEC EDGAR Company Facts XBRL API"}
              href={viewData.source_url}
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
                    <p className="mt-1 text-xs uppercase tracking-wide text-slate-600">
                      {segment.share.toFixed(1)}% of {latestLabel} revenue
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wide text-slate-600">Revenue</p>
                      <p className="text-sm font-bold tabular-nums text-blue-50">
                        {formatCurrencyCompact(segment.value)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wide text-slate-600">{changeLabel}</p>
                      <p
                        className={`text-sm font-bold tabular-nums ${
                          segment.yoy === null ? "text-slate-400" : segment.yoy >= 0 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {segment.yoy === null ? "N/A" : `${segment.yoy >= 0 ? "+" : ""}${segment.yoy.toFixed(1)}%`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-950/85">
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
              label={viewData.source_name ?? "SEC EDGAR Company Facts XBRL API"}
              href={viewData.source_url}
            />
          </div>
        </section>

        <section id="source" className="scroll-mt-24">
          <SectionHeader num={sectionNum(4)} title="Data Source" />
          <div className="bb-card p-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-center">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-400/10 border border-emerald-400/18">
                    <Database className="w-4 h-4 text-emerald-400" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-blue-50">{viewData.source_name ?? "SEC EDGAR Company Facts XBRL API"}</p>
                    <p className="text-xs uppercase tracking-wide text-slate-600">
                      {viewData.concept_label ?? viewData.concept ?? "Revenue"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="rounded-lg border border-sky-400/8 bg-[#0f2040]/50 p-2.5">
                    <p className="text-xs uppercase tracking-wide text-slate-600">XBRL Dimension</p>
                    <p className="mt-1 truncate text-xs font-semibold text-slate-300">
                      {viewData.dimension ?? "Total revenue only"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-sky-400/8 bg-[#0f2040]/50 p-2.5">
                    <p className="text-xs uppercase tracking-wide text-slate-600">Coverage</p>
                    <p className="mt-1 text-xs font-semibold text-slate-300">
                      {viewData.years.length} {activePeriod === "quarterly" ? "fiscal quarters" : "fiscal years"} - {viewData.segments.length} reported lines
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
                <a
                  href={viewData.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition hover:-translate-y-0.5 text-sky-400 bg-sky-400/[0.07] border border-sky-400/16"
                >
                  {primarySourceLabel}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                {viewData.filing_url && viewData.filing_url !== viewData.source_url && (
                  <a
                    href={viewData.filing_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition hover:-translate-y-0.5 text-indigo-300 bg-indigo-400/[0.08] border border-indigo-400/18"
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
