"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SWOTCard from "@/app/components/SWOTCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LoadingScreen from "@/app/components/LoadingScreen";
import StockChartToggle from "@/app/components/StockChartToggle";
import FinancialMetricsGrid from "@/app/components/FinancialMetricsGrid";
import ExecutiveGrid from "@/app/components/ExecutiveGrid";
import Tooltip from "@/app/components/Tooltip";
import PeerSummaryCard from "@/app/components/PeerSummaryCard";

type BackendSummary = {
  company_name: string;
  ticker: string;
  exchange: string;
  exchange_symbol: string;
  business_summary: string;
  swot: string;
  outlook: string;
  market_cap: number;
  pe_ratio: number;
  range_52w: string;
  sector: string;
  current_price: number;
  eps_ttm: number;
  forward_pe: number;
  dividend_yield: number;
  beta: number;
  volume: number;
  avg_volume: number;
  peg_ratio: number;
  price_to_sales: number;
  price_to_book: number;
  roe: number;
  free_cashflow: number;
  debt_to_equity: number;
  profit_margin: number;
  institutional_ownership: number;
  short_percent: number;
  raw_summary: string;
};

function formatAbbreviatedNumber(value: number): string {
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
}

function formatAbbreviatedShares(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export default function TickerPage() {
  const { ticker } = useParams();
  const [data, setData] = useState<BackendSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<
    { title: string; publisher: string; link: string; providerPublishTime: string }[]
  >([]);
  const [execs, setExecs] = useState<{ name: string; title: string; pay: string }[]>([]);
  const [peerData, setPeerData] = useState<{ target: any; peers: any[] } | null>(null);
  const [peerInsight, setPeerInsight] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/company/peers/insight/${ticker}`);
        const json = await res.json();
        setPeerInsight(json.insight || null);
      } catch (err) {
        console.error("Failed to fetch peer insight:", err);
      }
      
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/summary/${ticker}`);
        const json = await res.json();
        if (res.ok) setData(json);
        else setError(json.error || "Unknown error");
      } catch (err) {
        setError("Failed to fetch summary");
      } finally {
        setLoading(false);
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/news/${ticker}`);
        const json = await res.json();
        setNews(json.news || []);
      } catch (err) {
        console.error("Failed to fetch news:", err);
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/executives/${ticker}`);
        const json = await res.json();
        setExecs(json.executives || []);
      } catch (err) {
        console.error("Failed to fetch executives:", err);
      }
    };
    

    fetchData();
  }, [ticker]);

  if (loading) return <LoadingScreen isLoading={loading} />;
  if (error) return <p className="text-red-500 p-8 text-center">Error: {error}</p>;
  if (!data) return null;

  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-16 py-24 font-sans space-y-16">
      <section className="space-y-4">
        <Link href="/" className="inline-flex items-center text-sm text-blue-400 hover:text-blue-200 transition mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-extrabold text-blue-400 tracking-tight">
          {data.company_name} <span className="text-white">({data.ticker})</span>
        </h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className={`text-sm px-3 py-1 rounded-full font-semibold ${data.pe_ratio > 100 ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
            {data.pe_ratio > 100 ? "Bearish Signal" : "Bullish Trend"}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-sm text-gray-300 mt-6">
          {[
            { label: "Sector", value: data.sector },
            { label: "Market Cap", value: formatAbbreviatedNumber(data.market_cap) },
            { label: "P/E Ratio", value: `${data.pe_ratio?.toFixed(1)}` },
            { label: "EPS (TTM)", value: `$${data.eps_ttm?.toFixed(2)}` },
            { label: "52W Range", value: data.range_52w },
            { label: "Volume", value: formatAbbreviatedShares(data.volume) },
          ].map((item, i) => (
            <div key={i} className="bg-zinc-900/70 backdrop-blur border border-zinc-700 px-4 py-3 rounded-xl shadow-sm flex flex-col">
              <span className="text-xs text-gray-400 font-medium">{item.label}</span>
              <span className="text-white text-sm font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-blue-300 mb-4"> Stock Performance</h2>
        <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
          <StockChartToggle symbol={data.exchange_symbol} />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-blue-300 mb-4"> Explore Metrics</h2>
        <div className="flex gap-4 flex-wrap">
          <Link href={`/summary/${ticker}/metric/revenue`}>
            <button className="bg-zinc-800 px-5 py-2 rounded-lg text-sm hover:bg-blue-600 transition text-white border border-zinc-700 shadow-sm">
              Revenue
            </button>
          </Link>
          <Link href={`/summary/${ticker}/metric/eps`}>
            <button className="bg-zinc-800 px-5 py-2 rounded-lg text-sm hover:bg-blue-600 transition text-white border border-zinc-700 shadow-sm">
              EPS
            </button>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-blue-300 mb-4">The BullBrief</h2>
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-sm leading-relaxed text-gray-100 whitespace-pre-wrap">
          {data.business_summary}
        </div>
      </section>

      <SWOTCard content={data.swot} />

      <section>
        <h2 className="text-2xl font-semibold text-blue-300 mb-4">Outlook</h2>
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-sm leading-relaxed text-gray-100 whitespace-pre-wrap">
          {data.outlook}
        </div>
      </section>

      <section>
        <FinancialMetricsGrid data={data} />
      </section>
      {peerData && peerData.target && peerData.peers?.length > 0 && (
  <section>
    <h2 className="text-2xl font-semibold text-blue-300 mb-4">Peer Snapshot</h2>
  </section>
  
)}
{peerInsight && (
  <section>
    <h2 className="text-2xl font-semibold text-blue-300 mb-4">AI Peer Insight</h2>
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-sm leading-relaxed text-gray-100 whitespace-pre-wrap">
      {peerInsight}
    </div>
  </section>
)}


      <section>
        {execs.length > 0 && <ExecutiveGrid execs={execs} />}
      </section>


      <section>
        <h2 className="text-2xl font-semibold text-blue-300 mb-4"> Recent News</h2>
        {news.length === 0 ? (
          <p className="text-gray-400 text-sm">No recent news found.</p>
        ) : (
          <div className="grid gap-4">
            {news.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-zinc-900 border border-zinc-700 rounded-lg p-4 hover:border-blue-400 transition"
              >
                <p className="text-sm text-white font-semibold mb-1">{item.title}</p>
                <p className="text-xs text-gray-400">
                  {item.publisher} • {new Date(item.providerPublishTime).toLocaleDateString()}
                </p>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
