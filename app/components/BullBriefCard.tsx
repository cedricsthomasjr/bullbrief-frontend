"use client";

import { Activity, BarChart3, Building2, CheckCircle2, TrendingDown, TrendingUp } from "lucide-react";
import DataSourceNote from "@/app/components/DataSourceNote";

type Props = {
  ticker: string;
  companyName: string;
  sector: string;
  summary: string;
  marketCap: number;
  peRatio: number;
  currentPrice: number;
  range52w: string;
  isBearish: boolean;
};

function fmtMoney(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return "N/A";
  if (Math.abs(value) >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

function fmtRatio(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return "N/A";
  return value.toFixed(1);
}

function cleanLine(value: string) {
  return value
    .replace(/^[-*]\s+/, "")
    .replace(/\*\*/g, "")
    .trim();
}

function splitBrief(summary: string) {
  const cleaned = summary.trim();
  if (!cleaned) {
    return {
      lead: "BullBrief could not generate a business summary for this ticker yet.",
      points: [] as string[],
    };
  }

  const bulletPoints = cleaned
    .split("\n")
    .map(cleanLine)
    .filter((line) => line.length > 0 && !/^[A-Z][A-Za-z\s]+:$/.test(line));

  const sentenceMatches = cleaned
    .replace(/\n+/g, " ")
    .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
    ?.map(cleanLine)
    .filter(Boolean) ?? [];

  const source = sentenceMatches.length > 1 ? sentenceMatches : bulletPoints;
  // Use only the first sentence as lead so more content is available for points
  const lead = source[0] ?? cleaned;
  const points = source.slice(1, 5);

  return {
    lead: lead || cleaned,
    points,
  };
}

function buildFallbackPoints(
  sector: string,
  marketCap: number,
  peRatio: number,
  isBearish: boolean,
): string[] {
  const pts: string[] = [];

  if (sector) {
    pts.push(`Operates in the ${sector} sector.`);
  }

  if (Number.isFinite(peRatio) && peRatio > 0 && peRatio < 500) {
    if (peRatio > 40) {
      pts.push(`Trades at a premium P/E of ${peRatio.toFixed(1)}x, pricing in elevated growth expectations.`);
    } else if (peRatio > 15) {
      pts.push(`P/E of ${peRatio.toFixed(1)}x reflects moderate market expectations baked into the price.`);
    } else {
      pts.push(`Low P/E of ${peRatio.toFixed(1)}x may signal value relative to current earnings.`);
    }
  }

  if (Number.isFinite(marketCap) && marketCap > 0) {
    if (marketCap >= 1e12) {
      pts.push(`Mega-cap company with a market cap exceeding $1T, carrying significant index weight.`);
    } else if (marketCap >= 2e11) {
      pts.push(`Large-cap company with substantial institutional coverage and index presence.`);
    } else if (marketCap >= 1e10) {
      pts.push(`Mid-to-large cap company with meaningful but still-growing market presence.`);
    }
  }

  if (isBearish) {
    pts.push(`Current valuation warrants caution — elevated multiples leave less room for error.`);
  }

  return pts;
}

export default function BullBriefCard({
  ticker,
  companyName,
  sector,
  summary,
  marketCap,
  peRatio,
  currentPrice,
  range52w,
  isBearish,
}: Props) {
  const { lead, points: rawPoints } = splitBrief(summary);
  const points =
    rawPoints.length >= 2
      ? rawPoints
      : [
          ...rawPoints,
          ...buildFallbackPoints(sector, marketCap, peRatio, isBearish),
        ].slice(0, Math.max(2, rawPoints.length));
  const signal = isBearish
    ? { label: "Watch Valuation", icon: <TrendingDown className="w-3.5 h-3.5" />, color: "#f43f5e", bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.22)" }
    : { label: "Constructive Setup", icon: <TrendingUp className="w-3.5 h-3.5" />, color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.22)" };

  const snapshot = [
    { label: "Sector", value: sector || "N/A" },
    { label: "Price", value: fmtMoney(currentPrice) },
    { label: "Market Cap", value: fmtMoney(marketCap) },
    { label: "P/E", value: fmtRatio(peRatio) },
    { label: "52W Range", value: range52w || "N/A" },
  ];

  return (
    <div className="bb-card overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="p-4 sm:p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.18)" }}
              >
                <Building2 className="w-4 h-4 text-sky-400" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Business Brief</p>
                <h3 className="text-lg font-bold text-blue-50 tracking-tight truncate">{companyName}</h3>
              </div>
            </div>

            <span
              className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-xs font-semibold"
              style={{ color: signal.color, backgroundColor: signal.bg, border: `1px solid ${signal.border}` }}
            >
              {signal.icon}
              {signal.label}
            </span>
          </div>

          <p className="text-[15px] leading-8 text-slate-300 max-w-3xl">
            {lead}
          </p>

          {points.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Key Takeaways</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {points.map((point, idx) => (
                  <div
                    key={`${point}-${idx}`}
                    className="rounded-lg border p-3"
                    style={{ backgroundColor: "rgba(15,32,64,0.36)", borderColor: "rgba(56,189,248,0.1)" }}
                  >
                    <div className="flex gap-3">
                      <span
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold tabular-nums"
                        style={{ color: "#38bdf8", backgroundColor: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.14)" }}
                      >
                        {idx + 1}
                      </span>
                      <p className="text-sm leading-6 text-slate-400">{point}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside
          className="border-t lg:border-t-0 lg:border-l p-4 sm:p-5"
          style={{ borderColor: "rgba(56,189,248,0.08)", backgroundColor: "rgba(6,12,26,0.28)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{ticker.toUpperCase()} Snapshot</p>
          </div>

          <div className="space-y-3">
            {snapshot.map((item) => (
              <div key={item.label} className="flex items-start justify-between gap-3 border-b border-sky-400/[0.06] pb-3 last:border-b-0 last:pb-0">
                <p className="text-[10px] uppercase tracking-widest text-slate-600">{item.label}</p>
                <p className="text-right text-xs font-bold text-blue-50 tabular-nums">{item.value}</p>
              </div>
            ))}
          </div>

          <div
            className="mt-5 rounded-lg p-3"
            style={{ backgroundColor: "rgba(129,140,248,0.07)", border: "1px solid rgba(129,140,248,0.15)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Read First</p>
            </div>
            <p className="text-xs leading-6 text-slate-500">
              Start with business quality, then compare valuation and growth in the sections below.
            </p>
          </div>
          <DataSourceNote
            label="Yahoo Finance via yfinance; BullBrief AI summary"
            align="left"
          />
        </aside>
      </div>
    </div>
  );
}
