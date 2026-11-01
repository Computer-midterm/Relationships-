"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useReducer, useRef, useState } from "react";
import { useAutoplay } from "@/components/motion/primitives";
import { dur, ease } from "@/lib/motion";
import { DotPager, PlayPauseButton, usePrefersReducedMotion } from "./landing/demo";

const EXAMPLES = [
  {
    before: "Wow. You cancelled AGAIN. You obviously don't care about me at all. Whatever.",
    after: "I felt really hurt when tonight got cancelled again. I miss you — can we find a time we both protect?",
    feeling: "hurt · wanting to feel like a priority",
  },
  {
    before: "I'm sick of doing everything around here while you sit on your phone.",
    after: "I've been feeling stretched thin with the housework lately. Could we sit down this weekend and make a plan together?",
    feeling: "overwhelmed · wanting to feel like a team",
  },
  {
    before: "Fine, go out with your friends again. Don't bother texting me.",
    after: "I'm glad you're seeing your friends. I've been missing time with you, though — could we plan something just us this week?",
    feeling: "lonely · wanting connection",
  },
];

const AFTER_WORDS = EXAMPLES.map((e) => e.after.split(" "));
const WORD_MS = 55;

type Phase = "before" | "stream" | "hold";
type State = { i: number; phase: Phase; n: number };
type Action = { type: "advance" } | { type: "tick" } | { type: "goto"; i: number; fromStart: boolean };

function reducer(st: State, a: Action): State {
  switch (a.type) {
    case "tick": {
      if (st.phase !== "stream") return st;
      const n = st.n + 1;
      return n >= AFTER_WORDS[st.i].length ? { ...st, n, phase: "hold" } : { ...st, n };
    }
    case "advance":
      if (st.phase === "before") return { ...st, phase: "stream" };
      if (st.phase === "stream") return { ...st, phase: "hold", n: AFTER_WORDS[st.i].length };
      return { i: (st.i + 1) % EXAMPLES.length, phase: "before", n: 0 };
    case "goto":
      return a.fromStart ? { i: a.i, phase: "before", n: 0 } : { i: a.i, phase: "hold", n: AFTER_WORDS[a.i].length };
  }
}

/** Looping before → after demo of the message rewriter. Pauses off-screen, on hover/focus, and on request. */
export function RewriteDemo() {
  // First frame (server HTML) is a finished example, so the tile is never blank.
  const [state, dispatch] = useReducer(reducer, { i: 0, phase: "hold", n: AFTER_WORDS[0].length });
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
    const id = setTimeout(() => dispatch({ type: "advance" }), state.phase === "before" ? 1300 : 4200);
    return () => clearTimeout(id);
  }, [playing, state.phase]);

  const ex = EXAMPLES[state.i];
  const n = reduce ? AFTER_WORDS[state.i].length : state.n;
  const phase: Phase = reduce ? "hold" : state.phase;

  return (
    <div className="flex flex-1 flex-col">
      <div ref={bodyRef} className="grid flex-1 content-center" aria-hidden>
        {/* Sizer: all examples stacked invisibly → fixed height, no layout shift. */}
        {EXAMPLES.map((e, k) => (
          <div key={k} className="invisible [grid-area:1/1]">
            <Frame ex={e} shown={e.after} phase="hold" />
          </div>
        ))}
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={state.i}
            className="[grid-area:1/1]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: { duration: dur.base + 0.07, ease: ease.calm } }}
            exit={{ opacity: 0, transition: { duration: dur.fast, ease: ease.exit } }}
          >
            <Frame ex={ex} shown={AFTER_WORDS[state.i].slice(0, n).join(" ")} phase={phase} />
          </m.div>
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <DotPager count={EXAMPLES.length} index={state.i} layoutId="rewrite-dot" label="Rewrite examples" onSelect={(k) => dispatch({ type: "goto", i: k, fromStart: playing })} />
        <PlayPauseButton paused={paused} onToggle={() => setPaused((p) => !p)} label="rewrite examples" hidden={reduce} />
      </div>

      <div className="sr-only" aria-live="off">
        {EXAMPLES.map((e, k) => (
          <p key={k}>
            Example {k + 1}: “{e.before}” could become “{e.after}”
          </p>
        ))}
      </div>
    </div>
  );
}

function Frame({ ex, shown, phase }: { ex: (typeof EXAMPLES)[number]; shown: string; phase: Phase }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">What you typed</div>
        <p className="mt-2 rounded-2xl bg-subtle px-4 py-3 text-[15.5px] leading-relaxed text-ink/75 line-through decoration-accent/60 decoration-[1.5px]">{ex.before}</p>
      </div>
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">What you could send</div>
          <m.div className="text-[13px] text-accent-text" initial={false} animate={{ opacity: phase === "before" ? 0 : 1 }} transition={{ duration: dur.base }}>
            {ex.feeling}
          </m.div>
        </div>
        <p className="mt-2 rounded-2xl rounded-bl-md border border-primary/15 bg-bubble-coach px-4 py-3 text-[15.5px] leading-relaxed text-ink">
          {phase === "before" ? <span className="text-muted">Finding calmer words…</span> : shown}
          {phase === "stream" && <span className="breathe ml-1.5 inline-block h-2 w-2 rounded-full bg-primary align-middle" />}
          {/* keep the bubble at least one line tall */}
          {phase !== "before" && !shown && <span className="invisible">.</span>}
        </p>
      </div>
    </div>
  );
}
