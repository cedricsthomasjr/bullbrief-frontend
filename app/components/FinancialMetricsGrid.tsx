"use client";

import { useState } from "react";
import {
  BarChart3, TrendingUp, PieChart, LineChart, Activity,
  BadgePercent, AreaChart, PiggyBank, Banknote, BookOpen,
  CircleDollarSign, Percent, Users, ArrowDownUp,
} from "lucide-react";
import { formatFixed, formatNumber, formatPercent } from "@/app/lib/format";
import EPSChartModal from "@/app/components/EPSChartModal";
import TermTooltip from "@/app/components/TermTooltip";
import DataSourceNote from "@/app/components/DataSourceNote";
import { TONE, type Tone } from "@/app/lib/tone";

type BackendSummary = {
  company_name: string; ticker: string; business_summary: string; swot: string; outlook: string;
  market_cap: number; pe_ratio: number; range_52w: string; sector: string; current_price: number;
  eps_ttm: number; forward_pe: number; dividend_yield: number; beta: number; volume: number;
  avg_volume: number; peg_ratio: number; price_to_sales: number; price_to_book: number;
  roe: number; free_cashflow: number; debt_to_equity: number; profit_margin: number;
  institutional_ownership: number; short_percent: number; raw_summary: string;
};

const GROUP_TONE: Record<string, Tone> = {
  "Valuation": "sky",
  "Risk & Ownership": "indigo",
  "Profitability & Cash": "emerald",
};

export default function FinancialMetricsGrid({ data }: { data: BackendSummary }) {
  const [showModal, setShowModal] = useState(false);

  const metricGroups = [
    {
      title: "Valuation",
      metrics: [
        { label: "EPS (TTM)",    value: formatFixed(data.eps_ttm),        icon: <BarChart3 className="w-3.5 h-3.5" />, clickable: true, termId: "eps" },
        { label: "Forward P/E",  value: formatFixed(data.forward_pe),     icon: <LineChart className="w-3.5 h-3.5" />,  termId: "forward-pe" },
        { label: "PEG Ratio",    value: formatFixed(data.peg_ratio),      icon: <TrendingUp className="w-3.5 h-3.5" />, termId: "peg-ratio" },
        { label: "Price / Sales",value: formatFixed(data.price_to_sales), icon: <PieChart className="w-3.5 h-3.5" />,   termId: "price-to-sales" },
        { label: "Price / Book", value: formatFixed(data.price_to_book),  icon: <BookOpen className="w-3.5 h-3.5" />,   termId: "price-to-book" },
      ],
    },
    {
      title: "Risk & Ownership",
      metrics: [
        { label: "Beta",               value: formatFixed(data.beta),                     icon: <Activity className="w-3.5 h-3.5" />,   termId: "beta" },
        { label: "Volume",             value: formatNumber(data.volume),                  icon: <ArrowDownUp className="w-3.5 h-3.5" /> },
        { label: "Avg Volume",         value: formatNumber(data.avg_volume),              icon: <ArrowDownUp className="w-3.5 h-3.5" /> },
        { label: "Short %",            value: formatPercent(data.short_percent),          icon: <BadgePercent className="w-3.5 h-3.5" />, termId: "short-interest" },
        { label: "Institutional Own.", value: formatPercent(data.institutional_ownership),icon: <Users className="w-3.5 h-3.5" />,       termId: "institutional-ownership" },
      ],
    },
    {
      title: "Profitability & Cash",
      metrics: [
        { label: "Dividend Yield", value: formatPercent(data.dividend_yield),     icon: <PiggyBank className="w-3.5 h-3.5" />,      termId: "dividend-yield" },
        { label: "ROE",            value: formatPercent(data.roe),                icon: <Percent className="w-3.5 h-3.5" />,         termId: "roe" },
        { label: "Profit Margin",  value: formatPercent(data.profit_margin),      icon: <CircleDollarSign className="w-3.5 h-3.5" />,termId: "profit-margin" },
        { label: "Free Cash Flow", value: `$${formatNumber(data.free_cashflow)}`, icon: <Banknote className="w-3.5 h-3.5" />,        termId: "free-cash-flow" },
        { label: "Debt / Equity",  value: formatFixed(data.debt_to_equity),      icon: <AreaChart className="w-3.5 h-3.5" />,        termId: "debt-to-equity" },
      ],
    },
  ];

  return (
    <div className="space-y-10">
      {metricGroups.map((group, gi) => {
        const tone = GROUP_TONE[group.title] ?? "slate";
        return (
          <div key={gi} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${TONE[tone].dot}`} />
              <p className={`text-xs font-semibold uppercase tracking-wide ${TONE[tone].text}`}>{group.title}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {group.metrics.map((item, idx) => {
                const isEPS = item.label === "EPS (TTM)";
                return (
                  <div
                    key={idx}
                    className="bb-card group relative p-3 transition-colors cursor-default"
                    style={{ borderColor: `${TONE[tone].hex}33` }}
                  >
                    <div className={`flex items-center gap-1.5 mb-2 opacity-80 ${TONE[tone].text}`}>
                      {item.icon}
                      <p className="text-[11px] uppercase tracking-wide font-medium text-slate-500">{item.label}</p>
                      {"termId" in item && item.termId && (
                        <TermTooltip termId={item.termId} tone={tone} />
                      )}
                    </div>
                    <p className="text-blue-50 text-sm font-bold tabular-nums">{item.value}</p>
                    {isEPS && (
                      <button
                        onClick={() => setShowModal(true)}
                        className={`absolute top-2.5 right-2.5 rounded-full border px-2 py-0.5 text-[11px] font-medium opacity-0 transition-opacity group-hover:opacity-100 ${TONE[tone].soft}`}
                      >
                        Chart
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <DataSourceNote label="Yahoo Finance via yfinance" className="-mt-6" />
      {showModal && <EPSChartModal ticker={data.ticker} onClose={() => setShowModal(false)} />}
    </div>
  );
}
