"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  ChartColumnStacked,
  CircleAlert,
  Gauge,
  Loader2,
  Network,
} from "lucide-react";
import { formatNumber } from "@/app/lib/format";
import DataSourceNote from "@/app/components/DataSourceNote";
import { TONE, type Tone } from "@/app/lib/tone";

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

const DRIVER_TONES: Tone[] = ["sky", "indigo", "violet", "emerald"];

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
            <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-400/10 border border-emerald-400/20">
              <Building2 className="w-4 h-4 text-emerald-400" />
            </span>
            <div>
              <p className="text-sm font-bold text-blue-50">
                What Drives The Stock
              </p>
              <p className="text-xs text-slate-600">
                SEC 10-K {data.fiscal_year ? `FY${data.fiscal_year}` : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-lg border border-white/[0.06] bg-[#0f2040]/60 px-3 py-2 text-xs font-medium text-slate-500 cursor-help"
              title={data.summary}
            >
              Filing Context
            </span>
            {data.source?.url && (
              <a
                href={data.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg shrink-0 transition-colors text-sky-400 bg-sky-400/[0.07] border border-sky-400/20 hover:bg-sky-400/10"
              >
                SEC Filing <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          {financialDrivers.length > 0 && (
            <div className="bb-card-soft p-3 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-sky-400" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    SEC Financial Signals
                  </p>
                </div>
                <span className="text-xs text-slate-600 tabular-nums">
                  {financialDrivers.length} signals
                </span>
              </div>

              <div className="space-y-3">
                {financialDrivers.map((driver, idx) => {
                  const tone = DRIVER_TONES[idx % DRIVER_TONES.length];
                  const width = barWidth(
                    driverMagnitude(driver),
                    maxDriverValue,
                  );

                  return (
                    <div
                      key={driver.label}
                      className="group rounded-lg border border-white/[0.06] p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20"
                      title={driver.description}
                      style={{ backgroundColor: `${TONE[tone].hex}0d` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-blue-50">
                            {driver.label}
                          </p>
                          <p className="text-xs text-slate-600">
                            SEC line item
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-bold tabular-nums text-blue-50">
                          {formatMoney(driver.value)}
                        </p>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/40">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${TONE[tone].bar}`}
                          style={{ width: `${width}%` }}
                        />
                      </div>

                      <p className="mt-2 min-h-8 text-xs leading-4 text-slate-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
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

          <div className="grid grid-cols-2 content-start gap-3 self-start">
            <div className="bb-card-soft p-3 transition-colors duration-200 hover:border-sky-400/30">
              <Gauge className="mb-4 w-4 h-4 text-sky-400" />
              <p className="text-xs text-slate-600">Filing Date</p>
              <p className="mt-1 text-sm font-bold text-blue-50">
                {formatFilingDate(data.filing_date)}
              </p>
            </div>

            <div className="bb-card-soft p-3 transition-colors duration-200 hover:border-indigo-400/30">
              <Network className="mb-4 w-4 h-4 text-indigo-400" />
              <p className="text-xs text-slate-600">Segments</p>
              <p className="mt-1 text-sm font-bold text-blue-50 tabular-nums">
                {operations.length}
              </p>
            </div>

            <Link
              href={revenueHref ?? "#business-engine"}
              className="bb-card-feature group relative col-span-2 rounded-xl p-3 text-left transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sky-400/25 bg-sky-400/10">
                    <ChartColumnStacked className="h-5 w-5 text-sky-300" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-blue-50">
                      See Revenue Breakdown
                    </p>
                    <p className="mt-0.5 text-xs leading-4 text-slate-500">
                      Segment mix, reported totals, and fiscal-period history.
                    </p>
                  </div>
                </div>

                <span className="btn-gradient inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg px-3 py-2 text-xs font-semibold text-white">
                  Open
                  <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          </div>
        </div>

        {data.watch_items.length > 0 && (
          <div className="bb-card p-3" style={{ borderColor: "rgba(245,158,11,0.16)" }}>
            <div className="mb-3 flex items-center gap-2">
              <CircleAlert className="w-4 h-4 text-amber-400" />
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">
                Investor Watch Items
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {data.watch_items.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-amber-400/10 bg-amber-400/[0.04] p-3 transition-colors duration-200 hover:border-amber-400/30 hover:bg-amber-400/[0.07]"
                  title={item}
                >
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
