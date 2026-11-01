"use client";

// Small building blocks shared by the landing page's looping demos
// (hero conversation, rewrite demo).

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useSyncExternalStore } from "react";
import { IconPause, IconPlay } from "@/components/icons";
import { dur, ease, spring } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/* Reduced motion, hydration-safe                                      */
/* ------------------------------------------------------------------ */

const RM_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeRM = (cb: () => void) => {
  const mq = window.matchMedia(RM_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * Like motion's useReducedMotion, but returns `false` during SSR and
 * hydration (then the real value), so markup that depends on it never causes
 * a hydration mismatch.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeRM,
    () => window.matchMedia(RM_QUERY).matches,
    () => false,
  );
}

/* ------------------------------------------------------------------ */
/* Controls                                                            */
/* ------------------------------------------------------------------ */

/** Dot pager with a sliding layoutId pill. Each dot is a 44px-tall target. */
export function DotPager({
  count,
  index,
  onSelect,
  layoutId,
  label,
  itemLabel = (k, n) => `Example ${k + 1} of ${n}`,
}: {
  count: number;
  index: number;
  onSelect: (k: number) => void;
  layoutId: string;
  label: string;
  itemLabel?: (k: number, n: number) => string;
}) {
  return (
    <div role="group" aria-label={label} className="-mx-1 flex items-center">
      {Array.from({ length: count }, (_, k) => {
        const on = k === index;
        return (
          <button
            key={k}
            type="button"
            onClick={() => onSelect(k)}
            aria-label={itemLabel(k, count)}
            aria-current={on ? "true" : undefined}
            className="group relative grid h-11 w-8 place-items-center rounded-full focus-visible:outline-offset-[-4px]"
          >
            <span className="block h-1.5 w-1.5 rounded-full bg-line transition-colors duration-200 group-hover:bg-muted" aria-hidden />
            {on && <m.span layoutId={layoutId} className="absolute h-1.5 w-5 rounded-full bg-primary" transition={spring.layout} aria-hidden />}
          </button>
        );
      })}
    </div>
  );
}

/** WCAG 2.2.2 pause control for auto-advancing content. Fixed 44px box. */
export function PlayPauseButton({ paused, onToggle, label, hidden = false }: { paused: boolean; onToggle: () => void; label: string; hidden?: boolean }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={paused}
      aria-label={paused ? `Play ${label}` : `Pause ${label}`}
      title={paused ? "Play" : "Pause"}
      tabIndex={hidden ? -1 : undefined}
      aria-hidden={hidden || undefined}
      className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted transition-colors duration-200 hover:bg-subtle hover:text-ink focus-visible:outline-offset-[-3px] ${hidden ? "invisible" : ""}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={paused ? "play" : "pause"}
          className="grid place-items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: dur.fast, ease: ease.calm } }}
          exit={{ opacity: 0, scale: 0.8, transition: { duration: dur.fast * 0.7, ease: ease.exit } }}
        >
          {paused ? <IconPlay size={18} /> : <IconPause size={18} />}
        </m.span>
      </AnimatePresence>
    </button>
  );
}

/** Three breathing dots (CSS keyframe, staggered). */
export function TypingDots({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`} aria-hidden>
      {[0, 1, 2].map((k) => (
        <span key={k} className="breathe block h-2 w-2 rounded-full bg-primary/70" style={{ animationDelay: `${k * 0.18}s` }} />
      ))}
    </span>
  );
}
