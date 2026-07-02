"use client";

import { useState } from "react";
import TradingViewMiniChart from "./TradingViewMiniChart";
import TradingViewFullChart from "./TradingViewFullChart";
import DataSourceNote from "@/app/components/DataSourceNote";

export default function StockChartToggle({ symbol }: { symbol: string }) {
  const [view, setView] = useState<"mini" | "full">("mini");

  return (
    <div className="space-y-4 p-4">
      {/* Toggle */}
      <div className="flex items-center gap-1 w-fit rounded-xl p-1 bg-sky-400/5 border border-sky-400/10">
        {(["mini", "full"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              view === v ? "bg-sky-400 text-[#060c1a]" : "text-slate-600 hover:text-slate-400"
            }`}
          >
            {v === "mini" ? "Overview" : "Full Chart"}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-xl overflow-hidden">
        {view === "mini" ? (
          <TradingViewMiniChart symbol={symbol} />
        ) : (
          <TradingViewFullChart symbol={symbol} />
        )}
      </div>
      <DataSourceNote label="TradingView market data and charting widget" />
    </div>
  );
}
