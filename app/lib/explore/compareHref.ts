export function toggleCompareSymbol(selected: string[], symbol: string): string[] {
  const next = symbol.trim().toUpperCase();
  if (!next) return selected;
  if (selected.includes(next)) return selected.filter((item) => item !== next);
  if (selected.length >= 3) return selected;
  return [...selected, next];
}

export function parseCompareParam(raw: string): string[] {
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    decoded = raw;
  }
  const unique: string[] = [];
  for (const part of decoded.split(",")) {
    const next = part.trim().toUpperCase();
    if (next && !unique.includes(next)) unique.push(next);
  }
  return unique.slice(0, 3);
}

export function compareHref(symbols: string[]): string {
  const unique: string[] = [];
  for (const symbol of symbols) {
    const next = symbol.trim().toUpperCase();
    if (next && !unique.includes(next)) unique.push(next);
  }
  const capped = unique.slice(0, 3);
  if (capped.length === 0) return "/compare";
  if (capped.length === 1) return `/compare?tickers=${encodeURIComponent(capped[0])}`;
  return `/compare/${capped.join(",")}`;
}
