import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Common Ground handles your conversations: no account, stored only on your device, deletable anytime.",
};

const ROWS: [string, string][] = [
  ["Your conversations", "Saved only in your browser's local storage, on this device. We don't keep them on our servers."],
  ["Your settings", "Name, the other person's name, country, age group and theme — also stored only on this device, and only if you add them."],
  ["When you send a message", "The conversation is sent over an encrypted connection to our server, which passes it to our AI provider (Anthropic) to write a reply. We don't log or store the content."],
  ["Our AI provider", "Anthropic processes messages to generate replies under its commercial terms, which don't use API data to train models by default. It may retain data for a limited period for safety and abuse monitoring."],
  ["Accounts, tracking & ads", "None. No sign-up, no advertising, no third-party analytics or tracking cookies. Fonts are self-hosted."],
  ["Rate limiting", "To keep the service available, our server briefly keeps a count of requests per IP address in memory. It isn't linked to your messages and isn't stored long-term."],
];

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-3xl px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
        <p className="eyebrow">Privacy</p>
        <h1 className="mt-3 text-4xl font-medium leading-tight text-ink sm:text-5xl">What you share stays yours.</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Relationships are personal. We built Common Ground so that you don&apos;t have to trust us with a record of your private life — because we never keep one.
        </p>

        <dl className="mt-10 divide-y divide-line rounded-[20px] border border-line bg-surface">
          {ROWS.map(([t, d]) => (
            <div key={t} className="grid gap-1 px-5 py-4 sm:grid-cols-[200px_1fr] sm:gap-6 sm:px-6">
              <dt className="font-medium text-ink">{t}</dt>
              <dd className="leading-relaxed text-muted">{d}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-12">
          <h2 className="text-2xl font-medium text-ink">Deleting your data</h2>
          <p className="mt-3 leading-relaxed text-ink/90">
            Delete a single conversation from the sidebar, or everything at once in <strong className="font-semibold">Settings &amp; privacy → Delete everything</strong>.
            Clearing your browser&apos;s site data for Common Ground does the same. Because nothing is stored on our servers, there&apos;s nothing else to request.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-medium text-ink">Shared or monitored devices</h2>
          <p className="mt-3 leading-relaxed text-ink/90">
            Anyone who can use your browser can see conversations saved in it. If that&apos;s a risk, use a private window, turn on the discreet tab title, delete chats
            when you&apos;re done, and press Esc twice to leave quickly. <Link href="/safety" className="underline underline-offset-2">More on staying safe</Link>.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-medium text-ink">You&apos;re talking to an AI</h2>
          <p className="mt-3 leading-relaxed text-ink/90">
            Replies are written by an AI model, not a person. No human at Common Ground reads your conversations.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
