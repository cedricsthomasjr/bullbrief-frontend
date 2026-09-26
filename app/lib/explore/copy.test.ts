import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as copy from "./copy";

const ADVICE =
  /\b(buy|sell|hold|recommend\w*|target price|price target|timing|overweight|underweight|outperform\w*|underperform\w*|must[- ]own|best stocks?|price objective|entry point|exit point|stop[- ]loss|take profit|guaranteed)\b/i;
const CALLS =
  /\b(bullish|bearish|breakout|opportunit\w*|top picks?|undervalued|overvalued|avoid|worth|should|winners?|hot|cold|signals?)\b/i;
const CAUSAL = /\b(why it moved|driven by|caused? by|because|due to|thanks to)\b/i;
const OTHER = /\bworkspace\b|—/i;

function stringsIn(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(stringsIn);
  if (value && typeof value === "object") return Object.values(value).flatMap(stringsIn);
  return [];
}

describe("Explore copy", () => {
  it("holds to the no-advice vocabulary", () => {
    const strings = [
      ...Object.values(copy).flatMap((value) => (typeof value === "function" ? [] : stringsIn(value))),
      copy.compareTrayMany(3),
      copy.sectorTitle("fmp"),
      copy.sectorTitle("static"),
    ];
    for (const text of strings) {
      assert.ok(!ADVICE.test(text), `advice wording: ${text}`);
      assert.ok(!CALLS.test(text), `directional wording: ${text}`);
      assert.ok(!CAUSAL.test(text), `causal wording: ${text}`);
      assert.ok(!OTHER.test(text), `reserved wording: ${text}`);
    }
    assert.equal(copy.LIVE_SECTOR_TITLE, "Largest by market cap");
    assert.equal(copy.STATIC_SECTOR_TITLE, "Companies in this sector");
  });
});
