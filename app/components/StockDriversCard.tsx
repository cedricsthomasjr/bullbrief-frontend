"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  CircleAlert,
  Gauge,
  Layers,
  Loader2,
  Network,
} from "lucide-react";
import { formatNumber } from "@/app/lib/format";
import DataSourceNote from "@/app/components/DataSourceNote";

export type StockDriverOperation = {
  name: string;
  role: string;
  why_it_matters: string;
  evidence: string;
};

export type StockFinancialDriver = {
  label: string;
  value: number | null;
  description: string;
};

export type StockDriversData = {
  ticker: string;
  company_name: string;
  summary: string;
  operations: StockDriverOperation[];
  financial_drivers: StockFinancialDriver[];
  watch_items: string[];
  fiscal_year?: number | null;
  filing_date?: string | null;
  source?: {
    name: string;
    url: string;
  };
};

type Props = {
  data: StockDriversData | null;
  loading: boolean;
  error: string | null;
  revenueHref?: string;
};

const ACCENTS = [
  {
    color: "#38bdf8",
    end: "#818cf8",
    border: "rgba(56, 189, 248, 0.34)",
    glow: "0 0 28px rgba(56, 189, 248, 0.18)",
    bg: "rgba(56, 189, 248, 0.08)",
  },
  {
    color: "#818cf8",
    end: "#a78bfa",
    border: "rgba(129, 140, 248, 0.34)",
    glow: "0 0 28px rgba(129, 140, 248, 0.2)",
    bg: "rgba(129, 140, 248, 0.08)",
  },
  {
    color: "#a78bfa",
    end: "#38bdf8",
    border: "rgba(167, 139, 250, 0.34)",
    glow: "0 0 28px rgba(167, 139, 250, 0.2)",
    bg: "rgba(167, 139, 250, 0.08)",
  },
  {
    color: "#10b981",
    end: "#38bdf8",
    border: "rgba(16, 185, 129, 0.3)",
    glow: "0 0 28px rgba(16, 185, 129, 0.16)",
    bg: "rgba(16, 185, 129, 0.08)",
  },
] as const;

function formatMoney(value: number | null) {
  if (value === null || value === undefined) return "N/A";
  return `$${formatNumber(value)}`;
}

function formatFilingDate(value?: string | null) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function driverMagnitude(driver: StockFinancialDriver) {
  return typeof driver.value === "number" ? Math.abs(driver.value) : 0;
}

function barWidth(value: number, max: number) {
  if (!max) return 18;
  return Math.max(14, Math.min(100, (value / max) * 100));
}

export default function StockDriversCard({
  data,
  loading,
  error,
  revenueHref,
}: Props) {
  if (loading) {
    return (
      <div className="bb-card p-3 flex items-center gap-3">
        <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
        <p className="text-sm text-slate-500">Reading latest SEC filing...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bb-card-danger p-3">
        <p className="text-sm text-rose-400">
          Could not load SEC driver analysis.
        </p>
        {error && <p className="text-xs text-slate-600 mt-1">{error}</p>}
      </div>
    );
  }

  const financialDrivers = data.financial_drivers.slice(0, 4);
  const maxDriverValue = Math.max(...financialDrivers.map(driverMagnitude), 0);
  const operations = data.operations;

  return (
    <div className="space-y-5">
      <div className="bb-card p-3 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
            </span>
            <div>
              <p className="text-sm font-bold text-blue-50">
                What Drives The Stock
              </p>
              <p className="text-[10px] uppercase tracking-widest text-slate-600">
                SEC 10-K {data.fiscal_year ? `FY${data.fiscal_year}` : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-lg px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500"
              title={data.summary}
              style={{
                backgroundColor: "rgba(15,32,64,0.58)",
                border: "1px solid rgba(56,189,248,0.1)",
              }}
            >
              Hover For Filing Context
            </span>
            {data.source?.url && (
              <a
                href={data.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg shrink-0 transition hover:-translate-y-0.5"
                style={{
                  color: "#38bdf8",
                  backgroundColor: "rgba(56,189,248,0.07)",
                  border: "1px solid rgba(56,189,248,0.16)",
                }}
              >
                SEC Filing <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4">
          {financialDrivers.length > 0 && (
            <div className="bb-card-soft p-3 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-sky-400" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    SEC Financial Signals
                  </p>
                </div>
                <span className="text-[10px] text-slate-600 tabular-nums">
                  {financialDrivers.length} signals
                </span>
              </div>

              <div className="space-y-3">
                {financialDrivers.map((driver, idx) => {
                  const accent = ACCENTS[idx % ACCENTS.length];
                  const width = barWidth(
                    driverMagnitude(driver),
                    maxDriverValue,
                  );

                  return (
                    <div
                      key={driver.label}
                      className="group rounded-lg border p-3 transition-all duration-300 hover:-translate-y-0.5"
                      title={driver.description}
                      style={{
                        backgroundColor: accent.bg,
                        borderColor: "rgba(56, 189, 248, 0.1)",
                      }}
                      onMouseEnter={(event) => {
                        event.currentTarget.style.borderColor = accent.border;
                        event.currentTarget.style.boxShadow = accent.glow;
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.borderColor =
                          "rgba(56, 189, 248, 0.1)";
                        event.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-blue-50">
                            {driver.label}
                          </p>
                          <p className="text-[10px] uppercase tracking-widest text-slate-600">
                            SEC line item
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-bold tabular-nums text-blue-50">
                          {formatMoney(driver.value)}
                        </p>
                      </div>

                      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-950/70">
                        <div
                          className="h-full rounded-full transition-all duration-500 group-hover:brightness-125"
                          style={{
                            width: `${width}%`,
                            background: `linear-gradient(90deg, ${accent.color}, ${accent.end})`,
                          }}
                        />
                      </div>

                      <p className="mt-2 min-h-8 text-[11px] leading-4 text-slate-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {driver.description}
                      </p>
                    </div>
                  );
                })}
              </div>
              <DataSourceNote
                label={data.source?.name ?? "SEC EDGAR 10-K filing"}
                href={data.source?.url}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="group bb-card-soft p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-400/40">
              <Gauge className="mb-4 w-4 h-4 text-sky-400 transition group-hover:scale-110" />
              <p className="text-[10px] uppercase tracking-widest text-slate-600">
                Filing Date
              </p>
              <p className="mt-1 text-sm font-bold text-blue-50">
                {formatFilingDate(data.filing_date)}
              </p>
            </div>

            <div className="group bb-card-soft p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/40">
              <Network className="mb-4 w-4 h-4 text-indigo-400 transition group-hover:scale-110" />
              <p className="text-[10px] uppercase tracking-widest text-slate-600">
                Segments
              </p>
              <p className="mt-1 text-sm font-bold text-blue-50 tabular-nums">
                {operations.length}
              </p>
            </div>

            <Link
              href={revenueHref ?? "#business-engine"}
              className="group bb-card-soft col-span-2 p-3 text-left transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background:
                  "linear-gradient(135deg, rgba(56,189,248,0.08) 0%, rgba(129,140,248,0.06) 50%, rgba(167,139,250,0.05) 100%)",
                borderColor: "rgba(129,140,248,0.22)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(129,140,248,0.5)";
                e.currentTarget.style.boxShadow =
                  "0 0 28px rgba(129,140,248,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(129,140,248,0.22)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: "rgba(129,140,248,0.14)",
                      border: "1px solid rgba(129,140,248,0.28)",
                    }}
                  >
                    <Layers className="w-4 h-4 text-indigo-300" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-blue-50">
                      Open Business Engine
                    </p>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5 truncate">
                      Segment revenue, source detail, and year-over-year
                      history.
                    </p>
                  </div>
                </div>
                <span
                  className="shrink-0 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-lg transition-colors"
                  style={{
                    color: "#a5b4fc",
                    backgroundColor: "rgba(129,140,248,0.12)",
                    border: "1px solid rgba(129,140,248,0.28)",
                  }}
                >
                  View Page
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          </div>
        </div>

        {data.watch_items.length > 0 && (
          <div
            className="bb-card p-3"
            style={{ borderColor: "rgba(245,158,11,0.14)" }}
          >
            <div className="mb-3 flex items-center gap-2">
              <CircleAlert className="w-4 h-4 text-amber-400" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                Investor Watch Items
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {data.watch_items.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="group rounded-lg border border-amber-400/10 bg-amber-400/[0.04] p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/35 hover:bg-amber-400/[0.07]"
                  title={item}
                >
                  <div className="mb-3 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, markerIdx) => (
                      <span
                        key={markerIdx}
                        className="h-1.5 flex-1 rounded-full bg-amber-400/20 transition-colors group-hover:bg-amber-400/60"
                        style={{ opacity: markerIdx <= idx + 2 ? 1 : 0.35 }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
