import Link from "next/link";
import { LogoMark } from "../Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-subtle/50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-display text-lg font-medium text-ink">Common Ground</span>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            A free, private AI relationship coach. Common Ground is a self-help tool, not therapy, medical care, or a crisis service.
          </p>
          <p className="mt-4 max-w-sm rounded-2xl border border-safety/25 bg-safety-bg px-4 py-3 text-sm text-ink">
            <strong className="font-semibold">Need someone now?</strong> In the US, call or text <a href="tel:988" className="underline">988</a>, or call the
            Domestic Violence Hotline at <a href="tel:18007997233" className="underline">1-800-799-7233</a>.{" "}
            <Link href="/safety" className="font-medium text-safety underline">
              Other countries
            </Link>
          </p>
        </div>
        <div>
          <div className="text-sm font-medium text-ink">Product</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link className="hover:text-ink" href="/chat">Talk to the coach</Link></li>
            <li><Link className="hover:text-ink" href="/rewrite">Message rewriter</Link></li>
            <li><Link className="hover:text-ink" href="/#modes">Ways to use it</Link></li>
            <li><Link className="hover:text-ink" href="/#faq">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium text-ink">Trust</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link className="hover:text-ink" href="/safety">Safety &amp; crisis protocol</Link></li>
            <li><Link className="hover:text-ink" href="/privacy">Privacy</Link></li>
            <li><span>Quick exit: press Esc twice</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line/70">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted sm:px-6">
          © {new Date().getFullYear()} Common Ground. You&apos;re talking with an AI. It can make mistakes — use your own judgment, and consult a licensed professional for
          mental-health, legal, or medical concerns.
        </p>
      </div>
    </footer>
  );
}
