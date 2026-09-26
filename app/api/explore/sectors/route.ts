import { readFile } from "node:fs/promises";
import path from "node:path";
import { SECTORS } from "@/app/lib/explore/sectors";
import { buildSectorLists, type ScreenerRow } from "@/app/lib/explore/select";

export const dynamic = "force-dynamic";

const TTL_MS = 12 * 60 * 60 * 1000;
const FMP_SCREENER = "https://financialmodelingprep.com/stable/company-screener";

let cached: { at: number; body: { sectors: ReturnType<typeof buildSectorLists> } } | null = null;

async function loadCatalog(): Promise<{ universe: Set<string>; names: Map<string, string> }> {
  const universe = new Set<string>();
  const names = new Map<string, string>();
  try {
    const raw = await readFile(path.join(process.cwd(), "public", "tickers.json"), "utf8");
    const rows = JSON.parse(raw) as { symbol?: string; name?: string }[];
    for (const row of rows) {
      const symbol = (row.symbol ?? "").trim().toUpperCase();
      if (!symbol) continue;
      universe.add(symbol);
      if (row.name?.trim()) names.set(symbol, row.name.trim());
    }
  } catch {
    return { universe, names };
  }
  return { universe, names };
}

async function fetchSector(fmpSector: string): Promise<ScreenerRow[] | null> {
  const key = process.env.FMP_API_KEY;
  if (!key) return null;
  const url = new URL(FMP_SCREENER);
  url.searchParams.set("sector", fmpSector);
  url.searchParams.set("limit", "40");
  url.searchParams.set("isActivelyTrading", "true");
  url.searchParams.set("apikey", key);
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;
    const body: unknown = await response.json();
    return Array.isArray(body) ? (body as ScreenerRow[]) : null;
  } catch {
    return null;
  }
}

export async function GET() {
  if (cached && Date.now() - cached.at < TTL_MS) {
    return Response.json(cached.body);
  }

  const { universe, names } = await loadCatalog();
  const fetched = new Map<string, ScreenerRow[] | null>();
  await Promise.all(
    SECTORS.map(async (sector) => {
      fetched.set(sector.fmpSector, await fetchSector(sector.fmpSector));
    }),
  );
  const body = {
    sectors: buildSectorLists((fmpSector) => fetched.get(fmpSector) ?? null, universe, names),
  };
  cached = { at: Date.now(), body };
  return Response.json(body);
}
