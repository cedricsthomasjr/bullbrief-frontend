"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cachedFetch } from "@/app/lib/summaryCache";
import { compareHref, toggleCompareSymbol } from "@/app/lib/explore/compareHref";
import { parsePeerList, peerGroupLabel, type PeerList } from "@/app/lib/explore/peers";

function formatCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toFixed(0)}`;
}

function usePeerList(ticker: string): PeerList | null {
  const [list, setList] = useState<PeerList | null>(null);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!base) return;
    let cancelled = false;
    cachedFetch<unknown>(`${base}/compare/peers/${encodeURIComponent(ticker.toUpperCase())}`)
      .then((body) => {
        if (cancelled) return;
        const parsed = parsePeerList(body);
        if (!parsed) {
          setList(null);
          return;
        }
        const symbol = ticker.toUpperCase();
        setList({
          source: parsed.source,
          peers: parsed.peers.filter((peer) => peer.ticker !== symbol),
        });
      })
      .catch(() => {
        if (!cancelled) setList(null);
      });
    return () => {
      cancelled = true;
    };
  }, [ticker]);

  return list;
}

export function PeerHeaderLine({ ticker }: { ticker: string }) {
  const list = usePeerList(ticker);
  const label = peerGroupLabel(list?.source);
  if (!list || !label || list.peers.length === 0) return null;
  const shown = list.peers.slice(0, 3);
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-400">
      <span className="uppercase tracking-widest text-slate-500">{label}</span>
      {shown.map((peer) => (
        <Link key={peer.ticker} href={`/summary/${peer.ticker}`} className="text-slate-300 hover:text-sky-300">
          <span className="font-mono text-blue-50">{peer.ticker}</span>
          {peer.name && peer.name !== peer.ticker ? <span className="text-slate-500"> {peer.name}</span> : null}
        </Link>
      ))}
      <Link href={compareHref([ticker, ...shown.map((peer) => peer.ticker)])} className="font-semibold text-sky-400 hover:text-sky-300">
        Compare
      </Link>
    </div>
  );
}

export function PeerChapter({ ticker }: { ticker: string }) {
  const list = usePeerList(ticker);
  const [staged, setStaged] = useState<string[]>([]);
  const label = peerGroupLabel(list?.source);
  if (!list || !label || list.peers.length === 0) return null;
  const shown = list.peers.slice(0, 6);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-blue-50">Peers</h2>
      {label !== "Peers" ? (
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
      ) : null}
      <div className="bb-card divide-y divide-sky-400/10 overflow-hidden">
        {shown.map((peer) => (
          <div key={peer.ticker} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="font-mono text-sm font-bold text-blue-50">{peer.ticker}</p>
              <p className="truncate text-xs text-slate-400">{peer.name}</p>
            </div>
            <div className="flex items-center gap-3">
              {peer.marketCap !== null ? (
                <span className="text-xs font-semibold tabular-nums text-slate-300">{formatCap(peer.marketCap)}</span>
              ) : null}
              <Link href={`/summary/${peer.ticker}`} className="text-xs font-semibold text-sky-400 hover:text-sky-300">
                Open Brief
              </Link>
              <button
                type="button"
                onClick={() => setStaged((current) => toggleCompareSymbol(current, peer.ticker))}
                className="text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                {staged.includes(peer.ticker) ? "Remove from Compare" : "Add to Compare"}
              </button>
            </div>
          </div>
        ))}
      </div>
      {staged.length > 0 ? (
        <Link href={compareHref(staged)} className="inline-flex text-xs font-semibold text-sky-400 hover:text-sky-300">
          Open Compare
        </Link>
      ) : null}
    </div>
  );
}
