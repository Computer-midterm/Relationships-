"use client";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef } from "react";
import type { Concern } from "@/lib/crisis";
import { getRegion, type RegionCode } from "@/lib/resources";
import { dur, ease } from "@/lib/motion";
import { smsHref, sortResources } from "../Resources";
import { IconArrowRight, IconLifebuoy, IconMessageSquare, IconPhone, IconX } from "../icons";

const COPY: Record<Concern, { title: string; body: string }> = {
  crisis: {
    title: "You deserve support from a real person, too",
    body: "If you're thinking about ending your life or hurting yourself, please reach out now — it's free, confidential, and someone is there right now.",
  },
  abuse: {
    title: "Your safety matters most",
    body: "What you're describing may not be safe. Advocates can help you think through options and make a safety plan — with no pressure to leave.",
  },
  "sexual-assault": {
    title: "What happened isn't your fault",
    body: "Trained, confidential support is available whenever you're ready, including help with medical care and your options.",
  },
};

const callBtn =
  "inline-flex min-h-11 items-center gap-1.5 rounded-full bg-safety px-3.5 text-sm font-medium text-bg transition-opacity hover:opacity-90";
const textBtn =
  "inline-flex min-h-11 items-center gap-1.5 rounded-full border border-safety/35 bg-surface/60 px-3.5 text-sm font-medium text-safety transition-colors hover:bg-surface";

/**
 * Calm, model-independent support card. Safety blue only; a slow fade-and-settle
 * entrance — no spring, pulse, shake or colour flash.
 */
export function CrisisCard({
  concerns,
  region,
  onOpenHelp,
  onDismiss,
}: {
  concerns: Concern[];
  region: RegionCode;
  onOpenHelp: () => void;
  onDismiss: () => void;
}) {
  const primary: Concern = concerns.includes("crisis") ? "crisis" : concerns.includes("abuse") ? "abuse" : concerns[0];
  const reg = getRegion(region);
  const top = sortResources(reg.resources, concerns).slice(0, 2);
  const c = COPY[primary];
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const t = setTimeout(() => ref.current?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" }), 120);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <m.aside
      ref={ref}
      className="relative scroll-mb-4 rounded-[22px] border border-safety/25 bg-safety-bg p-4 text-ink sm:p-5"
      aria-label="Support resources"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: dur.slow, ease: ease.calm }}
    >
      <button
        type="button"
        onClick={onDismiss}
        className="absolute right-1.5 top-1.5 grid h-11 w-11 place-items-center rounded-full text-muted transition-colors hover:bg-surface/70 hover:text-ink"
        aria-label="Hide this card"
      >
        <IconX size={17} />
      </button>

      <div className="flex items-center gap-3 pr-10">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface/80 text-safety" aria-hidden>
          <IconLifebuoy size={18} />
        </span>
        <h2 className="font-serif text-[17px] font-medium leading-snug text-ink">{c.title}</h2>
      </div>
      <p className="mt-2.5 text-[15px] leading-relaxed text-ink/90">{c.body}</p>

      <ul className="mt-3.5 divide-y divide-safety/15 overflow-hidden rounded-2xl border border-safety/15 bg-surface/55">
        <li className="flex min-h-12 items-center justify-between gap-3 py-0.5 pl-3.5 pr-1.5">
          <span className="text-[15px]">
            <strong className="font-semibold">In danger right now?</strong> Call {reg.emergency}
          </span>
          <a href={`tel:${reg.emergency.replace(/[^\d]/g, "") || reg.emergency}`} className={callBtn} aria-label={`Call ${reg.emergency}`}>
            <IconPhone size={15} /> Call
          </a>
        </li>
        {top.map((r) => (
          <li key={r.name} className="flex min-h-12 flex-wrap items-center justify-between gap-x-3 gap-y-1 py-1.5 pl-3.5 pr-1.5">
            <span className="min-w-0 flex-1 basis-48">
              <span className="block text-[15px] font-semibold leading-snug">{r.name}</span>
              <span className="block text-[13.5px] leading-snug text-muted">{r.contact}</span>
            </span>
            <span className="flex shrink-0 gap-1.5">
              {r.tel && (
                <a href={`tel:${r.tel}`} className={callBtn} aria-label={`Call ${r.name}`}>
                  <IconPhone size={15} /> Call
                </a>
              )}
              {r.sms && (
                <a href={smsHref(r.sms)} className={textBtn} aria-label={`Text ${r.name}`}>
                  <IconMessageSquare size={15} /> Text
                </a>
              )}
              {!r.tel && !r.sms && r.url && (
                <a href={r.url} target="_blank" rel="noopener noreferrer" className={textBtn}>
                  Visit
                </a>
              )}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onOpenHelp}
        className="-mb-1 -ml-2 mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm font-medium text-safety transition-colors hover:bg-surface/60"
      >
        See all support options <IconArrowRight size={15} />
      </button>
    </m.aside>
  );
}
