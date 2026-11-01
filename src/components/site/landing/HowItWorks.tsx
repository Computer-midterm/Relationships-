"use client";

import * as m from "motion/react-m";
import { DrawPath } from "@/components/motion/primitives";
import { ease } from "@/lib/motion";

const STEPS = [
  ["Say what's going on", "No forms, no account. Pick a starting point or just start typing — messy is fine."],
  ["Get understood, then get perspective", "The coach asks a question or two, reflects what it hears, and helps you see the pattern — and the other side."],
  ["Leave with something useful", "Words you can actually say, a plan for a hard conversation, or one small next step."],
] as const;

const WAVE = "M0 24 C 100 14, 200 34, 300 24 S 500 14, 600 24";

/** Three steps joined by a hand-drawn line; numbers pop in sequence. */
export function HowItWorks() {
  return (
    <ol className="relative mt-12 grid gap-9 md:mt-14 md:grid-cols-3 md:gap-8">
      {/* Desktop: gentle wave between the step numbers */}
      <div className="pointer-events-none absolute left-[16.67%] top-0 hidden h-12 w-[66.66%] md:block" aria-hidden>
        <svg className="h-full w-full" viewBox="0 0 600 48" preserveAspectRatio="none" fill="none">
          <path d={WAVE} stroke="var(--border)" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 7" />
          <DrawPath d={WAVE} stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeOpacity={0.6} duration={1.4} delay={0.15} />
        </svg>
      </div>

      {STEPS.map(([t, d], k) => (
        <li key={t} className="relative grid grid-cols-[48px_1fr] content-start gap-x-5 md:grid-cols-1 md:justify-items-center md:text-center">
          {/* Mobile: line down the left, from this number to the next */}
          {k < STEPS.length - 1 && (
            <div className="pointer-events-none absolute -bottom-9 left-[23px] top-12 w-0.5 md:hidden" aria-hidden>
              <svg className="h-full w-full" viewBox="0 0 2 100" preserveAspectRatio="none" fill="none">
                <path d="M1 0 V 100" stroke="var(--border)" strokeWidth="2" />
                <DrawPath d="M1 0 V 100" stroke="var(--primary)" strokeWidth="2" strokeOpacity={0.6} duration={0.9} delay={0.2 + k * 0.15} />
              </svg>
            </div>
          )}
          <m.div
            data-reveal=""
            className="relative z-10 grid h-12 w-12 place-items-center rounded-full border border-primary/25 bg-bubble-coach font-display text-xl font-medium text-primary ring-8 ring-bg"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.45, ease: ease.calm, delay: 0.1 + k * 0.15 }}
          >
            {k + 1}
          </m.div>
          <div className="pt-2 md:max-w-xs md:pt-5">
            <h3 className="text-xl font-medium leading-snug text-ink">{t}</h3>
            <p className="mt-2 leading-relaxed text-muted">{d}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
