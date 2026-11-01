import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { DataFlow } from "@/components/site/pages/DataFlow";
import { DeleteEverything } from "@/components/site/pages/DeleteEverything";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { IconDevice, IconEye, IconLock, IconServer, IconSettings, IconSparkle, IconTalk, IconUserOff, IconCheck } from "@/components/icons";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Common Ground handles your conversations: no account, stored only on your device, deletable anytime.",
};

const NEVER = ["No account", "No analytics", "No ads", "No trackers", "Self-hosted fonts"];

const FACTS: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: <IconDevice size={20} />,
    title: "Your conversations",
    body: "Saved only in your browser's local storage, on this device. We don't keep them on our servers.",
  },
  {
    icon: <IconSettings size={20} />,
    title: "Your settings",
    body: "Name, the other person's name, country, age group and theme — also stored only on this device, and only if you add them.",
  },
  {
    icon: <IconLock size={20} />,
    title: "When you send a message",
    body: "The conversation is sent over an encrypted connection to our server, which passes it to our AI provider (Anthropic) to write a reply. We don't log or store the content.",
  },
  {
    icon: <IconSparkle size={20} />,
    title: "Our AI provider",
    body: "Anthropic processes messages to generate replies under its commercial terms, which don't use API data to train models by default. It may retain data for a limited period for safety and abuse monitoring.",
  },
  {
    icon: <IconUserOff size={20} />,
    title: "Accounts, tracking & ads",
    body: "None. No sign-up, no advertising, no third-party analytics or tracking cookies. Fonts are self-hosted.",
  },
  {
    icon: <IconServer size={20} />,
    title: "Rate limiting",
    body: "To keep the service available, our server briefly keeps a count of requests per IP address in memory. It isn't linked to your messages and isn't stored long-term.",
  },
];

const h2 = "text-[1.75rem] font-medium leading-tight text-ink sm:text-[2rem]";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="overflow-x-clip pb-24">
        <div className="pg-hero mx-auto max-w-5xl px-4 pt-10 sm:px-6 sm:pt-16">
          <div className="max-w-3xl">
            <p className="eyebrow">Privacy</p>
            <h1 className="mt-3 text-[clamp(2.4rem,1.7rem+2.6vw,3.5rem)] font-medium leading-[1.05] text-ink">What you share stays yours.</h1>
            <p className="rise mt-4 text-lg leading-relaxed text-muted" style={{ animationDelay: "60ms" }}>
              Relationships are personal. We built Common Ground so that you don&apos;t have to trust us with a record of your private life &mdash; because we
              never keep one.
            </p>
            <ul className="rise mt-6 flex flex-wrap gap-2" style={{ animationDelay: "120ms" }} aria-label="At a glance">
              {NEVER.map((n) => (
                <li key={n} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink">
                  <IconCheck size={14} strokeWidth={2.2} className="text-primary" />
                  {n}
                </li>
              ))}
            </ul>
          </div>

          <section className="mt-14 sm:mt-16" aria-labelledby="flow-h">
            <Reveal y={12}>
              <h2 id="flow-h" className={h2}>
                Where your words go
              </h2>
              <p className="mt-2 max-w-2xl text-[17px] leading-relaxed text-muted">When you send a message, this is the whole trip. Nothing else sees it.</p>
            </Reveal>
            <div className="mt-7">
              <DataFlow />
            </div>
          </section>

          <section className="mt-16 sm:mt-20" aria-labelledby="details-h">
            <Reveal y={12}>
              <h2 id="details-h" className={h2}>
                The details
              </h2>
            </Reveal>
            <Stagger as="ul" className="mt-6 grid gap-3 sm:grid-cols-2" stagger={0.05} amount={0.1}>
              {FACTS.map((f) => (
                <StaggerItem key={f.title} as="li" y={10} className="flex gap-4 rounded-[20px] border border-line bg-surface p-5">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-subtle text-primary" aria-hidden>
                    {f.icon}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-sans text-base font-semibold text-ink">{f.title}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-muted">{f.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </section>

          <section id="delete" className="pg-anchor mt-16 sm:mt-20" aria-labelledby="delete-h">
            <Reveal y={12}>
              <h2 id="delete-h" className={h2}>
                Deleting your data
              </h2>
              <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-ink/90">
                Delete a single conversation from the sidebar, or everything at once below or in{" "}
                <strong className="font-semibold">Settings &amp; privacy &rarr; Delete everything</strong>. Clearing your browser&apos;s site data for Common Ground
                does the same. Because nothing is stored on our servers, there&apos;s nothing else to request.
              </p>
              <div className="mt-6">
                <DeleteEverything />
              </div>
            </Reveal>
          </section>

          <div className="mt-16 grid gap-4 sm:mt-20 md:grid-cols-2">
            <Reveal y={12} as="section" className="rounded-[20px] border border-line bg-surface p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-subtle text-primary" aria-hidden>
                <IconEye size={20} />
              </span>
              <h2 className="mt-4 text-xl font-medium text-ink">Shared or monitored devices</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/85">
                Anyone who can use your browser can see conversations saved in it. If that&apos;s a risk, use a private window, turn on the discreet tab title,
                delete chats when you&apos;re done, and press Esc twice to leave quickly.{" "}
                <Link href="/safety" className="font-medium text-primary underline underline-offset-2">
                  More on staying safe
                </Link>
                .
              </p>
            </Reveal>
            <Reveal y={12} delay={0.06} as="section" className="rounded-[20px] border border-line bg-surface p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-subtle text-primary" aria-hidden>
                <IconTalk size={20} />
              </span>
              <h2 className="mt-4 text-xl font-medium text-ink">You&apos;re talking to an AI</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/85">
                Replies are written by an AI model, not a person. No human at Common Ground reads your conversations.
              </p>
            </Reveal>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
