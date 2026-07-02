"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Brain,
  BriefcaseBusiness,
  ChevronDown,
  CircleHelp,
  Gauge,
  Landmark,
  LineChart,
  Scale,
  Shield,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { cachedFetch } from "@/app/lib/summaryCache";
import LoadingScreen from "@/app/components/LoadingScreen";
import DataSourceNote from "@/app/components/DataSourceNote";
import { useSideNavSections } from "@/app/hooks/useSideNavSections";
import { TONE, type Tone } from "@/app/lib/tone";

type OverallSignal = "Bullish" | "Neutral" | "Bearish";
type Confidence = "Low" | "Medium" | "High";
type Grade =
  | "Strong"
  | "Improving"
  | "Mixed"
  | "Weak"
  | "Concerning"
  | "Cheap"
  | "Reasonable"
  | "Expensive"
  | "Low"
  | "Moderate"
  | "High";

type ScorecardItem = {
  grade: Grade | string;
  rationale: string;
};

type CompetitivePeer = {
  company: string;
  ticker: string;
  positioning: string;
  growth: string;
  margins: string;
  valuation: string;
  main_strength: string;
  main_weakness: string;
  moat: string;
};

type StockDriver = {
  driver: string;
  why_it_matters: string;
  evidence: string;
  trend: string;
};

type LegacyAnalystReport = {
  rating?: string;
  confidence?: string | number;
  executive_summary?: string;
  scores?: Partial<Record<LegacyScoreKey, number>>;
  score_rationale?: Partial<Record<LegacyScoreKey, string>>;
  bull_thesis?: string[];
  bear_thesis?: string[];
  catalysts?: { title?: string; description?: string; timeline?: string }[];
  risks?: { title?: string; description?: string; severity?: string }[];
};

type LegacyScoreKey =
  | "valuation"
  | "growth"
  | "profitability"
  | "financial_health"
  | "competitive_position"
  | "momentum";

type AnalystReport = {
  company_name: string;
  ticker: string;
  sector: string;
  industry: string;
  current_price?: number | null;
  market_cap?: number | null;
  wk52_low?: number | null;
  wk52_high?: number | null;
  overall_signal: OverallSignal;
  signal_label: "Bullish Setup" | "Watch / Hold Zone" | "Risk-Off / Bearish Setup" | string;
  confidence: Confidence;
  summary: string;
  why_signal_appears: string[];
  what_could_change_signal: string[];
  key_upside_drivers: string[];
  key_downside_risks: string[];
  scorecard: Record<string, ScorecardItem>;
  competitive_analysis: {
    summary: string;
    peers: CompetitivePeer[];
    where_company_wins: string[];
    where_competitors_may_be_stronger: string[];
  };
  bull_case: string[];
  bear_case: string[];
  stock_drivers: StockDriver[];
  uncertainty: string[];
  disclaimer: string;
  source?: {
    market_data?: string;
    segment_data?: string | null;
    ai?: string;
  };
};

type DeepDiveTab = "bullBear" | "competition" | "drivers" | "change" | "risks";

const SIGNAL_TONE: Record<OverallSignal, Tone> = {
  Bullish: "emerald",
  Neutral: "amber",
  Bearish: "rose",
};

const SIGNAL_ICON: Record<OverallSignal, React.ReactNode> = {
  Bullish: <TrendingUp className="w-4 h-4" />,
  Neutral: <Scale className="w-4 h-4" />,
  Bearish: <TrendingDown className="w-4 h-4" />,
};

const CONFIDENCE_TONE: Record<Confidence, Tone> = {
  Low: "slate",
  Medium: "sky",
  High: "emerald",
};

const CONFIDENCE_WIDTH: Record<Confidence, string> = {
  Low: "34%",
  Medium: "66%",
  High: "100%",
};

const GRADE_TONE: Record<string, Tone> = {
  Strong: "emerald",
  Improving: "sky",
  Mixed: "amber",
  Weak: "rose",
  Concerning: "rose",
  Cheap: "emerald",
  Reasonable: "sky",
  Expensive: "amber",
  Low: "emerald",
  Moderate: "amber",
  High: "rose",
};

const GRADE_WIDTH: Record<string, string> = {
  Strong: "92%",
  Improving: "74%",
  Mixed: "54%",
  Weak: "34%",
  Concerning: "22%",
  Cheap: "84%",
  Reasonable: "66%",
  Expensive: "42%",
  Low: "78%",
  Moderate: "55%",
  High: "30%",
};

const SCORECARD_META: Record<string, { label: string; icon: React.ReactNode }> = {
  revenue_growth: { label: "Revenue Growth", icon: <TrendingUp className="w-4 h-4" /> },
  earnings_growth: { label: "Earnings Growth", icon: <LineChart className="w-4 h-4" /> },
  margin_trend: { label: "Margin Trend", icon: <BarChart3 className="w-4 h-4" /> },
  valuation: { label: "Valuation", icon: <Target className="w-4 h-4" /> },
  balance_sheet: { label: "Balance Sheet", icon: <Landmark className="w-4 h-4" /> },
  free_cash_flow: { label: "Free Cash Flow", icon: <WalletCards className="w-4 h-4" /> },
  analyst_sentiment: { label: "Analyst Sentiment", icon: <Brain className="w-4 h-4" /> },
  price_momentum: { label: "Price Momentum", icon: <Activity className="w-4 h-4" /> },
  competitive_position: { label: "Competitive Position", icon: <Shield className="w-4 h-4" /> },
  business_segment_strength: { label: "Segment Strength", icon: <BriefcaseBusiness className="w-4 h-4" /> },
  risk_level: { label: "Risk Level", icon: <AlertTriangle className="w-4 h-4" /> },
};

const SCORECARD_ORDER = [
  "revenue_growth",
  "earnings_growth",
  "margin_trend",
  "valuation",
  "balance_sheet",
  "free_cash_flow",
  "analyst_sentiment",
  "price_momentum",
  "competitive_position",
  "business_segment_strength",
  "risk_level",
];

const TABS: { key: DeepDiveTab; label: string; icon: React.ReactNode }[] = [
  { key: "bullBear", label: "Bull vs Bear", icon: <Scale className="w-4 h-4" /> },
  { key: "competition", label: "Competition", icon: <Shield className="w-4 h-4" /> },
  { key: "drivers", label: "Stock Drivers", icon: <Gauge className="w-4 h-4" /> },
  { key: "change", label: "Signal Changes", icon: <Sparkles className="w-4 h-4" /> },
  { key: "risks", label: "Risks", icon: <AlertTriangle className="w-4 h-4" /> },
];

function normalizeOverallSignal(value?: string | null): OverallSignal {
  const normalized = String(value ?? "").trim().toLowerCase();

  if (
    normalized.includes("bear") ||
    normalized.includes("risk-off") ||
    normalized.includes("risk off") ||
    normalized.includes("sell")
  ) {
    return "Bearish";
  }

  if (normalized.includes("bull") || normalized.includes("buy")) {
    return "Bullish";
  }

  return "Neutral";
}

function signalFallbackLabel(signal: OverallSignal) {
  if (signal === "Bullish") return "Bullish Setup";
  if (signal === "Bearish") return "Risk-Off / Bearish Setup";
  return "Watch / Hold Zone";
}

function normalizeConfidence(value?: string | number | null): Confidence {
  if (typeof value === "number") {
    if (value >= 75) return "High";
    if (value >= 45) return "Medium";
    return "Low";
  }

  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "high") return "High";
  if (normalized === "medium") return "Medium";
  return "Low";
}

function legacyRating(report: Partial<AnalystReport> | null) {
  return (report as unknown as LegacyAnalystReport | null)?.rating;
}

function legacySummary(report: Partial<AnalystReport>) {
  return (report as unknown as LegacyAnalystReport).executive_summary;
}

function safeStringList(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

function legacyGrade(score?: number, kind: "general" | "valuation" | "risk" = "general") {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return kind === "risk" ? "Moderate" : "Mixed";
  }

  if (kind === "risk") {
    if (score >= 7) return "Low";
    if (score >= 4) return "Moderate";
    return "High";
  }

  if (kind === "valuation") {
    if (score >= 7) return "Reasonable";
    if (score >= 4) return "Expensive";
    return "Expensive";
  }

  if (score >= 8) return "Strong";
  if (score >= 6) return "Improving";
  if (score >= 4) return "Mixed";
  if (score >= 2) return "Weak";
  return "Concerning";
}

function cleanSummary(summary: string | undefined, companyName: string, signal: OverallSignal) {
  if (!summary?.trim()) {
    return `${companyName} screens as a ${signal.toLowerCase()} market signal based on available fundamentals, valuation, momentum, and risk inputs. Missing fields are treated as uncertainty rather than filled in.`;
  }

  return summary
    .replace(/\bcompelling investment opportunity\b/gi, `${signal.toLowerCase()} market-signal setup`)
    .replace(/\binvestment case\b/gi, "market-signal setup")
    .replace(/\binvestment thesis\b/gi, "market-signal setup")
    .replace(/\binvestors should remain cautious of\b/gi, "key uncertainties include")
    .replace(/\binvestors should remain cautious about\b/gi, "key uncertainties include")
    .replace(/\brecommendation\b/gi, "research snapshot");
}

function legacyRiskItems(raw: LegacyAnalystReport) {
  return (raw.risks ?? [])
    .map((risk) => [risk.title, risk.description].filter(Boolean).join(": "))
    .filter(Boolean);
}

function legacyCatalystItems(raw: LegacyAnalystReport) {
  return (raw.catalysts ?? [])
    .map((catalyst) => [catalyst.title, catalyst.description].filter(Boolean).join(": "))
    .filter(Boolean);
}

function scorecardFromLegacy(raw: LegacyAnalystReport): Record<string, ScorecardItem> {
  const scores = raw.scores ?? {};
  const rationales = raw.score_rationale ?? {};

  return {
    revenue_growth: {
      grade: legacyGrade(scores.growth),
      rationale:
        rationales.growth ||
        "Growth was translated from available analyst inputs; the response did not split revenue and earnings growth.",
    },
    earnings_growth: {
      grade: legacyGrade(scores.growth),
      rationale: "Separate earnings growth detail was not returned, so this uses the available growth input as context.",
    },
    margin_trend: {
      grade: legacyGrade(scores.profitability),
      rationale:
        rationales.profitability ||
        "Profitability inputs were used as the closest available margin signal.",
    },
    valuation: {
      grade: legacyGrade(scores.valuation, "valuation"),
      rationale:
        rationales.valuation ||
        "Valuation was translated from the available analyst valuation input; no raw score is shown.",
    },
    balance_sheet: {
      grade: legacyGrade(scores.financial_health),
      rationale:
        rationales.financial_health ||
        "Financial health inputs were used as the balance sheet signal.",
    },
    free_cash_flow: {
      grade: legacyGrade(scores.financial_health),
      rationale: "Free cash flow detail was not separated, so financial health is used as a proxy signal.",
    },
    analyst_sentiment: {
      grade: "Mixed",
      rationale: "Analyst sentiment detail was not returned in this response.",
    },
    price_momentum: {
      grade: legacyGrade(scores.momentum),
      rationale:
        rationales.momentum ||
        "Momentum was translated from the available price-action input.",
    },
    competitive_position: {
      grade: legacyGrade(scores.competitive_position),
      rationale:
        rationales.competitive_position ||
        "Competitive positioning was translated from the available moat input.",
    },
    business_segment_strength: {
      grade: "Mixed",
      rationale: "Business segment detail was not returned in this response.",
    },
    risk_level: {
      grade: (raw.risks ?? []).some((risk) => risk.severity?.toLowerCase() === "high")
        ? "High"
        : "Moderate",
      rationale: "Risk level was translated from the available risk-factor list.",
    },
  };
}

function coerceAnalystReport(rawReport: Partial<AnalystReport> & LegacyAnalystReport, routeTicker: string): AnalystReport {
  const signal = normalizeOverallSignal(rawReport.overall_signal ?? rawReport.rating);
  const confidence = normalizeConfidence(rawReport.confidence);
  const companyName = rawReport.company_name || routeTicker.toUpperCase();
  const bullCase = safeStringList(rawReport.bull_case).length
    ? safeStringList(rawReport.bull_case)
    : safeStringList(rawReport.bull_thesis);
  const bearCase = safeStringList(rawReport.bear_case).length
    ? safeStringList(rawReport.bear_case)
    : safeStringList(rawReport.bear_thesis);
  const catalysts = legacyCatalystItems(rawReport);
  const risks = legacyRiskItems(rawReport);
  const scorecard =
    rawReport.scorecard && Object.keys(rawReport.scorecard).length > 0
      ? rawReport.scorecard
      : scorecardFromLegacy(rawReport);
  const whySignalAppears = safeStringList(rawReport.why_signal_appears);

  return {
    company_name: companyName,
    ticker: rawReport.ticker || routeTicker.toUpperCase(),
    sector: rawReport.sector || "Sector unavailable",
    industry: rawReport.industry || "Industry unavailable",
    current_price: rawReport.current_price ?? null,
    market_cap: rawReport.market_cap ?? null,
    wk52_low: rawReport.wk52_low ?? null,
    wk52_high: rawReport.wk52_high ?? null,
    overall_signal: signal,
    signal_label: rawReport.signal_label || signalFallbackLabel(signal),
    confidence,
    summary: cleanSummary(rawReport.summary || rawReport.executive_summary, companyName, signal),
    why_signal_appears:
      whySignalAppears.length > 0
        ? whySignalAppears
        : Object.values(scorecard)
            .map((item) => item.rationale)
            .filter(Boolean)
            .slice(0, 3),
    what_could_change_signal:
      safeStringList(rawReport.what_could_change_signal).length > 0
        ? safeStringList(rawReport.what_could_change_signal)
        : [...catalysts, ...risks].slice(0, 4),
    key_upside_drivers:
      safeStringList(rawReport.key_upside_drivers).length > 0
        ? safeStringList(rawReport.key_upside_drivers)
        : (bullCase.length ? bullCase : catalysts).slice(0, 4),
    key_downside_risks:
      safeStringList(rawReport.key_downside_risks).length > 0
        ? safeStringList(rawReport.key_downside_risks)
        : (risks.length ? risks : bearCase).slice(0, 4),
    scorecard,
    competitive_analysis: {
      summary:
        rawReport.competitive_analysis?.summary ||
        "Competitive peer detail was not returned in this response.",
      peers: rawReport.competitive_analysis?.peers ?? [],
      where_company_wins: rawReport.competitive_analysis?.where_company_wins ?? [],
      where_competitors_may_be_stronger:
        rawReport.competitive_analysis?.where_competitors_may_be_stronger ?? [],
    },
    bull_case: bullCase,
    bear_case: bearCase,
    stock_drivers:
      rawReport.stock_drivers?.length
        ? rawReport.stock_drivers
        : (rawReport.catalysts ?? []).slice(0, 4).map((catalyst) => ({
            driver: catalyst.title || "Potential catalyst",
            why_it_matters: catalyst.description || "Catalyst detail was not returned.",
            evidence: catalyst.timeline ? `${catalyst.timeline} catalyst` : "Legacy analyst catalyst",
            trend: "monitoring",
          })),
    uncertainty:
      safeStringList(rawReport.uncertainty).length > 0
        ? safeStringList(rawReport.uncertainty)
        : [
            "Some detailed fields were not returned by the analyst data source.",
            "Unavailable peer, segment, or sentiment fields are shown as missing rather than estimated.",
          ],
    disclaimer:
      rawReport.disclaimer ||
      "This is an AI-generated research summary for educational purposes only. It is not financial advice.",
    source: rawReport.source,
  };
}

function fmtMoney(value?: number | null) {
  if (value == null) return "N/A";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  return `${sign}$${abs.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function fmtPrice(value?: number | null) {
  if (value == null) return "N/A";
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function normalizeList(items?: string[], fallback = "Data unavailable.") {
  return Array.isArray(items) && items.length > 0 ? items : [fallback];
}

function gradeStyle(grade: string) {
  return { tone: GRADE_TONE[grade] ?? "slate", width: GRADE_WIDTH[grade] ?? "50%" };
}

function PanelShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="space-y-4"
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ icon, title, kicker }: { icon: React.ReactNode; title: string; kicker?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-sky-400/10 px-3 py-3">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sky-400 shrink-0">{icon}</span>
        <p className="text-sm font-bold text-blue-50 truncate">{title}</p>
      </div>
      {kicker && <p className="text-xs uppercase tracking-wide text-slate-600 shrink-0">{kicker}</p>}
    </div>
  );
}

function SignalBadge({
  signal,
  label,
}: {
  signal?: string | null;
  label?: string | null;
}) {
  const normalizedSignal = normalizeOverallSignal(signal);
  const tone = SIGNAL_TONE[normalizedSignal];
  const displayLabel = label?.trim() || signalFallbackLabel(normalizedSignal);

  return (
    <span className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold uppercase tracking-wide ${TONE[tone].soft}`}>
      {SIGNAL_ICON[normalizedSignal]}
      {displayLabel}
    </span>
  );
}

function ScorecardTile({ itemKey, item }: { itemKey: string; item: ScorecardItem }) {
  const meta = SCORECARD_META[itemKey] ?? { label: itemKey.replaceAll("_", " "), icon: <CircleHelp className="w-4 h-4" /> };
  const { tone, width } = gradeStyle(item.grade);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bb-card-soft p-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className={TONE[tone].text}>{meta.icon}</span>
          <p className="truncate text-xs font-bold text-blue-50">{meta.label}</p>
        </div>
        <span className={`shrink-0 rounded-md border px-2 py-1 text-xs font-bold uppercase tracking-wide ${TONE[tone].soft}`}>
          {item.grade}
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-950/70">
        <motion.div
          className={`h-full rounded-full ${TONE[tone].bar}`}
          initial={{ width: 0 }}
          animate={{ width }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">{item.rationale || "Data unavailable."}</p>
    </motion.div>
  );
}

const BULLET_TONE: Record<"bull" | "bear" | "neutral", Tone> = {
  bull: "emerald",
  bear: "rose",
  neutral: "sky",
};

function BulletPanel({ title, tone, items }: { title: string; tone: "bull" | "bear" | "neutral"; items: string[] }) {
  const toneKey = BULLET_TONE[tone];
  return (
    <div className={`rounded-lg border p-3 ${TONE[toneKey].soft}`}>
      <p className={`mb-3 text-sm font-bold ${TONE[toneKey].text}`}>{title}</p>
      <div className="space-y-3">
        {normalizeList(items).map((item, idx) => (
          <div key={idx} className="flex gap-3">
            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${TONE[toneKey].soft}`}>
              {idx + 1}
            </span>
            <p className="text-xs leading-6 text-slate-400">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompactList({ items, tone = "sky" }: { items: string[]; tone?: Tone }) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {normalizeList(items).map((item, idx) => (
        <div key={idx} className="bb-card-soft px-3 py-2.5">
          <div className="flex gap-2">
            <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${TONE[tone].dot}`} />
            <p className="text-xs leading-5 text-slate-400">{item}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CompetitionTable({ report }: { report: AnalystReport }) {
  const peers = report.competitive_analysis?.peers ?? [];
  if (peers.length === 0) {
    return (
      <div className="bb-card-soft p-4">
        <p className="text-sm text-slate-500">Competitive peer data is unavailable for this ticker.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-sky-400/10">
      <table className="min-w-[980px] w-full text-left text-xs">
        <thead className="bg-[#0f2040]/70">
          <tr className="text-xs uppercase tracking-wide text-slate-600">
            <th className="px-3 py-3">Company</th>
            <th className="px-3 py-3">Ticker</th>
            <th className="px-3 py-3">Positioning</th>
            <th className="px-3 py-3">Growth</th>
            <th className="px-3 py-3">Margins</th>
            <th className="px-3 py-3">Valuation</th>
            <th className="px-3 py-3">Main Strength</th>
            <th className="px-3 py-3">Main Weakness</th>
          </tr>
        </thead>
        <tbody>
          {peers.map((peer, idx) => (
            <tr key={`${peer.ticker}-${idx}`} className="border-t border-sky-400/10">
              <td className="px-3 py-3 font-semibold text-blue-50">{peer.company || "N/A"}</td>
              <td className="px-3 py-3 font-mono text-sky-400">{peer.ticker || "N/A"}</td>
              <td className="px-3 py-3 text-slate-400">{peer.positioning || "N/A"}</td>
              <td className="px-3 py-3 text-slate-400">{peer.growth || "N/A"}</td>
              <td className="px-3 py-3 text-slate-400">{peer.margins || "N/A"}</td>
              <td className="px-3 py-3 text-slate-400">{peer.valuation || "N/A"}</td>
              <td className="px-3 py-3 text-slate-400">{peer.main_strength || "N/A"}</td>
              <td className="px-3 py-3 text-slate-400">{peer.main_weakness || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DriverGrid({ drivers }: { drivers: StockDriver[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {(drivers.length ? drivers : [{ driver: "Business drivers", why_it_matters: "Driver data is unavailable.", evidence: "N/A", trend: "unknown" }]).map((driver, idx) => (
        <div
          key={`${driver.driver}-${idx}`}
          className="bb-card-soft p-3"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-bold text-blue-50">{driver.driver}</p>
            <span className="rounded-md bg-slate-950/70 px-2 py-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              {driver.trend || "unknown"}
            </span>
          </div>
          <p className="mt-2 text-xs leading-6 text-slate-400">{driver.why_it_matters}</p>
          <p className="mt-3 text-xs uppercase tracking-wide text-slate-600">{driver.evidence || "N/A"}</p>
        </div>
      ))}
    </div>
  );
}

export default function AnalystReportPage() {
  const { ticker } = useParams() as { ticker: string };
  const [report, setReport] = useState<AnalystReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DeepDiveTab>("bullBear");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!ticker) return;
    setLoading(true);
    setError(null);
    setReport(null);
    cachedFetch<Partial<AnalystReport> & LegacyAnalystReport & { error?: string }>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/analyst/${encodeURIComponent(ticker)}?schema=market-signal-v4`
    )
      .then((json) => {
        if (json.error) {
          setError(json.error);
        } else {
          setReport(coerceAnalystReport(json, ticker));
        }
      })
      .catch(() => setError("Failed to generate AI research snapshot."))
      .finally(() => setLoading(false));
  }, [ticker]);

  const signal = normalizeOverallSignal(report?.overall_signal ?? legacyRating(report));
  const signalTone = SIGNAL_TONE[signal];

  useSideNavSections(
    [
      { id: "overview", label: "Overview" },
      { id: "scorecard", label: "Scorecard" },
      { id: "deep-dive", label: "Deep Dive" },
      { id: "competition", label: "Competition" },
      { id: "uncertainty", label: "Uncertainty" },
    ],
    TONE[signalTone].hex,
  );

  const scorecardItems = useMemo(() => {
    if (!report?.scorecard) return [];
    return SCORECARD_ORDER
      .filter((key) => report.scorecard[key])
      .map((key) => [key, report.scorecard[key]] as const);
  }, [report]);

  if (loading) return <LoadingScreen isLoading />;

  if (error || !report) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#060c1a]">
        <div className="bb-card-danger max-w-md p-5 text-center">
          <p className="text-sm font-semibold text-rose-400">AI research snapshot unavailable</p>
          <p className="mt-2 text-xs leading-6 text-slate-500">{error ?? "No report returned."}</p>
          <Link href={`/summary/${ticker}`} className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-400 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Summary
          </Link>
        </div>
      </main>
    );
  }

  const confidenceLevel = normalizeConfidence(report.confidence);
  const confidenceTone = CONFIDENCE_TONE[confidenceLevel];
  const confidenceWidth = CONFIDENCE_WIDTH[confidenceLevel];

  return (
    <main className="min-h-screen pt-[88px] bg-[#060c1a]">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href={`/summary/${ticker}`} className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-sky-400 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Summary
          </Link>
          <div className="inline-flex items-center gap-2 text-xs text-slate-700">
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI-generated research snapshot</span>
          </div>
        </div>

        <motion.section
          id="overview"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="scroll-mt-24"
        >
          <div className="bb-card overflow-hidden" style={{ borderColor: `${TONE[signalTone].hex}33` }}>
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.6fr]">
              <div className="p-4" style={{ background: `linear-gradient(135deg, ${TONE[signalTone].hex}1a, rgba(15,32,64,0.32))` }}>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{report.sector} / {report.industry}</p>
                <h1 className="mt-2 text-4xl font-bold tracking-tighter text-blue-50 sm:text-5xl">{report.company_name}</h1>
                <p className="mt-2 font-mono text-sm text-slate-500">{report.ticker} / {fmtMoney(report.market_cap)}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <SignalBadge signal={report.overall_signal ?? legacyRating(report)} label={report.signal_label} />
                  <span className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold uppercase tracking-wide ${TONE[confidenceTone].soft}`}>
                    <Gauge className="w-4 h-4" />
                    {confidenceLevel} Confidence
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-sky-400/10 bg-[#081224]/50 px-3 py-2">
                    <p className="text-xs uppercase tracking-wide text-slate-600">Current</p>
                    <p className="mt-1 text-sm font-bold tabular-nums text-blue-50">{fmtPrice(report.current_price)}</p>
                  </div>
                  <div className="rounded-lg border border-sky-400/10 bg-[#081224]/50 px-3 py-2">
                    <p className="text-xs uppercase tracking-wide text-slate-600">52W Range</p>
                    <p className="mt-1 text-sm font-bold tabular-nums text-blue-50">{fmtPrice(report.wk52_low)} - {fmtPrice(report.wk52_high)}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-sky-400">Market Signal Summary</p>
                  <p className="mt-3 text-sm leading-8 text-slate-300">
                    {report.summary || legacySummary(report) || "Research summary is unavailable."}
                  </p>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-slate-600">
                    <span>Signal Conviction</span>
                    <span className={TONE[confidenceTone].text}>{confidenceLevel}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-950/80">
                    <motion.div
                      className={`h-full rounded-full ${TONE[confidenceTone].bar}`}
                      initial={{ width: 0 }}
                      animate={{ width: confidenceWidth }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <CompactList items={report.why_signal_appears} tone={signalTone} />
                </div>

                <DataSourceNote
                  label={`${report.source?.market_data ?? "Yahoo Finance via yfinance"}; AI-generated research snapshot`}
                />
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          id="scorecard"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="bb-card scroll-mt-24 overflow-hidden"
        >
          <SectionTitle icon={<BarChart3 className="w-4 h-4" />} title="AI Scorecard" kicker="Category labels, no raw score" />
          <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3">
            {scorecardItems.map(([key, item]) => (
              <ScorecardTile key={key} itemKey={key} item={item} />
            ))}
          </div>
        </motion.section>

        <motion.section
          id="deep-dive"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="bb-card scroll-mt-24 overflow-hidden"
        >
          <SectionTitle icon={<Sparkles className="w-4 h-4" />} title="Deep Dive" />
          <div className="flex gap-2 overflow-x-auto border-b border-sky-400/10 p-3">
            {TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                    active
                      ? "border-sky-400/28 bg-sky-400/12 text-blue-50"
                      : "border-sky-400/8 bg-[#0f2040]/34 text-slate-500"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-3">
            <AnimatePresence mode="wait">
              {activeTab === "bullBear" && (
                <PanelShell key="bullBear">
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    <BulletPanel title="Bull Case" tone="bull" items={report.bull_case} />
                    <BulletPanel title="Bear Case" tone="bear" items={report.bear_case} />
                  </div>
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    <BulletPanel title="Key Upside Drivers" tone="bull" items={report.key_upside_drivers} />
                    <BulletPanel title="Key Downside Risks" tone="bear" items={report.key_downside_risks} />
                  </div>
                </PanelShell>
              )}

              {activeTab === "competition" && (
                <PanelShell key="competition">
                  <p className="text-sm leading-7 text-slate-400">{report.competitive_analysis?.summary || "Peer analysis is unavailable."}</p>
                  <CompetitionTable report={report} />
                  <div id="competition" className="grid grid-cols-1 gap-3 scroll-mt-24 lg:grid-cols-2">
                    <BulletPanel title="Where This Company Wins" tone="bull" items={report.competitive_analysis?.where_company_wins ?? []} />
                    <BulletPanel title="Where Competitors May Be Stronger" tone="neutral" items={report.competitive_analysis?.where_competitors_may_be_stronger ?? []} />
                  </div>
                </PanelShell>
              )}

              {activeTab === "drivers" && (
                <PanelShell key="drivers">
                  <DriverGrid drivers={report.stock_drivers ?? []} />
                </PanelShell>
              )}

              {activeTab === "change" && (
                <PanelShell key="change">
                  <CompactList items={report.what_could_change_signal} tone="violet" />
                </PanelShell>
              )}

              {activeTab === "risks" && (
                <PanelShell key="risks">
                  <CompactList items={report.key_downside_risks} tone="rose" />
                </PanelShell>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        <motion.section
          id="uncertainty"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
          className="bb-card scroll-mt-24 overflow-hidden"
        >
          <button
            type="button"
            onClick={() => setExpanded((current) => ({ ...current, uncertainty: !current.uncertainty }))}
            className={`flex w-full items-center justify-between gap-3 px-3 py-3 text-left ${expanded.uncertainty ? "border-b border-sky-400/10" : ""}`}
          >
            <div className="flex items-center gap-2">
              <CircleHelp className="w-4 h-4 text-sky-400" />
              <p className="text-sm font-bold text-blue-50">Uncertainty And Data Gaps</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-600 transition ${expanded.uncertainty ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence initial={false}>
            {expanded.uncertainty && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3">
                  <CompactList items={report.uncertainty} tone="slate" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        <div className="pb-10">
          <p className="mx-auto max-w-2xl text-center text-xs leading-6 text-slate-700">
            {report.disclaimer || "This is an AI-generated research summary for educational purposes only. It is not financial advice."}
          </p>
        </div>
      </div>
    </main>
  );
}
