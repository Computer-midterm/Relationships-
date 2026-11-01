import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-4xl font-medium text-ink">This page wandered off.</h1>
        <p className="mt-3 text-muted">Let&apos;s get you back somewhere useful.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn-outline">Home</Link>
          <Link href="/chat" className="btn-primary">Talk to the coach</Link>
        </div>
      </main>
    </>
  );
}
