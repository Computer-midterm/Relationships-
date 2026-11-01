import Link from "next/link";
import { Logo } from "../Logo";
import { QuickExitButton } from "../QuickExit";

export function SiteHeader({ showExit = false }: { showExit?: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line/60 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
          <Link href="/rewrite" className="hidden rounded-full px-3 py-2 text-[15px] text-ink hover:bg-subtle sm:inline-flex">
            Message rewriter
          </Link>
          <Link href="/safety" className="hidden rounded-full px-3 py-2 text-[15px] text-ink hover:bg-subtle md:inline-flex">
            Safety
          </Link>
          {showExit && <QuickExitButton />}
          <Link href="/chat" className="btn-primary !px-4 !py-2">
            Start talking
          </Link>
        </nav>
      </div>
    </header>
  );
}
