import type { ReactNode } from "react";
import { IconCheck, IconX } from "../../icons";

export type Protocol = {
  id: string;
  title: string;
  icon: ReactNode;
  will: ReactNode[];
  wont?: ReactNode[];
  note?: ReactNode;
};

/** One situation from the crisis protocol: what the coach will do, and won't. */
export function WillWontCard({ p }: { p: Protocol }) {
  const hasWont = !!p.wont?.length;
  return (
    <article className="card overflow-hidden" aria-labelledby={`${p.id}-title`}>
      <div className="flex items-center gap-3 px-5 pb-1 pt-5 sm:px-6">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-safety-bg text-safety" aria-hidden>
          {p.icon}
        </span>
        <h3 id={`${p.id}-title`} className="text-xl font-medium leading-snug text-ink">
          {p.title}
        </h3>
      </div>
      <div className={`grid gap-x-8 gap-y-5 px-5 pb-5 pt-4 sm:px-6 sm:pb-6 ${hasWont ? "md:grid-cols-2" : ""}`}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">The coach will</p>
          <ul className="mt-2.5 space-y-2.5">
            {p.will.map((w, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink/90">
                <span className="mt-[3px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bubble-coach text-primary" aria-hidden>
                  <IconCheck size={13} strokeWidth={2.2} />
                </span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
        {hasWont && (
          <div className="border-t border-line pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">It won&apos;t</p>
            <ul className="mt-2.5 space-y-2.5">
              {p.wont!.map((w, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink/90">
                  <span className="mt-[3px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-subtle text-muted" aria-hidden>
                    <IconX size={12} strokeWidth={2.2} />
                  </span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {p.note && <p className="border-t border-line bg-subtle/40 px-5 py-3.5 text-sm leading-relaxed text-muted sm:px-6">{p.note}</p>}
    </article>
  );
}
