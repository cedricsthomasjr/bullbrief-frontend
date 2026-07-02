"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import DataSourceNote from "@/app/components/DataSourceNote";
import { TONE } from "@/app/lib/tone";

type SupportedFilter = "gainers" | "losers" | "actives";
type DisabledFilter = "large-cap" | "mid-cap" | "small-cap";
type MoverFilter = SupportedFilter | DisabledFilter;

type MarketMover = {
  symbol: string;
  name?: string | null;
  price?: number | null;
  change?: number | null;
  changesPercentage?: number | null;
  volume?: number | null;
  marketCap?: number | null;
  sector?: string | null;
  exchange?: string | null;
  reason?: string | null;
  source?: "FMP" | "ExistingData" | "Fallback";
};

type MoversResponse = {
  category?: SupportedFilter;
  movers?: MarketMover[];
  source?: {
    name?: string;
    url?: string;
    updated_at?: string;
  };
  unsupported_filters?: DisabledFilter[];
  error?: string;
};

const FILTERS: { id: MoverFilter; label: string; disabled?: boolean }[] = [
  { id: "gainers", label: "Gainers" },
  { id: "losers", label: "Losers" },
  { id: "actives", label: "Most Active" },
  { id: "large-cap", label: "Large Cap", disabled: true },
  { id: "mid-cap", label: "Mid Cap", disabled: true },
  { id: "small-cap", label: "Small Cap", disabled: true },
];

function isSupportedFilter(filter: MoverFilter): filter is SupportedFilter {
  return filter === "gainers" || filter === "losers" || filter === "actives";
}

function formatCurrencyCompact(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "N/A";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}$${abs.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  return `${sign}$${abs.toFixed(abs >= 100 ? 2 : 4).replace(/\.?0+$/, "")}`;
}

function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "N/A";
  return `${value >= 0 ? "+" : ""}${value.toFixed(Math.abs(value) >= 100 ? 1 : 2)}%`;
}

function formatLargeNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "N/A";
  const abs = Math.abs(value);
  if (abs >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toLocaleString();
}

function getMoveDirection(mover: MarketMover): "up" | "down" | "flat" {
  const pct = mover.changesPercentage ?? mover.change ?? 0;
  if (pct > 0) return "up";
  if (pct < 0) return "down";
  return "flat";
}

function sortMovers(movers: MarketMover[], filter: SupportedFilter): MarketMover[] {
  const rows = [...movers];
  if (filter === "gainers") {
    return rows.sort((a, b) => (b.changesPercentage ?? -Infinity) - (a.changesPercentage ?? -Infinity));
  }
  if (filter === "losers") {
    return rows.sort((a, b) => (a.changesPercentage ?? Infinity) - (b.changesPercentage ?? Infinity));
  }
  return rows.sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0));
}

function filterMovers(movers: MarketMover[], filter: MoverFilter): MarketMover[] {
  if (!isSupportedFilter(filter)) return [];
  return sortMovers(movers, filter);
}

function lastUpdatedLabel(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function SkeletonCard() {
  return (
    <div className="bb-card p-3 animate-pulse space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-4 w-16 rounded bg-slate-800/70" />
          <div className="h-3 w-32 rounded bg-slate-900" />
        </div>
        <div className="h-7 w-20 rounded-lg bg-slate-900" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="h-14 rounded-lg bg-slate-900" />
        <div className="h-14 rounded-lg bg-slate-900" />
        <div className="h-14 rounded-lg bg-slate-900" />
      </div>
      <div className="h-12 rounded-lg bg-slate-900" />
    </div>
  );
}

function MoverCard({ mover, rank }: { mover: MarketMover; rank: number }) {
  const direction = getMoveDirection(mover);
  const positive = direction !== "down";
  const tone = positive ? TONE.emerald : TONE.rose;
  const href = `/summary/${encodeURIComponent(mover.symbol)}`;

  return (
    <Link
      href={href}
      className="bb-card bb-card-hover group block overflow-hidden p-3 transition-all duration-200"
      style={{ borderColor: `${tone.hex}26` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-semibold tabular-nums ${tone.soft}`}>
              {rank}
            </span>
            <p className="font-mono text-sm font-black text-blue-50">{mover.symbol}</p>
            {mover.exchange && (
              <span className="truncate rounded-md px-1.5 py-0.5 text-xs font-medium uppercase tracking-wide text-slate-700">
                {mover.exchange}
              </span>
            )}
          </div>
          <p className="mt-1 truncate text-xs text-slate-500">
            {mover.name || "Company name unavailable"}
          </p>
        </div>

        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold tabular-nums ${tone.soft}`}>
          {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {formatPercent(mover.changesPercentage)}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg p-2.5 bg-[#0f2040]/40 border border-white/[0.05]">
          <p className="text-xs text-slate-600">Price</p>
          <p className="mt-1 text-xs font-bold tabular-nums text-blue-50">{formatCurrencyCompact(mover.price)}</p>
        </div>
        <div className="rounded-lg p-2.5 bg-[#0f2040]/40 border border-white/[0.05]">
          <p className="text-xs text-slate-600">Change</p>
          <p className={`mt-1 text-xs font-bold tabular-nums ${tone.text}`}>
            {formatCurrencyCompact(mover.change)}
          </p>
        </div>
        <div className="rounded-lg p-2.5 bg-[#0f2040]/40 border border-white/[0.05]">
          <p className="text-xs text-slate-600">Volume</p>
          <p className="mt-1 text-xs font-bold tabular-nums text-blue-50">{formatLargeNumber(mover.volume)}</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="rounded-lg p-2.5 bg-black/20 border border-white/[0.04]">
          <p className="text-xs text-slate-600">Market Cap</p>
          <p className="mt-1 truncate text-xs font-semibold text-slate-400">{formatCurrencyCompact(mover.marketCap)}</p>
        </div>
        <div className="rounded-lg p-2.5 bg-black/20 border border-white/[0.04]">
          <p className="text-xs text-slate-600">Sector</p>
          <p className="mt-1 truncate text-xs font-semibold text-slate-400">{mover.sector || "N/A"}</p>
        </div>
      </div>

      <div className="mt-3 rounded-lg p-3" style={{ backgroundColor: `${tone.hex}0d`, border: `1px solid ${tone.hex}20` }}>
        <p className={`text-xs font-semibold uppercase tracking-wide ${tone.text}`}>
          Possible Reason
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {mover.reason || "No verified reason in the mover source. Open the brief to connect price action with fundamentals, filings, and recent news."}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
        <span className="text-xs font-medium text-slate-700">
          See what moved. Understand why it matters.
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 transition-colors group-hover:text-sky-300">
          Open Brief
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

export default function MoversPage() {
  const [activeFilter, setActiveFilter] = useState<SupportedFilter>("gainers");
  const [movers, setMovers] = useState<MarketMover[]>([]);
  const [source, setSource] = useState<MoversResponse["source"]>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMovers() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/movers?category=${activeFilter}`, { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const json = (await response.json()) as MoversResponse;
        if (json.error) throw new Error(json.error);

        if (!cancelled) {
          setMovers(Array.isArray(json.movers) ? json.movers : []);
          setSource(json.source);
        }
      } catch (err) {
        if (!cancelled) {
          setMovers([]);
          setSource(undefined);
          setError(err instanceof Error ? err.message : "Market mover data is unavailable.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMovers();

    return () => {
      cancelled = true;
    };
  }, [activeFilter]);

  const visibleMovers = useMemo(
    () => filterMovers(movers, activeFilter).slice(0, 24),
    [activeFilter, movers],
  );
  const leader = visibleMovers[0] ?? null;
  const updatedLabel = lastUpdatedLabel(source?.updated_at);

  return (
    <main className="min-h-screen pt-[88px] bg-[#060c1a]">
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 left-1/2 h-[440px] w-[760px] -translate-x-1/2 rounded-full animate-orb"
          style={{ background: "radial-gradient(ellipse, rgba(56,189,248,0.07) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-6 py-12">
        <section className="space-y-5 pt-4">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-400">
                Market Discovery
              </p>
              <h1 className="font-fraunces text-4xl font-bold tracking-tight text-blue-50 sm:text-5xl">
                Biggest Movers of the Day
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-500">
                Track the stocks making the biggest moves today, then open a BullBrief to understand the business behind the move.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {updatedLabel && (
                <span className="rounded-lg border border-white/[0.06] bg-[#0f2040]/60 px-3 py-2 text-xs font-medium text-slate-500">
                  Last updated: {updatedLabel}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-400/20 bg-indigo-400/[0.08] px-3 py-2 text-xs font-medium text-slate-500">
                <Activity className="h-3.5 w-3.5 text-indigo-300" />
                Live Market Data
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_280px]">
            <div className="bb-card p-3">
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((filter) => {
                  const active = activeFilter === filter.id;
                  const disabled = filter.disabled;
                  return (
                    <button
                      key={filter.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        if (!disabled && isSupportedFilter(filter.id)) setActiveFilter(filter.id);
                      }}
                      title={disabled ? "Market-cap filters require data not available in the current feed. Use Gainers, Losers, or Most Active to explore today's movers." : undefined}
                      className={`rounded-lg border px-4 py-2 text-xs font-semibold transition-colors ${
                        disabled
                          ? "cursor-not-allowed opacity-35 text-slate-500 bg-[#0f2040]/40 border-white/[0.05]"
                          : active
                          ? "text-sky-400 bg-sky-400/10 border-sky-400/25"
                          : "text-slate-500 bg-[#0f2040]/40 border-white/[0.05] hover:text-slate-300"
                      }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-700">
                Market-cap filters are not yet supported by the current data feed. Use Gainers, Losers, or Most Active to explore today&apos;s moves.
              </p>
            </div>

            <div className="bb-card p-3">
              <div className="flex items-center gap-2 text-sky-400">
                <BarChart3 className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-wide">Current Leader</p>
              </div>
              {leader ? (
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-lg font-black text-blue-50">{leader.symbol}</p>
                    <p className="truncate text-xs text-slate-600">{leader.name}</p>
                  </div>
                  <p className={`shrink-0 text-sm font-bold tabular-nums ${getMoveDirection(leader) === "down" ? "text-rose-400" : "text-emerald-400"}`}>
                    {formatPercent(leader.changesPercentage)}
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-xs leading-6 text-slate-600">Waiting for mover data.</p>
              )}
            </div>
          </div>
        </section>

        {loading && (
          <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 9 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </section>
        )}

        {!loading && error && (
          <section className="bb-card-danger p-5 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-rose-400/10 text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <p className="mt-3 text-sm font-bold text-rose-400">Market data temporarily unavailable.</p>
            <p className="mt-1 text-xs leading-6 text-slate-600">
              The mover feed may be rate-limited or down. Try refreshing, or search a specific ticker to open a BullBrief.
            </p>
            <p className="mt-2 text-xs text-slate-700">{error}</p>
          </section>
        )}

        {!loading && !error && visibleMovers.length === 0 && (
          <section className="bb-card p-5 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-sky-400/10 text-sky-400">
              <Search className="h-4 w-4" />
            </div>
            <p className="mt-3 text-sm font-bold text-blue-50">No movers found for this filter.</p>
            <p className="mt-1 text-xs leading-6 text-slate-600">
              Switch to Gainers, Losers, or Most Active to see today&apos;s market activity — or search a ticker directly.
            </p>
          </section>
        )}

        {!loading && !error && visibleMovers.length > 0 && (
          <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {visibleMovers.map((mover, idx) => (
              <MoverCard key={`${activeFilter}-${mover.symbol}-${idx}`} mover={mover} rank={idx + 1} />
            ))}
          </section>
        )}

        {source?.name && (
          <DataSourceNote label={source.name} href={source.url} />
        )}
      </div>
    </main>
  );
}
