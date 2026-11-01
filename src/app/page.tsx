import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { ModeIcon } from "@/components/ModeIcon";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { PressLink } from "@/components/motion/primitives";
import {
  IconArrowRight,
  IconBook,
  IconCompass,
  IconDevice,
  IconEye,
  IconHeartHand,
  IconLifebuoy,
  IconLock,
  IconPencil,
  IconPrinter,
  IconScale,
  IconShield,
  IconUserOff,
} from "@/components/icons";
import { CupsMark } from "@/components/site/Illustration";
import { RewriteDemo } from "@/components/site/RewriteDemo";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { IconTag } from "@/components/site/landing/icons";
import { EscKeys } from "@/components/site/landing/EscKeys";
import { FairDemo } from "@/components/site/landing/FairDemo";
import { FinalComposer } from "@/components/site/landing/FinalComposer";
import { HeroConversation } from "@/components/site/landing/HeroConversation";
import { HowItWorks } from "@/components/site/landing/HowItWorks";
import { MODES } from "@/lib/modes";

type Icon = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

// Primary/outline buttons driven by PressLink: let Motion own the transform.
const PRESS = "!transition-colors active:!scale-100";

const FACTS: [Icon, string][] = [
  [IconUserOff, "No account"],
  [IconDevice, "Saved only on your device"],
  [IconTag, "Free"],
];

const PRINCIPLES: [Icon, string, string][] = [
  [IconHeartHand, "Validates your feelings, not every verdict", "Your hurt is real. That doesn't automatically make the other person the villain."],
  [IconScale, "Never diagnoses someone who isn't in the room", "No “narcissist” or “gaslighter” labels for a person it has only heard about."],
  [IconCompass, "Won't push you to break up — or to stay", "It helps you get clear on what you want. The decision stays yours."],
  [IconEye, "Gently helps you see your part in a pattern", "Not blame — just the piece you can actually change."],
];

const FAQ = [
  {
    q: "Is this therapy?",
    a: "No. Common Ground is an AI coach — a place to think things through, find words, and plan next steps. It can't diagnose, treat, or replace a licensed therapist, and it will suggest one when that would genuinely help (for example after infidelity, when a painful pattern keeps repeating, or when someone's mental health is struggling).",
  },
  {
    q: "Who can see my conversations?",
    a: "Your chats are saved only in your own browser, on your own device. There's no account and we don't store conversations on our servers. To generate replies, each message is sent securely to our AI provider (Anthropic) and isn't kept by us. You can delete everything with one tap in Settings.",
  },
  {
    q: "Can my partner find out I'm using this?",
    a: "Anyone with access to your device and browser could see saved chats. If that's a concern, you can turn on a discreet tab title, delete conversations, or use a private browsing window. Press Esc twice at any time to leave the site instantly.",
  },
  {
    q: "Will it just tell me I'm right?",
    a: "No — and that's on purpose. Research shows AI chatbots agree with users far more than people do, and that over-agreement makes people less likely to repair their relationships. Common Ground validates your feelings, but it will also gently help you see the other person's side and your own part in a pattern.",
  },
  {
    q: "What if I'm not safe?",
    a: "If you're in danger right now, call your local emergency number. The coach is designed to recognize signs of abuse, coercive control, and crisis, and will point you to free, confidential hotlines staffed by trained people. You can also tap “Talk to a person” any time.",
  },
  {
    q: "Is it really free? Do I need to sign up?",
    a: "Yes, it's free, and there's no signup. Open it and start typing. There are sensible limits on how many messages can be sent in a short time, to keep it available for everyone.",
  },
  {
    q: "Can I use it for family or friendships too?",
    a: "Yes. It's built mainly for romantic relationships, but the same skills — understanding each other, saying hard things kindly, repairing after conflict — work with parents, siblings, in-laws, and friends.",
  },
];

const H2 = "text-[clamp(2rem,1.45rem+1.9vw,2.85rem)] font-medium leading-[1.1] text-ink";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        {/* 1. Hero */}
        <section className="hero-glow -mt-16 pt-16">
          <div className="mx-auto grid max-w-6xl gap-x-12 gap-y-9 px-4 pb-16 pt-10 sm:px-6 md:grid-cols-[1fr_1.05fr] md:grid-rows-[auto_auto] md:pb-24 md:pt-16 lg:gap-x-16">
            <div className="md:col-start-1 md:row-start-1 md:self-end">
              <p className="eyebrow">A private AI relationship coach</p>
              <h1 className="hero-title mt-4 font-medium text-ink">
                Talk it through <span className="italic text-primary">before</span> you talk it out.
              </h1>
              <p className="rise mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-[19px]" style={{ animationDelay: "60ms" }}>
                For the moments between a hard feeling and a hard conversation. Common Ground listens properly, helps you see what’s going on — on both sides —
                and helps you find words that land.
              </p>
              <div className="rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "120ms" }}>
                <PressLink href="/chat" className={`btn-primary h-12 w-full !px-7 !py-0 text-base sm:w-auto ${PRESS}`}>
                  Start talking <IconArrowRight size={18} />
                </PressLink>
                <PressLink href="/rewrite" className={`btn-outline h-12 w-full !px-7 !py-0 text-base sm:w-auto ${PRESS}`}>
                  Rewrite a message
                </PressLink>
              </div>
            </div>

            <div className="md:col-start-2 md:row-span-2 md:row-start-1 md:self-center">
              <HeroConversation />
            </div>

            <ul aria-label="At a glance" className="rise flex flex-wrap gap-2 md:col-start-1 md:row-start-2 md:self-start" style={{ animationDelay: "180ms" }}>
              {FACTS.map(([I, label]) => (
                <li key={label} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-2 text-[14px] font-medium text-ink">
                  <I size={16} className="text-primary" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 2. Fair, not flattering */}
        <section className="border-y border-line/70 bg-subtle/40">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1.08fr_1fr] lg:gap-16">
            <div>
              <p className="eyebrow">Fair, not flattering</p>
              <h2 className={`mt-3 ${H2}`}>It takes your feelings seriously — and the other person, too.</h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
                General chatbots tend to tell you what you want to hear. Studies suggest that kind of agreement makes people <em>less</em> likely to apologize or
                repair. Here’s the difference:
              </p>
              <div className="mt-8">
                <FairDemo />
              </div>
            </div>
            <div>
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">What the coach holds to</h3>
              <Stagger as="ul" className="mt-4 space-y-3" stagger={0.07}>
                {PRINCIPLES.map(([I, t, d]) => (
                  <StaggerItem as="li" key={t} className="card flex gap-4 p-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-bubble-coach text-primary">
                      <I size={20} />
                    </span>
                    <div>
                      <div className="font-medium leading-snug text-ink">{t}</div>
                      <p className="mt-1 text-[15px] leading-relaxed text-muted">{d}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </section>

        {/* 3. What it helps with (bento) */}
        <section id="modes" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 md:py-28">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">What it helps with</p>
            <h2 className={`mt-3 ${H2}`}>Whatever you’re in the middle of.</h2>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {/* Rewrite demo */}
            <div className="card tile flex flex-col p-5 sm:col-span-2 sm:p-7 lg:col-span-4 lg:row-span-2">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-bubble-user text-accent-text">
                  <IconPencil size={18} />
                </span>
                <span className="eyebrow">Message rewriter</span>
              </div>
              <h3 className="mt-4 text-2xl font-medium leading-snug text-ink sm:text-[28px]">Say what you mean, in a way they can hear.</h3>
              <p className="mt-2 max-w-lg leading-relaxed text-muted">Paste the text you’re about to send. Get calmer versions that keep your point and lose the blame.</p>
              <div className="mt-6 flex flex-1 flex-col rounded-2xl border border-line/70 bg-bg/70 p-4 sm:p-5">
                <RewriteDemo />
              </div>
              <Link href="/rewrite" className="group mt-2 inline-flex min-h-11 items-center gap-2 self-start font-medium text-primary underline-offset-4 hover:underline">
                Try the rewriter <IconArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* See their side */}
            <Link href="/chat?mode=conflict" className="card tile tile-hover group flex flex-col p-6 lg:col-span-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-bubble-coach text-primary">
                <IconEye size={18} />
              </span>
              <h3 className="mt-4 text-xl font-medium text-ink">See their side</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted">One tap under a reply. The coach steelmans the other person’s view and names the need you share.</p>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-[13px]" aria-hidden>
                <span className="rounded-full bg-bubble-user px-3 py-1.5 text-ink">You: unheard</span>
                <span className="rounded-full bg-bubble-coach px-3 py-1.5 text-ink">Them: overwhelmed</span>
              </div>
              <p className="mt-3 text-[14px] text-ink" aria-hidden>
                Shared need: <em className="font-display text-primary">to feel like a team</em>
              </p>
            </Link>

            {/* Prep sheet */}
            <Link href="/chat?mode=prepare" className="card tile tile-hover group flex flex-col overflow-hidden p-6 lg:col-span-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-bubble-coach text-primary">
                <IconPrinter size={18} />
              </span>
              <h3 className="mt-4 text-xl font-medium text-ink">A prep sheet for the hard talk</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted">Your opener, the points that matter, and a plan for if it heats up — ready to print.</p>
              <div className="paper mt-5 rounded-xl border border-line bg-bg p-4 text-[13px] leading-snug text-ink shadow-soft" aria-hidden>
                <div className="font-display text-[15px] font-medium">Conversation prep</div>
                <div className="mt-2 space-y-1.5">
                  <p>
                    <span className="font-semibold">Open with:</span> “Can we talk about weekends? I miss us.”
                  </p>
                  <p>
                    <span className="font-semibold">Avoid:</span> “always”, “never”
                  </p>
                  <p>
                    <span className="font-semibold">If it heats up:</span> take 20 minutes, then come back
                  </p>
                </div>
              </div>
            </Link>

            {/* Modes */}
            <p className="mt-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-muted sm:col-span-2 lg:col-span-6">Or start from where you are</p>
            {MODES.map((m) => (
              <Link key={m.id} href={`/chat?mode=${m.id}`} className="card tile tile-hover group flex items-start gap-4 p-5 lg:col-span-2">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-subtle text-primary">
                  <ModeIcon mode={m.id} size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-medium text-ink">{m.label}</span>
                    <IconArrowRight size={16} className="shrink-0 text-primary opacity-60 transition-[transform,opacity] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </span>
                  <span className="mt-1 block text-[14.5px] leading-relaxed text-muted">{m.description}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. How it works */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 md:pb-28">
          <div className="mx-auto max-w-2xl md:text-center">
            <p className="eyebrow">How it works</p>
            <h2 className={`mt-3 ${H2}`}>Three minutes to a clearer head.</h2>
          </div>
          <HowItWorks />
        </section>

        {/* 5. Why you can trust it */}
        <section className="border-y border-line/70 bg-subtle/40">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <Reveal className="max-w-2xl">
              <p className="eyebrow">Why you can trust it</p>
              <h2 className={`mt-3 ${H2}`}>Private by design. Honest about what it is.</h2>
            </Reveal>

            <div className="mt-12 grid gap-4 lg:grid-cols-6">
              <div className="card flex flex-col p-7 sm:p-10 lg:col-span-4 lg:row-span-2">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-bubble-coach text-primary">
                  <IconLock size={22} />
                </span>
                <p className="mt-6 font-display text-[clamp(2.1rem,1.4rem+2.6vw,3.4rem)] font-medium leading-[1.06] tracking-[-0.015em] text-ink">
                  No account.
                  <br />
                  No trackers.
                  <br />
                  <span className="text-primary">No chats on our servers.</span>
                </p>
                <p className="mt-6 max-w-xl leading-relaxed text-muted">
                  Your conversations are saved in your browser, on your device. To write each reply, your message passes through our server to Anthropic, our AI
                  provider — we don’t keep it. Delete everything whenever you like.
                </p>
                <Link href="/privacy" className="group mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-6 font-medium text-primary underline-offset-4 hover:underline">
                  How privacy works <IconArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="card flex flex-col p-6 sm:p-7 lg:col-span-2">
                <EscKeys />
                <h3 className="mt-6 text-xl font-medium text-ink">Esc twice to leave</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted">Press Escape twice and this tab jumps to a neutral page. Back won’t bring you here.</p>
              </div>

              <div className="card flex flex-col p-6 sm:p-7 lg:col-span-2">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-bubble-coach text-primary">
                  <IconBook size={20} />
                </span>
                <h3 className="mt-4 text-xl font-medium text-ink">Built on couples research</h3>
                <ul className="mt-3 flex flex-wrap gap-2" aria-label="Approaches the coach draws on">
                  {["EFT", "Gottman", "IBCT", "Communication skills"].map((c) => (
                    <li key={c} className="rounded-full border border-line bg-subtle px-3 py-1.5 text-[14px] font-medium text-ink">
                      {c}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[14px] leading-relaxed text-muted">
                  Emotionally Focused Therapy, Gottman’s research and Integrative Behavioral Couple Therapy — with popular ideas like attachment styles used as
                  tools, never sold as science.
                </p>
              </div>

              <Link href="/safety" className="card tile tile-hover group flex items-center gap-4 p-6 sm:p-7 lg:col-span-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-safety-bg text-safety">
                  <IconShield size={22} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-medium text-ink">Read the rules the coach follows</span>
                  <span className="mt-0.5 block text-[15px] leading-relaxed text-muted">
                    Our crisis protocol is published: what the coach will always do, and what it will never do.
                  </span>
                </span>
                <IconArrowRight size={20} className="shrink-0 text-primary transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. Safety note + FAQ */}
        <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6 md:pt-28">
          <Reveal className="rounded-[24px] border border-safety/25 bg-safety-bg p-7 sm:p-10">
            <div className="flex items-center gap-3 text-safety">
              <IconLifebuoy size={24} />
              <h2 className="text-3xl font-medium text-ink">What it isn’t</h2>
            </div>
            <div className="mt-5 grid gap-6 md:grid-cols-2">
              <p className="leading-relaxed text-ink">
                Common Ground is an AI — not a therapist, doctor, lawyer, or crisis service. It can’t call for help, and it can get things wrong. For ongoing
                struggles, a licensed therapist is worth it.
              </p>
              <p className="leading-relaxed text-ink">
                If you’re being hurt, threatened, or controlled — or thinking about ending your life — trained people are available right now, for free.{" "}
                <Link href="/safety" className="font-medium text-safety underline underline-offset-2">
                  Find help in your country
                </Link>
                .
              </p>
            </div>
          </Reveal>
        </section>

        <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-20 sm:px-6 md:py-24">
          <h2 className={`text-center ${H2}`}>Questions</h2>
          <div className="mt-10 divide-y divide-line rounded-[20px] border border-line bg-surface">
            {FAQ.map((f) => (
              <details key={f.q} className="group px-5 sm:px-6">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-medium text-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="faq-plus grid h-8 w-8 shrink-0 place-items-center rounded-full bg-subtle text-lg leading-none text-ink" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="pb-5 leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 7. Final CTA: a real composer */}
        <section className="px-4 pb-20 sm:px-6 md:pb-28">
          <div className="evening mx-auto max-w-4xl rounded-[28px] border border-line px-5 py-12 text-center shadow-soft sm:px-12 sm:py-16">
            <CupsMark className="mx-auto h-14 w-auto" />
            <h2 className="mx-auto mt-5 max-w-2xl text-[clamp(2rem,1.4rem+2.2vw,3rem)] font-medium leading-[1.1] text-ink">
              Whatever it is, you don’t have to figure it out alone.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-lg text-muted">Ready when you are — even at 2am.</p>
            <FinalComposer />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
