"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; label: string };

/** On-page contents. Highlights the section being read with a colour change only. */
export function SafetyToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      let current = items[0]?.id ?? "";
      for (const i of items) {
        const el = document.getElementById(i.id);
        if (el && el.getBoundingClientRect().top <= 180) current = i.id;
      }
      // At the very bottom, the last section is the one being read.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = items[items.length - 1]?.id ?? current;
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [items]);

  return (
    <nav aria-label="On this page">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">On this page</p>
      <ol className="mt-3 space-y-0.5 border-l border-line">
        {items.map((i) => {
          const on = i.id === active;
          return (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                aria-current={on ? "location" : undefined}
                className={`-ml-px flex min-h-10 items-center border-l-2 py-1.5 pl-4 pr-2 text-[15px] leading-snug transition-colors duration-200 ${
                  on ? "border-primary font-medium text-ink" : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {i.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
