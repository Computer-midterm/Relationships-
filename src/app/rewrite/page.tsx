import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Rewriter } from "@/components/site/Rewriter";
import { RewriteHeroVisual } from "@/components/site/pages/RewriteHeroVisual";

export const metadata: Metadata = {
  title: "Message rewriter",
  description: "Turn a heated text into one they can actually hear. Three calmer versions — gentle, direct, or brief — in seconds. Free and private.",
};

export default function RewritePage() {
  return (
    <>
      <SiteHeader showExit />
      <main id="main" className="overflow-x-clip pb-20">
        <div className="pg-hero mx-auto max-w-4xl px-4 pt-8 sm:px-6 sm:pt-12">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_minmax(0,24rem)] md:gap-10">
            <div>
              <p className="eyebrow">Message rewriter</p>
              <h1 className="mt-3 text-[clamp(2.4rem,1.7rem+2.6vw,3.5rem)] font-medium leading-[1.05] text-ink">Before you hit send.</h1>
              <p className="rise mt-4 max-w-xl text-lg leading-relaxed text-muted" style={{ animationDelay: "60ms" }}>
                Paste the message you&apos;re about to send. You&apos;ll get three calmer versions that keep your point &mdash; and lose the blame.
              </p>
              <ul className="rise mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted" style={{ animationDelay: "120ms" }}>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden /> Three tones
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden /> Not saved anywhere
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden /> Free, no account
                </li>
              </ul>
            </div>
            <div className="hidden sm:block">
              <RewriteHeroVisual />
            </div>
          </div>
          <Rewriter />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
