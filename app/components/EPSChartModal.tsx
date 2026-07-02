"use client";

import { X } from "lucide-react";
import EPSChartCard from "@/app/components/EPSChartCard";

export default function EPSChartModal({
  onClose,
  ticker,
}: {
  onClose: () => void;
  ticker: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bb-card w-full max-w-2xl mx-4 p-3 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-blue-50 mb-4">
          EPS History - {ticker.toUpperCase()}
        </h2>
        <EPSChartCard ticker={ticker} />
      </div>
    </div>
  );
}
