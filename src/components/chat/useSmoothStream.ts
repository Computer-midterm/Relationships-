"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Smooths bursty streamed text into an even reveal. A rAF loop drains the
 * backlog at max(45 chars/s, backlog / 0.6s), so it never falls more than
 * ~0.6s behind the network and never crawls. Text that was not streamed
 * (history) is shown in full straight away.
 */
export function useSmoothStream(text: string, streaming: boolean): { shown: string; caughtUp: boolean } {
  const reduce = useReducedMotion();
  const [len, setLen] = useState(() => (streaming ? 0 : text.length));
  const pos = useRef(len);
  const target = useRef(text);
  const frame = useRef(0);

  useEffect(() => {
    target.current = text;
    if (reduce) return;
    if (pos.current > text.length) pos.current = text.length;
    if (frame.current || pos.current >= text.length) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const total = target.current.length;
      const backlog = total - pos.current;
      if (backlog <= 0) {
        frame.current = 0;
        return;
      }
      pos.current = Math.min(total, pos.current + Math.max(45, backlog / 0.6) * dt);
      setLen(Math.floor(pos.current));
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [text, reduce]);

  useEffect(
    () => () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = 0;
    },
    [],
  );

  if (reduce) return { shown: text, caughtUp: true };
  const n = Math.min(len, text.length);
  return { shown: text.slice(0, n), caughtUp: n >= text.length };
}
