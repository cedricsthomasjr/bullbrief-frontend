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

type EPSData = {
  year: string;
  eps: number;
};

type EPSResponse = {
  data?: { year: number; value: number }[];
  error?: string;
};

export default function EPSChartCard({ ticker }: { ticker: string }) {
  const [data, setData] = useState<EPSData[]>([]);
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
          .map((row) => ({ year: String(row.year), eps: row.value }))
          .sort((a, b) => Number(a.year) - Number(b.year));
        setData(sorted);
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

  return (
    <div className="space-y-4">
      <h2 className="text-white text-lg font-semibold mb-4">
        EPS History ({ticker.toUpperCase()})
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis dataKey="year" stroke="#999" />
          <YAxis stroke="#999" />
          <Tooltip
            contentStyle={{ backgroundColor: "#111", border: "none" }}
            labelStyle={{ color: "#fff" }}
            itemStyle={{ color: "#3b82f6" }}
          />
          <Bar dataKey="eps" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Line
            type="monotone"
            dataKey="eps"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={{ r: 3, fill: "#60a5fa" }}
            activeDot={{ r: 5 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
