import "server-only";

// Simple fixed-window, in-memory limiter. Good for a single instance; on
// serverless / multi-instance hosting, swap for Redis/Upstash (see README).

type Window = { count: number; resetAt: number };
const short = new Map<string, Window>();
const daily = new Map<string, Window>();

const SHORT_MS = 10 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const num = (v: string | undefined, d: number) => (v && Number.isFinite(+v) && +v > 0 ? +v : d);
const SHORT_MAX = num(process.env.RATE_LIMIT_PER_10_MIN, 20);
const DAY_MAX = num(process.env.RATE_LIMIT_PER_DAY, 150);

let lastPrune = Date.now();
function prune(now: number) {
  if (now - lastPrune < 60_000) return;
  lastPrune = now;
  for (const m of [short, daily]) for (const [k, w] of m) if (w.resetAt <= now) m.delete(k);
}

function hit(map: Map<string, Window>, key: string, max: number, windowMs: number, now: number, cost: number) {
  let w = map.get(key);
  if (!w || w.resetAt <= now) {
    w = { count: 0, resetAt: now + windowMs };
    map.set(key, w);
  }
  if (w.count + cost > max) return { ok: false as const, retryAfter: Math.ceil((w.resetAt - now) / 1000) };
  w.count += cost;
  return { ok: true as const };
}

export function rateLimit(key: string, cost = 1): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  prune(now);
  const s = short.get(key);
  const d = daily.get(key);
  // check both before charging either
  if (s && s.resetAt > now && s.count + cost > SHORT_MAX) return { ok: false, retryAfter: Math.ceil((s.resetAt - now) / 1000) };
  if (d && d.resetAt > now && d.count + cost > DAY_MAX) return { ok: false, retryAfter: Math.ceil((d.resetAt - now) / 1000) };
  const a = hit(short, key, SHORT_MAX, SHORT_MS, now, cost);
  if (!a.ok) return a;
  return hit(daily, key, DAY_MAX, DAY_MS, now, cost);
}

export function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  return ip;
}
