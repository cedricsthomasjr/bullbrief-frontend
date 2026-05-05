import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Brain,
  Code2,
  Database,
  FileSearch,
  Github,
  LineChart,
  Linkedin,
  Newspaper,
  ShieldCheck,
  SquareArrowOutUpRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About | BullBrief",
  description:
    "Learn what BullBrief is, who built it, and where its data comes from.",
};

const PROVIDERS = [
  {
    name: "Yahoo Finance",
    share: 32,
    accent: "#38bdf8",
    role: "Company profiles, real-time quotes, key ratios, market snapshot fields, live ticker bar, market movers (gainers/losers/actives), peers, executives, and fallback headlines.",
  },
  {
    name: "SEC EDGAR",
    share: 22,
    accent: "#10b981",
    role: "Company filings used for 10-K style business drivers, filing links, fiscal-year context, and operating signals.",
  },
  {
    name: "Financial Modeling Prep",
    share: 12,
    accent: "#818cf8",
    role: "Historical financial statements, forward estimates, key ratios, and stock-news fallback.",
  },
  {
    name: "OpenAI",
    share: 14,
    accent: "#a78bfa",
    role: "Plain-English summaries, analyst-style reports, peer comparison language, SWOT framing, and interpretation.",
  },
  {
    name: "NewsAPI / Finnhub / Yahoo / FMP",
    share: 10,
    accent: "#f59e0b",
    role: "Recent-news candidate pools that are filtered by source quality, ticker relevance, market keywords, and recency.",
  },
  {
    name: "TradingView",
    share: 6,
    accent: "#06b6d4",
    role: "Embedded price charts and stock-performance views.",
  },
  {
    name: "Local ticker datasets",
    share: 4,
    accent: "#f43f5e",
    role: "Search autocomplete, ticker mapping, exchange metadata, and fast local lookup support.",
  },
];

const FLOW = [
  {
    label: "Search",
    text: "Ticker lookup starts with local symbol data and company metadata.",
    icon: <Database className="w-4 h-4" />,
  },
  {
    label: "Gather",
    text: "BullBrief pulls market data, filings, financials, charts, news, and peer context.",
    icon: <FileSearch className="w-4 h-4" />,
  },
  {
    label: "Filter",
    text: "News and filings are ranked for relevance before they hit the page.",
    icon: <ShieldCheck className="w-4 h-4" />,
  },
  {
    label: "Brief",
    text: "AI turns the raw material into readable research sections.",
    icon: <Brain className="w-4 h-4" />,
  },
];

const FEATURE_STACK = [
  { value: "10-K", label: "SEC filing scans" },
  { value: "3-Way", label: "Ticker compare" },
  { value: "6+", label: "Research sections" },
];

export default function AboutPage() {
  return (
    <main
      className="min-h-screen pt-[88px]"
      style={{ backgroundColor: "#060c1a" }}
    >
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[640px] h-[440px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(129,140,248,0.08) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <div
          className="absolute bottom-24 left-[-8%] w-[520px] h-[420px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(56,189,248,0.06) 0%, transparent 70%)",
            filter: "blur(72px)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16 space-y-16">
        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 lg:gap-12 items-end">
          <div className="space-y-6">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-sky-400 font-mono"
              style={{
                backgroundColor: "rgba(56,189,248,0.06)",
                border: "1px solid rgba(56,189,248,0.18)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              About BullBrief
            </div>

            <div className="space-y-4">
              <h1
                className="font-fraunces font-black leading-[0.94] tracking-tight text-blue-50"
                style={{ fontSize: "clamp(3rem, 7vw, 6.2rem)" }}
              >
                Stock research,
                <br />
                <span className="gradient-text-animated italic">
                  without the fog.
                </span>
              </h1>
              <p className="max-w-2xl text-sm sm:text-base leading-8 text-slate-500">
                BullBrief is an AI-assisted stock research workspace that turns
                public market data, company filings, financial statements,
                charts, and recent headlines into concise, plain-English briefs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
              {FEATURE_STACK.map((item) => (
                <div
                  key={item.label}
                  className="bb-card px-3 py-4 text-center space-y-1"
                >
                  <p className="font-fraunces font-black gradient-text-animated text-4xl">
                    {item.value}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 font-mono">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bb-card p-4 space-y-4">
            <div className="flex items-center gap-3">
              <span
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(129,140,248,0.1)",
                  border: "1px solid rgba(129,140,248,0.2)",
                }}
              >
                <Code2 className="w-5 h-5 text-indigo-400" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                  Developer
                </p>
                <h2 className="text-xl font-black tracking-tight text-blue-50">
                  CJ Thomas
                </h2>
              </div>
            </div>
            <p className="text-sm leading-7 text-slate-500">
              BullBrief is built by CJ Thomas, a CS student focused on making
              dense financial research easier to scan, compare, and understand.
              The product blends frontend design, backend APIs, filing analysis,
              and AI summarization into one research flow.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://github.com/cedricsthomasjr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 hover:text-sky-300 transition-colors"
                style={{
                  backgroundColor: "rgba(15,32,64,0.5)",
                  border: "1px solid rgba(56,189,248,0.1)",
                }}
              >
                <Github className="w-3.5 h-3.5" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/cedric-thomas-jr/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 hover:text-sky-300 transition-colors"
                style={{
                  backgroundColor: "rgba(15,32,64,0.5)",
                  border: "1px solid rgba(56,189,248,0.1)",
                }}
              >
                <Linkedin className="w-3.5 h-3.5" />
                LinkedIn
              </a>
              <a
                href="https://www.cjst.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 hover:text-sky-300 transition-colors"
                style={{ backgroundColor: "rgba(15,32,64,0.5)", border: "1px solid rgba(56,189,248,0.1)" }}
              >
                <SquareArrowOutUpRight className="w-3.5 h-3.5" />
                Portfolio
              </a>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-sky-400">
                How It Works
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-blue-50">
                From raw data to brief
              </h2>
            </div>
            <p className="max-w-md text-xs leading-6 text-slate-600">
              BullBrief separates collection, filtering, and explanation so the
              final page feels like a research dashboard instead of a pile of
              links.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {FLOW.map((item, idx) => (
              <div key={item.label} className="bb-card p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-sky-400"
                    style={{
                      backgroundColor: "rgba(56,189,248,0.08)",
                      border: "1px solid rgba(56,189,248,0.16)",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span className="text-[10px] font-mono text-slate-700 tabular-nums">
                    0{idx + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-blue-50">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                Data Providers
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-blue-50">
                Where the brief comes from
              </h2>
            </div>
            <p className="max-w-xl text-xs leading-6 text-slate-600">
              The percentages below are estimated only for this provider mix
              visual. They describe a typical BullBrief research page, not a
              guaranteed source allocation for every ticker.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-5">
            <div className="space-y-3">
              {PROVIDERS.map((provider) => (
                <div key={provider.name} className="bb-card p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: provider.accent }}
                        />
                        <p className="text-sm font-bold text-blue-50">
                          {provider.name}
                        </p>
                      </div>
                      <p className="mt-2 text-xs leading-6 text-slate-500">
                        {provider.role}
                      </p>
                    </div>
                    <p
                      className="font-fraunces text-3xl font-black tabular-nums"
                      style={{ color: provider.accent }}
                    >
                      {provider.share}%
                    </p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-950/70">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${provider.share}%`,
                        background: `linear-gradient(90deg, ${provider.accent}, rgba(56,189,248,0.55))`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <aside className="space-y-3">
              <div className="bb-card p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <LineChart className="w-4 h-4 text-sky-400" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Charting Layer
                  </p>
                </div>
                <p className="text-sm leading-7 text-slate-500">
                  TradingView embeds power the visual stock-performance
                  experience, while BullBrief keeps the surrounding analysis and
                  context in its own interface.
                </p>
              </div>

              <div className="bb-card p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-amber-400" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    News Layer
                  </p>
                </div>
                <p className="text-sm leading-7 text-slate-500">
                  Recent headlines are gathered from multiple providers, then
                  ranked for bigger outlets, company relevance, finance
                  keywords, and recency.
                </p>
              </div>

              <div className="bb-card p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Filing Layer
                  </p>
                </div>
                <p className="text-sm leading-7 text-slate-500">
                  SEC filing scans are used to ground business drivers in public
                  filings before AI summarizes the operating story.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="bb-card p-5 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-5 lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                Research, not advice
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-blue-50">
                BullBrief helps you understand companies faster.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                It does not tell you what to buy or sell. Treat every brief as a
                starting point, then verify important details with primary
                sources and qualified professionals.
              </p>
            </div>
            <Link
              href="/disclaimer"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-xs font-bold uppercase tracking-widest text-sky-300 transition hover:-translate-y-0.5"
              style={{
                backgroundColor: "rgba(56,189,248,0.08)",
                border: "1px solid rgba(56,189,248,0.16)",
              }}
            >
              Read Disclaimer <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
