"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, Loader2, Sparkles } from "lucide-react";
import { cachedFetch } from "@/app/lib/summaryCache";

type MetricPoint = {
  year: number;
  value: number;
};

type ExploreMetric = {
  key: string;
  label: string;
  unit: "currency" | "per-share" | string;
  accent: string;
  data: MetricPoint[];
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
    schwab?: SchwabSource;
  };
  error?: string;
};

function compact(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
  if (abs >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toFixed(abs < 10 ? 2 : 0);
}

function formatValue(value: number, unit: string, abbreviated = false) {
  if (unit === "currency") {
    const abs = Math.abs(value);
    const sign = value < 0 ? "-" : "";
    return abbreviated ? `${sign}$${compact(abs)}` : `${sign}$${abs.toLocaleString()}`;
  }

  if (unit === "per-share") {
    return `$${value.toFixed(2)}`;
  }

  return abbreviated ? compact(value) : value.toLocaleString();
}

function sourceLabel(source?: MetricsResponse["source"]) {
  if (source?.schwab?.available) return "Schwab Market Data";
  return "Historical Fundamentals";
}

export default function ExploreMetricsChart({ ticker }: { ticker: string }) {
  const [metrics, setMetrics] = useState<ExploreMetric[]>([]);
  const [source, setSource] = useState<MetricsResponse["source"]>(undefined);
  const [activeKey, setActiveKey] = useState("revenue");
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

  const chartData = useMemo(
    () => [...(activeMetric?.data ?? [])].sort((a, b) => a.year - b.year),
    [activeMetric],
  );

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

  return (
    <div className="bb-card p-3 space-y-4 overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)" }}
            >
              <BarChart3 className="w-4 h-4 text-sky-400" />
            </span>
            <div>
              <p className="text-sm font-bold text-blue-50">{activeMetric.label}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-600">
                {ticker.toUpperCase()} metric history
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500"
            title={source?.schwab?.message ?? source?.schwab?.status}
            style={{ backgroundColor: "rgba(15,32,64,0.58)", border: "1px solid rgba(56,189,248,0.1)" }}
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            {sourceLabel(source)}
          </span>
          <div className="rounded-lg px-3 py-2" style={{ backgroundColor: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
            <p className="text-[10px] uppercase tracking-widest text-slate-600">Latest</p>
            <p className="text-sm font-bold tabular-nums text-blue-50">
              {formatValue(latest.value, activeMetric.unit, true)}
            </p>
          </div>
          <div className="rounded-lg px-3 py-2" style={{ backgroundColor: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.15)" }}>
            <p className="text-[10px] uppercase tracking-widest text-slate-600">YoY</p>
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
                boxShadow: active ? `0 0 24px ${metric.accent}33` : "none",
              }}
            >
              {metric.label}
            </button>
          );
        })}
      </div>

      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 18, right: 18, bottom: 6, left: 0 }}>
            <defs>
              <linearGradient id={`metric-fill-${activeMetric.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activeMetric.accent} stopOpacity={0.34} />
                <stop offset="95%" stopColor={activeMetric.accent} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,189,248,0.08)" vertical={false} />
            <XAxis
              dataKey="year"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value: number) => formatValue(value, activeMetric.unit, true)}
              tickLine={false}
              axisLine={false}
              width={78}
            />
            <Tooltip
              cursor={{ stroke: activeMetric.accent, strokeWidth: 1, strokeDasharray: "4 4" }}
              contentStyle={{
                backgroundColor: "#081224",
                border: `1px solid ${activeMetric.accent}55`,
                borderRadius: 8,
                boxShadow: `0 0 28px ${activeMetric.accent}22`,
              }}
              labelStyle={{ color: "#bfdbfe", fontWeight: 700 }}
              formatter={(value: number | string) => {
                const numeric = typeof value === "number" ? value : Number(value);
                return Number.isFinite(numeric)
                  ? [formatValue(numeric, activeMetric.unit), activeMetric.label]
                  : [value, activeMetric.label];
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              name={activeMetric.label}
              stroke={activeMetric.accent}
              strokeWidth={3}
              fill={`url(#metric-fill-${activeMetric.key})`}
              dot={{ r: 3, fill: "#081224", stroke: activeMetric.accent, strokeWidth: 2 }}
              activeDot={{ r: 6, fill: activeMetric.accent, stroke: "#eff6ff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
