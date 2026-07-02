"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import TickerInput from "@/app/components/TickerInput";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Brain,
  Cpu,
  Layers,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Fade-in-on-scroll — one variant, used at the section level so we're not
// re-declaring a stagger for every single card on the page.
// ─────────────────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const viewport = { once: true, margin: "-80px" };

// ─────────────────────────────────────────────────────────────────────────────
// Hero demo cards
// ─────────────────────────────────────────────────────────────────────────────

function Sparkline({ points, up }: { points: string; up: boolean }) {
  const color = up ? "#34d399" : "#fb7185";
  return (
    <svg width="100%" height="32" viewBox="0 0 120 40" preserveAspectRatio="none" className="w-full">
      <path d={points} stroke={color} strokeWidth="1.75" fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const UP_LINE = "M0,36 C14,32 26,26 38,20 C50,14 60,18 72,12 C84,7 96,9 108,4 C112,2 116,1 120,0";

function ChangeTag({ pct }: { pct: number }) {
  const up = pct >= 0;
  return (
    <span
      className={`text-xs font-semibold px-1.5 py-0.5 rounded tabular-nums ${
        up ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
      }`}
    >
      {up ? "+" : ""}
      {pct.toFixed(2)}%
    </span>
  );
}

type DemoStock = {
  ticker: string;
  name: string;
  pct: number;
  note?: string;
  stats: { label: string; value: string }[];
  sparkUp?: boolean;
};

const DEMO_STOCKS: DemoStock[] = [
  {
    ticker: "NVDA",
    name: "NVIDIA Corp",
    pct: 2.41,
    stats: [
      { label: "Price", value: "~$200" },
      { label: "P/E", value: "38×" },
    ],
    sparkUp: true,
  },
  {
    ticker: "GOOGL",
    name: "Alphabet Inc",
    pct: 7.04,
    note: "Cloud revenue up 63% YoY — one of the few Mag 7 names where capex was matched by growth.",
    stats: [{ label: "Cloud growth", value: "+63%" }],
    sparkUp: true,
  },
  {
    ticker: "META",
    name: "Meta Platforms",
    pct: -7.18,
    note: "2026 capex guide raised to $145B — the market punished the spend without matching cloud growth.",
    stats: [
      { label: "Price", value: "~$560" },
      { label: "P/E", value: "22×" },
    ],
  },
  {
    ticker: "XOM",
    name: "Exxon Mobil",
    pct: 3.84,
    stats: [
      { label: "Price", value: "~$108" },
      { label: "P/E", value: "12×" },
    ],
    sparkUp: true,
  },
];

function DemoCard({ stock }: { stock: DemoStock }) {
  return (
    <Link href={`/summary/${stock.ticker}`} className="block group">
      <div className="bb-card bb-card-hover p-3.5 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-bold text-blue-50 font-mono">{stock.ticker}</p>
            <p className="text-xs text-slate-500">{stock.name}</p>
          </div>
          <ChangeTag pct={stock.pct} />
        </div>
        {stock.sparkUp !== undefined && <Sparkline points={UP_LINE} up={stock.sparkUp} />}
        {stock.note && <p className="text-xs text-slate-400 leading-relaxed">{stock.note}</p>}
        <div className="flex gap-4">
          {stock.stats.map((s) => (
            <div key={s.label}>
              <p className="text-[11px] text-slate-600">{s.label}</p>
              <p className="text-xs font-semibold text-slate-300 tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.06]">
          <span className="text-[11px] text-slate-700">Illustrative, not live data</span>
          <span className="flex items-center gap-1 text-xs font-medium text-sky-500 group-hover:text-sky-300 transition-colors">
            Open Brief
            <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Data constants
// ─────────────────────────────────────────────────────────────────────────────

const QUICK_TICKERS = ["NVDA", "AAPL", "GOOGL", "META", "TSLA", "JPM"];

const STEPS = [
  {
    num: "01",
    title: "Search any stock",
    desc: "Type a ticker or company name. We pull live financials and filings instantly.",
  },
  {
    num: "02",
    title: "BullBrief reads the business",
    desc: "We scan financials, filings, risks, valuation, and market narrative, then translate the signal into plain English.",
  },
  {
    num: "03",
    title: "Get the brief",
    desc: "A complete research brief in seconds. No jargon, no paywall, no wait.",
  },
];

const PROOF = [
  { value: "10-K", label: "SEC filing scans" },
  { value: "50+", label: "Metrics per summary" },
  { value: "6+", label: "Research sections" },
  { value: "0", label: "Paywalls" },
];

const BRIEF_SECTIONS = [
  {
    Icon: BarChart3,
    title: "Financial Snapshot",
    desc: "Revenue, margins, cash flow, and profitability context in one clean view.",
  },
  {
    Icon: Layers,
    title: "Revenue Engine",
    desc: "Business segments, products, and geographies powering the company's growth.",
  },
  {
    Icon: TrendingUp,
    title: "Valuation",
    desc: "Whether investor expectations look stretched, reasonable, or discounted.",
  },
  {
    Icon: AlertTriangle,
    title: "Risks",
    desc: "The biggest business, market, filing, and execution risks, identified and explained.",
  },
  {
    Icon: Target,
    title: "SWOT",
    desc: "Strengths, weaknesses, opportunities, and threats in plain language.",
  },
  {
    Icon: Users,
    title: "Peer Comparison",
    desc: "How the company stacks up against relevant competitors and sector benchmarks.",
  },
  {
    Icon: Brain,
    title: "Plain-English Summary",
    desc: "Dense financial data translated into a readable investor brief you can follow in minutes.",
  },
] as const;

const WHY_CARDS = [
  {
    title: "Numbers become narrative",
    desc: "Revenue growth tells you what happened. BullBrief shows what drove it, whether it looks sustainable, and what investors may be pricing in.",
  },
  {
    title: "Filings become signal",
    desc: "SEC language is dense by design. BullBrief extracts the parts that matter: risks, changes in guidance, and business context.",
  },
  {
    title: "Trends become watchpoints",
    desc: "See the metrics that could drive upside or pressure the stock: margin compression, capex cycles, competitive shifts.",
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();

  // Press "/" to focus the search box
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#060c1a]">
      {/* Background: one calm, slow-moving gradient blob. That's it. */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-48 left-[35%] w-[900px] h-[700px] rounded-full animate-orb"
          style={{
            background: "radial-gradient(ellipse, rgba(56,189,248,0.09) 0%, transparent 68%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-[88px]">
        <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 grid lg:grid-cols-[minmax(0,1.14fr)_minmax(300px,0.78fr)] gap-10 xl:gap-14 items-center py-16">
          {/* LEFT – copy + search */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col items-start gap-7">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-sky-400 bg-sky-400/[0.06] border border-sky-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-live" />
              One ticker. One brief. Full picture.
            </div>

            <h1
              className="font-fraunces font-black leading-[0.95] tracking-tight text-blue-50"
              style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)" }}
            >
              Wall Street research,
              <br />
              <span className="italic gradient-text">in plain English.</span>
            </h1>

            <p className="text-[15px] text-slate-400 leading-relaxed max-w-[460px]">
              BullBrief turns earnings, financials, filings, valuation, risks, and market narrative into a clean
              investor brief you can read in minutes.
            </p>

            <div className="w-full max-w-[480px] space-y-2.5">
              <TickerInput />

              <div className="flex items-center justify-between px-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-slate-600">Try</span>
                  {QUICK_TICKERS.map((t) => (
                    <button
                      key={t}
                      onClick={() => router.push(`/summary/${t}`)}
                      className="font-mono font-semibold text-xs px-2 py-0.5 rounded-md border border-sky-400/10 bg-sky-400/[0.04] text-sky-400/60 transition-colors hover:text-sky-300 hover:bg-sky-400/10 hover:border-sky-400/25"
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-700 shrink-0 ml-3">
                  <kbd className="px-1.5 py-0.5 rounded text-[11px] font-semibold text-sky-400/50 bg-sky-400/5 border border-sky-400/10">
                    /
                  </kbd>
                  to search
                </span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT – demo card grid */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="hidden lg:grid grid-cols-2 gap-2.5 relative max-w-[430px] justify-self-end"
          >
            <div className="flex flex-col gap-2.5">
              <DemoCard stock={DEMO_STOCKS[0]} />
              <DemoCard stock={DEMO_STOCKS[1]} />
            </div>
            <div className="flex flex-col gap-2.5 mt-8">
              <DemoCard stock={DEMO_STOCKS[2]} />
              <DemoCard stock={DEMO_STOCKS[3]} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PROOF STATS ──────────────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeUp}
        className="max-w-5xl mx-auto px-6 lg:px-12 py-16"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PROOF.map((s) => (
            <div key={s.label} className="bb-card px-3 py-4 text-center space-y-1">
              <p
                className="font-fraunces font-black gradient-text"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", letterSpacing: "-0.03em" }}
              >
                {s.value}
              </p>
              <p className="text-xs font-medium text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeUp}
        className="max-w-5xl mx-auto px-6 lg:px-12 pb-20"
      >
        <div className="mb-12 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-500">How it works</p>
          <h2
            className="font-fraunces font-black tracking-tight text-blue-50 leading-none"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Research in <span className="italic gradient-text">three steps.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div key={step.num} className="space-y-3">
              <span className="font-mono font-bold text-2xl text-sky-400/50">{step.num}</span>
              <div>
                <p className="font-fraunces font-bold text-lg text-blue-50 tracking-tight">{step.title}</p>
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── WHAT YOU GET IN EVERY BRIEF ──────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeUp}
        className="max-w-6xl mx-auto px-6 lg:px-12 pb-24"
      >
        <div className="mb-12 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">Every Brief</p>
          <h2
            className="font-fraunces font-black tracking-tight text-blue-50 leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            What you get in <span className="italic gradient-text">every brief.</span>
          </h2>
          <p className="max-w-xl text-sm leading-7 text-slate-500">
            BullBrief connects the numbers, the narrative, and the risks so you can understand a company faster.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {BRIEF_SECTIONS.map(({ Icon, title, desc }) => (
            <div key={title} className="bb-card bb-card-hover p-4 space-y-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-sky-400/10 border border-sky-400/20">
                <Icon className="w-4 h-4 text-sky-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-50">{title}</p>
                <p className="mt-1.5 text-xs leading-5 text-slate-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── WHY BULLBRIEF ────────────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeUp}
        className="max-w-5xl mx-auto px-6 lg:px-12 pb-24"
      >
        <div className="mb-12 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-500">Why BullBrief</p>
          <h2
            className="font-fraunces font-black tracking-tight text-blue-50 leading-tight max-w-2xl"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            Most tools show you numbers.
            <br />
            <span className="italic gradient-text">BullBrief explains what they mean.</span>
          </h2>
          <p className="max-w-xl text-sm leading-7 text-slate-500">
            Revenue growth tells you what happened. BullBrief shows what drove it, whether it looks sustainable, and
            what investors may be pricing in.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {WHY_CARDS.map(({ title, desc }) => (
            <div key={title} className="bb-card bb-card-hover p-5 space-y-3">
              <p className="font-bold text-sm text-blue-50 tracking-tight">{title}</p>
              <p className="text-xs leading-6 text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── BUSINESS ENGINE TEASER ───────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeUp}
        className="max-w-5xl mx-auto px-6 lg:px-12 pb-24"
      >
        <div className="bb-card-feature relative overflow-hidden">
          <div className="relative px-8 sm:px-12 py-12 grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-8 items-center">
            <div className="space-y-4 max-w-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-indigo-400/10 border border-indigo-400/20">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">Business Engine</p>
              </div>
              <h2
                className="font-fraunces font-black tracking-tight text-blue-50 leading-tight"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
              >
                Every stock has an engine. <span className="italic gradient-text">BullBrief shows what powers it.</span>
              </h2>
              <p className="text-sm leading-7 text-slate-500">
                Break down the revenue streams, growth drivers, risks, and investor expectations behind the ticker.
                Not just what happened, but what is driving the business.
              </p>
              <Link
                href="/summary/NVDA"
                className="inline-flex items-center gap-2.5 btn-gradient text-white font-semibold px-6 py-3 rounded-xl text-sm tracking-tight"
              >
                Explore NVDA Brief
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-36 h-36 rounded-full border border-indigo-400/20 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border border-sky-400/20 flex items-center justify-center bg-indigo-400/[0.04]">
                  <Cpu className="w-7 h-7 text-indigo-400/70" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── MOVERS TEASER ────────────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeUp}
        className="max-w-5xl mx-auto px-6 lg:px-12 pb-24"
      >
        <div className="bb-card relative overflow-hidden">
          <div className="relative px-8 sm:px-12 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-md">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">Market Discovery</p>
              </div>
              <h2
                className="font-fraunces font-black tracking-tight text-blue-50"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
              >
                Biggest Movers Today
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                See what moved. Then open a BullBrief to understand why it matters.
              </p>
            </div>
            <Link
              href="/movers"
              className="shrink-0 inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-colors text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 hover:bg-emerald-400/15"
            >
              View All Movers
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ── DEEP COMPARE CTA ─────────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeUp}
        className="max-w-5xl mx-auto px-6 lg:px-12 pb-28"
      >
        <div className="bb-card-feature relative overflow-hidden">
          <div className="relative px-8 sm:px-12 py-12 sm:py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div className="space-y-3 max-w-md">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-400">Featured Tool</p>
              <h2
                className="font-fraunces font-black tracking-tight text-blue-50 leading-none"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                Deep <span className="italic gradient-text">Compare.</span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Side-by-side analysis across fundamentals, valuation, and market outlook. Compare up to three
                companies with interactive charts.
              </p>
            </div>
            <button
              onClick={() => router.push("/compare")}
              className="btn-gradient shrink-0 flex items-center gap-2.5 text-white font-semibold px-8 py-3.5 rounded-xl text-sm tracking-tight"
            >
              Compare Companies
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
