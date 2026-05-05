"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";
import DataSourceNote from "@/app/components/DataSourceNote";

type TickerData = {
  ticker: string;
  company_name?: string;
  market_cap: number | null;
  pe_ratio: number | null;
  roe: number | null;
  profit_margin: number | null;
};

type StatKey = "market_cap" | "pe_ratio" | "roe" | "profit_margin";

type StatConfig = {
  key: StatKey;
  label: string;
  shortLabel: string;
  toDisplay: (v: number) => number;
  formatDisplay: (v: number) => string;
  formatAxis: (v: number) => string;
};

const STATS: StatConfig[] = [
  {
    key: "market_cap",
    label: "Market Cap",
    shortLabel: "Mkt Cap",
    toDisplay: (v) => parseFloat((v / 1e9).toFixed(1)),
    formatDisplay: (v) => `$${v.toFixed(1)}B`,
    formatAxis: (v) => `$${v}B`,
  },
  {
    key: "pe_ratio",
    label: "P/E Ratio",
    shortLabel: "P/E",
    toDisplay: (v) => parseFloat(v.toFixed(1)),
    formatDisplay: (v) => `${v.toFixed(1)}x`,
    formatAxis: (v) => `${v}x`,
  },
  {
    key: "roe",
    label: "Return on Equity",
    shortLabel: "ROE",
    toDisplay: (v) => parseFloat((v * 100).toFixed(1)),
    formatDisplay: (v) => `${v.toFixed(1)}%`,
    formatAxis: (v) => `${v}%`,
  },
  {
    key: "profit_margin",
    label: "Profit Margin",
    shortLabel: "Margin",
    toDisplay: (v) => parseFloat((v * 100).toFixed(1)),
    formatDisplay: (v) => `${v.toFixed(1)}%`,
    formatAxis: (v) => `${v}%`,
  },
];

const COMPANY_COLORS = ["#38bdf8", "#818cf8", "#10b981"];

function CustomTooltipContent({
  active,
  payload,
  stat,
}: {
  active?: boolean;
  payload?: { value: number; payload: { color: string; ticker: string } }[];
  stat: StatConfig;
}) {
  if (!active || !payload?.length) return null;
  const { value, payload: item } = payload[0];
  return (
    <div
      className="bb-card px-3 py-2 text-xs"
      style={{
        backgroundColor: "#0f1e38",
        border: "1px solid rgba(56,189,248,0.18)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}
    >
      <p className="font-black font-mono mb-0.5" style={{ color: item.color }}>
        {item.ticker}
      </p>
      <p className="text-slate-300">{stat.formatDisplay(value)}</p>
    </div>
  );
}

export default function CompareCharts({ data }: { data: TickerData[] | undefined }) {
  const [activeStat, setActiveStat] = useState<StatConfig>(STATS[0]);
  const [hiddenTickers, setHiddenTickers] = useState<string[]>([]);

  if (!data || data.length === 0) return null;

  const toggleTicker = (ticker: string) => {
    const visible = data.filter((d) => !hiddenTickers.includes(d.ticker)).length;
    if (!hiddenTickers.includes(ticker)) {
      if (visible <= 1) return;
      setHiddenTickers((prev) => [...prev, ticker]);
    } else {
      setHiddenTickers((prev) => prev.filter((t) => t !== ticker));
    }
  };

  const chartData = data
    .filter((d) => !hiddenTickers.includes(d.ticker))
    .map((d) => {
      const raw = d[activeStat.key];
      const colorIdx = data.findIndex((x) => x.ticker === d.ticker);
      return {
        ticker: d.ticker,
        value: raw != null ? activeStat.toDisplay(raw) : 0,
        color: COMPANY_COLORS[colorIdx % COMPANY_COLORS.length],
        noData: raw == null,
      };
    });

  return (
    <div
      className="bb-card overflow-hidden"
    >
      {/* Header row */}
      <div
        className="px-3 py-3 flex items-center justify-between gap-3 flex-wrap"
        style={{ borderBottom: "1px solid rgba(56,189,248,0.07)" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">
            Financial Metrics Explorer
          </p>
        </div>
        <p className="text-[10px] uppercase tracking-widest text-slate-600">
          Toggle companies and metrics
        </p>
        {/* Company toggles */}
        <div className="flex gap-3 flex-wrap">
          {data.map((d, i) => {
            const color = COMPANY_COLORS[i % COMPANY_COLORS.length];
            const isActive = !hiddenTickers.includes(d.ticker);
            return (
              <button
                key={d.ticker}
                onClick={() => toggleTicker(d.ticker)}
                className="flex items-center gap-1.5 text-[11px] font-bold font-mono transition-all duration-150"
                style={{ opacity: isActive ? 1 : 0.28, color }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                {d.ticker}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stat tabs */}
      <div className="px-3 pt-3 flex flex-wrap gap-2">
        {STATS.map((stat) => {
          const active = activeStat.key === stat.key;
          return (
            <button
              key={stat.key}
              onClick={() => setActiveStat(stat)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
              style={
                active
                  ? {
                      color: "#38bdf8",
                      backgroundColor: "rgba(56,189,248,0.1)",
                      border: "1px solid rgba(56,189,248,0.28)",
                    }
                  : {
                      color: "#475569",
                      backgroundColor: "transparent",
                      border: "1px solid rgba(56,189,248,0.07)",
                    }
              }
            >
              {stat.label}
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div className="px-3 pb-4 pt-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStat.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={chartData}
                margin={{ top: 28, right: 16, left: 4, bottom: 4 }}
                barCategoryGap="35%"
              >
                <XAxis
                  dataKey="ticker"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 700, fill: "#64748b", fontFamily: "monospace" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#334155" }}
                  tickFormatter={(v) => activeStat.formatAxis(v)}
                  width={52}
                />
                <Tooltip
                  content={<CustomTooltipContent stat={activeStat} />}
                  cursor={{ fill: "rgba(56,189,248,0.03)", radius: 4 }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={80}>
                  {chartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.color}
                      fillOpacity={entry.noData ? 0.2 : 0.85}
                    />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="top"
                    formatter={(v: number) => activeStat.formatDisplay(v)}
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      fill: "#94a3b8",
                      fontFamily: "ui-monospace, monospace",
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <DataSourceNote label="Yahoo Finance via yfinance" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* All-stats mini grid */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-px"
        style={{ borderTop: "1px solid rgba(56,189,248,0.07)" }}
      >
        {STATS.map((stat) => (
          <button
            key={stat.key}
            onClick={() => setActiveStat(stat)}
            className="px-3 py-3 text-left transition-all duration-150 hover:bg-sky-400/[0.03]"
            style={
              activeStat.key === stat.key
                ? { backgroundColor: "rgba(56,189,248,0.04)" }
                : {}
            }
          >
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600 mb-2">
              {stat.shortLabel}
            </p>
            <div className="flex flex-col gap-1">
              {data.map((d, i) => {
                const raw = d[stat.key];
                const color = COMPANY_COLORS[i % COMPANY_COLORS.length];
                return (
                  <div key={d.ticker} className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-mono" style={{ color, opacity: 0.7 }}>
                      {d.ticker}
                    </span>
                    <span className="text-[10px] font-bold tabular-nums text-slate-400">
                      {raw != null ? stat.formatDisplay(stat.toDisplay(raw)) : "-"}
                    </span>
                  </div>
                );
              })}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
