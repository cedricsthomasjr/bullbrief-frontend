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
const inFlight = new Map<string, Promise<unknown>>();

function bodyKey(body: BodyInit | null | undefined) {
  if (!body) return "";
  if (typeof body === "string") return body;
  if (body instanceof URLSearchParams) return body.toString();
  return "[request-body]";
}

function cacheKey(url: string, init?: RequestInit) {
  const method = (init?.method ?? "GET").toUpperCase();
  const body = bodyKey(init?.body);
  return body || method !== "GET" ? `${method}:${url}:${body}` : url;
}

function ssKey(key: string) {
  return `bb:${key}`;
}

function readSession<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(ssKey(key));
    if (raw) return JSON.parse(raw) as T;
  } catch { /* SSR or private-mode quota */ }
  return null;
}

function writeSession(key: string, data: unknown) {
  try {
    sessionStorage.setItem(ssKey(key), JSON.stringify(data));
  } catch { /* quota exceeded */ }
}

/**
 * Drop-in replacement for `fetch(url).then(r => r.json())`.
 * - Returns the cached value immediately if available.
 * - Throws on non-ok HTTP responses so callers can catch normally.
 */
export async function cachedFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const key = cacheKey(url, init);

  // 1. In-memory (fastest - same SPA session)
  if (memCache.has(key)) return memCache.get(key) as T;

  // 2. sessionStorage (survives page refresh)
  const stored = readSession<T>(key);
  if (stored !== null) {
    memCache.set(key, stored);
    return stored;
  }

  // 3. In-flight de-dupe (prevents duplicate AI calls during parallel loads)
  if (inFlight.has(key)) return inFlight.get(key) as Promise<T>;

  const request = fetch(url, init)
    .then(async (res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} - ${url}`);
      const data = (await res.json()) as T;
      memCache.set(key, data);
      writeSession(key, data);
      return data;
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, request);
  return request;
}

/** Force a re-fetch next time (e.g. after a manual refresh action). */
export function bustCache(url: string, init?: RequestInit) {
  const key = cacheKey(url, init);
  memCache.delete(key);
  inFlight.delete(key);
  try { sessionStorage.removeItem(ssKey(key)); } catch { /* ignore */ }
}
