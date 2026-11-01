# Common Ground — Build Plan

> **Talk it through before you talk it out.**
> A private, no-signup AI relationship coach that is *fair, not flattering*.

This plan is built from three research briefs (relationship psychology and safety, competitors and UX, tech stack), each produced by a research subagent. Key findings are summarised inline.

---

## 1. Product thesis (from research)

| Gap in the market | How Common Ground answers it |
|---|---|
| Most couples apps need **both partners** to sign up, but most conflicts get worked through alone, late at night | Built for **one person**, on their phone, in the moment |
| **Paywalls and billing** are the #1 reason for 1-star reviews (Paired, Lasting, Rosebud) | Free and no account. Nothing to cancel |
| General chatbots are **sycophantic**. A 2026 Stanford/*Science* study found models affirm users 49% more often than humans do, which made users *less* willing to repair | A "**fair witness**" coach: it validates feelings, not verdicts, and offers a built-in **"See their side"** tool |
| Nearly every competitor is a **mobile app** that requires signup | Web-first. First message within 5 seconds. Chats are **stored only on your device** |
| Abuse is often treated as a "communication problem" | A dedicated **safety layer**: coercive-control red flags, never suggesting couples counselling where there is abuse, region-aware hotlines, and a quick-exit button |

Positioning: **coaching, never therapy.** This matters legally: California SB 243 (companion chatbots) and the Illinois WOPR Act (AI therapy ban). We disclose that the user is talking to an AI, publish our crisis protocol, and recommend licensed professionals when appropriate.

---

## 2. Feature scope (MVP, ranked by impact vs. effort)

1. **Guided modes**. Each has its own prompt addendum, opening line and starter chips:
   - 💬 **Talk it through**: open conversation, venting welcome
   - 🧭 **Understand a conflict**: map the cycle (EFT pursue-withdraw, Gottman's Four Horsemen)
   - 🗣️ **Prepare for a hard talk**: ends in a printable **prep sheet** (opener, key points, what to avoid, what to do if it escalates)
   - ✉️ **Write a message**: draft texts and letters with the user
   - 🌱 **Dating & early days**: dating, mixed signals, defining the relationship
   - 🌧️ **After a breakup**: grief, closure, no-contact, rebuilding
2. **Message rewriter** (`/rewrite`), a standalone tool. Paste a heated text and get three calmer versions (Gentle / Direct / Brief) with one-tap copy, plus a short "what changed and why". Uses structured JSON output.
3. **"See their side"** action under coach replies. It steelmans the other person's view and names the shared need underneath (our main answer to sycophancy).
4. **Fairness built into the system prompt**. Hear one side, don't diagnose absent people (no "narcissist" or "gaslighter" labels), don't push a user to break up or to stay, gently surface the user's own part.
5. **Local-only history**: a conversation list, rename/delete, "Delete everything", and Markdown export.
6. **Safety layer**:
   - The model is trained by its prompt to recognise IPV, coercive control, suicidality, child abuse and sexual assault, and respond with best-practice scripts.
   - **Client-side crisis detection** (regex on the user's text) adds a calm "You deserve real support too" card in-chat with region-matched hotlines. It does not depend on the model.
   - A persistent **"Get help now"** button opens a resources panel (US / UK / IE / CA / AU / international).
   - **Quick exit**: a button plus pressing Esc twice. It replaces the page with a neutral site, so Back doesn't return.
   - A published **/safety** page holds the crisis protocol (SB 243).
7. **Welcome sheet** on first chat: AI-not-therapist notice, privacy note, and an age check. **Under-18** turns on a teen safety addendum (youth lines, no sexual content, encourage a trusted adult).
8. **Optional personal context**: your name, the other person's name, country. Stored locally and sent with the conversation. Country picks which hotlines appear.
9. **Stop / regenerate / copy** on messages. Markdown rendering. Streaming with no layout jump.

**Post-MVP (not now):** accounts and encrypted sync, voice, shared partner space, payments.

---

## 3. Coaching approach (system-prompt design)

Evidence weighting from the research: **EFT and behavioural couple therapy (IBCT)** are strongest. **Gottman's observational research** and **PREP speaker-listener** are moderate. **NVC, Imago and attachment "styles"** are used only as communication tools and are never presented as science.

Conversation arc: **safety screen (always) → understand (1–2 questions at a time) → reflect feeling → clarify the goal ("ideas, or mostly to be heard?") → widen the view → 1–2 concrete options or scripts → small next step.**

Techniques the model can use: soft startup ("I feel… about… I need…"), Four Horsemen and their antidotes, repair attempts, bids for connection, naming the cycle as the enemy, the softer emotion underneath, IBCT unified detachment, the NVC four steps, speaker-listener, and a 20-minute self-soothing break when flooded.

Declines and redirects: monitoring or stalking a partner, getting around blocks or protective orders, manipulation (making someone jealous, "dread game", love-bombing), revenge, sharing intimate images, diagnosing third parties. It always redirects to the underlying need. If a user describes their *own* harmful behaviour, the coach responds without shame and points to accountability resources.

Abuse handling rules: believe the user and name the pattern. Ask "are you safe right now?" Give hotlines and safety-planning basics. **Never** suggest couples counselling, confronting the abuser, appeasement scripts or "just leave". Leaving is the most dangerous time, so plan it with an advocate.

Hotlines were verified through multiple listings by the research subagent. US: NDVH 1-800-799-7233 / text START to 88788, 988, RAINN 800-656-4673, Crisis Text Line HOME to 741741, love is respect 1-866-331-9474 / LOVEIS to 22522, Childhelp 1-800-422-4453. Also UK, IE, CA and AU lines, plus findahelpline.com as the fallback for everywhere else.

---

## 4. Architecture

```
Browser (Next.js client)                      Server (Next.js route handlers, Node runtime)
┌──────────────────────────────┐              ┌────────────────────────────────────────────┐
│ /chat  React chat UI         │  POST JSON   │ /api/chat                                  │
│  • conversations in          │ ───────────► │  origin check → rate limit (per IP)        │
│    localStorage (on-device)  │              │  → zod validation → history cap            │
│  • crisis regex → help card  │ ◄─────────── │  → Claude Messages API (streaming)         │
│  • NDJSON stream reader      │   NDJSON     │     system = [core prompt ⟂cache] + [mode] │
│                              │   stream     │     + top-level auto-cache for history     │
│ /rewrite  rewriter UI        │ ───────────► │ /api/rewrite → structured JSON (3 variants)│
└──────────────────────────────┘              └────────────────────────────────────────────┘
```

- **Stack:** Next.js 16.4 (App Router, Turbopack), React 19.3, TypeScript 5.9 (not 7: Next still pins ^5), Tailwind CSS 4.3 (CSS-first `@theme`), `@anthropic-ai/sdk` 1.3, zod, react-markdown + remark-gfm.
- **Model:** `claude-opus-5-5`, configurable through the `COACH_MODEL` env var. Effort is `medium`, because coaching quality matters more than speed. Thinking is adaptive (always on for this model). Server-side **refusal fallbacks** (`fallbacks: "default"`) re-run a declined request on another model instead of failing. No `temperature` (it returns 400 on the current API version).
- **Prompt caching:** the large core system prompt is byte-stable with an explicit cache breakpoint. The per-mode addendum comes after it. Top-level automatic caching covers the growing history. The history cap trims old turns in chunks so the cache prefix stays stable.
- **Streaming protocol:** newline-delimited JSON events `{type:"text"|"done"|"error"}`, so the client can tell the final stop reason and errors apart from text.
- **Privacy:** no database and no accounts. Messages pass through the server to the model provider and are not stored or logged. History lives only in the browser.
- **Hardening:**
  - In-memory per-IP rate limit (20 per 10 min, 150 per day) and a body-size cap.
  - Message length limit, role validation and last-message-must-be-user check. The client can never supply the system prompt or model.
  - Same-origin check.
  - Generic error messages. The API key stays server-only (`server-only` import).
  - Security headers: CSP, frame-ancestors none, nosniff, Referrer-Policy, Permissions-Policy, HSTS.
  - react-markdown with no raw HTML, and external links set to `noopener`.

## 5. Visual design

"Evening light in a quiet room." Warm oat background, deep evergreen for trust, clay as the human accent, a calm blue for safety (never alarm red). **No hearts or pink.**

- Light: bg `#FAF6F1`, surface `#FFFFFF`, text `#2B2A33`, muted `#6B6570`, primary `#2F5D50`, accent `#C2704F`, user bubble `#F6E3D6`, coach bubble `#E6EDE7`, safety `#3E6A8A`, border `#E4DCD2`.
- Dark (follows the system setting): bg `#1B1A1F`, surface `#25242A`, text `#EDE7DF`, primary `#86BBA8`, accent `#E3977A`.
- Type: **Fraunces** for headings, **DM Sans** for body. Chat text 17px with 1.6 line height. Inputs are 16px or larger (prevents iOS zoom).
- Rounded 16–20px cards, soft shadows, 200–300ms ease-out motion, a "breathing" typing dot. Hand-drawn two-cups line illustration.
- Mobile-first: composer pinned to the bottom with safe-area padding, horizontally scrolling mode chips, quick exit in the thumb zone.

## 6. Pages

| Route | Contents |
|---|---|
| `/` | Hero → animated rewrite demo → how it works → six modes → "Fair, not flattering" → privacy → limits and safety → FAQ → final CTA |
| `/chat` | Sidebar (history, new chat, settings), mode picker, message list, composer, help panel, welcome sheet |
| `/rewrite` | Message rewriter |
| `/safety` | Crisis protocol, hotlines by region, what the coach will and won't do |
| `/privacy` | Plain-language privacy |

## 7. Build steps

1. Scaffold Next 16 + Tailwind 4 + TS 5.9. Add dependencies, design tokens and fonts.
2. Write the system prompt modules (core, modes, teen addendum, rewriter) and the hotline data.
3. Build the API routes: chat streaming and rewrite structured output, with hardening.
4. Build the chat UI: storage, streaming, modes, safety card, help panel, quick exit, welcome sheet, export.
5. Build the landing, rewrite, safety and privacy pages.
6. QA: typecheck, lint, production build, and Playwright end-to-end tests on desktop and mobile with a **mock model mode** (`COACH_MOCK=1`, since there is no API key in this environment). Screenshots in light and dark mode. Fix whatever turns up.
7. README with setup and deployment notes, then commit.

## 8. Before going live (for the owner)

- Set `ANTHROPIC_API_KEY` and a **spend limit** in the Anthropic Console.
- On serverless or multi-instance hosting, move the rate limiter to Redis/Upstash.
- Check each hotline once on its official site. Get legal review for your jurisdictions (SB 243, Illinois WOPR).
- Optional: Cloudflare Turnstile if bots appear.
