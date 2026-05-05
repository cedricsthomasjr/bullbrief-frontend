"use client";

import { useEffect, useMemo, useState } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { Activity, ArrowUpRight, Layers, Loader2, TrendingUp } from "lucide-react";
import DataSourceNote from "@/app/components/DataSourceNote";

export type RevenueSegment = {
  name: string;
  color: string;
};

export type RevenueYearEntry = {
  year: number;
  total: number;
  breakdown: Record<string, number>;
};

export type RevenueBreakdownData = {
  ticker: string;
  company_name: string;
  concept: string;
  concept_label: string;
  dimension?: string | null;
  source_name?: string;
  segments: RevenueSegment[];
  years: RevenueYearEntry[];
  source_url: string;
  filing_url?: string | null;
  has_segments: boolean;
};

type Props = {
  data: RevenueBreakdownData | null;
  loading?: boolean;
  error?: string | null;
  onOpenDeepDive?: () => void;
};

// Cohesive blue → indigo → violet → emerald palette (no rainbow)
const PALETTE = [
  { base: "#38bdf8", light: "#7dd3fc", deep: "#0284c7" },
  { base: "#818cf8", light: "#a5b4fc", deep: "#4f46e5" },
  { base: "#a78bfa", light: "#c4b5fd", deep: "#7c3aed" },
  { base: "#06b6d4", light: "#67e8f9", deep: "#0891b2" },
  { base: "#6366f1", light: "#a5b4fc", deep: "#4338ca" },
  { base: "#c084fc", light: "#d8b4fe", deep: "#9333ea" },
  { base: "#10b981", light: "#6ee7b7", deep: "#047857" },
  { base: "#0ea5e9", light: "#7dd3fc", deep: "#0369a1" },
  { base: "#94a3b8", light: "#cbd5e1", deep: "#475569" },
  { base: "#d946ef", light: "#f0abfc", deep: "#a21caf" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatCurrencyCompact(value: number): string {
  if (!Number.isFinite(value)) return "N/A";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(abs >= 1e10 ? 1 : 2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(abs >= 1e7 ? 0 : 1)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(0)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

export function formatPercent(value: number, digits = 0): string {
  if (!Number.isFinite(value)) return "N/A";
  return `${value >= 0 ? "" : ""}${value.toFixed(digits)}%`;
}

function isFmpSource(data: RevenueBreakdownData): boolean {
  return data.source_name?.toLowerCase().includes("fmp") ?? false;
}

function stackedRevenueLabel(data: RevenueBreakdownData): string {
  if (isFmpSource(data)) {
    return data.has_segments ? "FMP product revenue - stacked" : "FMP total revenue";
  }
  return data.has_segments ? "SEC segment revenue - stacked" : "SEC total revenue";
}

function reportedLineLabel(data: RevenueBreakdownData): string {
  return isFmpSource(data) ? "FMP reported revenue line" : "SEC reported segment";
}

export function calculateSegmentShare(value: number, total: number): number {
  if (!total || !Number.isFinite(value)) return 0;
  return (value / total) * 100;
}

type EnrichedSegment = {
  id: string;
  name: string;
  color: { base: string; light: string; deep: string };
  value: number;
  share: number;
  yoy: number | null;
  prev: number | null;
};

export function getLargestSegment(segments: EnrichedSegment[]): EnrichedSegment | null {
  if (segments.length === 0) return null;
  return segments.reduce((a, b) => (a.value >= b.value ? a : b));
}

export function getFastestGrowingSegment(segments: EnrichedSegment[]): EnrichedSegment | null {
  const candidates = segments.filter((s) => s.yoy !== null && s.value > 0);
  if (candidates.length === 0) return null;
  return candidates.reduce((a, b) => ((a.yoy ?? -Infinity) >= (b.yoy ?? -Infinity) ? a : b));
}

export function generateBusinessEngineInsight(
  segments: EnrichedSegment[],
  companyName: string,
): string | null {
  if (segments.length === 0) return null;
  const largest = getLargestSegment(segments);
  if (!largest) return null;

  const single = segments.length === 1;
  if (single) {
    return `${companyName || "This company"} reports a single revenue line — the full top line moves with that one stream.`;
  }

  const fastest = getFastestGrowingSegment(segments);
  const concentration = largest.share;

  let opener: string;
  if (concentration >= 60) {
    opener = `Revenue is heavily concentrated in ${largest.name} (${largest.share.toFixed(0)}% of total)`;
  } else if (concentration >= 40) {
    opener = `${largest.name} leads the mix at ${largest.share.toFixed(0)}% of revenue`;
  } else {
    opener = `Revenue is spread across ${segments.length} segments, led by ${largest.name} at ${largest.share.toFixed(0)}%`;
  }

  if (fastest && fastest.id !== largest.id && (fastest.yoy ?? 0) > 10) {
    return `${opener}, while ${fastest.name} is accelerating (+${(fastest.yoy ?? 0).toFixed(0)}% YoY).`;
  }

  if (largest.yoy !== null) {
    const trend = largest.yoy >= 0 ? `growing ${largest.yoy.toFixed(0)}%` : `down ${Math.abs(largest.yoy).toFixed(0)}%`;
    return `${opener}, ${trend} year-over-year.`;
  }

  return `${opener}.`;
}

function describeSegmentRole(seg: EnrichedSegment, ranks: { largest: string | null; fastest: string | null }) {
  const lines: { label: string; body: string }[] = [];

  if (seg.id === ranks.largest) {
    lines.push({
      label: "Why it matters",
      body: "This is the company's main revenue engine. It carries the bulk of forward expectations baked into the stock.",
    });
  } else if (seg.id === ranks.fastest) {
    lines.push({
      label: "Why it matters",
      body: "Fastest-growing segment in the mix — investors track it as the next leg of the thesis.",
    });
  } else if (seg.share >= 15) {
    lines.push({
      label: "Why it matters",
      body: "A meaningful contributor that diversifies the top line and softens single-segment risk.",
    });
  } else {
    lines.push({
      label: "Why it matters",
      body: "A smaller revenue line — useful for optionality, but not a primary mover for the stock today.",
    });
  }

  if (seg.yoy !== null) {
    if (seg.yoy >= 25) {
      lines.push({
        label: "Investor watchpoint",
        body: `Strong ${seg.yoy.toFixed(0)}% YoY growth — watch for sustained demand and pricing durability.`,
      });
    } else if (seg.yoy >= 5) {
      lines.push({
        label: "Investor watchpoint",
        body: `Steady ${seg.yoy.toFixed(0)}% growth — the question is whether it can re-accelerate.`,
      });
    } else if (seg.yoy >= -5) {
      lines.push({
        label: "Investor watchpoint",
        body: "Roughly flat — neither a tailwind nor a meaningful drag right now.",
      });
    } else {
      lines.push({
        label: "Investor watchpoint",
        body: `Declined ${Math.abs(seg.yoy).toFixed(0)}% YoY — investors want to know whether it's cyclical or structural.`,
      });
    }
  } else {
    lines.push({
      label: "Investor watchpoint",
      body: "Prior-year comparison not available in SEC filings yet.",
    });
  }

  if (seg.id === ranks.largest && seg.share >= 50) {
    lines.push({
      label: "Risk if it slows",
      body: "Concentration risk — any deceleration here could compress the multiple before other segments can offset it.",
    });
  } else if (seg.id === ranks.fastest) {
    lines.push({
      label: "Risk if it slows",
      body: "If acceleration stalls, narrative-driven multiple expansion would unwind.",
    });
  } else {
    lines.push({
      label: "Risk if it slows",
      body: "Limited single-segment risk — the stock is unlikely to hinge on this line alone.",
    });
  }

  return lines;
}


// ─── Component ────────────────────────────────────────────────────────────────

export default function BusinessEngineCylinder({ data, loading, error, onOpenDeepDive }: Props) {
  const enriched = useMemo<EnrichedSegment[]>(() => {
    if (!data || data.years.length === 0) return [];
    const latest = data.years[data.years.length - 1];
    const prev = data.years.length > 1 ? data.years[data.years.length - 2] : null;
    const total = latest.total || Object.values(latest.breakdown).reduce((a, b) => a + b, 0);
    if (!total) return [];

    const segments = data.segments
      .map((seg, idx) => {
        const value = latest.breakdown[seg.name] ?? 0;
        if (value <= 0) return null;
        const prevValue = prev ? prev.breakdown[seg.name] ?? 0 : 0;
        const yoy = prev && prevValue > 0 ? ((value - prevValue) / prevValue) * 100 : null;
        const share = calculateSegmentShare(value, total);
        return {
          id: seg.name,
          name: seg.name,
          color: PALETTE[idx % PALETTE.length],
          value,
          share,
          yoy,
          prev: prev ? prevValue : null,
        };
      })
      .filter((s): s is EnrichedSegment => s !== null);

    return segments.sort((a, b) => b.value - a.value);
  }, [data]);

  const total = useMemo(
    () => enriched.reduce((sum, s) => sum + s.value, 0),
    [enriched],
  );

  const ranks = useMemo(() => {
    const largest = getLargestSegment(enriched);
    const fastest = getFastestGrowingSegment(enriched);
    return {
      largest: largest?.id ?? null,
      fastest: fastest?.id ?? null,
    };
  }, [enriched]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [lockedId, setLockedId] = useState<string | null>(null);

  useEffect(() => {
    if (lockedId && !enriched.some((s) => s.id === lockedId)) setLockedId(null);
  }, [enriched, lockedId]);

  const displayId = lockedId ?? hoveredId ?? ranks.largest;
  const displaySeg = enriched.find((s) => s.id === displayId) ?? null;

  // ── Render states ────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="bb-card p-4 flex items-center gap-3">
        <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
        <p className="text-sm text-slate-500">Loading business engine...</p>
      </div>
    );
  }

  if (error || !data || enriched.length === 0) {
    return (
      <div className="bb-card p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-500" />
          <p className="text-sm font-bold text-blue-50">Business Engine</p>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Revenue segment data is not available for this company yet.
        </p>
      </div>
    );
  }

  const insight = generateBusinessEngineInsight(enriched, data.company_name);
  const largestSeg = enriched.find((s) => s.id === ranks.largest);
  const fastestSeg = enriched.find((s) => s.id === ranks.fastest);
  const concentration = largestSeg?.share ?? 0;

  // ── Cylinder ─────────────────────────────────────────────────────────────────

  return (
    <div className="bb-card p-3 space-y-4" style={{ borderColor: "rgba(56,189,248,0.14)" }}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.25)" }}
          >
            <Layers className="w-4 h-4 text-indigo-300" />
          </span>
          <div>
            <p className="text-sm font-bold text-blue-50">Business Engine</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-600">
              {stackedRevenueLabel(data)}
            </p>
          </div>
        </div>
        {onOpenDeepDive && (
          <button
            onClick={onOpenDeepDive}
            className="self-start text-[10px] font-semibold uppercase tracking-widest px-3 py-2 rounded-lg transition hover:-translate-y-0.5"
            style={{
              color: "#38bdf8",
              backgroundColor: "rgba(56,189,248,0.07)",
              border: "1px solid rgba(56,189,248,0.18)",
            }}
          >
            Year-over-year history
            <ArrowUpRight className="inline-block w-3 h-3 ml-1" />
          </button>
        )}
      </div>

      {insight && (
        <p className="text-xs leading-relaxed text-slate-400">
          <span className="text-slate-500">Insight: </span>
          {insight}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5">
        {/* Donut chart */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
            <PieChart width={220} height={220}>
              <Pie
                data={enriched}
                cx={110}
                cy={110}
                innerRadius={68}
                outerRadius={104}
                paddingAngle={enriched.length > 1 ? 2 : 0}
                dataKey="value"
                onMouseEnter={(_, index) => setHoveredId(enriched[index].id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={(_, index) => setLockedId((cur) => (cur === enriched[index].id ? null : enriched[index].id))}
                stroke="none"
              >
                {enriched.map((seg) => {
                  const isActive = seg.id === displayId;
                  const isDimmed = displayId !== null && !isActive && (hoveredId !== null || lockedId !== null);
                  return (
                    <Cell
                      key={seg.id}
                      fill={seg.color.base}
                      fillOpacity={isDimmed ? 0.2 : isActive ? 1 : 0.82}
                      stroke={isActive ? seg.color.light : "none"}
                      strokeWidth={isActive ? 2 : 0}
                      style={{ cursor: "pointer", outline: "none" }}
                    />
                  );
                })}
              </Pie>
            </PieChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-base font-bold tabular-nums text-blue-50">{formatCurrencyCompact(total)}</p>
              <p className="text-[9px] uppercase tracking-widest text-slate-500 mt-0.5">
                FY{data.years[data.years.length - 1]?.year}
              </p>
            </div>
          </div>
        </div>

        {/* Detail panel */}
        <div className="space-y-3">
          {/* Legend / segment selector */}
          <div className="flex flex-wrap gap-1.5">
            {enriched.map((seg) => {
              const isActive = seg.id === displayId;
              return (
                <button
                  key={seg.id}
                  type="button"
                  onClick={() => setLockedId((cur) => (cur === seg.id ? null : seg.id))}
                  onMouseEnter={() => setHoveredId(seg.id)}
                  onMouseLeave={() => setHoveredId((cur) => (cur === seg.id ? null : cur))}
                  className="group flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium transition-all"
                  style={{
                    color: isActive ? "#eff6ff" : "#94a3b8",
                    backgroundColor: isActive ? `${seg.color.base}22` : "rgba(15,32,64,0.42)",
                    border: `1px solid ${isActive ? `${seg.color.base}66` : "rgba(56,189,248,0.08)"}`,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: seg.color.base }}
                  />
                  <span className="truncate max-w-[140px]">{seg.name}</span>
                  <span className="tabular-nums text-slate-500 ml-1">{seg.share.toFixed(0)}%</span>
                </button>
              );
            })}
          </div>

          {displaySeg && (
            <SegmentDetail
              segment={displaySeg}
              ranks={ranks}
              sourceLabel={reportedLineLabel(data)}
            />
          )}
        </div>
      </div>

      {/* Mini key-metrics row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <MiniMetric
          label="Largest segment"
          value={largestSeg?.name ?? "—"}
          accent={largestSeg?.color.base ?? "#38bdf8"}
          subtle={largestSeg ? `${largestSeg.share.toFixed(0)}% · ${formatCurrencyCompact(largestSeg.value)}` : undefined}
          icon={<Layers className="w-3.5 h-3.5" />}
        />
        <MiniMetric
          label="Fastest-growing"
          value={fastestSeg?.name ?? "—"}
          accent={fastestSeg?.color.base ?? "#10b981"}
          subtle={
            fastestSeg && fastestSeg.yoy !== null
              ? `${fastestSeg.yoy >= 0 ? "+" : ""}${fastestSeg.yoy.toFixed(0)}% YoY`
              : "YoY data unavailable"
          }
          icon={<TrendingUp className="w-3.5 h-3.5" />}
        />
        <MiniMetric
          label="Concentration risk"
          value={concentrationLabel(concentration)}
          accent={concentrationAccent(concentration)}
          subtle={`Top segment: ${concentration.toFixed(0)}% of revenue`}
          icon={<Activity className="w-3.5 h-3.5" />}
        />
      </div>

      <DataSourceNote
        label={data.source_name ?? "SEC EDGAR Company Facts XBRL API"}
        href={data.source_url}
      />
    </div>
  );
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function SegmentDetail({
  segment,
  ranks,
  sourceLabel,
}: {
  segment: EnrichedSegment;
  ranks: { largest: string | null; fastest: string | null };
  sourceLabel: string;
}) {
  const lines = describeSegmentRole(segment, ranks);

  return (
    <div
      className="rounded-xl p-3 space-y-3"
      style={{
        backgroundColor: `${segment.color.base}10`,
        border: `1px solid ${segment.color.base}33`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: segment.color.base }} />
            <p className="text-sm font-bold text-blue-50 truncate">{segment.name}</p>
          </div>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-600">
            {sourceLabel}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-base font-bold tabular-nums" style={{ color: segment.color.light }}>
            {formatCurrencyCompact(segment.value)}
          </p>
          <p className="text-[10px] text-slate-500 tabular-nums">
            {segment.share.toFixed(1)}% of revenue
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <DetailStat label="Share" value={`${segment.share.toFixed(1)}%`} />
        <DetailStat
          label="YoY"
          value={
            segment.yoy === null
              ? "N/A"
              : `${segment.yoy >= 0 ? "+" : ""}${segment.yoy.toFixed(1)}%`
          }
          tone={segment.yoy === null ? "neutral" : segment.yoy >= 0 ? "up" : "down"}
        />
        <DetailStat
          label="Prior FY"
          value={segment.prev !== null ? formatCurrencyCompact(segment.prev) : "N/A"}
        />
      </div>

      <div className="space-y-2">
        {lines.map((line) => (
          <div key={line.label} className="space-y-0.5">
            <p
              className="text-[9px] font-bold uppercase tracking-widest"
              style={{ color: segment.color.light }}
            >
              {line.label}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">{line.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailStat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "up" | "down" | "neutral";
}) {
  const toneColor = tone === "up" ? "#34d399" : tone === "down" ? "#fb7185" : "#eff6ff";
  return (
    <div
      className="rounded-md px-2 py-1.5"
      style={{ backgroundColor: "rgba(8,18,36,0.6)", border: "1px solid rgba(56,189,248,0.08)" }}
    >
      <p className="text-[9px] uppercase tracking-widest text-slate-600">{label}</p>
      <p className="mt-0.5 text-xs font-bold tabular-nums" style={{ color: toneColor }}>
        {value}
      </p>
    </div>
  );
}

function MiniMetric({
  label,
  value,
  subtle,
  accent,
  icon,
}: {
  label: string;
  value: string;
  subtle?: string;
  accent: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="rounded-lg p-2.5 transition-all hover:-translate-y-0.5"
      style={{
        backgroundColor: `${accent}10`,
        border: `1px solid ${accent}33`,
      }}
    >
      <div className="flex items-center gap-1.5" style={{ color: accent }}>
        {icon}
        <p className="text-[9px] font-bold uppercase tracking-widest">{label}</p>
      </div>
      <p className="mt-1 text-xs font-bold text-blue-50 truncate">{value}</p>
      {subtle && (
        <p className="text-[10px] text-slate-500 tabular-nums truncate">{subtle}</p>
      )}
    </div>
  );
}

function concentrationLabel(pct: number): string {
  if (pct >= 70) return "Very high";
  if (pct >= 50) return "High";
  if (pct >= 35) return "Moderate";
  return "Diversified";
}

function concentrationAccent(pct: number): string {
  if (pct >= 70) return "#fb7185";
  if (pct >= 50) return "#f59e0b";
  if (pct >= 35) return "#38bdf8";
  return "#34d399";
}

export type { Props as BusinessEngineCylinderProps };
