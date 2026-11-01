import "server-only";
import { clientKey, rateLimit } from "./rate-limit";
import { isConfigured } from "./anthropic";

export const MAX_BODY_BYTES = 200_000;

export function jsonError(status: number, message: string, headers: Record<string, string> = {}) {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

/** Shared checks for public AI endpoints. Returns a Response to short-circuit, or null. */
export function guardRequest(req: Request, cost = 1): Response | null {
  // Same-origin check: browsers always send Origin on cross-origin POSTs.
  const origin = req.headers.get("origin");
  if (origin) {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    try {
      if (!host || new URL(origin).host !== host) return jsonError(403, "Forbidden");
    } catch {
      return jsonError(403, "Forbidden");
    }
  }
  if (!(req.headers.get("content-type") || "").includes("application/json")) {
    return jsonError(415, "Expected JSON");
  }
  const len = Number(req.headers.get("content-length") || 0);
  if (len > MAX_BODY_BYTES) return jsonError(413, "That's a bit too long for me to read in one go.");

  if (!isConfigured()) {
    return jsonError(503, "The coach isn't set up yet — the site owner needs to add an API key.");
  }

  const rl = rateLimit(clientKey(req), cost);
  if (!rl.ok) {
    return jsonError(429, "You've sent a lot of messages in a short time. Take a breath — you can continue in a few minutes.", {
      "Retry-After": String(rl.retryAfter),
    });
  }
  return null;
}

export async function readJson(req: Request): Promise<unknown> {
  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) throw new Error("too_large");
  return JSON.parse(text);
}
