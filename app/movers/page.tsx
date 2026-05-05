"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Loader2,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import DataSourceNote from "@/app/components/DataSourceNote";

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
  const accent = positive ? "#10b981" : "#f43f5e";
  const href = `/summary/${encodeURIComponent(mover.symbol)}`;

  return (
    <Link
      href={href}
      className="bb-card bb-card-hover group block overflow-hidden p-3 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        borderColor: positive ? "rgba(16,185,129,0.14)" : "rgba(244,63,94,0.14)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold tabular-nums"
              style={{ color: accent, backgroundColor: `${accent}12`, border: `1px solid ${accent}24` }}
            >
              {rank}
            </span>
            <p className="font-mono text-sm font-black text-blue-50">{mover.symbol}</p>
            {mover.exchange && (
              <span className="truncate rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-slate-700">
                {mover.exchange}
              </span>
            )}
          </div>
          <p className="mt-1 truncate text-xs text-slate-500">
            {mover.name || "Company name unavailable"}
          </p>
        </div>

        <span
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold tabular-nums"
          style={{ color: accent, backgroundColor: `${accent}12`, border: `1px solid ${accent}24` }}
        >
          {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {formatPercent(mover.changesPercentage)}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg p-2.5" style={{ backgroundColor: "rgba(15,32,64,0.42)", border: "1px solid rgba(56,189,248,0.07)" }}>
          <p className="text-[9px] uppercase tracking-widest text-slate-600">Price</p>
          <p className="mt-1 text-xs font-bold tabular-nums text-blue-50">{formatCurrencyCompact(mover.price)}</p>
        </div>
        <div className="rounded-lg p-2.5" style={{ backgroundColor: "rgba(15,32,64,0.42)", border: "1px solid rgba(56,189,248,0.07)" }}>
          <p className="text-[9px] uppercase tracking-widest text-slate-600">Change</p>
          <p className="mt-1 text-xs font-bold tabular-nums" style={{ color: accent }}>
            {formatCurrencyCompact(mover.change)}
          </p>
        </div>
        <div className="rounded-lg p-2.5" style={{ backgroundColor: "rgba(15,32,64,0.42)", border: "1px solid rgba(56,189,248,0.07)" }}>
          <p className="text-[9px] uppercase tracking-widest text-slate-600">Volume</p>
          <p className="mt-1 text-xs font-bold tabular-nums text-blue-50">{formatLargeNumber(mover.volume)}</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="rounded-lg p-2.5" style={{ backgroundColor: "rgba(8,18,36,0.52)", border: "1px solid rgba(56,189,248,0.06)" }}>
          <p className="text-[9px] uppercase tracking-widest text-slate-600">Market Cap</p>
          <p className="mt-1 truncate text-xs font-semibold text-slate-400">{formatCurrencyCompact(mover.marketCap)}</p>
        </div>
        <div className="rounded-lg p-2.5" style={{ backgroundColor: "rgba(8,18,36,0.52)", border: "1px solid rgba(56,189,248,0.06)" }}>
          <p className="text-[9px] uppercase tracking-widest text-slate-600">Sector</p>
          <p className="mt-1 truncate text-xs font-semibold text-slate-400">{mover.sector || "N/A"}</p>
        </div>
      </div>

      <div className="mt-3 rounded-lg p-3" style={{ backgroundColor: `${accent}08`, border: `1px solid ${accent}18` }}>
        <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: accent }}>
          Possible Reason
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {mover.reason || "No verified reason in the mover source. Open the brief to connect price action with fundamentals, filings, and recent news."}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-sky-400/[0.06] pt-3">
        <span className="text-[10px] font-medium uppercase tracking-widest text-slate-700">
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
    <main className="min-h-screen pt-[88px]" style={{ backgroundColor: "#060c1a" }}>
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 left-1/2 h-[440px] w-[760px] -translate-x-1/2 rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(56,189,248,0.08) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <div
          className="absolute right-[-10%] top-[30%] h-[420px] w-[420px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(129,140,248,0.06) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-6 py-12">
        <section className="space-y-5 pt-4">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-sky-400">
                Market Discovery
              </p>
              <h1 className="text-4xl font-bold tracking-tighter text-blue-50 sm:text-5xl">
                Biggest Movers of the Day
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-500">
                Track the stocks making the biggest moves today, then open a BullBrief to understand the business behind the move.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {updatedLabel && (
                <span
                  className="rounded-lg px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500"
                  style={{ backgroundColor: "rgba(15,32,64,0.58)", border: "1px solid rgba(56,189,248,0.1)" }}
                >
                  Last updated: {updatedLabel}
                </span>
              )}
              <span
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500"
                style={{ backgroundColor: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.16)" }}
              >
                <Activity className="h-3.5 w-3.5 text-indigo-300" />
                See what moved
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
                      title={disabled ? "Market cap categories are not supported by the current mover source." : undefined}
                      className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${disabled ? "cursor-not-allowed opacity-35" : "hover:-translate-y-0.5"}`}
                      style={
                        active
                          ? { color: "#38bdf8", backgroundColor: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.28)" }
                          : { color: "#64748b", backgroundColor: "rgba(15,32,64,0.36)", border: "1px solid rgba(56,189,248,0.08)" }
                      }
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-[11px] leading-5 text-slate-700">
                Market-cap filters are disabled until the mover source includes market cap for each row.
              </p>
            </div>

            <div className="bb-card p-3">
              <div className="flex items-center gap-2 text-sky-400">
                <BarChart3 className="h-4 w-4" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Current Leader</p>
              </div>
              {leader ? (
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-lg font-black text-blue-50">{leader.symbol}</p>
                    <p className="truncate text-xs text-slate-600">{leader.name}</p>
                  </div>
                  <p
                    className="shrink-0 text-sm font-bold tabular-nums"
                    style={{ color: getMoveDirection(leader) === "down" ? "#f43f5e" : "#10b981" }}
                  >
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
              <Loader2 className="h-4 w-4" />
            </div>
            <p className="mt-3 text-sm font-bold text-rose-400">Market mover data is not available right now.</p>
            <p className="mt-1 text-xs leading-6 text-slate-600">
              Try searching a ticker to open a BullBrief.
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-widest text-slate-700">{error}</p>
          </section>
        )}

        {!loading && !error && visibleMovers.length === 0 && (
          <section className="bb-card p-5 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-sky-400/10 text-sky-400">
              <Search className="h-4 w-4" />
            </div>
            <p className="mt-3 text-sm font-bold text-blue-50">Market mover data is not available right now.</p>
            <p className="mt-1 text-xs leading-6 text-slate-600">
              Try searching a ticker to open a BullBrief.
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
