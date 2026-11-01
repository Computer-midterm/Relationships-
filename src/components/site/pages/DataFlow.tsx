"use client";

import { useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { IconDevice, IconServer, IconSparkle } from "../../icons";

type Node = {
  icon: ReactNode;
  title: string;
  tag: string;
  tone: "keep" | "pass" | "process";
  body: string;
};

const NODES: Node[] = [
  {
    icon: <IconDevice size={22} />,
    title: "Your device",
    tag: "Saved here, only here",
    tone: "keep",
    body: "Your chats and settings live in this browser's local storage. Delete them any time.",
  },
  {
    icon: <IconServer size={22} />,
    title: "Our server",
    tag: "Passes through, not stored",
    tone: "pass",
    body: "Receives your message over an encrypted connection and hands it to the AI. We don't log or store the content.",
  },
  {
    icon: <IconSparkle size={22} />,
    title: "Anthropic",
    tag: "Processes; may retain briefly for safety",
    tone: "process",
    body: "Writes the reply. May keep data for a limited time for safety and abuse monitoring. Doesn't train on API data by default.",
  },
];

const TONE: Record<Node["tone"], string> = {
  keep: "bg-bubble-coach text-primary",
  pass: "bg-subtle text-ink",
  process: "bg-bubble-user text-accent-text",
};

function Track({ second = false, label }: { second?: boolean; label: string }) {
  return (
    <div className="flex items-center justify-center md:flex-col md:px-1" aria-hidden>
      <div className={`df-track ${second ? "df-track-2" : ""} h-12 w-6 md:h-6 md:w-full`}>
        {/* the line */}
        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 border-l border-dashed border-muted/50 md:left-0 md:top-1/2 md:h-px md:w-full md:-translate-y-1/2 md:translate-x-0 md:border-l-0 md:border-t" />
        <span className="df-run">
          <span className="df-dot" />
        </span>
      </div>
      <span className="ml-3 text-xs text-muted md:ml-0 md:mt-1 md:whitespace-nowrap">{label}</span>
    </div>
  );
}

/**
 * Where a message goes: device -> our server -> Anthropic. A single dot
 * travels the path once when the diagram scrolls into view.
 */
export function DataFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  return (
    <div ref={ref} className={inView ? "df-on" : undefined}>
      <ol className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_6.5rem_minmax(0,1fr)_6.5rem_minmax(0,1fr)] md:items-stretch" aria-label="What happens when you send a message">
        {NODES.map((n, i) => (
          <li key={n.title} className="contents">
            <div className={`df-node df-node-${i + 1} rounded-[20px] border border-line bg-surface p-5 shadow-soft`}>
              <div className="flex items-center gap-3">
                <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${TONE[n.tone]}`} aria-hidden>
                  {n.icon}
                </span>
                <div className="min-w-0">
                  <span className="block text-xs font-medium text-muted">Step {i + 1}</span>
                  <h3 className="font-sans text-[17px] font-semibold leading-snug text-ink">{n.title}</h3>
                </div>
              </div>
              <p className={`mt-4 inline-block rounded-full px-3 py-1 text-[13px] font-medium ${TONE[n.tone]}`}>{n.tag}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{n.body}</p>
            </div>
            {i < NODES.length - 1 && <Track second={i === 1} label={i === 0 ? "encrypted" : "for a reply"} />}
          </li>
        ))}
      </ol>
    </div>
  );
}
