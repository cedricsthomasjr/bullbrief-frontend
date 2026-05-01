/**
 * Session-scoped fetch cache.
 *
 * Layer 1 - module-level Map: survives SPA route changes (back/forward)
 * Layer 2 - sessionStorage: survives a hard page refresh within the same tab
 *
 * Nothing is written to localStorage, so a fresh browser session always
 * fetches live data (avoids stale OpenAI responses across days).
 */

const memCache = new Map<string, unknown>();

function ssKey(url: string) {
  return `bb:${url}`;
}

function readSession<T>(url: string): T | null {
  try {
    const raw = sessionStorage.getItem(ssKey(url));
    if (raw) return JSON.parse(raw) as T;
  } catch { /* SSR or private-mode quota */ }
  return null;
}

function writeSession(url: string, data: unknown) {
  try {
    sessionStorage.setItem(ssKey(url), JSON.stringify(data));
  } catch { /* quota exceeded */ }
}

/**
 * Drop-in replacement for `fetch(url).then(r => r.json())`.
 * - Returns the cached value immediately if available.
 * - Throws on non-ok HTTP responses so callers can catch normally.
 */
export async function cachedFetch<T>(url: string, init?: RequestInit): Promise<T> {
  // 1. In-memory (fastest - same SPA session)
  if (memCache.has(url)) return memCache.get(url) as T;

  // 2. sessionStorage (survives page refresh)
  const stored = readSession<T>(url);
  if (stored !== null) {
    memCache.set(url, stored);
    return stored;
  }

  // 3. Network
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${url}`);
  const data = (await res.json()) as T;

  memCache.set(url, data);
  writeSession(url, data);
  return data;
}

/** Force a re-fetch next time (e.g. after a manual refresh action). */
export function bustCache(url: string) {
  memCache.delete(url);
  try { sessionStorage.removeItem(ssKey(url)); } catch { /* ignore */ }
}
