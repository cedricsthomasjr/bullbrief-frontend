import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { compareHref, parseCompareParam, toggleCompareSymbol } from "./compareHref";

describe("compareHref", () => {
  it("opens the existing compare route for one or more names", () => {
    assert.equal(compareHref([]), "/compare");
    assert.equal(compareHref(["nvda"]), "/compare/NVDA");
    assert.equal(compareHref(["MSFT", "GOOGL", "AMZN"]), "/compare/MSFT,GOOGL,AMZN");
    assert.equal(compareHref(["NVDA", "nvda", "AAPL", "MSFT", "META"]), "/compare/NVDA,AAPL,MSFT");
  });
});

describe("parseCompareParam", () => {
  it("decodes a comma-separated path param", () => {
    assert.deepEqual(parseCompareParam("MSFT%2CGOOGL"), ["MSFT", "GOOGL"]);
    assert.deepEqual(parseCompareParam("nvda"), ["NVDA"]);
  });
});

describe("toggleCompareSymbol", () => {
  it("adds, removes, and stops at three names", () => {
    assert.deepEqual(toggleCompareSymbol(["NVDA"], "aapl"), ["NVDA", "AAPL"]);
    assert.deepEqual(toggleCompareSymbol(["NVDA", "AAPL"], "NVDA"), ["AAPL"]);
    assert.deepEqual(toggleCompareSymbol(["NVDA", "AAPL", "MSFT"], "META"), ["NVDA", "AAPL", "MSFT"]);
  });
});
