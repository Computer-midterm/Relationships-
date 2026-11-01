"use client";

import type { Concern } from "@/lib/crisis";
import { getRegion, type RegionCode } from "@/lib/resources";
import { sortResources } from "../Resources";
import { IconLifebuoy, IconX } from "../icons";

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

  return (
    <aside className="rise relative rounded-[20px] border border-safety/30 bg-safety-bg p-4 pr-11 text-ink" aria-label="Support resources">
      <button type="button" onClick={onDismiss} className="absolute right-2 top-2 rounded-full p-1.5 text-muted hover:bg-surface hover:text-ink" aria-label="Hide this card">
        <IconX size={16} />
      </button>
      <div className="flex items-center gap-2 font-medium text-safety">
        <IconLifebuoy size={18} /> {c.title}
      </div>
      <p className="mt-1.5 text-[15px] leading-relaxed">{c.body}</p>
      <ul className="mt-3 space-y-1.5 text-[15px]">
        <li>
          <strong className="font-semibold">In danger right now?</strong> Call {reg.emergency}.
        </li>
        {top.map((r) => (
          <li key={r.name}>
            <strong className="font-semibold">{r.name}:</strong>{" "}
            {r.tel ? (
              <a href={`tel:${r.tel}`} className="underline underline-offset-2">
                {r.contact}
              </a>
            ) : (
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                {r.contact}
              </a>
            )}
          </li>
        ))}
      </ul>
      <button type="button" onClick={onOpenHelp} className="mt-3 text-sm font-medium text-safety underline underline-offset-2">
        See all support options
      </button>
    </aside>
  );
}
