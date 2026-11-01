import Link from "next/link";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { TwoCups } from "@/components/site/Illustration";
import { RewriteDemo } from "@/components/site/RewriteDemo";
import { IconArrowRight, IconDevice, IconLifebuoy, IconScale, IconTrash, IconUserOff } from "@/components/icons";
import { MODES } from "@/lib/modes";

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

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_80%_10%,color-mix(in_srgb,var(--accent)_14%,transparent),transparent_70%),radial-gradient(50%_45%_at_10%_30%,color-mix(in_srgb,var(--primary)_10%,transparent),transparent_70%)]" />
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-14 sm:px-6 md:grid-cols-[1.1fr_1fr] md:pb-24 md:pt-20">
            <div>
              <p className="eyebrow">Free · Private · No signup</p>
              <h1 className="mt-4 text-[44px] font-medium leading-[1.04] text-ink sm:text-6xl">
                Talk it through <span className="italic text-primary">before</span> you talk it out.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
                Common Ground is an AI relationship coach that listens properly, helps you understand what&apos;s really going on — on both sides — and helps you find the
                words. Your chats stay on your device.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/chat" className="btn-primary !px-6 !py-3 text-base">
                  Start talking <IconArrowRight size={18} />
                </Link>
                <Link href="/rewrite" className="btn-outline !px-6 !py-3 text-base">
                  Rewrite a message
                </Link>
              </div>
              <p className="mt-5 text-sm text-muted">Built on Gottman, EFT &amp; couples research · Fair, not flattering</p>
            </div>
            <div className="relative mx-auto w-full max-w-[460px] pb-14 pt-24 sm:pt-20">
              <TwoCups className="mx-auto w-full max-w-[400px]" />
              <div className="absolute right-0 top-0 max-w-[250px] rounded-[20px] rounded-br-md bg-bubble-coach p-3.5 text-[14px] leading-snug text-ink shadow-soft">
                <div className="mb-1 text-xs font-medium text-muted">Coach</div>
                That sounds lonely. It might be a cycle you&apos;re both caught in — want to map it together?
              </div>
              <div className="card absolute bottom-0 left-0 max-w-[240px] p-3.5 text-[14px] leading-snug text-ink shadow-lift">
                <div className="mb-1 text-xs font-medium text-muted">You</div>
                The more I try to talk, the more they shut down.
              </div>
            </div>
          </div>
        </section>

        {/* Demo */}
        <section className="border-y border-line/70 bg-subtle/40">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-20">
            <div>
              <p className="eyebrow">Before you hit send</p>
              <h2 className="mt-3 text-4xl font-medium leading-tight text-ink">Say what you mean, in a way they can hear.</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                Paste the text you&apos;re about to send in the heat of the moment. Get three calmer versions — gentle, direct, or brief — that keep your point and lose the
                blame.
              </p>
              <Link href="/rewrite" className="mt-6 inline-flex items-center gap-2 font-medium text-primary underline-offset-4 hover:underline">
                Try the rewriter <IconArrowRight size={18} />
              </Link>
            </div>
            <RewriteDemo />
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <p className="eyebrow text-center">How it works</p>
          <h2 className="mt-3 text-center text-4xl font-medium text-ink">Three minutes to a clearer head</h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              ["Say what's going on", "No forms, no account. Pick a starting point or just start typing — messy is fine."],
              ["Get understood, then get perspective", "The coach asks a question or two, reflects what it hears, and helps you see the pattern — and the other side."],
              ["Leave with something useful", "Words you can actually say, a plan for a hard conversation, or one small next step."],
            ].map(([t, d], k) => (
              <li key={t} className="card p-6">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-bubble-coach font-display text-lg font-medium text-primary">{k + 1}</div>
                <h3 className="mt-4 text-xl font-medium text-ink">{t}</h3>
                <p className="mt-2 leading-relaxed text-muted">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Modes */}
        <section id="modes" className="scroll-mt-20 bg-subtle/40 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="eyebrow text-center">Ways to use it</p>
            <h2 className="mt-3 text-center text-4xl font-medium text-ink">Whatever you&apos;re in the middle of</h2>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MODES.map((m) => (
                <Link key={m.id} href={`/chat?mode=${m.id}`} className="card group flex flex-col p-6 transition-[transform,box-shadow] duration-300 ease-(--ease-calm) hover:-translate-y-0.5 hover:shadow-lift">
                  <div className="text-2xl" aria-hidden>
                    {m.icon}
                  </div>
                  <h3 className="mt-3 text-xl font-medium text-ink">{m.label}</h3>
                  <p className="mt-1.5 flex-1 leading-relaxed text-muted">{m.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Start <IconArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Fair, not flattering */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-bubble-coach text-primary">
                <IconScale size={24} />
              </div>
              <h2 className="mt-5 text-4xl font-medium leading-tight text-ink">Fair, not flattering.</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                General chatbots tend to tell you what you want to hear. Studies show that kind of agreement makes people <em>less</em> likely to apologize or repair.
                Common Ground takes your feelings seriously — and treats the other person as a real human, too.
              </p>
              <ul className="mt-6 space-y-2.5 text-ink">
                {[
                  "Validates your feelings, not every verdict",
                  "Never diagnoses someone who isn't in the room",
                  "Won't push you to break up — or to stay",
                  "Gently helps you see your part in a pattern",
                ].map((x) => (
                  <li key={x} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <div className="card p-5 opacity-80">
                <div className="text-xs font-medium uppercase tracking-wider text-muted">A typical chatbot</div>
                <p className="mt-2 leading-relaxed text-ink">
                  &ldquo;You&apos;re absolutely right to feel that way. Honestly, it sounds like they&apos;re being really selfish and you deserve better.&rdquo;
                </p>
              </div>
              <div className="rounded-[20px] border border-primary/30 bg-bubble-coach p-5 shadow-soft">
                <div className="text-xs font-medium uppercase tracking-wider text-primary">Common Ground</div>
                <p className="mt-2 leading-relaxed text-ink">
                  &ldquo;Being left out of that decision really stung — that makes sense. I&apos;m only hearing your side, so I&apos;m curious: if they were telling me
                  about this, what do you think they&apos;d say was going on for them?&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section className="border-y border-line/70 bg-subtle/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
            <p className="eyebrow text-center">Private by design</p>
            <h2 className="mt-3 text-center text-4xl font-medium text-ink">What you share stays yours</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                [IconUserOff, "No account", "No email, no phone number, no profile. Just open it and talk."],
                [IconDevice, "Stays on your device", "Conversations are saved in your browser — not on our servers."],
                [IconTrash, "Delete anytime", "Remove one chat or everything, instantly. Press Esc twice to leave fast."],
              ].map(([Icon, t, d]) => {
                const I = Icon as typeof IconDevice;
                return (
                  <div key={t as string} className="text-center">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-surface text-primary shadow-soft">
                      <I size={22} />
                    </div>
                    <h3 className="mt-4 text-xl font-medium text-ink">{t as string}</h3>
                    <p className="mx-auto mt-1.5 max-w-xs leading-relaxed text-muted">{d as string}</p>
                  </div>
                );
              })}
            </div>
            <p className="mt-10 text-center text-sm text-muted">
              <Link href="/privacy" className="underline underline-offset-2">
                Read exactly how privacy works
              </Link>
            </p>
          </div>
        </section>

        {/* Research */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <div className="card grid gap-8 p-7 sm:p-10 md:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="eyebrow">Grounded in research</p>
              <h2 className="mt-3 text-3xl font-medium leading-tight text-ink">Built on what actually helps couples</h2>
              <p className="mt-3 leading-relaxed text-muted">
                The coach draws on the approaches with the strongest evidence — and is honest about the ones that are useful tools rather than proven science.
              </p>
            </div>
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                ["Emotionally Focused Therapy", "Seeing the cycle you're both stuck in, and the softer feelings underneath."],
                ["Gottman research", "Gentle start-ups, repair attempts, and the antidotes to criticism and contempt."],
                ["Behavioral couple therapy", "Balancing acceptance with change, without blame."],
                ["Communication skills", "Speaker–listener, “I” statements, and clear, kind requests."],
              ].map(([t, d]) => (
                <div key={t} className="rounded-2xl bg-subtle/70 p-4">
                  <dt className="font-medium text-ink">{t}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">{d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Safety */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 md:pb-24">
          <div className="rounded-[24px] border border-safety/25 bg-safety-bg p-7 sm:p-10">
            <div className="flex items-center gap-3 text-safety">
              <IconLifebuoy size={24} />
              <h2 className="text-3xl font-medium text-ink">What it isn&apos;t</h2>
            </div>
            <div className="mt-5 grid gap-6 md:grid-cols-2">
              <p className="leading-relaxed text-ink">
                Common Ground is an AI — not a therapist, doctor, lawyer, or crisis service. It can&apos;t call for help, and it can get things wrong. For ongoing struggles,
                a licensed therapist is worth it.
              </p>
              <p className="leading-relaxed text-ink">
                If you&apos;re being hurt, threatened, or controlled — or thinking about ending your life — trained people are available right now, for free.{" "}
                <Link href="/safety" className="font-medium text-safety underline underline-offset-2">
                  Find help in your country
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 mx-auto max-w-3xl px-4 pb-20 sm:px-6">
          <h2 className="text-center text-4xl font-medium text-ink">Questions</h2>
          <div className="mt-10 divide-y divide-line rounded-[20px] border border-line bg-surface">
            {FAQ.map((f) => (
              <details key={f.q} className="group px-5 py-1 sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-medium text-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-subtle text-muted transition-transform duration-300 group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="pb-5 leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 pb-20 sm:px-6">
          <div className="mx-auto max-w-4xl rounded-[28px] bg-primary px-6 py-14 text-center text-on-primary sm:px-12">
            <h2 className="text-4xl font-medium leading-tight sm:text-5xl">Whatever it is, you don&apos;t have to figure it out alone.</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg opacity-85">Free, private, and ready when you are — even at 2am.</p>
            <Link href="/chat" className="btn mt-8 bg-bg !px-7 !py-3 text-base text-ink hover:opacity-90">
              Start talking <IconArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
