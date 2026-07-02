"use client";

import { useEffect, useMemo, useState } from "react";

const TICKER_SYMBOLS = [
  { request: "SPY", display: "SPY" },
  { request: "NVDA", display: "NVDA" },
  { request: "MSFT", display: "MSFT" },
  { request: "GOOGL", display: "GOOGL" },
  { request: "META", display: "META" },
  { request: "AMZN", display: "AMZN" },
  { request: "TSLA", display: "TSLA" },
  { request: "JPM", display: "JPM" },
  { request: "XOM", display: "XOM" },
  { request: "COST", display: "COST" },
  { request: "V", display: "V" },
  { request: "AAPL", display: "AAPL" },
  { request: "NFLX", display: "NFLX" },
  { request: "AMD", display: "AMD" },
];

type MarketQuote = {
  name: string;
  symbol: string;
  price: number | null;
  change: number | null;
  percent: number | null;
};

type MarketResponse = {
  quotes?: MarketQuote[];
  source?: {
    quote?: string;
    updated_at?: string;
  };
  error?: string;
};

const TICKER_SOURCE = "Financial Modeling Prep quote API";
const REFRESH_MS = 5 * 60_000;

function formatPrice(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function MarketTicker() {
  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const requestedSymbols = useMemo(
    () => TICKER_SYMBOLS.map((item) => item.request).join(","),
    [],
  );

  useEffect(() => {
    let cancelled = false;

    async function fetchQuotes() {
      try {
        const response = await fetch(`/api/market?symbols=${encodeURIComponent(requestedSymbols)}`, {
          cache: "no-store",
        });

        if (!response.ok) throw new Error("Market ticker request failed");

        const json = (await response.json()) as MarketResponse;
        if (json.error || !Array.isArray(json.quotes)) {
          throw new Error(json.error ?? "Market ticker data unavailable");
        }

        if (!cancelled) {
          setQuotes(json.quotes);
          setUpdatedAt(json.source?.updated_at ?? null);
          setError(false);
          setLoading(false);
        }
      } catch (err) {
        console.error("Market ticker fetch failed", err);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchQuotes();
    const interval = window.setInterval(fetchQuotes, REFRESH_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [requestedSymbols]);

  const orderedQuotes = useMemo(() => {
    const bySymbol = new Map(quotes.map((quote) => [quote.symbol, quote]));
    return TICKER_SYMBOLS.map(({ request, display }) => {
      const quote = bySymbol.get(request);
      return quote ? { ...quote, displaySymbol: display } : null;
    }).filter((quote): quote is MarketQuote & { displaySymbol: string } => Boolean(quote));
  }, [quotes]);

  const tickerRows = orderedQuotes.length > 0 ? orderedQuotes : [];
  const sourceTitle = updatedAt
    ? `Source: ${TICKER_SOURCE}; updated ${new Date(updatedAt).toLocaleTimeString()}`
    : `Source: ${TICKER_SOURCE}`;
  const statusLabel = loading ? "Loading" : error ? "Offline" : "Live";
  const statusToneClass = error ? "text-rose-400" : loading ? "text-slate-500" : "text-emerald-400";
  const dotToneClass = error ? "bg-rose-400" : loading ? "bg-slate-500" : "bg-emerald-400";

  return (
    <div
      className="w-full overflow-hidden h-8 flex items-center bg-[#04091a] border-b border-white/[0.05]"
      title={sourceTitle}
    >
      {/* Live dot */}
      <div className="shrink-0 flex items-center gap-1.5 px-4 h-full border-r border-white/[0.06]">
        <span className={`w-1.5 h-1.5 rounded-full animate-live ${dotToneClass}`} />
        <span className={`text-[10px] font-semibold uppercase tracking-wide font-mono ${statusToneClass}`}>
          {statusLabel}
        </span>
      </div>

      {/* Scrolling strip */}
      <div className="flex-1 overflow-hidden">
        <div className="flex animate-marquee gap-8 whitespace-nowrap select-none">
          {tickerRows.length > 0 ? (
            [...tickerRows, ...tickerRows].map((ticker, i) => {
              const percent = ticker.percent ?? 0;
              const up = percent >= 0;
              return (
                <span key={`${ticker.symbol}-${i}`} className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="font-bold text-slate-400">{ticker.displaySymbol}</span>
                  <span className="text-slate-500 tabular-nums">
                    {formatPrice(ticker.price)}
                  </span>
                  <span className={`font-semibold tabular-nums ${up ? "text-emerald-400" : "text-rose-400"}`}>
                    {up ? "▲" : "▼"} {Math.abs(percent).toFixed(2)}%
                  </span>
                </span>
              );
            })
          ) : (
            <span className="text-[10px] font-mono uppercase tracking-wide text-slate-700">
              {loading ? "Loading market data..." : "Market data unavailable"}
            </span>
          )}
        </div>
      </div>

      <div className="hidden sm:flex shrink-0 items-center gap-1.5 px-3 h-full border-l border-white/[0.06]">
        <span className="text-[9px] font-medium uppercase tracking-wide text-slate-700">
          Source:
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-600">
          FMP
        </span>
      </div>
    </div>
  );
}
