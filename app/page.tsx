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
  ArrowRightLeft,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Brain,
  Cpu,
  Layers,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function Sparkline({
  points,
  color = "#10b981",
}: {
  points: string;
  color?: string;
}) {
  return (
    <svg
      width="100%"
      height="34"
      viewBox="0 0 120 44"
      preserveAspectRatio="none"
      className="w-full"
    >
      <defs>
        <linearGradient
          id={`sg-${color.replace("#", "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={points + " L120,44 L0,44 Z"}
        fill={`url(#sg-${color.replace("#", "")})`}
      />
      <path
        d={points}
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

const UP_LINE =
  "M0,40 C12,35 22,28 34,22 C46,16 54,20 66,13 C78,6 88,10 98,5 C108,2 114,1 120,0";
const UP_LINE_2 =
  "M0,36 C14,32 26,26 38,20 C50,14 60,18 72,12 C84,7 96,9 108,4 C112,2 116,1 120,0";

function BadgePct({ pct }: { pct: number }) {
  const up = pct >= 0;
  return (
    <span
      className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-md tabular-nums"
      style={{
        backgroundColor: up ? "rgba(16,185,129,0.12)" : "rgba(244,63,94,0.12)",
        color: up ? "#10b981" : "#f43f5e",
        border: `1px solid ${up ? "rgba(16,185,129,0.2)" : "rgba(244,63,94,0.2)"}`,
      }}
    >
      {up ? "+" : ""}
      {pct.toFixed(2)}%
    </span>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[8px] uppercase tracking-wider text-slate-600 font-mono mb-0.5">
        {label}
      </p>
      <p className="text-[10px] font-bold text-slate-300 tabular-nums">{value}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo cards — clickable, Open Brief CTA
// ─────────────────────────────────────────────────────────────────────────────

function DemoCardShell({
  ticker,
  children,
}: {
  ticker: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={`/summary/${ticker}`} className="block group">
      <div className="example-card-glow p-3 space-y-2">
        {children}
        <div
          className="flex items-center justify-between pt-1.5"
          style={{ borderTop: "1px solid rgba(56,189,248,0.07)" }}
        >
          <span className="text-[8px] font-mono text-slate-700">
            Illustrative · not live data
          </span>
          <span className="flex items-center gap-1 text-[9px] font-bold text-sky-500 group-hover:text-sky-300 transition-colors duration-150">
            Open Brief
            <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function CardNVDA() {
  return (
    <DemoCardShell ticker="NVDA">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-black text-blue-50">NVDA</p>
          <p className="text-[9px] text-slate-500 mt-0.5">NVIDIA Corp</p>
        </div>
        <BadgePct pct={2.41} />
      </div>
      <Sparkline points={UP_LINE} color="#10b981" />
      <div className="flex gap-3">
        <StatCell label="Price" value="~$200" />
        <StatCell label="P/E" value="38×" />
        <StatCell label="Mkt Cap" value="~$4.8T" />
      </div>
    </DemoCardShell>
  );
}

function CardGOOGL() {
  return (
    <DemoCardShell ticker="GOOGL">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-black text-blue-50">GOOGL</p>
          <p className="text-[9px] text-slate-500 mt-0.5">Alphabet Inc</p>
        </div>
        <BadgePct pct={7.04} />
      </div>
      <Sparkline points={UP_LINE_2} color="#10b981" />
      <p className="text-[9px] text-slate-400 leading-relaxed">
        Cloud revenue surged 63% YoY. The only Mag 7 name where capex was
        matched by growth.
      </p>
      <div className="flex gap-3">
        <StatCell label="Price" value="~$165" />
        <StatCell label="Cloud" value="+63%" />
      </div>
    </DemoCardShell>
  );
}

function CardMETA() {
  return (
    <DemoCardShell ticker="META">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-black text-blue-50">META</p>
          <p className="text-[9px] text-slate-500 mt-0.5">Meta Platforms</p>
        </div>
        <BadgePct pct={-7.18} />
      </div>
      <p className="text-[9px] text-slate-400 leading-relaxed">
        Capex guide raised to $145B for 2026 — market punished the spend
        without matching cloud growth.
      </p>
      <div className="flex gap-3">
        <StatCell label="Price" value="~$560" />
        <StatCell label="P/E" value="22×" />
      </div>
    </DemoCardShell>
  );
}

function CardXOM() {
  return (
    <DemoCardShell ticker="XOM">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-black text-blue-50">XOM</p>
          <p className="text-[9px] text-slate-500 mt-0.5">Exxon Mobil</p>
        </div>
        <BadgePct pct={3.84} />
      </div>
      <Sparkline points={UP_LINE} color="#10b981" />
      <div className="flex gap-3">
        <StatCell label="Price" value="~$108" />
        <StatCell label="P/E" value="12×" />
      </div>
    </DemoCardShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Animations
// ─────────────────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Data constants
// ─────────────────────────────────────────────────────────────────────────────

const MARQUEE_ITEMS = [
  "EARNINGS",
  "REVENUE GROWTH",
  "P/E RATIO",
  "PIOTROSKI F-SCORE",
  "MARKET CAP",
  "PLAIN-ENGLISH BRIEFS",
  "ROE",
  "FREE CASH FLOW",
  "PEER COMPARISON",
  "EPS TRENDS",
  "PROFIT MARGINS",
  "SEC ITEM 1A",
];

const QUICK_TICKERS = ["NVDA", "AAPL", "GOOGL", "META", "TSLA", "JPM"];

const STEPS = [
  {
    num: "01",
    title: "Search any stock",
    desc: "Type a ticker or company name. We pull live financials and filings instantly.",
  },
  {
    num: "02",
    title: "BullBrief analyzes the business",
    desc: "We scan financials, filings, risks, valuation, and market narrative — then translate the signal into plain English.",
  },
  {
    num: "03",
    title: "Get the brief",
    desc: "A complete research brief in seconds — no jargon, no paywall, no wait.",
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
    desc: "Revenue, margins, cash flow, FCF yield, and profitability context in one clean view.",
    accent: "#38bdf8",
  },
  {
    Icon: Layers,
    title: "Revenue Engine",
    desc: "Business segments, products, and geographies powering the company's growth.",
    accent: "#818cf8",
  },
  {
    Icon: TrendingUp,
    title: "Valuation Pillars",
    desc: "Peer-relative multiples and history percentiles — inspectable, not opaque grades.",
    accent: "#10b981",
  },
  {
    Icon: AlertTriangle,
    title: "SEC Risks",
    desc: "Material Item 1A risk factors extracted from the latest 10-K, with filing evidence.",
    accent: "#f43f5e",
  },
  {
    Icon: Target,
    title: "Quality Checklist",
    desc: "Piotroski F-Score tests and Altman Z″ bands with the underlying numbers shown.",
    accent: "#f59e0b",
  },
  {
    Icon: Users,
    title: "Peer Comparison",
    desc: "Cap-banded competitors and sector benchmarks — metrics only, no moat essays.",
    accent: "#a78bfa",
  },
  {
    Icon: Brain,
    title: "Plain-English Summary",
    desc: "Dense financial data translated into a readable investor brief you can follow in minutes.",
    accent: "#38bdf8",
  },
] as const;

const WHY_CARDS = [
  {
    Icon: ArrowRightLeft,
    title: "Numbers → Narrative",
    desc: "Revenue growth tells you what happened. BullBrief shows what drove it, whether it looks sustainable, and what investors may be pricing in.",
    accent: "#38bdf8",
  },
  {
    Icon: BookOpen,
    title: "Filings → Signal",
    desc: "SEC language is dense by design. BullBrief extracts the parts that matter: risks, changes in guidance, and business context.",
    accent: "#818cf8",
  },
  {
    Icon: Activity,
    title: "Trends → Watchpoints",
    desc: "See the metrics that could drive upside or pressure the stock — margin compression, capex cycles, competitive shifts.",
    accent: "#10b981",
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
    <main
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: "#060c1a" }}
    >
      {/* Background orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-48 left-[30%] w-[900px] h-[700px] rounded-full animate-orb"
          style={{
            background:
              "radial-gradient(ellipse, rgba(56,189,248,0.1) 0%, transparent 68%)",
            filter: "blur(70px)",
          }}
        />
        <div
          className="absolute top-20 right-[-5%] w-[600px] h-[500px] rounded-full animate-orb-2"
          style={{
            background:
              "radial-gradient(ellipse, rgba(129,140,248,0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-[30%] left-[-8%] w-[500px] h-[400px] rounded-full animate-orb-3"
          style={{
            background:
              "radial-gradient(ellipse, rgba(167,139,250,0.06) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(56,189,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-[88px]">
        <div className="max-w-7xl mx-auto w-full px-8 lg:px-12 grid lg:grid-cols-[minmax(0,1.14fr)_minmax(300px,0.78fr)] gap-10 xl:gap-14 items-center py-16">
          {/* LEFT – copy + search */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start gap-7"
          >
            {/* Badge */}
            <motion.div custom={0} variants={fadeUp}>
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-sky-400 font-mono"
                style={{
                  backgroundColor: "rgba(56,189,248,0.06)",
                  border: "1px solid rgba(56,189,248,0.18)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-live" />
                One ticker. One brief. Full picture.
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div custom={1} variants={fadeUp}>
              <h1
                className="font-fraunces font-black leading-[0.92] tracking-tight"
                style={{ fontSize: "clamp(3.2rem, 6.5vw, 6rem)" }}
              >
                <span className="text-blue-50">Wall Street research,</span>
                <br />
                <span
                  className="italic"
                  style={{
                    background:
                      "linear-gradient(135deg, #818cf8 0%, #a78bfa 45%, #38bdf8 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  in plain English.
                </span>
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              custom={2}
              variants={fadeUp}
              className="text-sm sm:text-[15px] text-slate-500 leading-relaxed max-w-[460px]"
            >
              BullBrief turns earnings, financials, filings, valuation, risks,
              and market narrative into a clean investor brief you can read in
              minutes.
            </motion.p>

            {/* Search + hints */}
            <motion.div
              custom={3}
              variants={fadeUp}
              className="w-full max-w-[480px] space-y-2.5"
            >
              <TickerInput />

              <div className="flex items-center justify-between px-1">
                {/* Quick-ticker chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-700">
                    Try
                  </span>
                  {QUICK_TICKERS.map((t) => (
                    <button
                      key={t}
                      onClick={() => router.push(`/summary/${t}`)}
                      className="font-mono font-bold text-[10px] px-2 py-0.5 rounded-md transition-all hover:-translate-y-0.5"
                      style={{
                        color: "rgba(56,189,248,0.55)",
                        backgroundColor: "rgba(56,189,248,0.04)",
                        border: "1px solid rgba(56,189,248,0.1)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          "#38bdf8";
                        (
                          e.currentTarget as HTMLElement
                        ).style.backgroundColor = "rgba(56,189,248,0.1)";
                        (
                          e.currentTarget as HTMLElement
                        ).style.borderColor = "rgba(56,189,248,0.28)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          "rgba(56,189,248,0.55)";
                        (
                          e.currentTarget as HTMLElement
                        ).style.backgroundColor = "rgba(56,189,248,0.04)";
                        (
                          e.currentTarget as HTMLElement
                        ).style.borderColor = "rgba(56,189,248,0.1)";
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Keyboard hint */}
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-slate-700 font-mono shrink-0 ml-3">
                  <kbd
                    className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                    style={{
                      backgroundColor: "rgba(56,189,248,0.05)",
                      border: "1px solid rgba(56,189,248,0.12)",
                      color: "rgba(56,189,248,0.45)",
                    }}
                  >
                    /
                  </kbd>
                  to search
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT – staggered demo card grid */}
          <div className="hidden lg:grid grid-cols-2 gap-2.5 relative max-w-[430px] justify-self-end">
            <div className="flex flex-col gap-2.5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <CardNVDA />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <CardGOOGL />
              </motion.div>
            </div>
            <div className="flex flex-col gap-2.5 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <CardMETA />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <CardXOM />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAPABILITY STRIP ─────────────────────────────────────────────── */}
      <div
        className="overflow-hidden py-3 border-y"
        style={{
          borderColor: "rgba(56,189,248,0.06)",
          backgroundColor: "rgba(4,9,20,0.8)",
        }}
      >
        <div className="flex animate-marquee gap-10 whitespace-nowrap select-none">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-700 font-mono flex items-center gap-4"
            >
              {item}
              <span className="text-sky-900/40">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── PROOF STATS ──────────────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="max-w-5xl mx-auto px-8 lg:px-12 py-16"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PROOF.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              variants={fadeUp}
              className="bb-card px-3 py-3 text-center space-y-1"
            >
              <p
                className="font-fraunces font-black gradient-text-animated"
                style={{
                  fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                  letterSpacing: "-0.03em",
                }}
              >
                {s.value}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 font-mono">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-5xl mx-auto px-8 lg:px-12 pb-20"
      >
        <motion.div variants={fadeUp} custom={0} className="mb-12 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky-500 font-mono">
            How it works
          </p>
          <h2
            className="font-fraunces font-black tracking-tight text-blue-50 leading-none"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Research in{" "}
            <span
              className="italic"
              style={{
                background:
                  "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              three steps.
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              custom={i + 1}
              variants={fadeUp}
              className="space-y-4"
            >
              <span
                className="font-mono font-black text-3xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(56,189,248,0.55) 0%, rgba(129,140,248,0.55) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {step.num}
              </span>
              <div>
                <p className="font-fraunces font-bold text-lg text-blue-50 tracking-tight">
                  {step.title}
                </p>
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── WHAT YOU GET IN EVERY BRIEF ──────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="max-w-6xl mx-auto px-8 lg:px-12 pb-24"
      >
        <motion.div variants={fadeUp} custom={0} className="mb-12 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-400 font-mono">
            Every Brief
          </p>
          <h2
            className="font-fraunces font-black tracking-tight text-blue-50 leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            What you get in{" "}
            <span
              className="italic"
              style={{
                background:
                  "linear-gradient(135deg, #818cf8 0%, #a78bfa 55%, #38bdf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              every brief.
            </span>
          </h2>
          <p className="max-w-xl text-sm leading-7 text-slate-500">
            BullBrief connects the numbers, the narrative, and the risks so you
            can understand a company faster.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {BRIEF_SECTIONS.map(({ Icon, title, desc, accent }, i) => (
            <motion.div
              key={title}
              custom={i + 1}
              variants={fadeUp}
              className="bb-card bb-card-hover p-4 space-y-3"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: `${accent}12`,
                  border: `1px solid ${accent}24`,
                }}
              >
                <Icon className="w-4 h-4" style={{ color: accent }} />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-50">{title}</p>
                <p className="mt-1.5 text-xs leading-5 text-slate-500">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── WHY BULLBRIEF ────────────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="max-w-5xl mx-auto px-8 lg:px-12 pb-24"
      >
        <motion.div variants={fadeUp} custom={0} className="mb-12 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky-500 font-mono">
            Why BullBrief
          </p>
          <h2
            className="font-fraunces font-black tracking-tight text-blue-50 leading-tight max-w-2xl"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            Most tools show you numbers.
            <br />
            <span
              className="italic"
              style={{
                background:
                  "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              BullBrief explains what they mean.
            </span>
          </h2>
          <p className="max-w-xl text-sm leading-7 text-slate-500">
            Revenue growth tells you what happened. BullBrief shows what drove
            it, whether it looks sustainable, and what investors may be pricing
            in.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {WHY_CARDS.map(({ Icon, title, desc, accent }, i) => (
            <motion.div
              key={title}
              custom={i + 1}
              variants={fadeUp}
              className="bb-card bb-card-hover p-5 space-y-4"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `${accent}12`,
                  border: `1px solid ${accent}22`,
                }}
              >
                <Icon className="w-5 h-5" style={{ color: accent }} />
              </div>
              <div>
                <p className="font-bold text-sm text-blue-50 tracking-tight">
                  {title}
                </p>
                <p className="mt-2 text-xs leading-6 text-slate-500">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── BUSINESS ENGINE TEASER ───────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="max-w-5xl mx-auto px-8 lg:px-12 pb-24"
      >
        <motion.div
          variants={fadeUp}
          custom={0}
          className="bb-card relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(15,32,64,0.72) 0%, rgba(99,102,241,0.07) 55%, rgba(167,139,250,0.05) 100%)",
            borderColor: "rgba(129,140,248,0.2)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 15% 50%, rgba(56,189,248,0.07) 0%, transparent 60%)",
            }}
          />
          <div className="relative px-8 sm:px-12 py-12 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8 items-center">
            <div className="space-y-4 max-w-lg">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: "rgba(129,140,248,0.12)",
                    border: "1px solid rgba(129,140,248,0.22)",
                  }}
                >
                  <Cpu className="w-4 h-4 text-indigo-400" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-400 font-mono">
                  Business Engine
                </p>
              </div>
              <h2
                className="font-fraunces font-black tracking-tight text-blue-50 leading-tight"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
              >
                Every stock has an engine.{" "}
                <span
                  className="italic"
                  style={{
                    background:
                      "linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  BullBrief shows what powers it.
                </span>
              </h2>
              <p className="text-sm leading-7 text-slate-500">
                Break down the revenue streams, growth drivers, risks, and
                investor expectations behind the ticker. Not just what happened
                — but what is driving the business.
              </p>
              <Link
                href="/summary/NVDA"
                className="inline-flex items-center gap-2.5 btn-gradient text-white font-bold px-6 py-3 rounded-xl text-sm tracking-tight"
              >
                Explore NVDA Brief
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Abstract engine visual */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-44 h-44">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: "1px solid rgba(129,140,248,0.18)",
                    boxShadow: "0 0 32px rgba(129,140,248,0.08)",
                  }}
                />
                <div
                  className="absolute inset-7 rounded-full"
                  style={{
                    border: "1px solid rgba(56,189,248,0.14)",
                    boxShadow: "0 0 20px rgba(56,189,248,0.06)",
                  }}
                />
                <div
                  className="absolute inset-14 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(129,140,248,0.06)",
                    border: "1px solid rgba(129,140,248,0.2)",
                    boxShadow:
                      "0 0 18px rgba(129,140,248,0.12), inset 0 0 12px rgba(129,140,248,0.06)",
                  }}
                >
                  <Cpu className="w-7 h-7 text-indigo-400/60" />
                </div>
                {/* Segment arcs as dots — positions pre-computed to avoid SSR/client hydration mismatch */}
                {[
                  { top:    0,     left:  64,    color: "rgba(56,189,248,0.7)"   },
                  { top:  55.43,   left:  32,    color: "rgba(129,140,248,0.55)" },
                  { top:  55.43,   left: -32,    color: "rgba(167,139,250,0.5)"  },
                  { top:    0,     left: -64,    color: "rgba(56,189,248,0.45)"  },
                  { top: -55.43,   left: -32,    color: "rgba(16,185,129,0.5)"   },
                  { top: -55.43,   left:  32,    color: "rgba(129,140,248,0.4)"  },
                ].map(({ top, left, color }) => (
                  <div
                    key={`${top}-${left}`}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: color,
                      top: `calc(50% - 4px + ${top}px)`,
                      left: `calc(50% - 4px + ${left}px)`,
                      boxShadow: `0 0 6px ${color}`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* ── MOVERS TEASER ────────────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="max-w-5xl mx-auto px-8 lg:px-12 pb-24"
      >
        <motion.div
          variants={fadeUp}
          custom={0}
          className="bb-card relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(8,18,36,0.96) 0%, rgba(16,185,129,0.04) 100%)",
            borderColor: "rgba(16,185,129,0.14)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 88% 50%, rgba(16,185,129,0.06) 0%, transparent 58%)",
            }}
          />
          <div className="relative px-8 sm:px-12 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-md">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-400 font-mono">
                  Market Discovery
                </p>
              </div>
              <h2
                className="font-fraunces font-black tracking-tight text-blue-50"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
              >
                Biggest Movers Today
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                See what moved. Then open a BullBrief to understand why it
                matters.
              </p>
            </div>
            <Link
              href="/movers"
              className="shrink-0 inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{
                color: "#10b981",
                backgroundColor: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
            >
              View All Movers
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </motion.section>

      {/* ── DEEP COMPARE CTA ─────────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="max-w-5xl mx-auto px-8 lg:px-12 pb-28"
      >
        <motion.div
          variants={fadeUp}
          custom={0}
          className="bb-card relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(14,165,233,0.08) 0%, rgba(99,102,241,0.09) 55%, rgba(167,139,250,0.07) 100%)",
            borderColor: "rgba(56,189,248,0.16)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 75% 50%, rgba(99,102,241,0.1) 0%, transparent 65%)",
            }}
          />
          <div className="relative px-8 sm:px-12 py-12 sm:py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div className="space-y-3 max-w-md">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky-400 font-mono">
                Featured Tool
              </p>
              <h2
                className="font-fraunces font-black tracking-tight text-blue-50 leading-none"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                Deep{" "}
                <span
                  className="italic"
                  style={{
                    background:
                      "linear-gradient(135deg, #38bdf8 0%, #818cf8 55%, #a78bfa 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Compare.
                </span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Side-by-side analysis across fundamentals, valuation, and
                market outlook. Compare up to three companies with interactive
                charts.
              </p>
            </div>
            <button
              onClick={() => router.push("/compare")}
              className="btn-gradient shrink-0 flex items-center gap-2.5 text-white font-bold px-8 py-3.5 rounded-xl text-sm tracking-tight"
            >
              Compare Companies
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </motion.section>
    </main>
  );
}
