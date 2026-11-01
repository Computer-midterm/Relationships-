"use client";

import * as m from "motion/react-m";
import { useState, type ReactNode } from "react";
import Link from "next/link";
import type { RegionCode } from "@/lib/resources";
import { dur, ease } from "@/lib/motion";
import { Sheet } from "../Sheet";
import { RegionSelect } from "../Resources";
import { LogoMark } from "../Logo";
import { IconLifebuoy, IconLock, IconTalk } from "../icons";

const list = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.22 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: dur.base + 0.12, ease: ease.calm } },
};

function Point({ icon, tone = "primary", children }: { icon: ReactNode; tone?: "primary" | "safety"; children: ReactNode }) {
  return (
    <m.li variants={item} className="flex gap-3.5">
      <span
        className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full ${tone === "safety" ? "bg-safety-bg text-safety" : "bg-bubble-coach text-primary"}`}
        aria-hidden
      >
        {icon}
      </span>
      <span>{children}</span>
    </m.li>
  );
}

export function WelcomeSheet({
  open,
  defaultRegion,
  onDone,
}: {
  open: boolean;
  defaultRegion: RegionCode;
  onDone: (v: { ageGroup: "adult" | "under18"; country: RegionCode }) => void;
}) {
  const [country, setCountry] = useState<RegionCode>(defaultRegion);

  return (
    <Sheet open={open} onClose={() => {}} dismissible={false} labelledBy="welcome-title">
      <div className="flex items-center gap-3">
        <LogoMark size={36} />
        <h2 id="welcome-title" className="text-[26px] font-medium leading-tight text-ink">
          Before we start
        </h2>
      </div>
      <m.ul className="mt-5 space-y-4 text-[15.5px] leading-relaxed text-ink" variants={list} initial="hidden" animate="visible">
        <Point icon={<IconTalk size={18} />}>
          <strong className="font-semibold">I&apos;m an AI coach, not a therapist.</strong> I can help you think things through, find words, and plan next steps — but I
          can&apos;t diagnose or replace professional care.
        </Point>
        <Point icon={<IconLock size={18} />}>
          <strong className="font-semibold">Your chats stay on this device.</strong> No account. We don&apos;t store your conversations on our servers.{" "}
          <Link href="/privacy" className="underline underline-offset-2" target="_blank">
            Privacy details
          </Link>
        </Point>
        <Point icon={<IconLifebuoy size={18} />} tone="safety">
          <strong className="font-semibold">If you&apos;re not safe, real people can help right now.</strong> Tap &ldquo;Talk to a person&rdquo; any time, or press{" "}
          <kbd className="kbd">Esc</kbd> twice to leave quickly.
        </Point>
      </m.ul>

      <m.div
        className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl bg-subtle/60 px-4 py-3 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: dur.base, ease: ease.calm, delay: 0.45 } }}
      >
        <label htmlFor="welcome-region" className="text-ink">
          Where are you? <span className="text-muted">So we show the right helplines.</span>
        </label>
        <RegionSelect id="welcome-region" value={country} onChange={setCountry} />
      </m.div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        <button type="button" data-autofocus onClick={() => onDone({ ageGroup: "adult", country })} className="btn-primary min-h-12">
          I&apos;m 18 or older
        </button>
        <button type="button" onClick={() => onDone({ ageGroup: "under18", country })} className="btn-outline min-h-12">
          I&apos;m under 18
        </button>
      </div>
      <p className="mt-3 text-center text-xs leading-relaxed text-muted">By continuing you agree this is a self-help tool, not medical or professional advice.</p>
    </Sheet>
  );
}
