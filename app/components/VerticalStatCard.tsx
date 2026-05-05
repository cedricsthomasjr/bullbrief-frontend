import type { SingleSummaryData } from "@/app/types/stock";
import DataSourceNote from "@/app/components/DataSourceNote";

type Props = { data: SingleSummaryData | null; loading?: boolean };

export default function VerticalStatCard({ data, loading = false }: Props) {
  const render = (v: number | null, suffix = "", divide = 1) =>
    v != null ? `${(v / divide).toFixed(2)}${suffix}` : "-";

  if (loading) {
    return (
      <div
        className="bb-card p-3 flex flex-col items-center justify-center min-h-[120px] gap-3"
      >
        <div
          className="w-5 h-5 rounded-full animate-spin"
          style={{ borderTop: "2px solid #38bdf8", borderRight: "2px solid transparent", borderBottom: "2px solid transparent", borderLeft: "2px solid transparent" }}
        />
        <p className="text-xs text-slate-700">Analyzing...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div
        className="bb-card p-3 flex items-center justify-center min-h-[120px]"
      >
        <p className="text-xs text-slate-700">No data loaded.</p>
      </div>
    );
  }

  const stats = [
    { label: "Market Cap",    value: render(data.market_cap, "B", 1e9) },
    { label: "P/E Ratio",     value: render(data.pe_ratio) },
    { label: "ROE",           value: render(data.roe, "%", 0.01) },
    { label: "Profit Margin", value: render(data.profit_margin, "%", 0.01) },
  ];

  return (
    <div
      className="bb-card overflow-hidden"
    >
      <div
        className="px-3 py-3"
        style={{ borderBottom: "1px solid rgba(56,189,248,0.08)" }}
      >
        <p className="text-sm font-bold text-blue-50">{data.company_name}</p>
        <p className="text-xs text-slate-600 font-mono mt-0.5">{data.ticker}</p>
      </div>
      <div className="divide-y" style={{ borderColor: "rgba(56,189,248,0.05)" }}>
        {stats.map((s) => (
          <div key={s.label} className="flex items-center justify-between px-3 py-2.5">
            <p className="text-xs text-slate-600">{s.label}</p>
            <p className="text-xs font-bold text-blue-50 tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>
      <DataSourceNote label="Yahoo Finance via yfinance" className="px-3 pb-3" />
    </div>
  );
}
