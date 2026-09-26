import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildSectorLists, normalizeCompanyName, selectSectorCompanies } from "./select";

const universe = new Set(["GOOG", "GOOGL", "NVDA", "AAPL", "MSFT", "AVGO", "META", "ORCL", "SPY", "JPM", "BAC", "WFC", "GS", "MS", "C"]);

describe("normalizeCompanyName", () => {
  it("collapses share classes of the same company", () => {
    assert.equal(normalizeCompanyName("Alphabet Inc. Class A"), normalizeCompanyName("Alphabet Inc. Class C"));
    assert.equal(normalizeCompanyName("Alphabet Inc."), "alphabet");
  });
});

describe("selectSectorCompanies", () => {
  it("keeps the six largest listed operating companies and drops the second share class", () => {
    const rows = [
      { symbol: "GOOG", companyName: "Alphabet Inc. Class C", marketCap: 2.1e12 },
      { symbol: "GOOGL", companyName: "Alphabet Inc. Class A", marketCap: 2.2e12 },
      { symbol: "NVDA", companyName: "NVIDIA Corporation", marketCap: 3e12 },
      { symbol: "AAPL", companyName: "Apple Inc.", marketCap: 2.9e12 },
      { symbol: "MSFT", companyName: "Microsoft Corporation", marketCap: 2.8e12 },
      { symbol: "AVGO", companyName: "Broadcom Inc.", marketCap: 1e12 },
      { symbol: "META", companyName: "Meta Platforms, Inc.", marketCap: 1.5e12 },
      { symbol: "ORCL", companyName: "Oracle Corporation", marketCap: 0.4e12 },
      { symbol: "SPY", companyName: "SPDR S&P 500 ETF Trust", marketCap: 5e12, isEtf: true },
      { symbol: "ZZZZ", companyName: "Not Listed", marketCap: 9e12 },
      { symbol: "AAPL", companyName: "Apple Inc.", marketCap: Number.NaN },
    ];
    const selected = selectSectorCompanies(rows, universe);
    assert.deepEqual(
      selected.map((row) => row.symbol),
      ["NVDA", "AAPL", "MSFT", "GOOGL", "META", "AVGO"],
    );
  });
});

describe("buildSectorLists", () => {
  it("asks FMP for Financial Services and labels the sector Financials", () => {
    const asked: string[] = [];
    const lists = buildSectorLists(
      (fmpSector) => {
        asked.push(fmpSector);
        if (fmpSector !== "Financial Services") return [];
        return ["JPM", "BAC", "WFC", "GS", "MS", "C"].map((symbol, index) => ({
          symbol,
          companyName: `${symbol} Inc.`,
          marketCap: (6 - index) * 1e11,
        }));
      },
      universe,
      new Map([
        ["JPM", "JPMorgan Chase & Co."],
        ["BAC", "Bank of America Corporation"],
      ]),
    );
    const financials = lists.find((sector) => sector.sector === "Financials");
    assert.ok(financials);
    assert.equal(financials.source, "fmp");
    assert.equal(financials.sectorEtf, "XLF");
    assert.equal(financials.companies.length, 6);
    assert.equal(financials.companies[0].symbol, "JPM");
    assert.ok(asked.includes("Financial Services"));
    assert.equal(lists.length, 11);
  });

  it("fills a thin or failed sector entirely from the static basket", () => {
    const lists = buildSectorLists(
      () => null,
      universe,
      new Map([["JPM", "JPMorgan Chase & Co."]]),
    );
    assert.equal(lists.length, 11);
    for (const sector of lists) {
      assert.equal(sector.source, "static");
      assert.ok(sector.companies.length >= 6);
      for (const company of sector.companies) {
        assert.equal(company.marketCap, null);
      }
    }
    const financials = lists.find((sector) => sector.sector === "Financials");
    assert.equal(financials?.companies[0].name, "JPMorgan Chase & Co.");
    assert.deepEqual(
      lists.map((sector) => sector.sector),
      [
        "Technology",
        "Healthcare",
        "Financials",
        "Consumer Discretionary",
        "Consumer Staples",
        "Industrials",
        "Energy",
        "Utilities",
        "Real Estate",
        "Materials",
        "Communication Services",
      ],
    );
  });
});
