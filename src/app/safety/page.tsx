import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SafetyResources } from "@/components/site/SafetyResources";

export const metadata: Metadata = {
  title: "Safety & crisis protocol",
  description: "Free, confidential helplines by country, and how Common Ground's AI coach responds to abuse, crisis, and safety concerns.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-medium text-ink">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-ink/90">{children}</div>
    </section>
  );
}

export default function SafetyPage() {
  return (
    <>
      <SiteHeader showExit />
      <main id="main" className="mx-auto max-w-3xl px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
        <p className="eyebrow">Safety</p>
        <h1 className="mt-3 text-4xl font-medium leading-tight text-ink sm:text-5xl">You deserve to be safe.</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          If you&apos;re in danger right now, call your local emergency number. If you&apos;re being hurt, threatened, or controlled — or you&apos;re thinking about ending
          your life — these free, confidential services are staffed by trained people who can help.
        </p>

        <div className="mt-8">
          <SafetyResources />
        </div>

        <div className="mt-8 rounded-2xl border border-line bg-surface p-5 text-[15px] leading-relaxed text-ink">
          <strong className="font-semibold">Staying safe online:</strong> if someone checks your phone or computer, press <kbd className="rounded border border-line px-1.5 text-xs">Esc</kbd>{" "}
          twice to leave this site instantly, or use the Quick exit button. Consider a private browsing window, a device they can&apos;t access, and deleting your
          conversations in Settings. Hotline advocates can help you think through tech safety too.
        </div>

        <Section title="Our crisis protocol">
          <p>
            Common Ground is an AI relationship coach, not a crisis service, and it can&apos;t contact anyone on your behalf. Here is exactly how it is designed to respond
            when safety comes up:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="font-semibold">Thoughts of suicide or self-harm.</strong> The coach pauses relationship coaching, asks directly and kindly about your
              safety, and encourages you to contact a crisis line (such as 988 in the US and Canada, or Samaritans on 116 123 in the UK and Ireland) or emergency services if
              you&apos;re in immediate danger. Separately from the AI, the app watches for crisis language and shows a support card with local hotlines.
            </li>
            <li>
              <strong className="font-semibold">Abuse and coercive control.</strong> The coach is designed to recognize signs like violence, choking, threats, monitoring,
              isolation, and financial control. It believes you, names the pattern, asks whether you&apos;re safe, and shares domestic-violence hotlines and
              safety-planning basics. It will <em>not</em> suggest couples counseling, confronting the person, or ways to &ldquo;manage&rdquo; their behavior — those can
              increase danger.
            </li>
            <li>
              <strong className="font-semibold">Sexual assault.</strong> The coach believes you, never implies blame, and explains options — medical care, support lines,
              and reporting — without pressure.
            </li>
            <li>
              <strong className="font-semibold">Children at risk.</strong> The coach clearly points to child-protection help or emergency services.
            </li>
            <li>
              <strong className="font-semibold">Under 18.</strong> Younger users get a more protective coach: no sexual content, youth helplines, and encouragement to
              involve a trusted adult.
            </li>
          </ul>
        </Section>

        <Section title="What the coach won't help with">
          <p>
            To protect everyone involved, the coach won&apos;t help monitor or track someone, get around a block or no-contact request, manipulate or pressure someone, seek
            revenge, or share intimate images. It will turn toward the feelings underneath instead — like broken trust, grief, or fear.
          </p>
          <p>
            If you&apos;re worried about your <em>own</em> behavior toward a partner, support exists for you too: in the US, the National Domestic Violence Hotline
            (1-800-799-7233) talks with people who want to change; in the UK, the Respect Phoneline is on 0808 802 4040.
          </p>
        </Section>

        <Section title="Its limits">
          <p>
            AI can misunderstand and make mistakes. Common Ground is a self-help tool and doesn&apos;t provide therapy, diagnosis, or medical, legal, or immigration advice.
            For ongoing struggles, infidelity, separation, trauma, addiction, or mental-health concerns, a licensed therapist can help in ways an AI can&apos;t.
          </p>
          <p className="text-sm text-muted">
            Hotline details were checked in November 2026. If a number doesn&apos;t work,{" "}
            <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
              findahelpline.com
            </a>{" "}
            keeps an up-to-date directory. <Link href="/privacy" className="underline underline-offset-2">Read our privacy page</Link>.
          </p>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
