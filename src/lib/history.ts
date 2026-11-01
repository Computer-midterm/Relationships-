import "server-only";
import type Anthropic from "@anthropic-ai/sdk";
import type { UserContext } from "./schemas";
import { getRegion } from "./resources";

type InMsg = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 40;
const CHUNK = 10;
const MAX_TOTAL_CHARS = 120_000;

/**
 * Keep the most recent part of the conversation. Old turns are dropped in
 * chunks (not one per turn) so the cached prefix stays stable between turns.
 */
export function trimHistory(messages: InMsg[]): InMsg[] {
  // Drop empty assistant turns (e.g. a stopped reply) and merge same-role neighbours.
  const cleaned: InMsg[] = [];
  for (const m of messages) {
    if (!m.content.trim()) continue;
    const prev = cleaned[cleaned.length - 1];
    if (prev && prev.role === m.role) prev.content += `\n\n${m.content}`;
    else cleaned.push({ ...m });
  }
  let out = cleaned;
  if (out.length > MAX_MESSAGES) {
    const drop = Math.ceil((out.length - MAX_MESSAGES) / CHUNK) * CHUNK;
    out = out.slice(drop);
  }
  while (out.length > 2 && out.reduce((n, m) => n + m.content.length, 0) > MAX_TOTAL_CHARS) {
    out = out.slice(Math.min(CHUNK, out.length - 1));
  }
  while (out.length && out[0].role !== "user") out = out.slice(1);
  return out;
}

export function contextBlock(ctx: UserContext | undefined): string | null {
  if (!ctx) return null;
  const lines: string[] = [];
  if (ctx.name) lines.push(`My name: ${ctx.name}`);
  if (ctx.partnerName) lines.push(`The other person's name: ${ctx.partnerName}`);
  if (ctx.country) lines.push(`Where I live: ${getRegion(ctx.country).label}`);
  if (ctx.ageGroup === "under18") lines.push("Age: under 18");
  if (!lines.length) return null;
  return `<user_context>\n${lines.join("\n")}\n</user_context>`;
}

export function toApiMessages(messages: InMsg[], ctx: UserContext | undefined): Anthropic.Beta.Messages.BetaMessageParam[] {
  const block = contextBlock(ctx);
  return messages.map((m, i) => {
    if (i === 0 && block) {
      return { role: "user", content: [{ type: "text", text: block }, { type: "text", text: m.content }] };
    }
    return { role: m.role, content: m.content };
  });
}
