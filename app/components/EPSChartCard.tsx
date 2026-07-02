"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import DataSourceNote from "@/app/components/DataSourceNote";

type EPSData = {
  label: string;
  date?: string;
  eps: number;
};

type EPSResponse = {
  data?: { year: number; value: number }[];
  quarterly_data?: { year: number; quarter?: number; date?: string; label?: string; value: number }[];
  source?: { historical?: string; historical_quarterly?: string | null };
  error?: string;
};

type PeriodMode = "annual" | "quarterly";

export default function EPSChartCard({ ticker }: { ticker: string }) {
  const [data, setData] = useState<EPSData[]>([]);
  const [quarterlyData, setQuarterlyData] = useState<EPSData[]>([]);
  const [source, setSource] = useState("Financial Modeling Prep income statements");
  const [quarterlySource, setQuarterlySource] = useState<string | null>(null);
  const [period, setPeriod] = useState<PeriodMode>("annual");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEPS = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/eps/${encodeURIComponent(ticker)}`);
        if (!res.ok) throw new Error("EPS request failed");

        const json = (await res.json()) as EPSResponse;
        if (json.error || !Array.isArray(json.data)) throw new Error(json.error ?? "EPS data unavailable");

        const sorted = json.data
          .map((row) => ({ label: String(row.year), eps: row.value }))
          .sort((a, b) => Number(a.label) - Number(b.label));
        const sortedQuarterly = (json.quarterly_data ?? [])
          .map((row) => ({
            label: row.label ?? (row.quarter ? `${row.year} Q${row.quarter}` : String(row.year)),
            date: row.date,
            eps: row.value,
          }))
          .sort((a, b) => String(a.date ?? a.label).localeCompare(String(b.date ?? b.label)));
        setData(sorted);
        setQuarterlyData(sortedQuarterly);
        setSource(
          json.source?.historical === "financialmodelingprep"
            ? "Financial Modeling Prep income statements"
            : json.source?.historical === "yfinance"
              ? "Yahoo Finance via yfinance income statements"
            : "Historical income statements"
        );
        setQuarterlySource(
          json.source?.historical_quarterly === "financialmodelingprep"
            ? "Financial Modeling Prep income statements"
            : json.source?.historical_quarterly === "yfinance"
              ? "Yahoo Finance via yfinance income statements"
              : null
        );
      } catch (err) {
        console.error("Failed to fetch EPS history", err);
        setError("EPS history is unavailable right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchEPS();
  }, [ticker]);

  if (loading) {
    return (
      <div className="py-10 text-sm text-slate-500">
        Loading EPS data...
      </div>
    );
  }

  if (error || data.length === 0) {
    return <div className="py-10 text-sm text-slate-500">{error || "No EPS data found."}</div>;
  }

  const hasQuarterly = quarterlyData.length > 0;
  const activePeriod = hasQuarterly ? period : "annual";
  const activeData = activePeriod === "quarterly" ? quarterlyData : data;
  const activeSource = activePeriod === "quarterly" ? quarterlySource ?? source : source;

  return (
    <div className="space-y-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-blue-50 text-lg font-bold">
          EPS History ({ticker.toUpperCase()})
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
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={activeData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="label" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip
            contentStyle={{ backgroundColor: "#0f1e38", border: "1px solid rgba(56,189,248,0.18)" }}
            labelStyle={{ color: "#eff6ff" }}
            itemStyle={{ color: "#38bdf8" }}
          />
          <Bar dataKey="eps" fill="#38bdf8" radius={[4, 4, 0, 0]} />
          <Line
            type="monotone"
            dataKey="eps"
            stroke="#818cf8"
            strokeWidth={2}
            dot={{ r: 3, fill: "#818cf8" }}
            activeDot={{ r: 5 }}
          />
        </BarChart>
      </ResponsiveContainer>
      <DataSourceNote label={activeSource} />
    </div>
  );
}
