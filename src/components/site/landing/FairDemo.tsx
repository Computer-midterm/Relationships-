"use client";

import { useState } from "react";
import { FadeSwap, SegmentedControl } from "@/components/motion/primitives";

type Who = "bot" | "cg";

const REPLIES: Record<Who, { label: string; text: string; note: string }> = {
  bot: {
    label: "A typical chatbot",
    text: "You're absolutely right to be upset. Honestly, that's really selfish of them — you deserve someone who respects you.",
    note: "Agrees with the verdict, labels them, and closes the door.",
  },
  cg: {
    label: "Common Ground",
    text: "Being left out of that decision really stung — and “again” tells me it isn't the first time. I'm only hearing your side, so I'm curious: if they were telling me about this, what would they say was going on for them?",
    note: "Takes the hurt seriously, and keeps the other person human.",
  },
};

/** One user message, two possible replies. */
export function FairDemo() {
  const [who, setWho] = useState<Who>("cg");
  return (
    <div className="card overflow-hidden p-5 sm:p-6">
      <div className="ml-auto w-fit max-w-[85%] rounded-[20px] rounded-br-md bg-bubble-user px-4 py-3 text-[15.5px] leading-relaxed text-ink">
        They made the decision without me. Again.
      </div>

      <div className="mt-5 flex justify-center">
        <SegmentedControl
          label="Compare replies"
          value={who}
          onChange={setWho}
          options={[
            { value: "bot", label: "A typical chatbot" },
            { value: "cg", label: "Common Ground" },
          ]}
        />
      </div>

      {/* Both replies stacked invisibly reserve the height; the live one crossfades on top. */}
      <div className="mt-5 grid">
        {(Object.keys(REPLIES) as Who[]).map((k) => (
          <div key={k} className="invisible [grid-area:1/1]" aria-hidden>
            <Reply who={k} />
          </div>
        ))}
        <div className="[grid-area:1/1]" aria-live="polite">
          <FadeSwap swapKey={who}>
            <Reply who={who} />
          </FadeSwap>
        </div>
      </div>
    </div>
  );
}

function Reply({ who }: { who: Who }) {
  const r = REPLIES[who];
  const good = who === "cg";
  return (
    <div>
      <div
        className={`mr-auto max-w-[94%] rounded-[20px] rounded-bl-md px-4 py-3 text-[15.5px] leading-relaxed ${
          good ? "border border-primary/25 bg-bubble-coach text-ink" : "border border-line bg-subtle text-ink/85"
        }`}
      >
        <span className="sr-only">{r.label} replies: </span>
        {r.text}
      </div>
      <p className={`mt-3 flex items-center gap-2 text-[14px] ${good ? "text-primary" : "text-muted"}`}>
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${good ? "bg-primary" : "bg-muted/60"}`} aria-hidden />
        {r.note}
      </p>
    </div>
  );
}
