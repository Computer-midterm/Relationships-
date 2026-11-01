import Link from "next/link";

/** Two cups, side by side — a conversation, not a cliché heart. */
export function LogoMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden className={className}>
      <rect width="32" height="32" rx="9" fill="var(--primary)" />
      <path d="M7 14h7.5v4.2a3.75 3.75 0 0 1-7.5 0V14z" stroke="var(--on-primary)" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M17.5 14H25v4.2a3.75 3.75 0 0 1-7.5 0V14z" stroke="var(--on-primary)" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9.5 11.2c0-1 1-1 1-2M21.5 11.2c0-1 1-1 1-2" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 24.5h16" stroke="var(--on-primary)" strokeWidth="1.6" strokeLinecap="round" opacity=".55" />
    </svg>
  );
}

export function Logo({ href = "/", compact = false }: { href?: string; compact?: boolean }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5 rounded-lg" aria-label="Common Ground home">
      <LogoMark />
      {!compact && <span className="font-display text-[19px] font-medium tracking-tight text-ink">Common Ground</span>}
    </Link>
  );
}
