"use client";

import { REGIONS, getRegion, type RegionCode, type Resource } from "@/lib/resources";
import { FadeSwap } from "../motion/primitives";
import { IconChevronDown, IconMessageSquare, IconPhone } from "../icons";
import { useSafetyRegion } from "./pages/SafetyRegion";

const TAG_LABEL: Partial<Record<Resource["tags"][number], string>> = {
  crisis: "Crisis",
  abuse: "Abuse",
  "sexual-assault": "Sexual assault",
  youth: "Young people",
  child: "Children",
  lgbtq: "LGBTQ+",
  men: "Men",
};

const IconExternal = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
  </svg>
);

function ResourceItem({ r }: { r: Resource }) {
  const tags = r.tags.map((t) => TAG_LABEL[t]).filter(Boolean).slice(0, 2);
  return (
    <li className="flex flex-col rounded-[20px] border border-line bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span key={t} className="rounded-full bg-safety-bg px-2.5 py-0.5 text-xs font-medium text-safety">
            {t}
          </span>
        ))}
      </div>
      <h3 className="mt-2.5 font-sans text-[17px] font-semibold leading-snug text-ink">{r.name}</h3>
      <p className="mt-1 text-[15px] leading-relaxed text-muted">{r.what}</p>
      <p className="mt-2 text-[15px] font-medium text-ink">{r.contact}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-3.5">
        {r.tel && (
          <a href={`tel:${r.tel}`} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-safety px-4 text-sm font-semibold text-bg transition-opacity hover:opacity-90">
            <IconPhone size={15} /> Call
          </a>
        )}
        {r.sms && (
          <a
            href={`sms:${r.sms.number}${r.sms.body ? `?&body=${encodeURIComponent(r.sms.body)}` : ""}`}
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
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line px-4 text-sm text-ink transition-colors hover:bg-subtle"
          >
            Website <IconExternal size={14} />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </div>
    </li>
  );
}

export function SafetyResources() {
  const { region, setRegion } = useSafetyRegion();
  const reg = getRegion(region);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <label htmlFor="safety-region" className="text-[15px] text-muted">
          Show help for
        </label>
        <div className="relative">
          <select
            id="safety-region"
            value={region}
            onChange={(e) => setRegion(e.target.value as RegionCode)}
            className="field min-h-11 !w-auto appearance-none !py-2 pl-3.5 pr-10 text-[15px] font-medium"
          >
            {REGIONS.map((r) => (
              <option key={r.code} value={r.code}>
                {r.label}
              </option>
            ))}
          </select>
          <IconChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted" />
        </div>
      </div>

      <FadeSwap swapKey={region} y={4} className="mt-5">
        <ul className="grid gap-3 sm:grid-cols-2">
          {reg.resources.map((r) => (
            <ResourceItem key={r.name} r={r} />
          ))}
        </ul>
        {region !== "OTHER" && (
          <p className="mt-4 text-[15px] text-muted">
            Somewhere else?{" "}
            <a className="text-ink underline underline-offset-2" href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">
              findahelpline.com
            </a>{" "}
            lists verified helplines in 130+ countries.
          </p>
        )}
      </FadeSwap>
    </div>
  );
}
