"use client";

import { useEffect, useState } from "react";

const EXAMPLES = [
  {
    before: "Wow. You cancelled AGAIN. You obviously don't care about me at all. Whatever.",
    after: "I felt really hurt when tonight got cancelled again. I miss you — can we find a time we both protect?",
    feeling: "hurt · wanting to feel like a priority",
  },
  {
    before: "I'm sick of doing everything around here while you sit on your phone.",
    after: "I've been feeling stretched thin with the housework lately. Could we sit down this weekend and make a plan together?",
    feeling: "overwhelmed · wanting to feel like a team",
  },
  {
    before: "Fine, go out with your friends again. Don't bother texting me.",
    after: "I'm glad you're seeing your friends. I've been missing time with you, though — could we plan something just us this week?",
    feeling: "lonely · wanting connection",
  },
];

export function RewriteDemo() {
  const [i, setI] = useState(0);
  return <DemoCard key={i} index={i} onNext={() => setI((x) => (x + 1) % EXAMPLES.length)} />;
}

function DemoCard({ index: i, onNext }: { index: number; onNext: () => void }) {
  const ex = EXAMPLES[i];
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let typer: ReturnType<typeof setInterval> | undefined;
    if (reduce) {
      timers.push(setTimeout(() => setShown(ex.after.length), 0));
      timers.push(setTimeout(onNext, 6000));
    } else {
      let n = 0;
      timers.push(
        setTimeout(() => {
          typer = setInterval(() => {
            n += 2;
            setShown(Math.min(n, ex.after.length));
            if (n >= ex.after.length) clearInterval(typer);
          }, 28);
        }, 1100),
      );
      timers.push(setTimeout(onNext, 1100 + (ex.after.length / 2) * 28 + 3800));
    }
    return () => {
      timers.forEach(clearTimeout);
      if (typer) clearInterval(typer);
    };
  }, [ex.after.length, onNext]);
  return (
    <div className="card relative overflow-hidden p-5 sm:p-7" aria-live="off">
      <div className="flex items-center justify-between">
        <span className="eyebrow">Message rewriter</span>
        <div className="flex gap-1.5" aria-hidden>
          {EXAMPLES.map((_, k) => (
            <span key={k} className={`h-1.5 rounded-full transition-all duration-500 ${k === i ? "w-6 bg-primary" : "w-1.5 bg-line"}`} />
          ))}
        </div>
      </div>
      <div className="mt-5">
        <div className="text-xs font-medium uppercase tracking-wider text-muted">What you typed</div>
        <p key={`b${i}`} className="fade mt-2 rounded-2xl bg-subtle px-4 py-3 text-[15.5px] leading-relaxed text-ink/80 line-through decoration-accent/50 decoration-2">
          {ex.before}
        </p>
      </div>
      <div className="mt-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="text-xs font-medium uppercase tracking-wider text-muted">What you could send</div>
          <div key={`f${i}`} className="fade text-xs text-accent-text">{ex.feeling}</div>
        </div>
        <p className="mt-2 min-h-[5.5rem] rounded-2xl bg-bubble-coach px-4 py-3 text-[15.5px] leading-relaxed text-ink">
          {ex.after.slice(0, shown)}
          {shown < ex.after.length && <span className="breathe ml-1 inline-block h-2 w-2 rounded-full bg-primary align-middle" />}
        </p>
      </div>
      <p className="sr-only">
        Example: “{ex.before}” becomes “{ex.after}”
      </p>
    </div>
  );
}
