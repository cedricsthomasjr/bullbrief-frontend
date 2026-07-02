"use client";

import DataSourceNote from "@/app/components/DataSourceNote";
import { TONE, type Tone } from "@/app/lib/tone";

type SWOTProps = { content: string };

const parseSWOTSection = (label: string, content: string): string[] => {
  const match = new RegExp(`\\*\\*${label}:\\*\\*[\\s\\n\\r]+([-\\s\\S]+?)(?=\\*\\*|$)`, "i").exec(content);
  if (!match) return [];
  return match[1]
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("-"))
    .map((l) => l.replace(/^-\s*/, ""));
};

const SWOT_TONE: Record<string, Tone> = {
  Strengths: "emerald",
  Weaknesses: "rose",
  Opportunities: "sky",
  Threats: "amber",
};

function SWOTSection({ title, points }: { title: keyof typeof SWOT_TONE; points: string[] }) {
  const tone = SWOT_TONE[title];
  return (
    <div className="bb-card p-3 space-y-3" style={{ borderColor: `${TONE[tone].hex}33` }}>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${TONE[tone].dot}`} />
        <h3 className={`text-xs font-semibold uppercase tracking-wide ${TONE[tone].text}`}>{title}</h3>
      </div>
      {points.length > 0 ? (
        <ul className="space-y-2">
          {points.map((p, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
              <span className={`shrink-0 mt-2 w-1 h-1 rounded-full opacity-60 ${TONE[tone].dot}`} />
              {p}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-700 text-xs">No data returned for this category.</p>
      )}
    </div>
  );
}

export default function SWOTCard({ content }: SWOTProps) {
  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <SWOTSection title="Strengths"     points={parseSWOTSection("Strengths", content)} />
        <SWOTSection title="Weaknesses"    points={parseSWOTSection("Weaknesses", content)} />
        <SWOTSection title="Opportunities" points={parseSWOTSection("Opportunities", content)} />
        <SWOTSection title="Threats"       points={parseSWOTSection("Threats", content)} />
      </div>
      <DataSourceNote label="Yahoo Finance via yfinance; BullBrief AI SWOT summary" />
    </div>
  );
}
