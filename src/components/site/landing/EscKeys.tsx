"use client";

import { useInView, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState } from "react";

/** Two <kbd>Esc</kbd> keys that press in sequence every 4s while in view. */
export function EscKeys() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const reduce = useReducedMotion();
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const first = setTimeout(() => setBeat((b) => b + 1), 500);
    const id = setInterval(() => setBeat((b) => b + 1), 4000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [inView, reduce]);

  return (
    <div ref={ref} className="flex items-center gap-3" aria-label="Escape, Escape" role="img">
      <Key beat={beat} delay={0} />
      <Key beat={beat} delay={0.32} />
    </div>
  );
}

function Key({ beat, delay }: { beat: number; delay: number }) {
  const t = { duration: 0.34, times: [0, 0.35, 1], ease: "easeOut" as const, delay };
  return (
    <kbd className="relative block h-14 w-[4.5rem] font-sans text-base font-semibold text-ink">
      {/* key base (static): the cap moves down onto it; nothing but transform animates */}
      <span className="absolute inset-0 translate-y-[3px] rounded-xl bg-line" aria-hidden />
      <m.span
        key={`cap-${beat}`}
        className="absolute inset-0 grid place-items-center rounded-xl border border-line bg-surface"
        initial={{ y: 0 }}
        animate={beat > 0 ? { y: [0, 3, 0] } : { y: 0 }}
        transition={t}
      >
        Esc
        <m.span
          className="absolute inset-0 rounded-xl bg-primary/15"
          initial={{ opacity: 0 }}
          animate={beat > 0 ? { opacity: [0, 1, 0] } : { opacity: 0 }}
          transition={{ ...t, duration: 0.5 }}
          aria-hidden
        />
      </m.span>
    </kbd>
  );
}
