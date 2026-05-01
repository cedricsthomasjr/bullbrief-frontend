"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import TickerInput from "@/app/components/TickerInput";
import { ArrowRight } from "lucide-react";

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

// Upward sparkline
const UP_LINE =
  "M0,40 C12,35 22,28 34,22 C46,16 54,20 66,13 C78,6 88,10 98,5 C108,2 114,1 120,0";
// Slight up sparkline
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
      <p className="text-[10px] font-bold text-slate-300 tabular-nums">
        {value}
      </p>
    </div>
  );
}

function CardNVDA() {
  return (
    <div className="example-card-glow p-3 space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-black text-blue-50">NVDA</p>
          <p className="text-[9px] text-slate-500 mt-0.5">NVIDIA Corp</p>
        </div>
        <BadgePct pct={2.41} />
      </div>
      <Sparkline points={UP_LINE} color="#10b981" />
      <div
        className="flex gap-3 pt-1"
        style={{ borderTop: "1px solid rgba(56,189,248,0.07)" }}
      >
        <StatCell label="Price" value="$1,892" />
        <StatCell label="P/E" value="38.4×" />
        <StatCell label="Mkt Cap" value="$4.6T" />
      </div>
    </div>
  );
}

function CardGOOGL() {
  return (
    <div className="example-card-glow p-3 space-y-2">
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
      <div
        className="flex gap-3 pt-1"
        style={{ borderTop: "1px solid rgba(56,189,248,0.07)" }}
      >
        <StatCell label="Price" value="$216.80" />
        <StatCell label="Cloud" value="+63%" />
      </div>
    </div>
  );
}

function CardMETA() {
  return (
    <div className="example-card-glow p-3 space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-black text-blue-50">META</p>
          <p className="text-[9px] text-slate-500 mt-0.5">Meta Platforms</p>
        </div>
        <BadgePct pct={-7.18} />
      </div>
      <p className="text-[9px] text-slate-400 leading-relaxed">
        Capex guide raised to $145B for 2026 - market punished the spend without
        matching cloud growth.
      </p>
      <div
        className="flex gap-3 pt-1"
        style={{ borderTop: "1px solid rgba(56,189,248,0.07)" }}
      >
        <StatCell label="Price" value="$782" />
        <StatCell label="P/E" value="22.1×" />
      </div>
    </div>
  );
}

function CardXOM() {
  return (
    <div className="example-card-glow p-3 space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-black text-blue-50">XOM</p>
          <p className="text-[9px] text-slate-500 mt-0.5">Exxon Mobil</p>
        </div>
        <BadgePct pct={3.84} />
      </div>
      <Sparkline points={UP_LINE} color="#10b981" />
      <div
        className="flex gap-3 pt-1"
        style={{ borderTop: "1px solid rgba(56,189,248,0.07)" }}
      >
        <StatCell label="Price" value="$142" />
        <StatCell label="P/E" value="12.4×" />
      </div>
    </div>
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

const MARQUEE_ITEMS = [
  "EARNINGS",
  "REVENUE GROWTH",
  "P/E RATIO",
  "SWOT ANALYSIS",
  "MARKET CAP",
  "AI SUMMARIES",
  "ROE",
  "FREE CASH FLOW",
  "PEER COMPARISON",
  "EPS TRENDS",
  "PROFIT MARGINS",
  "ANALYST RATING",
];

const STEPS = [
  {
    num: "01",
    title: "Search any stock",
    desc: "Type a ticker or company name. We pull live financials instantly.",
  },
  {
    num: "02",
    title: "AI does the work",
    desc: "Our model analyzes fundamentals, risks, valuation, and competitive position.",
  },
  {
    num: "03",
    title: "Get the brief",
    desc: "A complete research brief in seconds - no jargon, no paywall, no wait.",
  },
];

const PROOF = [
  { value: "10-K", label: "SEC filing scans" },
  { value: "50+", label: "Metrics per summary" },
  { value: "6+", label: "Research sections" },
  { value: "0", label: "Paywalls" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();

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
          {/* LEFT - copy */}
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
                Live · AI-Powered Stock Intelligence
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

            {/* Body */}
            <motion.p
              custom={2}
              variants={fadeUp}
              className="text-sm sm:text-[15px] text-slate-500 leading-relaxed max-w-[420px]"
            >
              Search any public company. Get an institutional-grade analysis -
              financials, risks, valuation - without the jargon, the paywall, or
              the wait.
            </motion.p>

            {/* Search */}
            <motion.div
              custom={3}
              variants={fadeUp}
              className="w-full max-w-[480px]"
            >
              <TickerInput />
            </motion.div>

            {/* Quick tickers */}
            <motion.div
              custom={4}
              variants={fadeUp}
              className="flex items-center gap-3 text-xs text-slate-700"
            >
              <span className="font-mono">Try</span>
              {["AAPL", "NVDA", "MSFT", "GOOGL"].map((t) => (
                <button
                  key={t}
                  onClick={() => router.push(`/summary/${t}`)}
                  className="font-mono font-bold text-slate-500 hover:text-sky-400 transition-colors"
                >
                  {t}
                </button>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT - 4 demo stock cards in staggered 2-col grid */}
          <div className="hidden lg:grid grid-cols-2 gap-2.5 relative max-w-[430px] justify-self-end">
            {/* Left column (larger cards) */}
            <div className="flex flex-col gap-2.5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <CardNVDA />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <CardGOOGL />
              </motion.div>
            </div>

            {/* Right column - offset down */}
            <div className="flex flex-col gap-2.5 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <CardMETA />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.75,
                  ease: [0.22, 1, 0.36, 1],
                }}
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
                background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
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
                Side-by-side AI-powered analysis across fundamentals, valuation,
                and market outlook. Compare up to three companies with
                interactive charts.
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
