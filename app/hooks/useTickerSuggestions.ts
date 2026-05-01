import { useEffect, useMemo, useState } from "react";

export type TickerSuggestion = {
  symbol: string;
  name: string;
  exchange?: string;
  sector?: string;
};

let tickerCache: TickerSuggestion[] | null = null;
let tickerRequest: Promise<TickerSuggestion[]> | null = null;
const FEATURED_SYMBOLS = [
  "AAPL",
  "NVDA",
  "MSFT",
  "GOOGL",
  "GOOG",
  "AMZN",
  "META",
  "TSLA",
  "AMD",
  "NFLX",
];
const featuredRank = new Map(FEATURED_SYMBOLS.map((symbol, index) => [symbol, index]));

async function loadTickers() {
  if (tickerCache) return tickerCache;
  if (!tickerRequest) {
    tickerRequest = fetch("/tickers.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load ticker catalog");
        return res.json() as Promise<TickerSuggestion[]>;
      })
      .then((tickers) => {
        tickerCache = tickers;
        return tickers;
      })
      .catch((error) => {
        tickerRequest = null;
        throw error;
      });
  }
  return tickerRequest;
}

function rankSuggestion(suggestion: TickerSuggestion, query: string) {
  const symbol = suggestion.symbol.toLowerCase();
  const name = suggestion.name.toLowerCase();

  if (symbol === query) return 0;
  if (symbol.startsWith(query)) return 1;
  if (name.startsWith(query)) return 2;
  if (symbol.includes(query)) return 3;
  if (name.includes(query)) return 4;
  return 5;
}

export const useTickerSuggestions = (query: string, limit = 6) => {
  const [allTickers, setAllTickers] = useState<TickerSuggestion[]>(tickerCache ?? []);

  useEffect(() => {
    if (tickerCache) return;

    let active = true;
    loadTickers()
      .then((tickers) => {
        if (active) setAllTickers(tickers);
      })
      .catch(() => {
        if (active) setAllTickers([]);
      });

    return () => {
      active = false;
    };
  }, []);

  return useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    return allTickers
      .map((suggestion, index) => ({
        suggestion,
        index,
        rank: rankSuggestion(suggestion, normalized),
      }))
      .filter((item) => item.rank < 5)
      .sort((a, b) => {
        if (a.rank !== b.rank) return a.rank - b.rank;
        const aFeatured = featuredRank.get(a.suggestion.symbol) ?? Number.MAX_SAFE_INTEGER;
        const bFeatured = featuredRank.get(b.suggestion.symbol) ?? Number.MAX_SAFE_INTEGER;
        if (aFeatured !== bFeatured) return aFeatured - bFeatured;
        if (a.suggestion.symbol.length !== b.suggestion.symbol.length) {
          return a.suggestion.symbol.length - b.suggestion.symbol.length;
        }
        return a.index - b.index;
      })
      .slice(0, limit)
      .map((item) => item.suggestion);
  }, [allTickers, limit, query]);
};
