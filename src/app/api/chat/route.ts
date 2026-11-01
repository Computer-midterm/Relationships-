import Anthropic from "@anthropic-ai/sdk";
import { EFFORT, FALLBACK_BETA, MODEL, getClient, isMock } from "@/lib/anthropic";
import { guardRequest, jsonError, readJson } from "@/lib/guard";
import { toApiMessages, trimHistory } from "@/lib/history";
import { mockReply, mockStream } from "@/lib/mock";
import { CORE_PROMPT, buildModePrompt } from "@/lib/prompts";
import { chatRequestSchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/** Events sent to the browser, one JSON object per line. */
type StreamEvent =
  | { type: "text"; text: string }
  | { type: "done"; stop: string | null }
  | { type: "error"; message: string };

function friendlyError(err: unknown): string {
  if (err instanceof Anthropic.RateLimitError) return "The coach is very busy right now. Please try again in a minute.";
  if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError)
    return "The coach isn't set up correctly. If you run this site, check the API key.";
  if (err instanceof Anthropic.APIConnectionError) return "I couldn't reach the coach just now. Check your connection and try again.";
  if (err instanceof Anthropic.APIError && (err.status === 529 || (err.status ?? 0) >= 500))
    return "The coach is temporarily overloaded. Please try again in a moment.";
  return "Something went wrong on our side. Please try again.";
}

export async function POST(req: Request) {
  const blocked = guardRequest(req);
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await readJson(req);
  } catch {
    return jsonError(400, "Invalid request.");
  }
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    const tooLong = parsed.error.issues.some((i) => i.code === "too_big");
    return jsonError(400, tooLong ? "That message is a little too long — could you split it up?" : "Invalid request.");
  }
  const { mode, context } = parsed.data;
  const history = trimHistory(parsed.data.messages);
  if (!history.length || history[history.length - 1].role !== "user") return jsonError(400, "Invalid request.");

  const isTeen = context?.ageGroup === "under18";
  const encoder = new TextEncoder();
  const send = (c: ReadableStreamDefaultController<Uint8Array>, e: StreamEvent) =>
    c.enqueue(encoder.encode(JSON.stringify(e) + "\n"));

  const upstream = new AbortController();
  req.signal.addEventListener("abort", () => upstream.abort());

  const body$ = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (isMock()) {
          const text = mockReply(mode, history[history.length - 1].content);
          for await (const chunk of mockStream(text, upstream.signal)) send(controller, { type: "text", text: chunk });
          send(controller, { type: "done", stop: "end_turn" });
          return;
        }

        const stream = getClient().beta.messages.stream(
          {
            model: MODEL,
            max_tokens: 16000,
            output_config: { effort: EFFORT },
            betas: [FALLBACK_BETA],
            fallbacks: "default",
            // Core prompt is byte-stable and cached; the mode block follows it.
            system: [
              { type: "text", text: CORE_PROMPT, cache_control: { type: "ephemeral" } },
              { type: "text", text: buildModePrompt(mode, isTeen) },
            ],
            // Automatic caching for the growing conversation tail.
            cache_control: { type: "ephemeral" },
            messages: toApiMessages(history, context),
          },
          { signal: upstream.signal },
        );

        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            send(controller, { type: "text", text: event.delta.text });
          }
        }
        const final = await stream.finalMessage();
        send(controller, { type: "done", stop: final.stop_reason });
      } catch (err) {
        if (err instanceof Anthropic.APIUserAbortError || upstream.signal.aborted) return;
        console.error("[chat] upstream error", err instanceof Anthropic.APIError ? `${err.status} ${err.name}` : (err as Error)?.name);
        try {
          send(controller, { type: "error", message: friendlyError(err) });
        } catch {}
      } finally {
        try {
          controller.close();
        } catch {}
      }
    },
    cancel() {
      upstream.abort();
    },
  });

  return new Response(body$, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
