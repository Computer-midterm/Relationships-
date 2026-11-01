import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SafetyResources } from "@/components/site/SafetyResources";
import { SafetyBand, SafetyRegionProvider } from "@/components/site/pages/SafetyRegion";
import { SafetyToc, type TocItem } from "@/components/site/pages/SafetyToc";
import { WillWontCard, type Protocol } from "@/components/site/pages/WillWont";
import { Reveal } from "@/components/motion/Reveal";
import { IconCheck, IconChevronDown, IconExit, IconHeartHand, IconLifebuoy, IconLock, IconPhone, IconShield, IconSprout, IconX } from "@/components/icons";

export const metadata: Metadata = {
  title: "Safety & crisis protocol",
  description: "Free, confidential helplines by country, and how Common Ground's AI coach responds to abuse, crisis, and safety concerns.",
};

const IconFamily = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="8.5" cy="5.5" r="2.5" />
    <path d="M4.5 21v-6.5a4 4 0 0 1 8 0V21" />
    <circle cx="17" cy="10" r="2" />
    <path d="M14.5 21v-4a2.5 2.5 0 0 1 5 0v4" />
  </svg>
);

const TOC: TocItem[] = [
  { id: "help", label: "Free, confidential help" },
  { id: "online", label: "Staying safe online" },
  { id: "protocol", label: "How the coach responds" },
  { id: "wont-help", label: "What it won't help with" },
  { id: "own-behavior", label: "Worried about your own behavior" },
  { id: "limits", label: "Its limits" },
];

const PROTOCOL: Protocol[] = [
  {
    id: "suicide",
    title: "Thoughts of suicide or self-harm",
    icon: <IconLifebuoy size={20} />,
    will: [
      "Pause relationship coaching and focus on you.",
      "Ask directly and kindly about your safety.",
      <>
        Encourage you to contact a crisis line &mdash; such as <strong className="font-semibold">988</strong> in the US and Canada, or{" "}
        <strong className="font-semibold">Samaritans on 116 123</strong> in the UK and Ireland &mdash; or emergency services if you&apos;re in immediate danger.
      </>,
    ],
    wont: ["Hurry back to relationship advice before you seem steadier.", "Promise you that everything will be fine."],
    note: "Separately from the AI, the app watches for crisis language and shows a support card with local hotlines.",
  },
  {
    id: "abuse",
    title: "Abuse and coercive control",
    icon: <IconShield size={20} />,
    will: [
      "Recognize signs like violence, choking, threats, monitoring, isolation, and financial control.",
      "Believe you, and name the pattern.",
      "Ask whether you're safe right now.",
      "Share domestic-violence hotlines and safety-planning basics.",
    ],
    wont: [
      <>
        Suggest <strong className="font-semibold">couples counseling</strong>.
      </>,
      "Suggest confronting the person.",
      <>Offer ways to &ldquo;manage&rdquo; their behavior, or scripts to appease them.</>,
      <>Push you with ultimatums or &ldquo;just leave.&rdquo;</>,
    ],
    note: "Those can increase danger. A domestic-violence advocate can help you plan for safety at your own pace.",
  },
  {
    id: "assault",
    title: "Sexual assault",
    icon: <IconHeartHand size={20} />,
    will: ["Believe you.", "Explain your options — medical care, support lines, and reporting."],
    wont: ["Imply that it was your fault in any way.", "Pressure you toward any particular choice."],
  },
  {
    id: "children",
    title: "Children at risk",
    icon: <IconFamily size={20} />,
    will: [
      "Say so clearly and kindly if a child is being harmed or is at risk — including living with violence between adults.",
      "Point to child-protection help, or emergency services if a child is in danger right now.",
    ],
  },
  {
    id: "under18",
    title: "If you're under 18",
    icon: <IconSprout size={20} />,
    will: ["Be more protective, and share youth helplines.", "Encourage you to involve a trusted adult."],
    wont: ["Engage with sexual content."],
  },
];

const WONT_HELP = [
  "Monitor or track someone",
  "Get around a block or no-contact request",
  "Manipulate or pressure someone",
  "Seek revenge",
  "Share intimate images",
];

function Section({ id, title, kicker, children }: { id: string; title: string; kicker?: string; children: ReactNode }) {
  return (
    <section id={id} className="pg-anchor" aria-labelledby={`${id}-h`}>
      <Reveal y={12}>
        {kicker && <p className="eyebrow">{kicker}</p>}
        <h2 id={`${id}-h`} className={`${kicker ? "mt-2" : ""} text-[1.75rem] font-medium leading-tight text-ink sm:text-[2rem]`}>
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </Reveal>
    </section>
  );
}

export default function SafetyPage() {
  return (
    <>
      <SiteHeader showExit />
      <SafetyRegionProvider>
        <main id="main" className="overflow-x-clip pb-24">
          <SafetyBand />

          <div className="pg-hero mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
            <div className="max-w-3xl">
              <p className="eyebrow">Safety</p>
              <h1 className="mt-3 text-[clamp(2.4rem,1.7rem+2.6vw,3.5rem)] font-medium leading-[1.05] text-ink">You deserve to be safe.</h1>
              <p className="rise mt-4 text-lg leading-relaxed text-muted" style={{ animationDelay: "60ms" }}>
                If you&apos;re in danger right now, call your local emergency number. If you&apos;re being hurt, threatened, or controlled &mdash; or you&apos;re
                thinking about ending your life &mdash; these free, confidential services are staffed by trained people who can help.
              </p>
            </div>

            {/* Mobile contents */}
            <details className="group mt-7 rounded-[20px] border border-line bg-surface lg:hidden">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-[15px] font-medium text-ink [&::-webkit-details-marker]:hidden">
                On this page
                <IconChevronDown size={18} className="text-muted transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <nav aria-label="On this page">
                <ol className="border-t border-line px-2 py-1.5">
                  {TOC.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="flex min-h-11 items-center rounded-xl px-2.5 text-[15px] text-ink hover:bg-subtle">
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </details>

            <div className="mt-10 grid gap-12 lg:mt-12 lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-14">
              <aside className="hidden lg:block">
                <div className="sticky top-[8.5rem]">
                  <SafetyToc items={TOC} />
                  <p className="mt-6 rounded-2xl border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-muted">
                    Press <kbd className="rounded-md border border-line bg-bg px-1.5 py-0.5 font-sans text-xs text-ink">Esc</kbd> twice to leave this site
                    instantly.
                  </p>
                </div>
              </aside>

              <div className="min-w-0 space-y-16 sm:space-y-20">
                <section id="help" className="pg-anchor" aria-labelledby="help-h">
                  <h2 id="help-h" className="text-[1.75rem] font-medium leading-tight text-ink sm:text-[2rem]">
                    Free, confidential help
                  </h2>
                  <p className="mt-2 max-w-2xl text-[17px] leading-relaxed text-muted">Trained people, 24/7 for most lines. You don&apos;t need to be sure it&apos;s &ldquo;bad enough&rdquo; to call.</p>
                  <div className="mt-6">
                    <SafetyResources />
                  </div>
                </section>

                <Section id="online" title="Staying safe online">
                  <div className="card grid gap-5 p-5 sm:grid-cols-[auto_1fr] sm:p-6">
                    <div className="flex items-start gap-2" aria-hidden>
                      <kbd className="inline-flex h-11 min-w-14 items-center justify-center rounded-xl border border-line border-b-[3px] bg-bg px-3 font-sans text-sm font-semibold text-ink">
                        Esc
                      </kbd>
                      <kbd className="inline-flex h-11 min-w-14 items-center justify-center rounded-xl border border-line border-b-[3px] bg-bg px-3 font-sans text-sm font-semibold text-ink">
                        Esc
                      </kbd>
                    </div>
                    <div className="text-[16px] leading-relaxed text-ink/90">
                      <p>
                        If someone checks your phone or computer, press <strong className="font-semibold">Esc twice</strong> to leave this site instantly, or use
                        the <span className="inline-flex items-center gap-1 whitespace-nowrap font-medium"><IconExit size={15} /> Quick exit</span> button.
                      </p>
                      <ul className="mt-3 space-y-2 text-[15px] text-ink/85">
                        <li className="flex gap-3">
                          <IconLock size={17} className="mt-[3px] shrink-0 text-primary" /> Consider a private browsing window, or a device they can&apos;t access.
                        </li>
                        <li className="flex gap-3">
                          <IconCheck size={17} className="mt-[3px] shrink-0 text-primary" /> Delete your conversations in Settings when you&apos;re done.
                        </li>
                        <li className="flex gap-3">
                          <IconPhone size={17} className="mt-[3px] shrink-0 text-primary" /> Hotline advocates can help you think through tech safety too.
                        </li>
                      </ul>
                    </div>
                  </div>
                </Section>

                <Section id="protocol" title="How the coach responds" kicker="Our crisis protocol">
                  <p className="max-w-2xl text-[17px] leading-relaxed text-ink/90">
                    Common Ground is an AI relationship coach, not a crisis service, and{" "}
                    <strong className="font-semibold">it can&apos;t contact anyone on your behalf</strong>. Here is exactly how it is designed to respond when
                    safety comes up.
                  </p>
                  <div className="mt-6 grid gap-4">
                    {PROTOCOL.map((p) => (
                      <WillWontCard key={p.id} p={p} />
                    ))}
                  </div>
                </Section>

                <Section id="wont-help" title="What the coach won't help with">
                  <p className="max-w-2xl text-[17px] leading-relaxed text-ink/90">To protect everyone involved, the coach won&apos;t help anyone:</p>
                  <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                    {WONT_HELP.map((w) => (
                      <li key={w} className="flex min-h-12 items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-2.5 text-[15px] text-ink">
                        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-subtle text-muted" aria-hidden>
                          <IconX size={13} strokeWidth={2.2} />
                        </span>
                        {w}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 flex max-w-2xl gap-3 rounded-2xl bg-bubble-coach px-4 py-3.5 text-[15px] leading-relaxed text-ink">
                    <IconHeartHand size={20} className="mt-0.5 shrink-0 text-primary" />
                    <span>
                      Instead, it will turn toward the feelings underneath &mdash; like broken trust, grief, or fear.
                    </span>
                  </p>
                </Section>

                <Section id="own-behavior" title="Worried about your own behavior?">
                  <p className="max-w-2xl text-[17px] leading-relaxed text-ink/90">
                    If you&apos;re worried about how you treat a partner, support exists for you too. Wanting to change is a real first step.
                  </p>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    <li className="flex flex-col rounded-[20px] border border-line bg-surface p-5">
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">United States</span>
                      <span className="mt-1.5 font-sans text-[17px] font-semibold text-ink">National Domestic Violence Hotline</span>
                      <span className="mt-1 text-[15px] leading-relaxed text-muted">Talks with people who want to change.</span>
                      <a
                        href="tel:18007997233"
                        className="mt-4 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-safety px-4 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
                      >
                        <IconPhone size={15} /> 1-800-799-7233
                      </a>
                    </li>
                    <li className="flex flex-col rounded-[20px] border border-line bg-surface p-5">
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">United Kingdom</span>
                      <span className="mt-1.5 font-sans text-[17px] font-semibold text-ink">Respect Phoneline</span>
                      <span className="mt-1 text-[15px] leading-relaxed text-muted">For people worried about their own behavior.</span>
                      <a
                        href="tel:08088024040"
                        className="mt-4 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-safety px-4 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
                      >
                        <IconPhone size={15} /> 0808 802 4040
                      </a>
                    </li>
                  </ul>
                </Section>

                <Section id="limits" title="Its limits">
                  <div className="max-w-2xl space-y-3 text-[17px] leading-relaxed text-ink/90">
                    <p>
                      AI can misunderstand and make mistakes. Common Ground is a self-help tool and doesn&apos;t provide therapy, diagnosis, or medical, legal, or
                      immigration advice.
                    </p>
                    <p>
                      For ongoing struggles, infidelity, separation, trauma, addiction, or mental-health concerns, a licensed therapist can help in ways an AI
                      can&apos;t.
                    </p>
                    <p className="pt-2 text-[15px] text-muted">
                      Hotline details were checked in November 2026. If a number doesn&apos;t work,{" "}
                      <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-2">
                        findahelpline.com
                      </a>{" "}
                      keeps an up-to-date directory.{" "}
                      <Link href="/privacy" className="text-ink underline underline-offset-2">
                        Read our privacy page
                      </Link>
                      .
                    </p>
                  </div>
                </Section>
              </div>
            </div>
          </div>
        </main>
      </SafetyRegionProvider>
      <SiteFooter />
    </>
  );
}
