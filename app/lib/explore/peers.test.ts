import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { compareHref, parseCompareParam, toggleCompareSymbol } from "./compareHref";
import { parsePeerList, peerGroupLabel } from "./peers";

describe("peerGroupLabel", () => {
  it("maps peer sources and hides anything else", () => {
    assert.equal(peerGroupLabel("fmp"), "Peers");
    assert.equal(peerGroupLabel("curated"), "Peers");
    assert.equal(peerGroupLabel("sector_static"), "Companies in this sector");
    assert.equal(peerGroupLabel("none"), null);
    assert.equal(peerGroupLabel(null), null);
    assert.equal(peerGroupLabel(undefined), null);
  });
});

describe("parsePeerList", () => {
  it("reads the current market_cap field and treats a missing source as fmp", () => {
    const parsed = parsePeerList({
      peers: [{ ticker: "msft", name: "Microsoft", market_cap: 2e12 }, { ticker: "" }],
    });
    assert.deepEqual(parsed, {
      source: "fmp",
      peers: [{ ticker: "MSFT", name: "Microsoft", marketCap: 2e12 }],
    });
    assert.equal(parsePeerList({ peers: [] }), null);
  });
});

describe("compareHref", () => {
  it("opens one name on the launcher and two or more on the results path", () => {
    assert.equal(compareHref([]), "/compare");
    assert.equal(compareHref(["nvda"]), "/compare?tickers=NVDA");
    assert.equal(compareHref(["NVDA", "AAPL", "MSFT", "GOOGL"]), "/compare/NVDA,AAPL,MSFT");
    assert.deepEqual(parseCompareParam("MSFT%2CAAPL"), ["MSFT", "AAPL"]);
    assert.deepEqual(toggleCompareSymbol(["NVDA", "AAPL", "MSFT"], "GOOGL"), ["NVDA", "AAPL", "MSFT"]);
    assert.deepEqual(toggleCompareSymbol(["NVDA", "AAPL"], "nvda"), ["AAPL"]);
  });
});
