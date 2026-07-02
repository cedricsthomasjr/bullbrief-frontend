import DataSourceNote from "@/app/components/DataSourceNote";

type CompanyMetric = {
  ticker: string;
  market_cap: number | null;
  pe_ratio: number | null;
  roe: number | null;
  profit_margin: number | null;
};

export default function CompareMetricsGrid({ data }: { data: CompanyMetric[] | undefined }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div
        className="bb-card-danger p-3"
      >
        <p className="text-rose-400 text-sm">No comparison data available.</p>
      </div>
    );
  }

  const renderValue = (value: number | null, suffix = "", divisor = 1) =>
    value != null
      ? `${(value / divisor).toFixed(2)}${suffix}`
      : <span className="text-slate-800">-</span>;

  const columns = [
    { label: "Market Cap",    key: "market_cap" as const, suffix: "B", divisor: 1e9 },
    { label: "P/E Ratio",     key: "pe_ratio" as const },
    { label: "ROE",           key: "roe" as const, suffix: "%", divisor: 0.01 },
    { label: "Profit Margin", key: "profit_margin" as const, suffix: "%", divisor: 0.01 },
  ];

  return (
    <div
      className="bb-card overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sky-400/10">
              <th className="text-left px-3 py-3 text-xs font-semibold uppercase tracking-wide text-sky-400">Ticker</th>
              {columns.map((col) => (
                <th key={col.key} className="text-left px-3 py-3 text-xs font-medium uppercase tracking-wide text-slate-600">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((c, i) => (
              <tr
                key={c.ticker}
                className={`transition-colors duration-150 hover:bg-sky-400/[0.03] ${i < data.length - 1 ? "border-b border-sky-400/5" : ""}`}
              >
                <td className="px-3 py-3 font-bold text-blue-50 font-mono">{c.ticker}</td>
                {columns.map((col) => (
                  <td key={col.key} className="px-3 py-3 text-slate-400 tabular-nums text-sm">
                    {renderValue(c[col.key], col.suffix, col.divisor)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DataSourceNote label="Yahoo Finance via yfinance" className="px-3 pb-3" />
    </div>
  );
}
