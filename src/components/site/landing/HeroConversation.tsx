"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useReducer, useRef, useState } from "react";
import { ModeIcon } from "@/components/ModeIcon";
import { IconEye } from "@/components/icons";
import { useAutoplay } from "@/components/motion/primitives";
import { getMode, type ModeId } from "@/lib/modes";
import { dur, ease, spring } from "@/lib/motion";
import { DotPager, PlayPauseButton, TypingDots, usePrefersReducedMotion } from "./demo";

type Scenario = { mode: ModeId; user: string; coach: string; theirs: string; need: string };

const SCENARIOS: Scenario[] = [
  {
    mode: "conflict",
    user: "I asked for help with the dishes again and got an eye-roll. I'm so tired of being the only one who notices what needs doing.",
    coach:
      "That sounds exhausting — carrying the noticing on top of the doing. Before we work out what to say, what did the eye-roll feel like? More dismissed, or more alone in it?",
    theirs: "“Again” might land as a verdict that they’re failing. The eye-roll could be bracing against feeling like the bad guy — not a sign they don’t care.",
    need: "to feel like a team",
  },
  {
    mode: "talk",
    user: "They were on their phone all through dinner. I said “forget it” and went to bed.",
    coach:
      "Feeling invisible across the table is lonely, and it makes sense you shut down. What did you most want in that moment — for them to notice you, or to actually talk?",
    theirs: "They may not have noticed you pulling away until it was over — and woke up unsure what went wrong, afraid to ask in case it starts another fight.",
    need: "to feel noticed by each other",
  },
  {
    mode: "message",
    user: "They haven't replied in two days. Should I just send “k, got it” and be done?",
    coach:
      "Two days of silence can feel like an answer. “k, got it” might protect you for a minute — but would it say what you actually feel? Let's find something you'd be glad you sent.",
    theirs: "They might be overwhelmed, or worried a slow reply has already let you down — so every hour it gets harder to write back.",
    need: "to feel safe reaching out",
  },
];

const words = (s: string) => s.split(" ");
const COACH_WORDS = SCENARIOS.map((s) => words(s.coach));

/* ------------------------------------------------------------------ */
/* Playback state                                                      */
/* ------------------------------------------------------------------ */

type Phase = "user" | "typing" | "stream" | "read" | "press" | "theirs";
type State = { s: number; phase: Phase; n: number };
type Action = { type: "advance" } | { type: "tick" } | { type: "goto"; s: number; fromStart: boolean };

const NEXT: Record<Exclude<Phase, "stream" | "theirs">, Phase> = { user: "typing", typing: "stream", read: "press", press: "theirs" };

function reducer(st: State, a: Action): State {
  switch (a.type) {
    case "tick": {
      if (st.phase !== "stream") return st;
      const n = st.n + 1;
      return n >= COACH_WORDS[st.s].length ? { ...st, n, phase: "read" } : { ...st, n };
    }
    case "advance":
      if (st.phase === "theirs") return { s: (st.s + 1) % SCENARIOS.length, phase: "user", n: 0 };
      if (st.phase === "stream") return { ...st, n: COACH_WORDS[st.s].length, phase: "read" };
      return { ...st, phase: NEXT[st.phase] };
    case "goto":
      return a.fromStart ? { s: a.s, phase: "user", n: 0 } : { s: a.s, phase: "read", n: COACH_WORDS[a.s].length };
  }
}

// How long each phase lasts while playing (ms). "stream" is driven by ticks.
const WORD_MS = 38;
const HOLD: Record<Exclude<Phase, "stream">, (s: number) => number> = {
  user: () => 850,
  typing: () => 900,
  read: () => 1700,
  press: () => 520,
  // ~3.5s, stretched a little for the longer "their side" texts so they can be read.
  theirs: (s) => Math.max(3500, words(SCENARIOS[s].theirs).length * 190),
};

/* ------------------------------------------------------------------ */

export function HeroConversation() {
  // First frame (server HTML): scenario 1 fully written, chip showing.
  const [state, dispatch] = useReducer(reducer, { s: 0, phase: "read", n: COACH_WORDS[0].length });
  const [paused, setPaused] = useState(false);
  const reduce = usePrefersReducedMotion();
  const bodyRef = useRef<HTMLDivElement>(null);
  const playing = useAutoplay(bodyRef, paused);

  useEffect(() => {
    if (!playing) return;
    if (state.phase === "stream") {
      const id = setInterval(() => dispatch({ type: "tick" }), WORD_MS);
      return () => clearInterval(id);
    }
    const id = setTimeout(() => dispatch({ type: "advance" }), HOLD[state.phase](state.s));
    return () => clearTimeout(id);
  }, [playing, state.phase, state.s]);

  // Reduced motion: no loop, show each scenario's final frame.
  const phase: Phase = reduce ? "theirs" : state.phase;
  const sc = SCENARIOS[state.s];
  const view = phase === "theirs" ? "theirs" : "yours";

  return (
    <div className="relative isolate flex min-h-[360px] flex-col overflow-hidden rounded-[26px] border border-line bg-surface shadow-lift md:min-h-[420px]">
      {/* Tint: clay for your side, evergreen for theirs (opacity only). */}
      <div className="hero-tint hero-tint-clay" aria-hidden />
      <m.div className="hero-tint hero-tint-green" aria-hidden initial={false} animate={{ opacity: view === "theirs" ? 1 : 0 }} transition={{ duration: dur.slow + 0.2, ease: ease.inOut }} />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 pt-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-bubble-coach text-primary">
            <ModeIcon mode={sc.mode} size={17} />
          </span>
          <div className="min-w-0 text-[14px] font-medium text-ink">
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={sc.mode}
                className="block truncate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: dur.base } }}
                exit={{ opacity: 0, transition: { duration: dur.fast, ease: ease.exit } }}
              >
                {getMode(sc.mode).label}
              </m.span>
            </AnimatePresence>
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-line bg-surface/70 px-2.5 py-1 text-[12px] font-medium text-muted">Example</span>
      </div>

      {/* Conversation. Visual only; the sr-only transcript below carries the content. */}
      <div ref={bodyRef} className="grid flex-1 px-5 pb-2 pt-5 sm:px-6" aria-hidden>
        {/* Sizer: every frame stacked invisibly so the card never changes height. */}
        {SCENARIOS.map((x, k) => (
          <div key={`size-yours-${k}`} className="invisible [grid-area:1/1]">
            <YoursView sc={x} phase="read" n={COACH_WORDS[k].length} enter={false} />
          </div>
        ))}
        {SCENARIOS.map((x, k) => (
          <div key={`size-theirs-${k}`} className="invisible [grid-area:1/1]">
            <TheirsView sc={x} />
          </div>
        ))}

        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={`${state.s}-${view}`}
            className="[grid-area:1/1]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: dur.base + 0.07, ease: ease.calm } }}
            exit={{ opacity: 0, transition: { duration: dur.fast + 0.04, ease: ease.exit } }}
          >
            {view === "yours" ? <YoursView sc={sc} phase={phase} n={state.n} enter={phase === "user"} /> : <TheirsView sc={sc} />}
          </m.div>
        </AnimatePresence>
      </div>

      {/* Footer controls */}
      <div className="flex items-center justify-between gap-2 border-t border-line/60 px-3 sm:px-4">
        <DotPager
          count={SCENARIOS.length}
          index={state.s}
          layoutId="hero-dot"
          label="Example conversations"
          onSelect={(k) => dispatch({ type: "goto", s: k, fromStart: playing })}
        />
        <p className="truncate text-[13px] text-muted" aria-hidden>
          {view === "theirs" ? "Seeing their side" : "Your side"}
        </p>
        <PlayPauseButton paused={paused} onToggle={() => setPaused((p) => !p)} label="example conversation" hidden={reduce} />
      </div>

      {/* Screen-reader transcript (static, never announced on change). */}
      <div className="sr-only" aria-live="off">
        <p>Example conversations with the coach:</p>
        {SCENARIOS.map((x, k) => (
          <div key={k}>
            <p>
              Example {k + 1}, {getMode(x.mode).label}. You: {x.user}
            </p>
            <p>Coach: {x.coach}</p>
            <p>
              See their side: {x.theirs} Shared need: {x.need}.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Frames                                                              */
/* ------------------------------------------------------------------ */

function YoursView({ sc, phase, n, enter }: { sc: Scenario; phase: Phase; n: number; enter: boolean }) {
  const all = words(sc.coach);
  const showChip = phase === "read" || phase === "press";
  return (
    <div className="flex flex-col gap-3">
      <m.div
        className="ml-auto max-w-[86%] rounded-[20px] rounded-br-md bg-bubble-user px-4 py-3 text-[15px] leading-relaxed text-ink"
        initial={enter ? { opacity: 0, y: 8 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.gentle}
      >
        {sc.user}
      </m.div>

      <div className="mr-auto max-w-[90%]">
        {phase === "typing" && (
          <m.div
            className="inline-flex rounded-[20px] rounded-bl-md bg-bubble-coach px-4 py-3.5"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring.gentle}
          >
            <TypingDots />
          </m.div>
        )}
        {phase !== "user" && phase !== "typing" && (
          <div className="rounded-[20px] rounded-bl-md bg-bubble-coach px-4 py-3 text-[15px] leading-relaxed text-ink">
            {all.slice(0, n).join(" ")}
            {phase === "stream" && <span className="breathe ml-1.5 inline-block h-2 w-2 rounded-full bg-primary align-middle" />}
          </div>
        )}
      </div>

      {/* Chip space is always reserved; only its opacity changes. */}
      <m.div className="flex" initial={false} animate={{ opacity: showChip ? 1 : 0 }} transition={{ duration: dur.base, ease: ease.calm }}>
        <m.span
          className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors duration-200 ${
            phase === "press" ? "border-primary/50 bg-bubble-coach text-primary" : "border-line bg-surface text-ink"
          }`}
          initial={false}
          animate={{ scale: phase === "press" ? 0.96 : 1 }}
          transition={spring.press}
        >
          <IconEye size={16} />
          See their side
        </m.span>
      </m.div>
    </div>
  );
}

function TheirsView({ sc }: { sc: Scenario }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <IconEye size={17} />
        Their side
      </div>
      <p className="mt-2 line-clamp-2 text-[14px] leading-snug text-muted">You said: {sc.user}</p>
      <p className="mt-4 font-display text-[19px] leading-[1.4] text-ink sm:text-[20px]">{sc.theirs}</p>
      <p className="mt-5 self-start rounded-2xl border border-primary/20 bg-bubble-coach px-4 py-2.5 text-[15px] text-ink">
        Shared need: <em className="font-display text-[17px] text-primary">{sc.need}</em>.
      </p>
    </div>
  );
}
