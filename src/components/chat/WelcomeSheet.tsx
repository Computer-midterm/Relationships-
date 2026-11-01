"use client";

import { useState } from "react";
import Link from "next/link";
import type { RegionCode } from "@/lib/resources";
import { Sheet } from "../Sheet";
import { RegionSelect } from "../Resources";
import { LogoMark } from "../Logo";

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
      <ul className="mt-5 space-y-3.5 text-[15.5px] leading-relaxed text-ink">
        <li className="flex gap-3">
          <span aria-hidden className="mt-0.5">🤝</span>
          <span>
            <strong className="font-semibold">I&apos;m an AI coach, not a therapist.</strong> I can help you think things through, find words, and plan next steps — but I
            can&apos;t diagnose or replace professional care.
          </span>
        </li>
        <li className="flex gap-3">
          <span aria-hidden className="mt-0.5">🔒</span>
          <span>
            <strong className="font-semibold">Your chats stay on this device.</strong> No account. We don&apos;t store your conversations on our servers.{" "}
            <Link href="/privacy" className="underline underline-offset-2" target="_blank">
              Privacy details
            </Link>
          </span>
        </li>
        <li className="flex gap-3">
          <span aria-hidden className="mt-0.5">🛟</span>
          <span>
            <strong className="font-semibold">If you&apos;re not safe, real people can help right now.</strong> Tap &ldquo;Talk to a person&rdquo; any time, or press Esc
            twice to leave quickly.
          </span>
        </li>
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
        <label htmlFor="welcome-region" className="text-muted">
          Where are you? <span className="text-muted/80">(for the right helplines)</span>
        </label>
        <RegionSelect id="welcome-region" value={country} onChange={setCountry} />
      </div>

      <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
        <button type="button" data-autofocus onClick={() => onDone({ ageGroup: "adult", country })} className="btn-primary !py-3">
          I&apos;m 18 or older
        </button>
        <button type="button" onClick={() => onDone({ ageGroup: "under18", country })} className="btn-outline !py-3">
          I&apos;m under 18
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-muted">By continuing you agree this is a self-help tool, not medical or professional advice.</p>
    </Sheet>
  );
}
