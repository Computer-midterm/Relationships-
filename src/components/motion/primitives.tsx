"use client";

import Link from "next/link";
import { AnimatePresence, useInView, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useId, useState, type ComponentProps, type ReactNode, type RefObject } from "react";
import { dur, ease, spring } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/* Press feedback for links and buttons                                */
/* ------------------------------------------------------------------ */

const MLink = m.create(Link);

/** A Next.js Link with calm hover lift + press feedback. Pass `btn-*` classes. */
type LinkProps = Omit<ComponentProps<typeof Link>, "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd" | "children">;

export function PressLink({ children, ...props }: LinkProps & { children: ReactNode }) {
  return (
    <MLink {...props} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} transition={spring.press}>
      {children}
    </MLink>
  );
}

export function PressButton({ children, ...props }: ComponentProps<typeof m.button> & { children: ReactNode }) {
  return (
    <m.button whileTap={{ scale: 0.97 }} transition={spring.press} {...props}>
      {children}
    </m.button>
  );
}

/* ------------------------------------------------------------------ */
/* FadeSwap: crossfade between keyed content                           */
/* ------------------------------------------------------------------ */

export function FadeSwap({
  swapKey,
  children,
  className,
  y = 6,
  mode = "wait",
}: {
  swapKey: string | number;
  children: ReactNode;
  className?: string;
  y?: number;
  mode?: "wait" | "popLayout" | "sync";
}) {
  return (
    <AnimatePresence mode={mode} initial={false}>
      <m.div
        key={swapKey}
        className={className}
        initial={{ opacity: 0, y }}
        animate={{ opacity: 1, y: 0, transition: { duration: dur.base + 0.04, ease: ease.calm } }}
        exit={{ opacity: 0, y: -y / 2, transition: { duration: dur.fast, ease: ease.exit } }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* SegmentedControl with a sliding layoutId pill                       */
/* ------------------------------------------------------------------ */

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  className = "",
}: {
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div role="radiogroup" aria-label={label} className={`inline-flex rounded-full border border-line bg-surface p-1 shadow-soft ${className}`}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`relative min-h-10 rounded-full px-4 text-sm font-medium transition-colors duration-200 ${on ? "text-on-primary" : "text-ink hover:text-primary"}`}
          >
            {on && <m.span layoutId={`seg-${id}`} className="absolute inset-0 rounded-full bg-primary" transition={spring.layout} aria-hidden />}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DrawPath: an SVG path that draws itself when in view                */
/* ------------------------------------------------------------------ */

export function DrawPath({ d, className, duration = 1.2, delay = 0, ...rest }: ComponentProps<typeof m.path> & { d: string; duration?: number; delay?: number }) {
  return (
    <m.path
      d={d}
      className={className}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ pathLength: { duration, ease: ease.calm, delay }, opacity: { duration: 0.2, delay } }}
      {...rest}
    />
  );
}

/* ------------------------------------------------------------------ */
/* useAutoplay: should a looping demo be playing right now?            */
/* ------------------------------------------------------------------ */

/**
 * True only when the element is in view, the tab is visible, it isn't hovered
 * or focused, the user hasn't paused it, and reduced motion is off.
 */
export function useAutoplay(ref: RefObject<HTMLElement | null>, paused = false): boolean {
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [engaged, setEngaged] = useState(false);

  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const on = () => setEngaged(true);
    const off = () => setEngaged(el.matches(":hover") || el.contains(document.activeElement));
    el.addEventListener("pointerenter", on);
    el.addEventListener("pointerleave", off);
    el.addEventListener("focusin", on);
    el.addEventListener("focusout", () => setTimeout(off, 0));
    return () => {
      el.removeEventListener("pointerenter", on);
      el.removeEventListener("pointerleave", off);
      el.removeEventListener("focusin", on);
    };
  }, [ref]);

  return inView && visible && !engaged && !paused && !reduce;
}
