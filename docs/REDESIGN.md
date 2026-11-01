# Redesign spec

Produced by a design audit using the installed `modern-web-design`, `motion-framer`, `animated-component-libraries`, `scroll-reveal-libraries` and `lightweight-3d-effects` skills. Brand: "evening light in a quiet room". The audience is often alone, upset, late at night, on a phone. **Calm, trust and safety beat flash.**

## Foundation (already built; use it, don't rewrite it)

**Motion setup**
- `MotionProvider` is mounted in `src/app/layout.tsx` with `LazyMotion strict` and `domMax` loaded asynchronously, plus `MotionConfig reducedMotion="user"`.
- **Every animated element must come from `import * as m from "motion/react-m"`** (`m.div`, `m.button`…). Using `motion.div` throws under `strict`.
- Hooks and `AnimatePresence` come from `"motion/react"`.

**`src/lib/motion.ts` tokens**
- `ease.calm`, `ease.exit`, `ease.inOut`
- `dur` fast 0.18 / base 0.28 / slow 0.5 / reveal 0.6
- `spring`:
  | Name | Stiffness / damping |
  |---|---|
  | press | 500/30 |
  | snappy | 420/32 |
  | gentle | 210/28 |
  | sheet | 320/34 |
  | drawer | 380/38 |
  | layout | 340/34 |
- `stagger` tight 0.04 / base 0.06 / loose 0.08
- `exitFade`

**Shared components**
- `src/components/motion/Reveal.tsx`: `<Reveal>`, `<Stagger>`, `<StaggerItem>`. Scroll reveals, `once`, with `data-reveal` so a `<noscript>` fallback shows them without JS.
- `src/components/motion/primitives.tsx`:
  - `PressLink` (Next Link with hover lift and press)
  - `PressButton`
  - `FadeSwap` (keyed crossfade)
  - `SegmentedControl` (sliding `layoutId` pill)
  - `DrawPath` (SVG `pathLength` draw on view)
  - `useAutoplay(ref, paused)`: true only when the element is in view, the tab is visible, it isn't hovered or focused, it isn't paused, and reduced motion is off.

**Icons, CSS and existing animations**
- `src/components/ModeIcon.tsx` gives line icons per mode. **Use it instead of the emoji in `modes.ts`.** `src/components/icons.tsx` has many line icons, including Shield, Book, Keyboard, Moon, Clipboard, Eye, Pause, Play, Server, Sparkle, Phone and MessageSquare.
- `globals.css` provides:
  - CSS tokens `--ease-calm`, `--ease-exit`, `--dur-fast`, `--dur-base`
  - smooth `<details>` through `interpolate-size`
  - `text-wrap: balance` on headings
- Area CSS files: `src/styles/landing.css`, `src/styles/chat.css`, `src/styles/pages.css`.
- Existing CSS keyframes in `globals.css`: `.rise`, `.fade`, `.breathe`, `.steam`, `.caret-wrap`.

## Motion rules (from the skills)

- No visible overshoot. Travel 24px or less. Scale 0.96 or more. Staggers 40–80ms, 0.4s total at most.
- Animate only `transform` and `opacity`. Never animate `box-shadow`; fade a shadow pseudo-element instead.
- At most one choreographed reveal per viewport. No parallax, scroll hijacking, magnetic buttons, cursor followers, tilt, Vanta or Zdog.
- **LCP: never put Motion `initial` on above-the-fold hero text.** Motion serialises `initial` into the SSR HTML as `opacity:0`. The h1 is not opacity-animated. The subtitle and CTAs may use the CSS `.rise` keyframe, which runs before JS.
- **No layout shift.** Reserve space for demo cards, skeletons, buttons that swap icons, and character counts.
- **Reduced motion.** `MotionConfig` handles transforms. Also use `useReducedMotion()` to stop autoplay loops (render the final frame) and to turn drawer and sheet slides into fades.
- **Targets of 44px or more** on touch. Keep the `:focus-visible` ring; use an inset ring inside `overflow-hidden` cards.
- **Contrast.** `text-muted` on `bg-subtle` is AA only, so don't use it under 14px. Raw `accent` (#C2704F) is decorative only; use `accent-text` for text. The eyebrow should be at least 12px.
- **Dark mode.** Sheets and cards need elevation (`bg-surface`, not `bg-bg`). No bright slabs at 2am.
- **No fake social proof.** No testimonials, user counts or count-up stats. Honest trust means published protocol and principles, research links, and "what we'll never do".

---

## A. Landing page (`src/app/page.tsx`, `src/components/site/*`)

Cut from ten sections to seven. The page stays a server component with small client islands.

### 1. Hero (new `HeroConversation.tsx`)

**Layout and copy**
- Grid `md:grid-cols-[1fr_1.05fr]`.
- h1: `clamp(2.75rem, 1.6rem + 4.2vw, 4.75rem)`, `leading-[1.02]`, balanced, so no lone "out." line.
- CTAs: `w-full sm:w-auto`, equal 48px height, `PressLink`.
- Replace the trust line with three honest fact pills, each with a line icon: "No account", "Saved only on your device", "Free".

**Centrepiece: a looping live session card** that replaces `TwoCups`. It reserves height (`min-h-[420px]`, 360px on mobile) and uses `shadow-lift`. Each beat:
1. The user bubble enters (opacity, y 8→0, `spring.gentle`).
2. A three-dot breathing indicator shows for 900ms.
3. The coach reply streams word by word at about 38ms per word.
4. A "See their side" chip shows a press state.
5. The card swaps to a **"Their side"** view: the tint moves from clay to evergreen, with an `AnimatePresence mode="wait"` crossfade. It ends on "Shared need: *to feel like a team*."
6. It holds 3.5s, then moves to the next of three scenarios. A dot pager uses a `layoutId` pill.

**Playback rules**
- Play only while `useAutoplay` is true, and include a visible **Pause/Play** button (WCAG 2.2.2).
- Under reduced motion, show the final frame statically.
- The first frame must be in the server HTML, so the card is never blank. Add an sr-only transcript with `aria-live="off"`.

**Mobile and background**
- On mobile the card sits directly under the CTAs, within the first 1.3 screens.
- Background: replace the two radial blobs with one warm radial on a `::before` that drifts slowly (CSS translate ±3%, 40s, alternate). It stops under reduced motion.

### 2. "Fair, not flattering" (moved up to second)
- One user message: "They made the decision without me. Again."
- A `SegmentedControl` ("A typical chatbot" / "Common Ground") crossfades the reply.
- The four principles go on the right, staggered.

### 3. Bento "What it helps with" (merges the Demo and Modes sections)
- Grid `lg:grid-cols-6`:
  - Live `RewriteDemo` tile: col-span-4, row-span-2.
  - "See their side" tile: span 2.
  - "Prep sheet" tile: span 2, a mini paper preview at −1.5° that straightens on hover.
  - Six compact mode tiles, using `ModeIcon` and linking to `/chat?mode=`.
- Tile hover: y −2 plus a shadow pseudo-element fading in.

### 4. How it works
- Three steps joined by an SVG line drawn with `DrawPath`. Step numbers pop in sequence (scale 0.9→1, stagger 0.15).
- On mobile the layout is vertical, with the line down the left.

### 5. "Why you can trust it" bento (merges Privacy and Research)
- A big typographic statement: "No account. No trackers. No chats on our servers."
- An "Esc twice to leave" tile with an animated `<kbd>` press that loops every 4s while in view.
- A research chips tile: EFT / Gottman / IBCT / communication skills.
- "Read the rules the coach follows", linking to `/safety`.

### 6. Safety note and FAQ
- Keep the calm-blue "What it isn't" block.
- FAQ: the CSS `details` animation is already global. Rotate the "+" 45° over 0.3s.

### 7. Final CTA
- Replace the slab with a **real composer**: a "What's on your mind?" input plus three starter chips.
  - Submit writes the text to `sessionStorage["cg.prefill"]`, which `/chat` already reads.
  - Then `router.push("/chat")`.
- Background: `bg-surface` with an evening gradient in both themes. No mint slab.
- A small two-cups mark with steam drawn through `DrawPath`.

### Header and footer
- `useScroll`: past 8px of scroll, the border and shadow fade in (opacity).
- On mobile, add a 44px lifebuoy icon linking to `/safety`.
- Keep the "Start talking" CTA.

## B. Chat (`src/components/chat/*`, `Sheet.tsx`, `HelpPanel.tsx`, `Resources.tsx`)

**Messages**
- `m.div` with `initial={{opacity:0,y:8,scale:0.985}}` and `spring.gentle`. Transform origin is bottom-right for the user and bottom-left for the coach.
- **Only animate messages created this session.** History uses `initial={false}`.
- The action row fades in after streaming ends. Follow-up chips stagger at 0.05s.
- `CopyButton` swaps its icon through `AnimatePresence mode="popLayout"`.
- Action buttons are 44px.

**Streaming**
- `useSmoothStream(text, streaming)`: a rAF loop drains at `max(45 chars/s, backlog/0.6s)`.
- Reserve `min-h` while streaming, with no layout animation on the bubble.
- Thinking state: three staggered breathing dots. After 4s, crossfade to "Taking a moment with this…".

**Composer**
- The send/stop swap uses `AnimatePresence mode="wait"` (rotate −90→0, scale 0.8→1, 0.18s) in a fixed 40px box.
- The enabled state animates in, and the disabled state looks intentional, not like a faded blob.
- Use `field-sizing: content`, keeping the JS fallback.

**Empty state**
- Don't fade the whole region; stagger the cards.
- The mode picker's selected highlight is `m.div layoutId="mode-active"`.
- On mobile: `snap-x`, an edge-fade `mask-image`, and the selected card scrolls into the centre.
- The greeting swaps with `FadeSwap` keyed by mode. Starters stagger at 0.04s.
- A small steaming-cups mark above the heading.
- Time-aware subtitle between 22:00 and 05:00: "It's late. Take your time — there's no rush here."
- The line "Saved only on this device · Esc twice to leave".

**Header**
- One line: title, then a mode chip with `ModeIcon` and the `short` label.
- 44px targets.

**Sidebar**
- Active item: `layoutId="conv-active"` pill.
- Items sit in `AnimatePresence` with `layout`; exit is opacity 0, x −8.
- Mobile drawer: x −100%→0 (`spring.drawer`), with the backdrop fading over 0.2s.
  - Use `drag="x"` with `dragConstraints={{ right: 0 }}`.
  - Close when offset < −80 or velocity < −400.

**Sheets (`Sheet.tsx`)**
- Always inside `AnimatePresence`.
- Desktop: opacity, y 8→0, scale 0.97→1, spring 260/30.
- Mobile: y 100%→0 (`spring.sheet`). When dismissible, add a drag handle with `drag="y"`; close on offset > 120 or velocity > 500.
- Exit: 0.18s with `ease.exit`. Restore focus after exit.
- Panel background is `bg-surface`.
- Welcome sheet: line icons, with items staggered after the sheet lands.

**Crisis card: calm, never alarming**
- Entrance: opacity plus y 6, 0.5s `ease.calm`. No spring, pulse, shake or colour flash.
- Gentle `scrollIntoView({block:"nearest"})`.
- Title on one line in 17px serif, with the icon in a 32px soft circle.
- Each hotline is a full-width 48px row with Call/Text buttons.
- Dismiss and "See all options" get 44px targets.
- Safety blue only, never red.

**Help panel**
- Resource cards stagger at 0.05s.
- A region change crossfades the list (keyed `popLayout`).

**Accessibility**
- Remove `aria-live` from the scroll region.
- Announce only completed coach replies through a separate sr-only `role="status"`.

## C. Rewriter, Safety, Privacy (`src/app/{rewrite,safety,privacy}/page.tsx`, `src/components/site/Rewriter.tsx`, `SafetyResources.tsx`)

**Rewriter**
- One `Stagger` results container in order: feeling, Gentle, Direct, Brief, What changed, coach CTA. This fixes the current gap and ordering bug.
- Skeleton ↔ results through `AnimatePresence mode="wait"`, with skeleton heights matching the results.
- Three visible example chips.
- Fixed-width submit button whose label crossfades to "Finding calmer words…".
- On copy, the card border goes to primary for 600ms.
- Dark mode: the result bubble gets `border-primary/20`.
- Hero with a before→after visual.

**Safety**
- A sticky band: "In danger now? Call {emergency}", using the detected region.
- The protocol as "Will / Won't" cards. Won't items use a muted ✕, never red.
- An on-page table of contents.
- `Reveal` only. This page should feel still.

**Privacy**
- Replace the table with a data-flow diagram: Your device → our server ("passes through, not stored") → Anthropic ("processes; may retain briefly for safety"). One dot travels the path once on view.
- Add a real "Delete everything on this device" button (use `wipeEverything` from `src/lib/storage.ts`).
- On mobile the rows stack as cards.
