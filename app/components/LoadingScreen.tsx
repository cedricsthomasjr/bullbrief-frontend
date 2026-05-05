"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Fact = {
  text: string;
  category:
    | "history"
    | "markets"
    | "investing"
    | "companies"
    | "macro"
    | "trivia";
};

const FACTS: Fact[] = [
  {
    text: "Warren Buffett bought his first stock at age 11 — three shares of Cities Service Preferred at $38 apiece.",
    category: "history",
  },
  {
    text: "The S&P 500 has averaged ~10% annual returns since inception, but only ~7% after inflation.",
    category: "markets",
  },
  {
    text: "Peter Lynch averaged 29% annual returns managing the Magellan Fund from 1977 to 1990.",
    category: "investing",
  },
  {
    text: "Only about 60 companies worldwide have crossed a $200B market cap.",
    category: "markets",
  },
  {
    text: "Dividends account for roughly 40% of total S&P 500 returns over the long run.",
    category: "investing",
  },
  {
    text: "Amazon didn't post a yearly profit until 2003 — nine years after launching.",
    category: "companies",
  },
  {
    text: "Dollar-cost averaging can reduce timing risk by spreading entries across volatile periods.",
    category: "investing",
  },
  {
    text: "Bear markets typically last under a year; bull markets average ~3.8 years.",
    category: "markets",
  },
  {
    text: 'The VIX is often called the market\'s "fear gauge" — it measures expected 30-day S&P volatility.',
    category: "markets",
  },
  {
    text: "U.S. stocks make up roughly 60% of global equity market capitalization.",
    category: "macro",
  },
  {
    text: "Tesla didn't post its first profitable quarter until Q3 2019.",
    category: "companies",
  },
  {
    text: "The NYSE was founded in 1792 under a buttonwood tree on Wall Street.",
    category: "history",
  },
  {
    text: "The 10-Q is filed quarterly; the 10-K is filed annually and is far more detailed.",
    category: "trivia",
  },
  {
    text: "Apple was nearly bankrupt in 1997 before Microsoft invested $150M to keep it afloat.",
    category: "companies",
  },
  {
    text: "Berkshire Hathaway's Class A shares have never split — that's why they trade in the hundreds of thousands.",
    category: "trivia",
  },
  {
    text: "The S&P 500 has had positive returns in roughly 73% of calendar years since 1928.",
    category: "markets",
  },
  {
    text: "Free cash flow, not net income, is what most institutional investors actually anchor on.",
    category: "investing",
  },
  {
    text: "Nvidia's revenue grew more than 8x between fiscal 2020 and fiscal 2026 on the back of AI demand.",
    category: "companies",
  },
  {
    text: "A P/E ratio compares price to earnings — but it tells you nothing about growth or capital intensity.",
    category: "investing",
  },
  {
    text: "The Fed's dual mandate: maximum employment and stable prices (typically ~2% inflation).",
    category: "macro",
  },
  {
    text: "Buffett's largest single mistake — by his own admission — was buying Berkshire Hathaway itself in 1962.",
    category: "history",
  },
  {
    text: "An inverted yield curve has preceded every U.S. recession since 1955, with one false signal.",
    category: "macro",
  },
  {
    text: "Microsoft's market cap eclipsed $3T in 2024 — larger than the GDP of the UK.",
    category: "companies",
  },
  {
    text: "The average holding period for a stock dropped from ~8 years in 1960 to under a year today.",
    category: "markets",
  },
  {
    text: "Insider buying is statistically more predictive of future returns than insider selling.",
    category: "investing",
  },
  {
    text: "Gross margin tells you pricing power; operating margin tells you operational discipline.",
    category: "investing",
  },
  {
    text: "The first ETF, SPDR S&P 500 (SPY), launched in 1993 and remains the most-traded ETF on earth.",
    category: "history",
  },
  {
    text: "Companies in the S&P 500 spend more on stock buybacks than on R&D in most years.",
    category: "markets",
  },
  {
    text: "Stock-based compensation is a real expense — it dilutes existing shareholders even if cash flow ignores it.",
    category: "investing",
  },
  {
    text: 'The "magnificent seven" tech names accounted for ~60% of S&P 500 returns in 2023.',
    category: "markets",
  },
  {
    text: "Long-duration bonds are more sensitive to interest rate changes than short-duration ones.",
    category: "macro",
  },
  {
    text: "Return on invested capital (ROIC) above the cost of capital is what actually creates shareholder value.",
    category: "investing",
  },
  {
    text: "The U.S. dollar is one side of roughly 88% of all foreign exchange transactions.",
    category: "macro",
  },
  {
    text: "Costco generates more profit from membership fees than from selling merchandise.",
    category: "companies",
  },
  {
    text: "Compound interest at 8% doubles your money roughly every 9 years (rule of 72).",
    category: "investing",
  },
  {
    text: "Short interest above 20% of float is often a warning — but can also fuel a squeeze.",
    category: "markets",
  },
  {
    text: "The Volcker Fed pushed rates above 19% in 1981 to break the back of double-digit inflation.",
    category: "history",
  },
  {
    text: "Market makers earn the bid-ask spread; high-frequency traders compete on microseconds to capture it.",
    category: "trivia",
  },
  {
    text: "A stock's beta measures its volatility relative to the broader market — not its risk in absolute terms.",
    category: "investing",
  },
  {
    text: "Goodwill on a balance sheet is what an acquirer paid above the fair value of net assets.",
    category: "trivia",
  },
];

const CATEGORY_ACCENT: Record<
  Fact["category"],
  { text: string; bg: string; border: string }
> = {
  history: {
    text: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.3)",
  },
  markets: {
    text: "#38bdf8",
    bg: "rgba(56,189,248,0.12)",
    border: "rgba(56,189,248,0.3)",
  },
  investing: {
    text: "#34d399",
    bg: "rgba(52,211,153,0.12)",
    border: "rgba(52,211,153,0.3)",
  },
  companies: {
    text: "#f472b6",
    bg: "rgba(244,114,182,0.12)",
    border: "rgba(244,114,182,0.3)",
  },
  macro: {
    text: "#fbbf24",
    bg: "rgba(251,191,36,0.12)",
    border: "rgba(251,191,36,0.3)",
  },
  trivia: {
    text: "#94a3b8",
    bg: "rgba(148,163,184,0.12)",
    border: "rgba(148,163,184,0.3)",
  },
};

const CATEGORY_LABEL: Record<Fact["category"], string> = {
  history: "History",
  markets: "Markets",
  investing: "Investing 101",
  companies: "Companies",
  macro: "Macro",
  trivia: "Did You Know",
};

const FACT_DURATION_MS = 6500;

export default function LoadingScreen({
  isLoading = true,
}: {
  isLoading?: boolean;
}) {
  const queue = FACTS;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const t = setInterval(
      () => setIdx((p) => (p + 1) % queue.length),
      FACT_DURATION_MS,
    );
    return () => clearInterval(t);
  }, [isLoading, queue.length]);

  const fact = queue[idx];
  const accent = CATEGORY_ACCENT[fact.category];

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8"
          style={{ backgroundColor: "#060c1a" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, rgba(56,189,248,0.08) 0%, transparent 65%)",
            }}
          />

          <div className="relative w-12 h-12">
            <div
              className="absolute inset-0 rounded-full"
              style={{ border: "1px solid rgba(56,189,248,0.1)" }}
            />
            <div
              className="absolute inset-0 rounded-full animate-spin"
              style={{
                borderTop: `2px solid ${accent.text}`,
                borderRight: "2px solid transparent",
                borderBottom: "2px solid transparent",
                borderLeft: "2px solid transparent",
              }}
            />
            <div
              className="absolute inset-2 rounded-full"
              style={{ backgroundColor: "rgba(56,189,248,0.04)" }}
            />
          </div>

          <div className="text-center space-y-4 max-w-md px-6 relative">
            <p className="text-sm font-semibold text-blue-50">
              Generating Analysis
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                className="space-y-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45 }}
              >
                <span
                  className="inline-flex rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-widest"
                  style={{
                    color: accent.text,
                    backgroundColor: accent.bg,
                    border: `1px solid ${accent.border}`,
                  }}
                >
                  {CATEGORY_LABEL[fact.category]}
                </span>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {fact.text}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
