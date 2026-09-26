import { SECTOR_PEERS, SECTORS, type SectorDef } from "./sectors";

export type ScreenerRow = {
  symbol?: unknown;
  name?: unknown;
  companyName?: unknown;
  marketCap?: unknown;
  market_cap?: unknown;
  isEtf?: unknown;
  isFund?: unknown;
};

export type SectorCompany = {
  symbol: string;
  name: string;
  marketCap: number | null;
};

export type SectorList = {
  sector: string;
  sectorEtf: string;
  source: "fmp" | "static";
  companies: SectorCompany[];
};

const SUFFIXES = [
  "class a",
  "class b",
  "class c",
  "corporation",
  "incorporated",
  "company",
  "inc",
  "corp",
  "ltd",
  "plc",
  "co",
];

export function normalizeCompanyName(name: string): string {
  let text = name.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  let stripped = true;
  while (stripped && text) {
    stripped = false;
    for (const suffix of SUFFIXES) {
      if (text === suffix || text.endsWith(` ${suffix}`)) {
        text = text.slice(0, text.length - suffix.length).trim();
        stripped = true;
        break;
      }
    }
  }
  return text;
}

function finiteCap(value: unknown): number | null {
  if (typeof value === "boolean" || value === null || value === undefined) return null;
  const number = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  if (!Number.isFinite(number) || number <= 0) return null;
  return number;
}

function flagged(value: unknown): boolean {
  return value === true || value === "true" || value === "True";
}

function rowSymbol(row: ScreenerRow): string {
  return String(row.symbol ?? "").trim().toUpperCase();
}

function rowName(row: ScreenerRow): string {
  const name = row.companyName ?? row.name;
  return typeof name === "string" ? name.trim() : "";
}

export function selectSectorCompanies(
  rows: ScreenerRow[],
  universe: ReadonlySet<string>,
  limit = 6,
): SectorCompany[] {
  const ranked: { symbol: string; name: string; marketCap: number }[] = [];
  for (const row of rows) {
    const symbol = rowSymbol(row);
    const marketCap = finiteCap(row.marketCap ?? row.market_cap);
    if (!symbol || !universe.has(symbol) || marketCap === null) continue;
    if (flagged(row.isEtf) || flagged(row.isFund)) continue;
    ranked.push({ symbol, name: rowName(row), marketCap });
  }
  ranked.sort((a, b) => b.marketCap - a.marketCap);

  const kept: SectorCompany[] = [];
  const seenNames = new Set<string>();
  for (const row of ranked) {
    const key = normalizeCompanyName(row.name);
    if (key && seenNames.has(key)) continue;
    if (key) seenNames.add(key);
    kept.push(row);
    if (kept.length >= limit) break;
  }
  return kept;
}

function staticCompanies(fmpSector: string, names: ReadonlyMap<string, string>): SectorCompany[] {
  return (SECTOR_PEERS[fmpSector] ?? []).map((symbol) => ({
    symbol,
    name: names.get(symbol) ?? symbol,
    marketCap: null,
  }));
}

export function buildSectorLists(
  fetchRows: (fmpSector: string) => ScreenerRow[] | null,
  universe: ReadonlySet<string>,
  names: ReadonlyMap<string, string>,
): SectorList[] {
  return SECTORS.map((sector: SectorDef) => {
    let selected: SectorCompany[] = [];
    try {
      const rows = fetchRows(sector.fmpSector);
      if (rows) selected = selectSectorCompanies(rows, universe);
    } catch {
      selected = [];
    }
    if (selected.length < 6) {
      return {
        sector: sector.sector,
        sectorEtf: sector.sectorEtf,
        source: "static" as const,
        companies: staticCompanies(sector.fmpSector, names),
      };
    }
    return {
      sector: sector.sector,
      sectorEtf: sector.sectorEtf,
      source: "fmp" as const,
      companies: selected,
    };
  });
}
