"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, X, ChevronDown, ChevronUp } from "lucide-react";
import {
  GLOSSARY,
  CATEGORIES,
  CATEGORY_TONE,
  searchGlossary,
  type GlossaryCategory,
  type GlossaryTerm,
} from "@/app/lib/glossary";
import { TONE } from "@/app/lib/tone";

function TermCard({
  term,
  isExpanded,
  onToggle,
}: {
  term: GlossaryTerm;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const tone = TONE[CATEGORY_TONE[term.category]];

  return (
    <div
      id={term.id}
      className="bb-card bb-card-hover cursor-pointer"
      style={{ borderColor: isExpanded ? `${tone.hex}4d` : undefined }}
      onClick={onToggle}
    >
      {/* Always-visible header */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${tone.soft}`}>
            {term.category}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-700" />
          )}
        </div>

        <div className="flex items-baseline gap-2 mb-1.5">
          <h3 className="text-base font-bold text-blue-50">{term.name}</h3>
          {term.abbreviation && term.abbreviation !== term.name && (
            <span className="text-xs font-mono text-slate-600">
              {term.abbreviation}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500 leading-relaxed mb-3">
          {term.tagline}
        </p>

        {term.formula && (
          <div className="rounded-lg border border-sky-400/10 bg-sky-400/[0.04] px-2.5 py-1.5 text-xs font-mono text-slate-400 mb-3 leading-relaxed">
            {term.formula}
          </div>
        )}

        <div className="flex items-start gap-2">
          <span className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${tone.dot}`} />
          <p className="text-xs text-slate-500 leading-relaxed italic">
            {term.keyTakeaway}
          </p>
        </div>
      </div>

      {/* Expanded detail section */}
      {isExpanded && (
        <div
          className="px-3 pb-3 space-y-3 border-t border-sky-400/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">
              Definition
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              {term.definition}
            </p>
          </div>

          {term.example && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">
                Example
              </p>
              <p className="bb-card-soft text-xs text-slate-400 leading-relaxed p-3 border border-emerald-400/10 bg-emerald-400/[0.04]">
                {term.example}
              </p>
            </div>
          )}

          {term.signal && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">
                Signal
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bb-card-soft p-3 border border-emerald-400/15 bg-emerald-400/[0.06]">
                  <p className="text-xs uppercase font-semibold text-emerald-400 mb-1">
                    High
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {term.signal.high}
                  </p>
                </div>
                <div className="bb-card-soft p-3 border border-rose-400/15 bg-rose-400/[0.06]">
                  <p className="text-xs uppercase font-semibold text-rose-400 mb-1">
                    Low
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {term.signal.low}
                  </p>
                </div>
              </div>
            </div>
          )}

          {term.typical && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">
                Typical Range
              </p>
              <p className="text-xs text-slate-400">{term.typical}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function GlossaryPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | null>(
    null,
  );
  const [expanded, setExpanded] = useState<string | null>(null);

  const terms = searchGlossary(query, activeCategory ?? undefined);

  return (
    <main className="min-h-screen pt-[88px] bg-[#060c1a]">
      {/* Background glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div
          className="absolute top-0 left-1/3 w-[600px] h-[400px] rounded-full animate-orb"
          style={{ background: "radial-gradient(ellipse, rgba(56,189,248,0.05) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-sky-400 transition-colors mb-6"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Home
          </Link>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-400">
              Investor Education
            </p>
            <h1 className="font-fraunces text-4xl sm:text-5xl font-bold tracking-tight text-blue-50">
              Term Glossary
            </h1>
            <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
              Plain-English definitions for essential financial terms and metrics &mdash; understand what you&apos;re reading before you act on it.
            </p>
          </div>
        </div>

        {/* Sticky search + filter bar */}
        <div className="sticky top-[88px] z-10 pb-4 -mx-6 px-6 pt-2 bg-[#060c1a]/95 backdrop-blur-md">
          {/* Search input */}
          <div className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
            <input
              type="text"
              placeholder='Search terms... (e.g. "P/E ratio", "beta", "EPS")'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bb-card w-full pl-10 pr-10 py-3 text-sm text-blue-50 placeholder-slate-600 outline-none transition-colors focus:border-sky-400/35"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`shrink-0 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                !activeCategory ? "bg-sky-400 text-[#060c1a] border-sky-400" : "bg-sky-400/[0.06] text-slate-500 border-sky-400/10 hover:text-slate-300"
              }`}
            >
              All ({GLOSSARY.length})
            </button>
            {CATEGORIES.map((cat) => {
              const tone = TONE[CATEGORY_TONE[cat]];
              const isActive = activeCategory === cat;
              const count = GLOSSARY.filter((t) => t.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(isActive ? null : cat)}
                  className={`shrink-0 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                    isActive ? tone.soft : "bg-sky-400/[0.04] text-slate-500 border-sky-400/[0.07] hover:text-slate-300"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Result count */}
        <p className="text-xs text-slate-700 mb-5 mt-2">
          {terms.length === GLOSSARY.length
            ? `All ${GLOSSARY.length} terms`
            : `${terms.length} of ${GLOSSARY.length} terms`}
        </p>

        {/* Term cards */}
        {terms.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-slate-600 text-sm">
              No terms match &ldquo;{query}&rdquo;
            </p>
            <button
              onClick={() => {
                setQuery("");
                setActiveCategory(null);
              }}
              className="text-xs text-sky-400 mt-2 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {terms.map((term) => (
              <TermCard
                key={term.id}
                term={term}
                isExpanded={expanded === term.id}
                onToggle={() =>
                  setExpanded(expanded === term.id ? null : term.id)
                }
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
