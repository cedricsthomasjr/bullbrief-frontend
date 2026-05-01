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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bb-card w-full max-w-2xl mx-4 p-3 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-400"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl text-blue-300 font-semibold mb-4">
          EPS History - {ticker.toUpperCase()}
        </h2>
        <EPSChartCard ticker={ticker} />
      </div>
    </div>
  );
}
