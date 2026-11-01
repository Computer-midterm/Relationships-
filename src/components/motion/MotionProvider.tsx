"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

// Animation features load asynchronously after first paint. Because of
// `strict`, animated elements must use `m.*` from "motion/react-m".
// reducedMotion="user" turns transform animations into fades for people who
// ask their OS for less motion.
const loadFeatures = () => import("./features").then((mod) => mod.default);

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
