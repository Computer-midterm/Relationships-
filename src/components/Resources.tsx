"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { REGIONS, getRegion, type RegionCode, type Resource } from "@/lib/resources";
import { dur, ease, exitFade, stagger } from "@/lib/motion";
import { IconMessageSquare, IconPhone } from "./icons";

const TAG_ORDER: Record<string, Resource["tags"][number][]> = {
  crisis: ["crisis"],
  abuse: ["abuse"],
  "sexual-assault": ["sexual-assault", "abuse"],
};

export function sortResources(list: Resource[], focus?: string[]): Resource[] {
  if (!focus?.length) return list;
  const wanted = new Set(focus.flatMap((f) => TAG_ORDER[f] ?? []));
  const score = (r: Resource) => (r.tags.some((t) => wanted.has(t)) ? 0 : 1);
  return [...list].sort((a, b) => score(a) - score(b));
}

export const smsHref = (sms: NonNullable<Resource["sms"]>) => `sms:${sms.number}${sms.body ? `?&body=${encodeURIComponent(sms.body)}` : ""}`;

export function RegionSelect({ value, onChange, id }: { value: RegionCode; onChange: (c: RegionCode) => void; id?: string }) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as RegionCode)}
      className="field !w-auto min-h-11 !py-2 pr-8 text-sm"
      aria-label="Your country"
    >
      {REGIONS.map((r) => (
        <option key={r.code} value={r.code}>
          {r.label}
        </option>
      ))}
    </select>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: dur.base + 0.06, ease: ease.calm } },
};

export function ResourceCard({ r, animated = false }: { r: Resource; animated?: boolean }) {
  const Li = animated ? m.li : "li";
  const motionProps = animated ? { variants: cardVariants } : {};
  return (
    <Li {...motionProps} className="flex flex-col rounded-2xl border border-line bg-surface p-4">
      <div className="font-medium leading-snug text-ink">{r.name}</div>
      <p className="mt-1 text-sm leading-relaxed text-muted">{r.what}</p>
      <div className="mt-1.5 text-sm text-ink/80">{r.contact}</div>
      <div className="mt-auto flex flex-wrap gap-2 pt-3">
        {r.tel && (
          <a
            href={`tel:${r.tel}`}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-safety px-4 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            <IconPhone size={15} /> Call
          </a>
        )}
        {r.sms && (
          <a
            href={smsHref(r.sms)}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-safety/40 px-4 text-sm font-medium text-safety transition-colors hover:bg-safety-bg"
          >
            <IconMessageSquare size={15} /> Text
          </a>
        )}
        {r.url && (
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm text-ink transition-colors hover:bg-subtle"
          >
            Website
          </a>
        )}
      </div>
    </Li>
  );
}

function ResourceBody({ region, focus, animated }: { region: RegionCode; focus?: string[]; animated: boolean }) {
  const reg = getRegion(region);
  const list = sortResources(reg.resources, focus);
  const Ul = animated ? m.ul : "ul";
  const ulMotion = animated
    ? {
        initial: "hidden",
        animate: "visible",
        variants: { hidden: {}, visible: { transition: { staggerChildren: stagger.base - 0.01, delayChildren: 0.06 } } },
      }
    : {};
  return (
    <>
      <p className="mb-3 rounded-2xl bg-safety-bg px-4 py-3 text-sm text-ink">
        <strong className="font-semibold">In immediate danger?</strong> Call {reg.emergency}.
      </p>
      <Ul {...ulMotion} className="grid gap-3 sm:grid-cols-2">
        {list.map((r) => (
          <ResourceCard key={r.name} r={r} animated={animated} />
        ))}
      </Ul>
      {region !== "OTHER" && (
        <p className="mt-3 text-sm text-muted">
          Somewhere else?{" "}
          <a className="underline underline-offset-2" href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">
            findahelpline.com
          </a>{" "}
          lists verified helplines in 130+ countries.
        </p>
      )}
    </>
  );
}

/**
 * Helplines for a region. `animated` (used by the in-chat help panel) staggers
 * the cards in and crossfades the list when the region changes; the /safety
 * page leaves it off so it stays still.
 */
export function ResourceList({ region, focus, animated = false }: { region: RegionCode; focus?: string[]; animated?: boolean }) {
  if (!animated) {
    return (
      <div>
        <ResourceBody region={region} focus={focus} animated={false} />
      </div>
    );
  }
  return (
    <div className="relative">
      <AnimatePresence mode="popLayout">
        <m.div
          key={region}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: dur.base, ease: ease.calm } }}
          exit={{ opacity: 0, transition: exitFade }}
        >
          <ResourceBody region={region} focus={focus} animated />
        </m.div>
      </AnimatePresence>
    </div>
  );
}
