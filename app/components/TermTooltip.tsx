"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { GLOSSARY } from "@/app/lib/glossary";
import { TONE, type Tone } from "@/app/lib/tone";

interface TermTooltipProps {
  termId: string;
  tone?: Tone;
}

export default function TermTooltip({ termId, tone = "sky" }: TermTooltipProps) {
  const [visible, setVisible] = useState(false);
  const term = GLOSSARY.find((t) => t.id === termId);
  if (!term) return null;

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      style={{ zIndex: visible ? 50 : undefined }}
    >
      <button
        className={`ml-1 flex items-center transition-opacity ${TONE[tone].text} ${visible ? "opacity-90" : "opacity-30"}`}
        tabIndex={-1}
        aria-label={`Definition of ${term.name}`}
      >
        <HelpCircle className="w-3 h-3" />
      </button>

      {visible && (
        <div className="bb-card absolute top-full left-0 z-50 mt-1.5 w-60 p-3 text-left">
          <p className="text-blue-50 text-xs font-semibold mb-1 leading-tight">{term.name}</p>
          <p className="text-slate-500 text-[11px] leading-relaxed mb-2">{term.tagline}</p>
          <p className="text-slate-600 text-[11px] leading-relaxed mb-2.5 italic">{term.keyTakeaway}</p>
          <Link href={`/glossary#${term.id}`} className={`text-[11px] font-medium hover:underline ${TONE[tone].text}`}>
            Full definition →
          </Link>
        </div>
      )}
    </div>
  );
}
