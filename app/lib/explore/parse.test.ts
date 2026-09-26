import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SECTORS } from "./sectors";
import { parseExplorePayload } from "./parse";

function sector(name: string, source: "fmp" | "static", marketCap: unknown) {
  return {
    sector: name,
    sectorEtf: "XXX",
    source,
    companies: [{ symbol: "nvda", name: "NVIDIA", marketCap }],
  };
}

describe("parseExplorePayload", () => {
  it("returns null for a bad payload", () => {
    assert.equal(parseExplorePayload(null), null);
    assert.equal(parseExplorePayload({ sectors: [] }), null);
    assert.equal(parseExplorePayload("nope"), null);
  });

  it("keeps eleven sectors in list order and drops a non-finite market cap", () => {
    const payload = parseExplorePayload({
      sectors: [...SECTORS].reverse().map((item, index) =>
        sector(item.sector, index === 0 ? "fmp" : "static", index === 0 ? Number.POSITIVE_INFINITY : 10),
      ),
    });
    assert.ok(payload);
    assert.deepEqual(
      payload.sectors.map((item) => item.sector),
      SECTORS.map((item) => item.sector),
    );
    const last = payload.sectors[payload.sectors.length - 1];
    assert.equal(last.companies[0].marketCap, null);
    assert.equal(last.companies[0].symbol, "NVDA");
    assert.equal(payload.sectors[0].companies[0].marketCap, 10);
  });
});
