import { DrawPath } from "@/components/motion/primitives";

/** Small two-cups mark; the steam draws itself when it scrolls into view. */
export function CupsMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 72" fill="none" className={className} aria-hidden>
      <path d="M14 66h68" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 38h22v12c0 6.6-4.9 12-11 12s-11-5.4-11-12V38z" fill="var(--surface)" stroke="var(--text)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M38 42c4.5 0 6.5 2 6.5 4.5S42.2 51 37.6 51" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" />
      <path d="M58 38h22v12c0 6.6-4.9 12-11 12s-11-5.4-11-12V38z" fill="var(--surface)" stroke="var(--text)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M58 42c-4.5 0-6.5 2-6.5 4.5s2.3 4.5 6.9 4.5" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" />
      <DrawPath d="M27 31c-3-4 3-6 0-10s2.5-7 7-9" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" duration={1.4} delay={0.2} />
      <DrawPath d="M69 31c3-4-3-6 0-10s-2.5-7-7-9" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" duration={1.4} delay={0.35} />
      <circle cx="48" cy="9" r="2.2" fill="var(--accent)" />
    </svg>
  );
}

/** Hand-drawn style: two cups on a small table, steam curling together. */
export function TwoCups({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 220" fill="none" className={className} aria-hidden>
      <ellipse cx="160" cy="196" rx="132" ry="10" fill="var(--subtle)" />
      <path d="M38 186c40-3 204-3 244 0" stroke="var(--border)" strokeWidth="2.5" strokeLinecap="round" />
      {/* left cup */}
      <path d="M62 110h66v38c0 20-15 36-33 36s-33-16-33-36v-38z" fill="var(--surface)" stroke="var(--text)" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M128 122c14 0 20 6 20 14s-7 14-21 14" stroke="var(--text)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M70 126c10 3 40 3 50 0" stroke="var(--primary)" strokeWidth="2.4" strokeLinecap="round" opacity=".7" />
      {/* right cup */}
      <path d="M190 110h66v38c0 20-15 36-33 36s-33-16-33-36v-38z" fill="var(--surface)" stroke="var(--text)" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M190 122c-14 0-20 6-20 14s7 14 21 14" stroke="var(--text)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M198 126c10 3 40 3 50 0" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" opacity=".8" />
      {/* steam meeting in the middle */}
      <path d="M95 98c-8-14 8-20 0-34s10-22 30-28c22-6 40 0 35 10" stroke="var(--primary)" strokeWidth="2.4" strokeLinecap="round" className="steam" />
      <path d="M223 98c8-14-8-20 0-34s-10-22-30-28c-22-6-40 0-35 10" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" className="steam steam-2" />
      <circle cx="160" cy="44" r="3.5" fill="var(--accent)" />
    </svg>
  );
}
