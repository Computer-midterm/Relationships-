"use client";

import { REGIONS, getRegion, type RegionCode, type Resource } from "@/lib/resources";

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

export function RegionSelect({ value, onChange, id }: { value: RegionCode; onChange: (c: RegionCode) => void; id?: string }) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as RegionCode)}
      className="field !w-auto !py-1.5 pr-8 text-sm"
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

export function ResourceCard({ r }: { r: Resource }) {
  return (
    <li className="rounded-2xl border border-line bg-surface p-4">
      <div className="font-medium text-ink">{r.name}</div>
      <p className="mt-0.5 text-sm text-muted">{r.what}</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {r.tel && (
          <a href={`tel:${r.tel}`} className="inline-flex items-center rounded-full bg-safety px-3 py-1.5 text-sm font-medium text-bg hover:opacity-90">
            Call
          </a>
        )}
        {r.sms && (
          <a
            href={`sms:${r.sms.number}${r.sms.body ? `?&body=${encodeURIComponent(r.sms.body)}` : ""}`}
            className="inline-flex items-center rounded-full border border-safety/40 px-3 py-1.5 text-sm font-medium text-safety hover:bg-safety-bg"
          >
            Text
          </a>
        )}
        {r.url && (
          <a href={r.url} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center rounded-full border border-line px-3 py-1.5 text-sm text-ink hover:bg-subtle">
            Website
          </a>
        )}
      </div>
      <div className="mt-2 text-sm text-ink/80">{r.contact}</div>
    </li>
  );
}

export function ResourceList({ region, focus }: { region: RegionCode; focus?: string[] }) {
  const reg = getRegion(region);
  return (
    <div>
      <p className="mb-3 rounded-2xl bg-safety-bg px-4 py-3 text-sm text-ink">
        <strong className="font-semibold">In immediate danger?</strong> Call {reg.emergency}.
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {sortResources(reg.resources, focus).map((r) => (
          <ResourceCard key={r.name} r={r} />
        ))}
      </ul>
      {region !== "OTHER" && (
        <p className="mt-3 text-sm text-muted">
          Somewhere else?{" "}
          <a className="underline underline-offset-2" href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">
            findahelpline.com
          </a>{" "}
          lists verified helplines in 130+ countries.
        </p>
      )}
    </div>
  );
}
