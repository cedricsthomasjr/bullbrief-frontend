export function peerGroupLabel(source: string | null | undefined): string | null {
  if (source === "fmp" || source === "curated") return "Peers";
  if (source === "sector_static") return "Companies in this sector";
  return null;
}

export type PeerRow = {
  ticker: string;
  name: string;
  marketCap: number | null;
};

export type PeerList = {
  source: string | null;
  peers: PeerRow[];
};

function finiteCap(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return null;
  return value;
}

/** Current peers route uses `market_cap`. A missing `source` with rows still counts as fmp. */
export function parsePeerList(body: unknown): PeerList | null {
  if (!body || typeof body !== "object") return null;
  const row = body as { source?: unknown; peers?: unknown };
  if (!Array.isArray(row.peers)) return null;
  const peers: PeerRow[] = [];
  for (const entry of row.peers) {
    if (!entry || typeof entry !== "object") continue;
    const peer = entry as Record<string, unknown>;
    const ticker = typeof peer.ticker === "string" ? peer.ticker.trim().toUpperCase() : "";
    if (!ticker) continue;
    const nameValue = peer.name ?? peer.short_name ?? peer.company_name;
    const name = typeof nameValue === "string" && nameValue.trim() ? nameValue.trim() : ticker;
    const marketCap = finiteCap(peer.marketCap ?? peer.market_cap);
    peers.push({ ticker, name, marketCap });
  }
  if (peers.length === 0) return null;
  const source = typeof row.source === "string" ? row.source : "fmp";
  return { source, peers };
}
