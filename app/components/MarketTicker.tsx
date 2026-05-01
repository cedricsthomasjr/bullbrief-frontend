"use client";

const TICKERS = [
  { symbol: "SPY",   price: 521.85, change: -0.84 },
  { symbol: "NVDA",  price: 1892.10, change: +2.41 },
  { symbol: "MSFT",  price: 498.73, change: -2.96 },
  { symbol: "GOOGL", price: 216.80, change: +7.04 },
  { symbol: "META",  price: 782.45, change: -7.18 },
  { symbol: "AMZN",  price: 264.34, change: -4.05 },
  { symbol: "TSLA",  price: 412.88, change: +1.62 },
  { symbol: "JPM",   price: 318.94, change: +0.32 },
  { symbol: "XOM",   price: 142.18, change: +3.84 },
  { symbol: "BRK.B", price: 524.30, change: -0.21 },
  { symbol: "V",     price: 389.12, change: +1.15 },
  { symbol: "AAPL",  price: 213.49, change: +0.84 },
  { symbol: "NFLX",  price: 638.72, change: +2.07 },
  { symbol: "AMD",   price: 162.44, change: -1.33 },
];

export default function MarketTicker() {
  return (
    <div
      className="w-full overflow-hidden h-8 flex items-center"
      style={{
        backgroundColor: "rgba(4,9,20,0.95)",
        borderBottom: "1px solid rgba(56,189,248,0.06)",
      }}
    >
      {/* Live dot */}
      <div
        className="shrink-0 flex items-center gap-1.5 px-4 h-full border-r"
        style={{ borderColor: "rgba(56,189,248,0.08)" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live" />
        <span className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-500 font-mono">
          Live
        </span>
      </div>

      {/* Scrolling strip */}
      <div className="flex-1 overflow-hidden">
        <div className="flex animate-marquee gap-8 whitespace-nowrap select-none">
          {[...TICKERS, ...TICKERS].map((t, i) => {
            const up = t.change >= 0;
            return (
              <span key={i} className="flex items-center gap-2 text-[10px] font-mono">
                <span className="font-bold text-slate-400">{t.symbol}</span>
                <span className="text-slate-500 tabular-nums">
                  {t.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span
                  className="font-semibold tabular-nums"
                  style={{ color: up ? "#10b981" : "#f43f5e" }}
                >
                  {up ? "▲" : "▼"} {Math.abs(t.change).toFixed(2)}%
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
