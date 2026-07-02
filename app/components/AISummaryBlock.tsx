import type { InsightSection } from "@//app/types/stock";
import DataSourceNote from "@/app/components/DataSourceNote";
import { TONE, type Tone } from "@/app/lib/tone";

const SECTIONS: { key: "valuation" | "profitability" | "margins" | "outlook"; label: string; tone: Tone }[] = [
  { key: "valuation", label: "Valuation", tone: "sky" },
  { key: "profitability", label: "Profitability", tone: "emerald" },
  { key: "margins", label: "Margins", tone: "amber" },
  { key: "outlook", label: "Outlook", tone: "indigo" },
];

export default function AISummaryBlock({ insight }: { insight: InsightSection }) {
  return (
    <div className="bb-card overflow-hidden">
      {/* Header */}
      <div className="px-3 py-3 border-b border-white/[0.06]">
        <p className="text-xs font-medium text-slate-500">AI Summary</p>
        <p className="text-sm font-bold text-blue-50 mt-0.5 gradient-text">{insight.ticker}</p>
      </div>

      {/* Sections */}
      <div>
        {SECTIONS.map((s) => (
          <div
            key={s.key}
            className="px-3 py-3 border-b border-white/[0.03]"
            style={{
              backgroundColor: `${TONE[s.tone].hex}0a`,
              borderLeft: `2px solid ${TONE[s.tone].hex}`,
            }}
          >
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1.5 ${TONE[s.tone].text}`}>{s.label}</p>
            <p className="text-xs text-slate-400 leading-relaxed">{insight[s.key]}</p>
          </div>
        ))}
      </div>
      <DataSourceNote
        label="Yahoo Finance via yfinance; BullBrief AI comparison summary"
        className="px-3 pb-3"
      />
    </div>
  );
}
