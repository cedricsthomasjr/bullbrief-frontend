import { SECTORS } from "./sectors";
import type { SectorCompany, SectorList } from "./select";

export type ExplorePayload = {
  sectors: SectorList[];
};

function finiteCap(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return null;
  return value;
}

function parseCompany(value: unknown): SectorCompany | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const symbol = typeof row.symbol === "string" ? row.symbol.trim().toUpperCase() : "";
  if (!symbol) return null;
  const name = typeof row.name === "string" && row.name.trim() ? row.name.trim() : symbol;
  return { symbol, name, marketCap: finiteCap(row.marketCap) };
}

export function parseExplorePayload(body: unknown): ExplorePayload | null {
  if (!body || typeof body !== "object") return null;
  const sectors = (body as { sectors?: unknown }).sectors;
  if (!Array.isArray(sectors)) return null;

  const byName = new Map<string, SectorList>();
  for (const entry of sectors) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const sector = typeof row.sector === "string" ? row.sector : "";
    const known = SECTORS.find((item) => item.sector === sector);
    if (!known) continue;
    const source = row.source === "fmp" ? "fmp" : "static";
    const companies = Array.isArray(row.companies)
      ? row.companies.map(parseCompany).filter((company): company is SectorCompany => company !== null)
      : [];
    byName.set(sector, {
      sector,
      sectorEtf: known.sectorEtf,
      source,
      companies,
    });
  }

  if (byName.size !== SECTORS.length) return null;
  return { sectors: SECTORS.map((item) => byName.get(item.sector)!) };
}
