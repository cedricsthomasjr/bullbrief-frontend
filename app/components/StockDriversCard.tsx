"use client";

import {
  ArrowUpRight,
  BarChart3,
  Building2,
  CircleAlert,
  Gauge,
  Loader2,
  Network,
} from "lucide-react";
import { formatNumber } from "@/app/lib/format";

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
  onRevenueClick?: () => void;
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

function operationStrength(index: number, total: number) {
  if (total <= 1) return 100;
  return Math.max(38, 100 - index * (62 / (total - 1)));
}

export default function StockDriversCard({ data, loading, error, onRevenueClick }: Props) {
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
        <p className="text-sm text-rose-400">Could not load SEC driver analysis.</p>
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
              style={{ backgroundColor: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
            </span>
            <div>
              <p className="text-sm font-bold text-blue-50">What Drives The Stock</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-600">
                SEC 10-K {data.fiscal_year ? `FY${data.fiscal_year}` : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-lg px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500"
              title={data.summary}
              style={{ backgroundColor: "rgba(15,32,64,0.58)", border: "1px solid rgba(56,189,248,0.1)" }}
            >
              Hover For Filing Context
            </span>
            {data.source?.url && (
              <a
                href={data.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg shrink-0 transition hover:-translate-y-0.5"
                style={{ color: "#38bdf8", backgroundColor: "rgba(56,189,248,0.07)", border: "1px solid rgba(56,189,248,0.16)" }}
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
                <button
                  onClick={onRevenueClick}
                  className="flex items-center gap-2 group/rev transition-all"
                  title="Click to view full revenue breakdown from SEC filings"
                  disabled={!onRevenueClick}
                  style={{ cursor: onRevenueClick ? "pointer" : "default" }}
                >
                  <BarChart3 className="w-4 h-4 text-sky-400 transition group-hover/rev:scale-110" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover/rev:text-sky-400 transition-colors">
                    Revenue Breakdown
                  </p>
                  {onRevenueClick && (
                    <ArrowUpRight className="w-3 h-3 text-slate-700 group-hover/rev:text-sky-400 transition-colors" />
                  )}
                </button>
                <span className="text-[10px] text-slate-600 tabular-nums">
                  {financialDrivers.length} signals
                </span>
              </div>

              <div className="space-y-3">
                {financialDrivers.map((driver, idx) => {
                  const accent = ACCENTS[idx % ACCENTS.length];
                  const width = barWidth(driverMagnitude(driver), maxDriverValue);

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
                        event.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.1)";
                        event.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-blue-50">{driver.label}</p>
                          <p className="text-[10px] uppercase tracking-widest text-slate-600">SEC line item</p>
                        </div>
                        <p className="shrink-0 text-sm font-bold tabular-nums text-blue-50">{formatMoney(driver.value)}</p>
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
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="group bb-card-soft p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-400/40">
              <Gauge className="mb-4 w-4 h-4 text-sky-400 transition group-hover:scale-110" />
              <p className="text-[10px] uppercase tracking-widest text-slate-600">Filing Date</p>
              <p className="mt-1 text-sm font-bold text-blue-50">{formatFilingDate(data.filing_date)}</p>
            </div>

            <div className="group bb-card-soft p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/40">
              <Network className="mb-4 w-4 h-4 text-indigo-400 transition group-hover:scale-110" />
              <p className="text-[10px] uppercase tracking-widest text-slate-600">Segments</p>
              <p className="mt-1 text-sm font-bold text-blue-50 tabular-nums">{operations.length}</p>
            </div>

            <div className="group bb-card-soft col-span-2 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-400/40">
              <p className="text-[10px] uppercase tracking-widest text-slate-600">SEC Signal</p>
              <div className="mt-3 grid grid-cols-12 gap-1.5">
                {operations.slice(0, 12).map((operation, idx) => {
                  const accent = ACCENTS[idx % ACCENTS.length];
                  const height = Math.max(28, operationStrength(idx, Math.max(operations.length, 1)));

                  return (
                    <span
                      key={`${operation.name}-${idx}`}
                      className="h-16 rounded-md bg-slate-950/70 flex items-end overflow-hidden"
                      title={`${operation.name}: ${operation.role}`}
                    >
                      <span
                        className="w-full rounded-md transition-all duration-500 group-hover:brightness-125"
                        style={{
                          height: `${height}%`,
                          background: `linear-gradient(180deg, ${accent.color}, ${accent.end})`,
                        }}
                      />
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {operations.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-emerald-400" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Business Engine</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {operations.map((operation, idx) => {
                const accent = ACCENTS[idx % ACCENTS.length];
                const strength = operationStrength(idx, operations.length);

                return (
                  <div
                    key={operation.name}
                    className="group bb-card-soft p-3 space-y-3 transition-all duration-300 hover:-translate-y-0.5"
                    title={operation.why_it_matters}
                    style={{ borderColor: "rgba(16,185,129,0.12)" }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-blue-50">{operation.name}</p>
                        <p className="mt-1 truncate text-xs text-emerald-400">{operation.role}</p>
                      </div>
                      <span
                        className="shrink-0 rounded-md px-2 py-1 text-[10px] font-bold tabular-nums"
                        style={{ color: accent.color, backgroundColor: accent.bg, border: `1px solid ${accent.border}` }}
                      >
                        Signal {idx + 1}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-950/70">
                      <div
                        className="h-full rounded-full transition-all duration-500 group-hover:brightness-125"
                        style={{
                          width: `${strength}%`,
                          background: `linear-gradient(90deg, ${accent.color}, ${accent.end})`,
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-8 gap-1.5">
                      {Array.from({ length: 8 }).map((_, markerIdx) => (
                        <span
                          key={markerIdx}
                          className="h-9 rounded-md transition-all duration-300 group-hover:scale-y-110"
                          style={{
                            backgroundColor: markerIdx / 8 < strength / 100 ? accent.bg : "rgba(15, 23, 42, 0.8)",
                            border: `1px solid ${markerIdx / 8 < strength / 100 ? accent.border : "rgba(56, 189, 248, 0.08)"}`,
                          }}
                        />
                      ))}
                    </div>

                    <p className="min-h-8 text-[11px] leading-4 text-slate-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {operation.evidence || operation.why_it_matters}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {data.watch_items.length > 0 && (
          <div className="bb-card p-3" style={{ borderColor: "rgba(245,158,11,0.14)" }}>
            <div className="mb-3 flex items-center gap-2">
              <CircleAlert className="w-4 h-4 text-amber-400" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Investor Watch Items</p>
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
                  <p className="text-xs text-slate-400 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
