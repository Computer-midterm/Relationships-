"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState } from "react";
import { MODES, getMode, type ModeId } from "@/lib/modes";
import { dur, ease, spring } from "@/lib/motion";
import { FadeSwap } from "../motion/primitives";
import { ModeIcon } from "../ModeIcon";
import { IconLock } from "../icons";
import { CupsMark } from "./CupsMark";

const rail = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};
const card = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: dur.base + 0.1, ease: ease.calm } },
};
const starters = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.12 } },
};
const starter = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: spring.gentle },
};

function isLate() {
  const h = new Date().getHours();
  return h >= 22 || h < 5;
}

export function EmptyState({
  mode,
  setMode,
  name,
  onStarter,
}: {
  mode: ModeId;
  setMode: (m: ModeId) => void;
  name?: string;
  onStarter: (t: string) => void;
}) {
  const current = getMode(mode);
  const [late] = useState(isLate);
  const railRef = useRef<HTMLDivElement>(null);
  const firstScroll = useRef(true);
  const reduce = useReducedMotion();

  // On the phone rail, bring the selected card to the centre.
  useEffect(() => {
    const el = railRef.current;
    const target = el?.querySelector<HTMLElement>(`[data-mode="${mode}"]`);
    if (!el || !target || el.scrollWidth <= el.clientWidth + 1) return;
    const left = target.offsetLeft - (el.clientWidth - target.offsetWidth) / 2;
    el.scrollTo({ left: Math.max(0, left), behavior: firstScroll.current || reduce ? "auto" : "smooth" });
    firstScroll.current = false;
  }, [mode, reduce]);

  return (
    <div>
      <div className="mb-6 pt-1 text-center sm:mb-7 sm:pt-2">
        <CupsMark className="mx-auto mb-2.5 h-12 w-auto" />
        <h1 className="text-[29px] font-medium leading-[1.15] text-ink sm:text-[38px]">
          {name ? `Hi ${name}. ` : ""}What would help right now?
        </h1>
        <p className="mx-auto mt-2.5 max-w-md text-[15.5px] leading-relaxed text-muted">
          {late ? "It's late. Take your time — there's no rush here." : "Pick a starting point, or just start typing below."}
        </p>
      </div>

      <m.div
        ref={railRef}
        layoutScroll
        role="radiogroup"
        aria-label="Choose a mode"
        className="mode-rail no-scrollbar relative -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2 pt-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0"
        variants={rail}
        initial="hidden"
        animate="visible"
      >
        {MODES.map((x) => {
          const on = x.id === mode;
          return (
            <m.button
              key={x.id}
              data-mode={x.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setMode(x.id)}
              variants={card}
              whileTap={{ scale: 0.98 }}
              className={`group relative shrink-0 whitespace-nowrap rounded-2xl border py-2.5 pl-2.5 pr-4 text-left sm:whitespace-normal sm:p-3.5 transition-colors duration-200 sm:min-w-0 ${
                on ? "border-transparent" : "border-line bg-surface/55 hover:border-primary/35 hover:bg-surface"
              }`}
            >
              {on && (
                <m.span
                  layoutId="mode-active"
                  aria-hidden
                  className="absolute -inset-px rounded-2xl border-[1.5px] border-primary bg-surface shadow-soft ring-4 ring-(--ring)/50"
                  transition={spring.layout}
                />
              )}
              <span className="relative flex items-center gap-2.5">
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors duration-200 sm:h-8 sm:w-8 ${
                    on ? "bg-bubble-coach text-primary" : "bg-subtle text-muted group-hover:text-primary"
                  }`}
                >
                  <ModeIcon mode={x.id} size={18} />
                </span>
                <span className="block text-[15px] font-medium leading-snug text-ink">{x.label}</span>
              </span>
              <span className="relative mt-2 hidden text-[13.5px] leading-snug text-muted sm:block">{x.description}</span>
            </m.button>
          );
        })}
      </m.div>

      <div className="mt-6 min-h-[4.9rem] sm:min-h-[3.2rem] sm:max-w-[88%]">
        <FadeSwap swapKey={current.id}>
          <div className="rounded-[22px] rounded-bl-md bg-bubble-coach px-4 py-3 text-[16.5px] leading-relaxed text-ink">{current.greeting}</div>
        </FadeSwap>
      </div>

      <m.div key={current.id} className="mt-3 flex flex-wrap gap-2" variants={starters} initial="hidden" animate="visible" role="group" aria-label="Conversation starters">
        {current.starters.map((s) => (
          <m.button key={s} type="button" onClick={() => onStarter(s)} className="chip min-h-11 text-left" variants={starter} whileTap={{ scale: 0.98 }}>
            {s}
          </m.button>
        ))}
      </m.div>

      <p className="mt-7 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[13px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <IconLock size={13} /> Saved only on this device
        </span>
        <span aria-hidden>·</span>
        <span>
          <kbd className="kbd">Esc</kbd> twice to leave
        </span>
      </p>
    </div>
  );
}
