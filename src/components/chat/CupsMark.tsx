/** Two small cups with steam drifting gently upward (CSS `.steam`, stops under reduced motion). */
export function CupsMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 88 56" width="88" height="56" fill="none" className={className} aria-hidden>
      <path d="M10 50.5h68" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
      {/* left cup */}
      <path d="M16 26h20v10a10 10 0 0 1-20 0V26z" fill="var(--surface)" stroke="var(--text)" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M36 29.5c4 0 6 1.8 6 4.2s-2 4.3-6.2 4.3" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M19.5 30.5c3.5 1 9.5 1 13 0" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" opacity=".75" />
      {/* right cup */}
      <path d="M52 26h20v10a10 10 0 0 1-20 0V26z" fill="var(--surface)" stroke="var(--text)" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M52 29.5c-4 0-6 1.8-6 4.2s2 4.3 6.2 4.3" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M55.5 30.5c3.5 1 9.5 1 13 0" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" opacity=".85" />
      {/* steam, curling toward each other */}
      <path d="M26 21c-2.5-3.5 2.5-5 0-8.5s3-6.5 9-7.5" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" className="steam" />
      <path d="M62 21c2.5-3.5-2.5-5 0-8.5s-3-6.5-9-7.5" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" className="steam steam-2" />
    </svg>
  );
}
