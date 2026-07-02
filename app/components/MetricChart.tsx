"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

import { motion } from "framer-motion";
import DataSourceNote from "@/app/components/DataSourceNote";

const formatNumber = (num: number) => {
  return num >= 1e9
    ? `$${(num / 1e9).toFixed(1)}B`
    : num >= 1e6
    ? `$${(num / 1e6).toFixed(1)}M`
    : `$${num.toLocaleString()}`;
};

type Props = {
  data: MetricPoint[] | null;
  quarterlyData?: MetricPoint[] | null;
  title: string;
  source?: string;
  quarterlySource?: string;
};

type MetricPoint = {
  year: number;
  quarter?: number;
  date?: string;
  label?: string;
  value: number;
};

type PeriodMode = "annual" | "quarterly";

function displayLabel(point: MetricPoint, period: PeriodMode) {
  if (period === "quarterly") {
    return point.label ?? (point.quarter ? `${point.year} Q${point.quarter}` : String(point.year));
  }
  return String(point.year);
}

export default function MetricChart({
  data,
  quarterlyData,
  title,
  source = "Financial Modeling Prep income statements",
  quarterlySource,
}: Props) {
  const [period, setPeriod] = useState<PeriodMode>("annual");
  const hasData = Array.isArray(data) && data.length > 0;
  const hasQuarterly = Array.isArray(quarterlyData) && quarterlyData.length > 0;
  const activePeriod = hasQuarterly ? period : "annual";
  const activeSource = activePeriod === "quarterly" ? quarterlySource ?? source : source;
  const sortedData = useMemo(() => {
    if (!hasData) return [];
    const rows = activePeriod === "quarterly" ? quarterlyData ?? [] : data ?? [];
    return [...rows]
      .sort((a, b) => {
        if (activePeriod === "quarterly") {
          return String(a.date ?? a.label ?? a.year).localeCompare(String(b.date ?? b.label ?? b.year));
        }
        return a.year - b.year;
      })
      .map((point) => ({ ...point, displayLabel: displayLabel(point, activePeriod) }));
  }, [activePeriod, data, hasData, quarterlyData]);

  if (!hasData) {
    console.warn("MetricChart: No valid data passed", data);
    return (
      <div className="text-center text-gray-400 py-12">
        No data available for this metric.
      </div>
    );
  }

  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bb-card p-3"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-blue-50 capitalize tracking-tight">
          {title} Trend
        </h2>
        {hasQuarterly && (
          <div className="inline-flex self-start rounded-lg p-1 bg-[#0f2040]/60 border border-sky-400/10">
            {(["annual", "quarterly"] as PeriodMode[]).map((option) => {
              const active = activePeriod === option;
              return (
                <button
                  key={option}
                  onClick={() => setPeriod(option)}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                    active ? "text-blue-50 bg-sky-400/15" : "text-slate-500"
                  }`}
                >
                  {option === "annual" ? "Annual" : "Quarterly"}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={sortedData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="displayLabel"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickFormatter={(v) => formatNumber(v)}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#0f1e38", border: "1px solid rgba(56,189,248,0.18)" }}
            labelStyle={{ color: "#cbd5e1" }}
            formatter={(value: number | string) => {
              const num = typeof value === "number" ? value : parseFloat(value);
              return isNaN(num) ? "-" : formatNumber(num);
            }}

          />
          <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ color: '#94a3b8' }} />
          <Line
            type="monotone"
            dataKey="value"
            name={title}
            stroke="#38bdf8"
            strokeWidth={3}
            dot={{ r: 4, stroke: "#060c1a", strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <DataSourceNote label={activeSource} />
    </motion.div>
  );
}
