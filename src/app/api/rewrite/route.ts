import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { EFFORT, FALLBACK_BETA, MODEL, getClient, isMock } from "@/lib/anthropic";
import { guardRequest, jsonError, readJson } from "@/lib/guard";
import { REWRITE_PROMPT } from "@/lib/prompts";
import { RewriteSchema, rewriteRequestSchema, type RewriteResult } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;


const MOCK: RewriteResult = {
  feeling: "hurt and wanting to feel like a priority",
  gentle:
    "Hey, I felt really hurt when plans changed last minute again tonight. I miss you, and I'd love for us to find a time that we both protect. Can we talk about it?",
  direct:
    "I was upset when tonight got cancelled at the last minute — it's happened a few times now. I need us to stick to plans we make, or give more notice. Can we figure that out together?",
  brief: "Tonight being cancelled again really stung. Can we talk about how to protect our plans?",
  notes: [
    "Replaced “you always” with what actually happened tonight",
    "Named the hurt underneath the anger",
    "Ended with a request instead of an accusation",
  ],
  safety: null,
};

export async function POST(req: Request) {
  const blocked = guardRequest(req);
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await readJson(req);
  } catch {
    return jsonError(400, "Invalid request.");
  }
  const parsed = rewriteRequestSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "Please paste a message up to about 3,000 characters.");
  const { text, context } = parsed.data;

  if (isMock()) {
    await new Promise((r) => setTimeout(r, 700));
    return Response.json(MOCK, { headers: { "Cache-Control": "no-store" } });
  }

  const userContent = [
    context ? `Some context about the situation (from the user): ${context}\n\n` : "",
    `<message_to_rewrite>\n${text}\n</message_to_rewrite>`,
  ].join("");

  try {
    const response = await getClient().beta.messages.parse(
      {
        model: MODEL,
        max_tokens: 16000,
        output_config: { effort: EFFORT, format: betaZodOutputFormat(RewriteSchema) },
        betas: [FALLBACK_BETA],
        fallbacks: "default",
        system: [{ type: "text", text: REWRITE_PROMPT, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: userContent }],
      },
      { signal: req.signal },
    );

    if (response.stop_reason === "refusal" || !response.parsed_output) {
      return jsonError(422, "I couldn't rewrite that one. If something difficult is going on, the coach is here to talk it through.");
    }
    return Response.json(response.parsed_output, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    if (err instanceof Anthropic.APIUserAbortError) return new Response(null, { status: 499 });
    console.error("[rewrite] upstream error", err instanceof Anthropic.APIError ? `${err.status} ${err.name}` : (err as Error)?.name);
    if (err instanceof Anthropic.RateLimitError) return jsonError(503, "The rewriter is very busy right now. Please try again in a minute.");
    return jsonError(502, "Something went wrong on our side. Please try again.");
  }
}
