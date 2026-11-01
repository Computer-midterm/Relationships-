import "server-only";
import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

/** Lazily construct the client so a missing key fails per-request, not at import. */
export function getClient(): Anthropic {
  if (!client) client = new Anthropic({ maxRetries: 2 });
  return client;
}

export const MODEL = process.env.COACH_MODEL || "claude-opus-5-5";

type Effort = "low" | "medium" | "high" | "xhigh" | "max";
const EFFORTS: Effort[] = ["low", "medium", "high", "xhigh", "max"];
export const EFFORT: Effort = EFFORTS.includes(process.env.COACH_EFFORT as Effort)
  ? (process.env.COACH_EFFORT as Effort)
  : "medium";

/** Re-run a safety-classifier decline on Anthropic's recommended fallback model. */
export const FALLBACK_BETA = "server-side-fallback-2026-07-01";

export const isMock = () => process.env.COACH_MOCK === "1";

export function isConfigured(): boolean {
  return isMock() || Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
}
