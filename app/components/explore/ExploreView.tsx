"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { COMPARE_PRESETS, LANDING_TICKERS } from "@/app/lib/explore/sectors";
import {
  ADD_TO_COMPARE,
  COMPARE_TRAY_ONE,
  COMPARE_TRAY_OPEN,
  EXPLORE_SUBHEAD,
  EXPLORE_TITLE,
  LOAD_ERROR,
  MAP_KICKER,
  OPEN_BRIEF,
  PRESET_KICKER,
  REMOVE_FROM_COMPARE,
  WAY_IN_KICKER,
  compareTrayMany,
  sectorTitle,
} from "@/app/lib/explore/copy";
import { compareHref, toggleCompareSymbol } from "@/app/lib/explore/compareHref";
import { parseExplorePayload, type ExplorePayload } from "@/app/lib/explore/parse";
import type { SectorCompany } from "@/app/lib/explore/select";

function formatCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toFixed(0)}`;
}

function CompanyRow({
  company,
  showCap,
  staged,
  onToggle,
}: {
  company: SectorCompany;
  showCap: boolean;
  staged: boolean;
  onToggle: (symbol: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <div className="min-w-0">
        <p className="font-mono text-sm font-bold text-blue-50">{company.symbol}</p>
        <p className="truncate text-xs text-slate-400">{company.name}</p>
      </div>
      <div className="flex items-center gap-3">
        {showCap && company.marketCap !== null ? (
          <span className="text-xs font-semibold tabular-nums text-slate-300">{formatCap(company.marketCap)}</span>
        ) : null}
        <Link href={`/summary/${company.symbol}`} className="text-xs font-semibold text-sky-400 hover:text-sky-300">
          {OPEN_BRIEF}
        </Link>
        <button
          type="button"
          onClick={() => onToggle(company.symbol)}
          className="text-xs font-semibold text-slate-400 hover:text-slate-200"
        >
          {staged ? REMOVE_FROM_COMPARE : ADD_TO_COMPARE}
        </button>
      </div>
    </div>
  );
}

export default function ExploreView() {
  const [payload, setPayload] = useState<ExplorePayload | null>(null);
  const [failed, setFailed] = useState(false);
  const [staged, setStaged] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/explore/sectors")
      .then(async (response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      })
      .then((body) => {
        if (cancelled) return;
        const parsed = parseExplorePayload(body);
        if (!parsed) {
          setFailed(true);
          return;
        }
        setPayload(parsed);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = (symbol: string) => setStaged((current) => toggleCompareSymbol(current, symbol));

  return (
    <main className="min-h-screen pt-[88px]" style={{ backgroundColor: "#060c1a" }}>
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(56,189,248,0.07) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        <div className="space-y-2">
          <h1 className="font-fraunces text-4xl font-bold tracking-tight text-blue-50">{EXPLORE_TITLE}</h1>
          <p className="max-w-xl text-sm text-slate-400">{EXPLORE_SUBHEAD}</p>
        </div>

        <section className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">{WAY_IN_KICKER}</p>
          <div className="flex flex-wrap gap-2">
            {LANDING_TICKERS.map((ticker) => (
              <Link
                key={ticker}
                href={`/summary/${ticker}`}
                className="rounded-md px-3 py-1.5 font-mono text-xs font-bold text-sky-300"
                style={{ backgroundColor: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.16)" }}
              >
                {ticker}
              </Link>
            ))}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">{PRESET_KICKER}</p>
          <div className="grid gap-3 md:grid-cols-3">
            {COMPARE_PRESETS.map((preset) => (
              <Link key={preset.id} href={compareHref(preset.tickers)} className="bb-card p-4 block hover:border-sky-400/30">
                <p className="text-sm font-semibold text-blue-50">{preset.label}</p>
                <p className="mt-2 text-xs leading-5 text-slate-400">{preset.description}</p>
                <p className="mt-3 font-mono text-[11px] text-slate-500">{preset.tickers.join(" · ")}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">{MAP_KICKER}</p>
          {failed ? <p className="text-sm text-slate-400">{LOAD_ERROR}</p> : null}
          {!failed && !payload ? <p className="text-sm text-slate-500">Loading sector lists.</p> : null}
          <div className="grid gap-4 lg:grid-cols-2">
            {payload?.sectors.map((sector) => (
              <article key={sector.sector} className="bb-card overflow-hidden">
                <div className="flex items-baseline justify-between gap-3 px-4 pt-4">
                  <h2 className="text-base font-semibold text-blue-50">{sector.sector}</h2>
                  <span className="font-mono text-[10px] text-slate-500">{sector.sectorEtf}</span>
                </div>
                <p className="px-4 pb-2 text-[11px] text-slate-400">{sectorTitle(sector.source)}</p>
                <div className="divide-y divide-sky-400/10">
                  {sector.companies.map((company) => (
                    <CompanyRow
                      key={company.symbol}
                      company={company}
                      showCap={sector.source === "fmp"}
                      staged={staged.includes(company.symbol)}
                      onToggle={toggle}
                    />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {staged.length > 0 ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-4">
          <div className="bb-card pointer-events-auto mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-3">
            <p className="text-xs text-slate-300">
              {staged.length >= 2 ? compareTrayMany(staged.length) : COMPARE_TRAY_ONE}
            </p>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setStaged([])} className="text-xs text-slate-500 hover:text-slate-300">
                Clear
              </button>
              <Link href={compareHref(staged)} className="text-xs font-semibold text-sky-400 hover:text-sky-300">
                {COMPARE_TRAY_OPEN}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
