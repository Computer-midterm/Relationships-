"use client";

import Link from "next/link";
import { useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { IconLifebuoy } from "../icons";
import { LogoMark } from "../Logo";
import { PressLink } from "../motion/primitives";
import { QuickExitButton } from "../QuickExit";

export function SiteHeader({ showExit = false }: { showExit?: boolean }) {
  const { scrollY } = useScroll();
  // Border + shadow fade in over the first 8px of scroll (opacity only).
  const edge = useTransform(scrollY, [0, 8], [0, 1]);

  return (
    <header className="sticky top-0 z-30 bg-bg/85 backdrop-blur-md">
      <m.div aria-hidden className="pointer-events-none absolute inset-0 border-b border-line/70 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.28)]" style={{ opacity: edge }} />
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <Link href="/" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg sm:gap-2.5" aria-label="Common Ground home">
          <LogoMark />
          {/* On pages with Quick exit, the phone header shows the mark only. */}
          <span className={`whitespace-nowrap font-display text-[17px] font-medium tracking-tight text-ink sm:text-[19px] ${showExit ? "hidden sm:inline" : ""}`}>
            Common Ground
          </span>
        </Link>
        <nav className="flex items-center gap-0.5 sm:gap-2" aria-label="Main">
          <Link href="/rewrite" className="hidden min-h-11 items-center rounded-full px-3 text-[15px] text-ink transition-colors hover:bg-subtle sm:inline-flex">
            Message rewriter
          </Link>
          <Link href="/safety" className="hidden min-h-11 items-center rounded-full px-3 text-[15px] text-ink transition-colors hover:bg-subtle md:inline-flex">
            Safety
          </Link>
          <Link
            href="/safety"
            aria-label="Safety and crisis help"
            title="Safety and crisis help"
            className="grid h-11 w-11 place-items-center rounded-full text-safety transition-colors hover:bg-safety-bg md:hidden"
          >
            <IconLifebuoy size={21} />
          </Link>
          {showExit && <QuickExitButton compact />}
          <PressLink href="/chat" className="btn-primary h-11 whitespace-nowrap !px-4 !py-0 text-[14.5px] !transition-colors active:!scale-100 sm:text-[15px]">
            Start talking
          </PressLink>
        </nav>
      </div>
    </header>
  );
}
