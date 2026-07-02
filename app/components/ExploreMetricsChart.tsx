"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Customized,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, Loader2, Sparkles } from "lucide-react";
import { cachedFetch } from "@/app/lib/summaryCache";
import DataSourceNote from "@/app/components/DataSourceNote";

type MetricPoint = {
  year: number;
  quarter?: number;
  date?: string;
  label?: string;
  value: number;
};

type ExploreMetric = {
  key: string;
  label: string;
  unit: "currency" | "per-share" | string;
  accent: string;
  data: MetricPoint[];
  quarterly_data?: MetricPoint[];
};

type SchwabSource = {
  available: boolean;
  status: string;
  message?: string;
};

type MetricsResponse = {
  ticker: string;
  metrics?: ExploreMetric[];
  source?: {
    historical?: string;
    historical_quarterly?: string | null;
    schwab?: SchwabSource;
  };
  periods?: string[];
  error?: string;
};

type PeriodMode = "annual" | "quarterly";

function compactCurrency(value: number) {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  const pick = (n: number, suffix: string) => {
    const fixed = n >= 100 || Number.isInteger(n) ? n.toFixed(0) : n.toFixed(1);
    return `${sign}$${fixed.replace(/\.0$/, "")}${suffix}`;
  };

  if (abs >= 1e12) return pick(abs / 1e12, "T");
  if (abs >= 1e9) return pick(abs / 1e9, "B");
  if (abs >= 1e6) return pick(abs / 1e6, "M");
  if (abs >= 1e3) return pick(abs / 1e3, "K");
  if (abs === 0) return `${sign}$0`;
  return `${sign}$${abs.toFixed(abs < 10 ? 2 : 0)}`;
}

function formatValue(value: number, unit: string, abbreviated = false) {
  if (unit === "currency") {
    if (abbreviated) return compactCurrency(value);
    const abs = Math.abs(value);
    const sign = value < 0 ? "-" : "";
    return `${sign}$${abs.toLocaleString()}`;
  }

  if (unit === "per-share") {
    return `$${value.toFixed(2)}`;
  }

  if (abbreviated) {
    const abs = Math.abs(value);
    const sign = value < 0 ? "-" : "";
    if (abs >= 1e12) return `${sign}${(abs / 1e12).toFixed(1)}T`;
    if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(1)}B`;
    if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(1)}M`;
    if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(1)}K`;
    return value.toFixed(abs < 10 ? 2 : 0);
  }

  return value.toLocaleString();
}

function formatYearTick(year: number, unit: string) {
  if (unit === "currency" || unit === "per-share") {
    const yy = String(year).slice(-2);
    return `FY${yy}`;
  }
  return String(year);
}

function formatPointLabel(point: MetricPoint, unit: string, period: PeriodMode) {
  if (period === "quarterly") {
    return point.label ?? (point.quarter ? `${point.year} Q${point.quarter}` : String(point.year));
  }
  return formatYearTick(point.year, unit);
}

function yoyPercent(current: number, previous: number): number | null {
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return null;
  if (previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

function formatYoyLabel(pct: number | null): string | null {
  if (pct === null) return null;
  const sign = pct >= 0 ? "+" : "";
  const rounded = Math.abs(pct) >= 100 ? pct.toFixed(0) : pct.toFixed(0);
  return `${sign}${rounded}%`;
}

function generateInsight(
  data: MetricPoint[],
  unit: string,
  label: string,
  period: PeriodMode,
): string | null {
  if (data.length < 3) return null;

  const first = data[0];
  const last = data[data.length - 1];
  if (!first || !last || first.value === 0) return null;
  if (first.value <= 0 || last.value <= 0) return null;

  const multiple = last.value / first.value;
  if (!Number.isFinite(multiple) || multiple <= 0) return null;

  const earliestYearLabel = formatPointLabel(first, unit, period);
  const multipleText =
    multiple >= 2 ? `${multiple.toFixed(1)}x` : `${(multiple * 100 - 100).toFixed(0)}%`;
  const direction = multiple >= 1 ? "up" : "down";
  const changeLabel = period === "quarterly" ? "QoQ" : "YoY";

  const firstYoy = yoyPercent(data[1].value, data[0].value);
  const lastYoy = yoyPercent(last.value, data[data.length - 2].value);

  const base = multiple >= 2
    ? `${label} is ${direction} ${multipleText} since ${earliestYearLabel}`
    : `${label} has moved ${multipleText} since ${earliestYearLabel}`;

  if (firstYoy !== null && lastYoy !== null && Math.abs(firstYoy - lastYoy) >= 5) {
    const trend = lastYoy < firstYoy ? "slowed" : "accelerated";
    return `${base}, though ${changeLabel} growth has ${trend} from ${formatYoyLabel(firstYoy)} to ${formatYoyLabel(lastYoy)}.`;
  }

  return `${base}.`;
}

function sourceLabel(source?: MetricsResponse["source"], period: PeriodMode = "annual") {
  const sourceKey = period === "quarterly" ? source?.historical_quarterly : source?.historical;
  if (sourceKey === "financialmodelingprep") {
    return "Financial Modeling Prep income statements";
  }
  if (sourceKey === "yfinance") {
    return "Yahoo Finance via yfinance income statements";
  }
  return "Historical financial statements";
}

type CustomizedProps = {
  xAxisMap?: Record<string, { scale?: (value: number | string) => number }>;
  yAxisMap?: Record<string, { scale?: (value: number) => number }>;
};

type ChartPoint = MetricPoint & { change: number | null; displayLabel: string };

function ValueAndYoyOverlay({
  xAxisMap,
  yAxisMap,
  data,
  accent,
  unit,
}: CustomizedProps & {
  data: ChartPoint[];
  accent: string;
  unit: string;
}) {
  const xKey = xAxisMap ? Object.keys(xAxisMap)[0] : undefined;
  const yKey = yAxisMap ? Object.keys(yAxisMap)[0] : undefined;
  const xScale = xKey ? xAxisMap?.[xKey]?.scale : undefined;
  const yScale = yKey ? yAxisMap?.[yKey]?.scale : undefined;

  if (!xScale || !yScale || data.length === 0) return null;

  return (
    <g pointerEvents="none">
      {data.map((point, idx) => {
        const cx = xScale(point.displayLabel);
        const cy = yScale(point.value);
        if (!Number.isFinite(cx) || !Number.isFinite(cy)) return null;

        const valueLabel = formatValue(point.value, unit, true);

        let yoyNode = null;
        if (idx > 0) {
          const prev = data[idx - 1];
          const prevX = xScale(prev.displayLabel);
          const prevY = yScale(prev.value);
          if (Number.isFinite(prevX) && Number.isFinite(prevY)) {
            const midX = (cx + prevX) / 2;
            const midY = (cy + prevY) / 2 - 14;
            const label = formatYoyLabel(point.change);
            if (label) {
              const positive = (point.change ?? 0) >= 0;
              yoyNode = (
                <text
                  key={`change-${point.displayLabel}`}
                  x={midX}
                  y={midY}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={600}
                  fill={positive ? "rgba(148, 163, 184, 0.85)" : "rgba(244, 63, 94, 0.9)"}
                  style={{ letterSpacing: "0.04em" }}
                >
                  {label}
                </text>
              );
            }
          }
        }

        return (
          <g key={`overlay-${point.displayLabel}`}>
            {yoyNode}
            <text
              x={cx}
              y={cy - 14}
              textAnchor="middle"
              fontSize={11}
              fontWeight={700}
              fill={accent}
              style={{ paintOrder: "stroke", stroke: "#06101e", strokeWidth: 3 }}
            >
              {valueLabel}
            </text>
          </g>
        );
      })}
    </g>
  );
}

type TooltipPayload = {
  payload?: ChartPoint;
  value?: number | string;
};

function CompactTooltip({
  active,
  payload,
  unit,
  label,
  accent,
  period,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  unit: string;
  label: string;
  accent: string;
  period: PeriodMode;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  const yoyLabel = formatYoyLabel(point.change ?? null);
  const yoyPositive = (point.change ?? 0) >= 0;
  const changeLabel = period === "quarterly" ? "QoQ" : "YoY";

  return (
    <div
      className="rounded-lg bg-[#081224]/96 px-3 py-2 text-xs"
      style={{ border: `1px solid ${accent}55` }}
    >
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {point.displayLabel}
      </p>
      <p className="mt-0.5 text-sm font-bold tabular-nums text-blue-50">
        {formatValue(point.value, unit)}
      </p>
      {yoyLabel && (
        <p className={`mt-0.5 text-xs font-semibold tabular-nums ${yoyPositive ? "text-emerald-400" : "text-rose-400"}`}>
          {changeLabel} {yoyLabel}
        </p>
      )}
      <p className="mt-1 text-xs uppercase tracking-wide text-slate-600">{label}</p>
    </div>
  );
}

export default function ExploreMetricsChart({ ticker }: { ticker: string }) {
  const [metrics, setMetrics] = useState<ExploreMetric[]>([]);
  const [source, setSource] = useState<MetricsResponse["source"]>(undefined);
  const [activeKey, setActiveKey] = useState("revenue");
  const [period, setPeriod] = useState<PeriodMode>("annual");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) return;

    let cancelled = false;

    async function fetchMetrics() {
      setLoading(true);
      setError(null);

      try {
        const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
        const json = await cachedFetch<MetricsResponse>(`${baseURL}/metrics/${encodeURIComponent(ticker)}`);

        if (json.error) throw new Error(json.error);
        if (!Array.isArray(json.metrics) || json.metrics.length === 0) {
          throw new Error("No metric history found.");
        }

        if (!cancelled) {
          setMetrics(json.metrics);
          setSource(json.source);
          setActiveKey((current) => (
            json.metrics?.some((metric) => metric.key === current)
              ? current
              : json.metrics?.[0]?.key ?? "revenue"
          ));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load metrics.");
          setMetrics([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMetrics();

    return () => {
      cancelled = true;
    };
  }, [ticker]);

  const activeMetric = useMemo(
    () => metrics.find((metric) => metric.key === activeKey) ?? metrics[0],
    [activeKey, metrics],
  );

  const hasQuarterly = (activeMetric?.quarterly_data?.length ?? 0) > 0;

  useEffect(() => {
    if (!hasQuarterly && period === "quarterly") {
      setPeriod("annual");
    }
  }, [hasQuarterly, period]);

  const chartData = useMemo<ChartPoint[]>(() => {
    const rawData = period === "quarterly" && hasQuarterly
      ? activeMetric?.quarterly_data ?? []
      : activeMetric?.data ?? [];
    const sorted = [...rawData].sort((a, b) => {
      if (period === "quarterly") {
        return String(a.date ?? a.label ?? a.year).localeCompare(String(b.date ?? b.label ?? b.year));
      }
      return a.year - b.year;
    });
    return sorted.map((point, idx) => ({
      ...point,
      displayLabel: formatPointLabel(point, activeMetric?.unit ?? "currency", period),
      change: idx === 0 ? null : yoyPercent(point.value, sorted[idx - 1].value),
    }));
  }, [activeMetric, hasQuarterly, period]);

  const yDomain = useMemo<[number, number]>(() => {
    if (chartData.length === 0) return [0, 1];
    const values = chartData.map((p) => p.value);
    const min = Math.min(...values, 0);
    const max = Math.max(...values);
    if (max === min) {
      const pad = Math.abs(max) * 0.15 || 1;
      return [min - pad, max + pad];
    }
    const top = max + (max - min) * 0.2;
    const bottom = min < 0 ? min - Math.abs(min) * 0.15 : 0;
    return [bottom, top];
  }, [chartData]);

  if (loading) {
    return (
      <div className="bb-card p-4 flex items-center gap-3">
        <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
        <p className="text-sm text-slate-500">Loading metric history...</p>
      </div>
    );
  }

  if (error || !activeMetric) {
    return (
      <div className="bb-card-danger p-4">
        <p className="text-sm text-rose-400">Explore Metrics could not load.</p>
        {error && <p className="mt-1 text-xs text-slate-600">{error}</p>}
      </div>
    );
  }

  const latest = chartData[chartData.length - 1];
  const previous = chartData[chartData.length - 2];
  const delta = latest && previous ? latest.value - previous.value : null;
  const deltaText = delta === null
    ? "N/A"
    : `${delta >= 0 ? "+" : ""}${formatValue(delta, activeMetric.unit, true)}`;

  const insight = generateInsight(chartData, activeMetric.unit, activeMetric.label, period);
  const singlePoint = chartData.length === 1;
  const changeLabel = period === "quarterly" ? "QoQ" : "YoY";

  return (
    <div className="bb-card p-3 space-y-4 overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-sky-400/8 border border-sky-400/20">
              <BarChart3 className="w-4 h-4 text-sky-400" />
            </span>
            <div>
              <p className="text-sm font-bold text-blue-50">{activeMetric.label}</p>
              <p className="text-xs uppercase tracking-wide text-slate-600">
                {ticker.toUpperCase()} metric history
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-lg border border-sky-400/10 bg-[#0f2040]/58 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500"
            title={source?.schwab?.available ? `Schwab fundamentals available: ${source.schwab.status}` : source?.schwab?.message ?? source?.schwab?.status}
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            {sourceLabel(source, period)}
          </span>
          {hasQuarterly && (
            <div className="inline-flex rounded-lg border border-sky-400/10 bg-[#0f2040]/58 p-1">
              {(["annual", "quarterly"] as PeriodMode[]).map((option) => {
                const active = period === option;
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
          <div className="rounded-lg border border-emerald-400/15 bg-emerald-400/8 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-slate-600">Latest</p>
            <p className="text-sm font-bold tabular-nums text-blue-50">
              {formatValue(latest.value, activeMetric.unit, true)}
            </p>
          </div>
          <div className="rounded-lg border border-indigo-400/15 bg-indigo-400/8 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-slate-600">{changeLabel}</p>
            <p className={`text-sm font-bold tabular-nums ${delta !== null && delta < 0 ? "text-rose-400" : "text-emerald-400"}`}>
              {deltaText}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {metrics.map((metric) => {
          const active = metric.key === activeMetric.key;

          return (
            <button
              key={metric.key}
              onClick={() => setActiveKey(metric.key)}
              className="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-all hover:-translate-y-0.5"
              style={{
                color: active ? "#eff6ff" : "#94a3b8",
                backgroundColor: active ? `${metric.accent}26` : "rgba(15, 32, 64, 0.42)",
                border: `1px solid ${active ? metric.accent : "rgba(56,189,248,0.1)"}`,
              }}
            >
              {metric.label}
            </button>
          );
        })}
      </div>

      {insight && (
        <p className="text-xs leading-relaxed text-slate-400">
          <span className="text-slate-500">Insight: </span>
          {insight}
        </p>
      )}

      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 32, right: 24, bottom: 6, left: 0 }}>
            <defs>
              <linearGradient id={`metric-fill-${activeMetric.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activeMetric.accent} stopOpacity={0.34} />
                <stop offset="95%" stopColor={activeMetric.accent} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,189,248,0.08)" vertical={false} />
            <XAxis
              dataKey="displayLabel"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: string) => value}
              padding={{ left: 12, right: 12 }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value: number) => formatValue(value, activeMetric.unit, true)}
              tickLine={false}
              axisLine={false}
              width={68}
              domain={yDomain}
            />
            <Tooltip
              cursor={false}
              content={(props: { active?: boolean; payload?: TooltipPayload[] }) => (
                <CompactTooltip
                  active={props.active}
                  payload={props.payload}
                  unit={activeMetric.unit}
                  label={activeMetric.label}
                  accent={activeMetric.accent}
                  period={period}
                />
              )}
            />
            <Area
              type="monotone"
              dataKey="value"
              name={activeMetric.label}
              stroke={activeMetric.accent}
              strokeWidth={2.5}
              fill={`url(#metric-fill-${activeMetric.key})`}
              dot={{ r: 3, fill: "#06101e", stroke: activeMetric.accent, strokeWidth: 2 }}
              activeDot={{ r: 6, fill: activeMetric.accent, stroke: "#eff6ff", strokeWidth: 2 }}
              isAnimationActive={false}
            />
            {!singlePoint && (
              <Customized
                component={(props: CustomizedProps) => (
                  <ValueAndYoyOverlay
                    {...props}
                    data={chartData}
                    accent={activeMetric.accent}
                    unit={activeMetric.unit}
                  />
                )}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <DataSourceNote label={sourceLabel(source, period)} />
    </div>
  );
}
