// Shared motion tokens. Calm by default: no visible overshoot (damping ratio
// >= ~0.8), short travel (<= 24px), scale never below 0.96, staggers 40-80ms.
import type { Transition } from "motion/react";

export const ease = {
  /** expo-out: quick to start, soft landing — default for entrances */
  calm: [0.22, 1, 0.36, 1] as const,
  /** accelerate away — for exits */
  exit: [0.4, 0, 1, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};

export const dur = { fast: 0.18, base: 0.28, slow: 0.5, reveal: 0.6 };

export const spring = {
  /** taps / presses */
  press: { type: "spring", stiffness: 500, damping: 30 } as Transition,
  /** chips, toggles, small UI feedback */
  snappy: { type: "spring", stiffness: 420, damping: 32 } as Transition,
  /** messages, cards entering */
  gentle: { type: "spring", stiffness: 210, damping: 28 } as Transition,
  /** modal sheets */
  sheet: { type: "spring", stiffness: 320, damping: 34 } as Transition,
  /** mobile drawer */
  drawer: { type: "spring", stiffness: 380, damping: 38 } as Transition,
  /** layoutId pills, reflow */
  layout: { type: "spring", stiffness: 340, damping: 34 } as Transition,
};

export const stagger = { tight: 0.04, base: 0.06, loose: 0.08 };

export const exitFade: Transition = { duration: dur.fast, ease: ease.exit };
