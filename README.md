# Common Ground

**Talk it through before you talk it out.** A free, private AI relationship coach that is *fair, not flattering*. No signup, and conversations stay on the user's device.

Built with Next.js 16, React 19, Tailwind CSS 4 and the Claude API (`claude-opus-5-5`). See [`PLAN.md`](./PLAN.md) for the research-backed product plan.

## Features

- **Six guided modes:** Talk it through · Understand a conflict · Prepare for a hard talk (with a printable prep sheet and role-play) · Write a message · Dating & early days · After a breakup
- **Message rewriter** (`/rewrite`): turns a heated text into Gentle / Direct / Brief versions using structured JSON output
- **"See their side"** and other next-step actions under each reply. This counters AI sycophancy.
- **Safety layer:**
  - The coach is prompted to follow abuse, coercive-control, suicide, sexual-assault and child-safety guidance.
  - Crisis-language detection in the browser shows a hotline card, independently of the model.
  - Region-aware helplines for the US, UK, IE, CA, AU and international.
  - "Talk to a person" panel.
  - **Quick exit** button, or press **Esc twice**.
  - Published crisis protocol at `/safety`.
- **Teen mode:** under-18s get a more protective prompt and youth helplines.
- **Privacy:**
  - No accounts and no database. History lives in `localStorage`.
  - Delete everything, Markdown export, discreet tab title, light/dark theme.
  - Self-hosted fonts and no third-party requests.

## Getting started

```bash
npm install
cp .env.example .env.local   # then add your ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
```

To try the UI without an API key, run in mock mode. It streams canned replies:

```bash
COACH_MOCK=1 npm run dev
```

## Configuration

| Variable | Default | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | (required) | Server-side only. Never prefix with `NEXT_PUBLIC_`. |
| `COACH_MODEL` | `claude-opus-5-5` | Any Messages API model. |
| `COACH_EFFORT` | `medium` | `low`, `medium`, `high`, `xhigh` or `max`. Lower is faster and cheaper. |
| `RATE_LIMIT_PER_10_MIN` / `RATE_LIMIT_PER_DAY` | `20` / `150` | Per-IP, in-memory. |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Used for metadata. |
| `COACH_MOCK` | (unset) | `1` = canned replies, for development only. |

## How the AI call works

- `src/app/api/chat/route.ts` streams Claude's reply to the browser as newline-delimited JSON (`text` / `done` / `error` events).
- **Prompt caching:**
  - The large coach prompt (`src/lib/prompts.ts`) is byte-stable and carries a cache breakpoint.
  - The per-mode and teen instructions come after it.
  - Automatic caching covers the growing conversation.
  - History is trimmed in chunks of 10 messages so the cached prefix stays stable.
- **Refusal fallback:** `fallbacks: "default"` (beta `server-side-fallback-2026-07-01`). If a safety classifier declines a request, it is re-run server-side on Anthropic's recommended fallback model instead of failing.
- **Hardening:**
  - Same-origin check, JSON-only requests and body-size limits.
  - zod validation. The client can never set the system prompt or model.
  - Per-IP rate limits and generic error messages.
  - CSP and security headers (`next.config.ts`).
  - Markdown is rendered without raw HTML.

## Testing

```bash
npm run typecheck && npm run lint && npm run build
COACH_MOCK=1 npx next start -p 3100 &
npm run test:e2e   # Playwright: 52 checks across desktop and mobile
```

## Before you launch

1. **Set a spend limit** for your API key's workspace in the Anthropic Console.
2. **Rate limiting** is in-memory and per-instance. On serverless or multi-instance hosting (Vercel, etc.), move it to Redis or Upstash, or use a WAF rule. Consider Cloudflare Turnstile if bots appear.
3. **Verify every hotline** in `src/lib/resources.ts` on the official sites. They were cross-checked in Nov 2026, but services change.
4. **Legal review** for your jurisdictions. Positioning is coaching, not therapy (see California SB 243 on companion chatbots and Illinois' WOPR Act on AI therapy). Add terms of service as needed.
5. Set `NEXT_PUBLIC_SITE_URL` to your domain.

## Project layout

```
src/
  app/            pages (/, /chat, /rewrite, /safety, /privacy) and API routes
  components/     UI (chat/, site/, shared)
  lib/            prompts, modes, resources (hotlines), schemas, storage, crisis detection, rate limit
tests/e2e.cjs     end-to-end smoke test
```
