"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { cachedFetch } from "@/app/lib/summaryCache";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Brain, Clock3, Newspaper } from "lucide-react";
import LoadingScreen from "@/app/components/LoadingScreen";
import StockChartToggle from "@/app/components/StockChartToggle";
import FinancialMetricsGrid from "@/app/components/FinancialMetricsGrid";
import ExecutiveGrid from "@/app/components/ExecutiveGrid";
import StockDriversCard, { type StockDriversData } from "@/app/components/StockDriversCard";
import ExploreMetricsChart from "@/app/components/ExploreMetricsChart";
import BullBriefCard from "@/app/components/BullBriefCard";
import { useSideNavSections } from "@/app/hooks/useSideNavSections";
import DataSourceNote from "@/app/components/DataSourceNote";

type BackendSummary = {
  company_name: string;
  ticker: string;
  exchange: string;
  exchange_symbol: string;
  business_summary: string;
  swot?: string;
  outlook?: string;
  market_cap: number;
  pe_ratio: number;
  range_52w: string;
  sector: string;
  current_price: number;
  eps_ttm: number;
  forward_pe: number;
  dividend_yield: number;
  beta: number;
  volume: number;
  avg_volume: number;
  peg_ratio: number;
  price_to_sales: number;
  price_to_book: number;
  roe: number;
  free_cashflow: number;
  fcf_yield?: number;
  debt_to_equity: number;
  profit_margin: number;
  operating_margin?: number;
  revenue_growth?: number;
  enterprise_value?: number;
  ebitda?: number;
  ev_ebitda?: number;
  institutional_ownership: number;
  short_percent: number;
  raw_summary: string;
};

type NewsItem = {
  title: string;
  publisher: string;
  link: string;
  providerPublishTime: string | null;
  summary?: string;
  image?: string | null;
  provider?: string;
  domain?: string;
  relevanceScore?: number;
  is_industry?: boolean;
  industry_label?: string;
};

function fmtNum(v: number): string {
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(1)}K`;
  return `$${v.toFixed(2)}`;
}

function fmtVol(v: number): string {
  if (v >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
  return v.toString();
}

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span
        className="text-[10px] font-mono font-bold tabular-nums px-2 py-0.5 rounded"
        style={{
          color: "#38bdf8",
          backgroundColor: "rgba(56,189,248,0.08)",
          border: "1px solid rgba(56,189,248,0.15)",
        }}
      >
        {num}
      </span>
      <h2 className="text-lg font-bold text-blue-50 tracking-tight">{title}</h2>
      <div className="flex-1 h-px" style={{ background: "rgba(56,189,248,0.07)" }} />
    </div>
  );
}

function formatNewsDate(value: string | null | undefined) {
  if (!value) return "Recent";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recent";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function newsBadge(item: NewsItem) {
  if (item.is_industry) return item.industry_label ?? "Industry";
  const score = item.relevanceScore;
  if (!score) return "Relevant";
  if (score >= 80) return "Top match";
  if (score >= 60) return "High signal";
  return "Relevant";
}

export default function TickerPage() {
  const { ticker } = useParams() as { ticker: string };
  const [data, setData] = useState<BackendSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [execs, setExecs] = useState<{ name: string; title: string; pay: string }[]>([]);
  const [drivers, setDrivers] = useState<StockDriversData | null>(null);
  const [driversLoading, setDriversLoading] = useState(false);
  const [driversError, setDriversError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) return;
    const base = process.env.NEXT_PUBLIC_BACKEND_URL;
    const symbol = ticker.toUpperCase();
    let active = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setData(null);
      setDrivers(null);
      setDriversError(null);
      setDriversLoading(true);
      setNews([]);
      setExecs([]);

      const summaryPromise = cachedFetch<BackendSummary>(`${base}/summary/${encodeURIComponent(symbol)}`);
      const driversPromise = cachedFetch<StockDriversData>(`${base}/drivers/${encodeURIComponent(symbol)}`);

      const optionalPromise = Promise.allSettled([
        cachedFetch<{ news?: typeof news }>(`${base}/news/${encodeURIComponent(symbol)}?v=2`)
          .then((j) => {
            if (active) setNews(j.news || []);
          }),
        cachedFetch<{ executives?: typeof execs }>(`${base}/executives/${encodeURIComponent(symbol)}`)
          .then((j) => {
            if (active) setExecs(j.executives || []);
          }),
      ]);

      const [summaryResult, driversResult] = await Promise.allSettled([
        summaryPromise,
        driversPromise,
      ]);

      if (!active) return;

      if (summaryResult.status === "fulfilled") {
        setData(summaryResult.value);
      } else {
        const reason = summaryResult.reason;
        setError(reason instanceof Error ? reason.message : "Failed to fetch summary");
      }

      if (driversResult.status === "fulfilled") {
        setDrivers(driversResult.value);
      } else {
        setDriversError("Failed to fetch SEC driver data.");
      }

      setDriversLoading(false);
      setLoading(false);
      void optionalPromise;
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [ticker]);

  const revenueEngineHref = `/summary/${ticker}/business-engine`;
  useSideNavSections(
    [
      { id: "stock-performance", label: "Stock Performance" },
      { id: "explore-metrics", label: "Explore Metrics" },
      { id: "bullbrief", label: "The BullBrief" },
      { id: "what-drives", label: "What Drives The Stock" },
      { id: "business-engine-page", label: "Business Engine", href: revenueEngineHref },
      { id: "financials", label: "Financial Metrics" },
      ...(execs.length > 0 ? [{ id: "executives", label: "Executive Team" }] : []),
      { id: "news", label: "Recent News" },
    ],
    "#38bdf8",
  );

  if (loading) return <LoadingScreen isLoading={loading} />;

  if (error) return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#060c1a" }}>
      <div className="text-center space-y-3">
        <p className="text-rose-400 text-sm font-medium">Failed to load stock data</p>
        <p className="text-slate-600 text-xs">{error}</p>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-400 transition-colors mt-2">
          <ArrowLeft className="w-3 h-3" /> Back to Home
        </Link>
      </div>
    </main>
  );

  if (!data) return null;

  const peRatio = typeof data.pe_ratio === "string" ? parseFloat(data.pe_ratio) : data.pe_ratio;
  const sectionNum = (n: number) => String(n).padStart(2, "0");
  let sectionIdx = 1;

  return (
    <main className="min-h-screen pt-[88px]" style={{ backgroundColor: "#060c1a" }}>
      {/* Page glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(56,189,248,0.06) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-16">

        {/* ── Header ── */}
        <section className="space-y-6 pt-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-sky-400 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Home
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div className="space-y-1.5">
              <p
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "#38bdf8" }}
              >
                {data.sector}
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-blue-50 leading-none">
                {data.company_name}
              </h1>
              <p className="text-slate-500 text-sm font-mono">{data.ticker} · {data.exchange}</p>
            </div>

            <div
              className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-full text-xs font-semibold"
              style={{ backgroundColor: "rgba(56,189,248,0.1)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.25)" }}
            >
              Research Brief
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Price", value: `$${data.current_price?.toFixed(2)}` },
              { label: "Market Cap", value: fmtNum(data.market_cap) },
              { label: "P/E Ratio", value: peRatio != null && !isNaN(peRatio) ? peRatio.toFixed(1) : "-" },
              { label: "EPS (TTM)", value: `$${data.eps_ttm?.toFixed(2)}` },
              { label: "52W Range", value: data.range_52w },
              { label: "Volume", value: fmtVol(data.volume) },
            ].map((item, i) => (
              <div
                key={i}
                className="bb-card px-3 py-3"
              >
                <p className="text-[10px] uppercase tracking-wider text-slate-600">{item.label}</p>
                <p className="text-blue-50 font-bold text-sm mt-1 tabular-nums">{item.value}</p>
              </div>
            ))}
          </div>
          <DataSourceNote label="Yahoo Finance via yfinance" />
        </section>

        {/* ── AI Analyst Report CTA ── */}
        <section>
          <Link href={`/summary/${ticker}/analyst`}>
            <div
              className="bb-card bb-card-hover group p-3 flex items-center justify-between gap-4 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, rgba(129,140,248,0.08) 0%, rgba(56,189,248,0.06) 100%)",
                borderColor: "rgba(129,140,248,0.25)",
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(129,140,248,0.12)", border: "1px solid rgba(129,140,248,0.25)" }}
                >
                  <Brain className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-50">AI Analyst Report</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    AI-generated pillar snapshot: Piotroski, Altman Z″, relative valuation, peers, and SEC risks
                  </p>
                </div>
              </div>
              <div
                className="shrink-0 flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: "rgba(129,140,248,0.12)", color: "#818cf8", border: "1px solid rgba(129,140,248,0.2)" }}
              >
                Open Snapshot <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        </section>

        {/* ── Chart ── */}
        <section id="stock-performance" className="scroll-mt-24">
          <SectionHeader num={sectionNum(sectionIdx++)} title="Stock Performance" />
          <div className="bb-card overflow-hidden p-1">
            <StockChartToggle symbol={data.exchange_symbol} />
          </div>
        </section>

        {/* ── Explore Metrics ── */}
        <section id="explore-metrics" className="scroll-mt-24">
          <SectionHeader num={sectionNum(sectionIdx++)} title="Explore Metrics" />
          <ExploreMetricsChart ticker={ticker} />
        </section>

        {/* ── BullBrief ── */}
        <section id="bullbrief" className="scroll-mt-24">
          <SectionHeader num={sectionNum(sectionIdx++)} title="The BullBrief" />
          <BullBriefCard
            ticker={data.ticker}
            companyName={data.company_name}
            sector={data.sector}
            summary={data.business_summary}
            marketCap={data.market_cap}
            peRatio={peRatio}
            currentPrice={data.current_price}
            range52w={data.range_52w}
          />
        </section>

        {/* ── Stock Drivers ── */}
        <section id="what-drives" className="scroll-mt-24">
          <SectionHeader num={sectionNum(sectionIdx++)} title="What Drives The Stock" />
          <StockDriversCard
            data={drivers}
            loading={driversLoading}
            error={driversError}
            revenueHref={revenueEngineHref}
          />
        </section>

        {/* ── Financials ── */}
        <section id="financials" className="scroll-mt-24">
          <SectionHeader num={sectionNum(sectionIdx++)} title="Financial Metrics" />
          <FinancialMetricsGrid data={data} />
        </section>

        {/* ── Executives ── */}
        {execs.length > 0 && (
          <section id="executives" className="scroll-mt-24">
            <SectionHeader num={sectionNum(sectionIdx++)} title="Executive Team" />
            <ExecutiveGrid execs={execs} />
          </section>
        )}

        {/* ── News ── */}
        <section id="news" className="scroll-mt-24">
          <SectionHeader num={sectionNum(sectionIdx++)} title="Recent News" />
          {news.length === 0 ? (
            <div className="bb-card p-4">
              <p className="text-sm font-semibold text-blue-50">No high-signal headlines found.</p>
              <p className="mt-1 text-xs leading-6 text-slate-600">
                BullBrief filtered for major outlets and ticker-specific market coverage.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.18)" }}
                  >
                    <Newspaper className="w-4 h-4 text-sky-400" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-blue-50">Major Outlet Filter</p>
                    <p className="text-[10px] uppercase tracking-widest text-slate-600">
                      Ranked by source, relevance, and recency
                    </p>
                  </div>
                </div>
                <span
                  className="self-start rounded-lg px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500"
                  style={{ backgroundColor: "rgba(15,32,64,0.58)", border: "1px solid rgba(56,189,248,0.1)" }}
                >
                  {news.length} headlines
                </span>
              </div>

              {news[0] && (
                <a
                  href={news[0].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bb-card bb-card-hover group grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_168px] gap-4 overflow-hidden p-4"
                >
                  <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span
                        className="rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-widest"
                        style={
                          news[0].is_industry
                            ? { color: "#f59e0b", backgroundColor: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }
                            : { color: "#7dd3fc", backgroundColor: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.16)" }
                        }
                      >
                        {newsBadge(news[0])}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-widest text-slate-600">
                        <Clock3 className="w-3 h-3" />
                        {formatNewsDate(news[0].providerPublishTime)}
                      </span>
                    </div>
                    <p className="text-lg font-bold leading-7 text-blue-50 group-hover:text-sky-300 transition-colors">
                      {news[0].title}
                    </p>
                    {news[0].summary && (
                      <p className="mt-2 text-sm leading-7 text-slate-500">
                        {news[0].summary}
                      </p>
                    )}
                    <p className="mt-3 text-xs font-semibold text-slate-600">
                      {news[0].publisher}
                    </p>
                  </div>
                  <div
                    className="hidden md:flex min-h-32 items-end justify-end rounded-lg p-3"
                    style={{
                      backgroundImage: news[0].image
                        ? `linear-gradient(180deg, rgba(6,12,26,0.1), rgba(6,12,26,0.82)), url(${news[0].image})`
                        : "linear-gradient(135deg, rgba(56,189,248,0.1), rgba(129,140,248,0.12))",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      border: "1px solid rgba(56,189,248,0.1)",
                    }}
                  >
                    <ArrowUpRight className="w-5 h-5 text-sky-300 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
              )}

              {news.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {news.slice(1).map((item, idx) => (
                    <a
                      key={`${item.link}-${idx}`}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bb-card-soft group p-3 transition-all hover:-translate-y-0.5 hover:border-sky-400/30"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            {item.is_industry && (
                              <span
                                className="rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest"
                                style={{ color: "#f59e0b", backgroundColor: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}
                              >
                                {item.industry_label ?? "Industry"}
                              </span>
                            )}
                            <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400">
                              {item.publisher}
                            </span>
                            <span className="text-[10px] text-slate-700">
                              {formatNewsDate(item.providerPublishTime)}
                            </span>
                          </div>
                          <p className="text-sm font-semibold leading-6 text-blue-50 group-hover:text-sky-300 transition-colors">
                            {item.title}
                          </p>
                          {item.summary && (
                            <p className="mt-2 text-xs leading-6 text-slate-600">
                              {item.summary}
                            </p>
                          )}
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-700 shrink-0 mt-0.5 group-hover:text-sky-400 transition-colors" />
                      </div>
                    </a>
                  ))}
                </div>
              )}
              <DataSourceNote label="Yahoo Finance news feed and linked publishers" />
            </div>
          )}
        </section>

      </div>

    </main>
  );
}
