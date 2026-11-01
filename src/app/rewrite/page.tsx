import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Rewriter } from "@/components/site/Rewriter";

export const metadata: Metadata = {
  title: "Message rewriter",
  description: "Turn a heated text into one they can actually hear. Three calmer versions — gentle, direct, or brief — in seconds. Free and private.",
};

export default function RewritePage() {
  return (
    <>
      <SiteHeader showExit />
      <main id="main" className="mx-auto max-w-3xl px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
        <p className="eyebrow">Message rewriter</p>
        <h1 className="mt-3 text-4xl font-medium leading-tight text-ink sm:text-5xl">Before you hit send.</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          Paste the message you&apos;re about to send. You&apos;ll get three calmer versions that keep your point — and lose the blame.
        </p>
        <Rewriter />
      </main>
      <SiteFooter />
    </>
  );
}
