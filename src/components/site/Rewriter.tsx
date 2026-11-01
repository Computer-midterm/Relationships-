"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { RewriteResult } from "@/lib/schemas";
import { dur, ease, stagger } from "@/lib/motion";
import { Stagger, StaggerItem } from "../motion/Reveal";
import { IconArrowRight, IconCheck, IconCopy, IconHeartHand, IconLifebuoy, IconMessageSquare, IconPlus, IconSparkle } from "../icons";

type VariantKey = "gentle" | "direct" | "brief";

const LABELS: { key: VariantKey; title: string; hint: string }[] = [
  { key: "gentle", title: "Gentle", hint: "Warm, leads with feelings" },
  { key: "direct", title: "Direct", hint: "Clear and honest, no blame" },
  { key: "brief", title: "Brief", hint: "Short enough for a quick text" },
];

const EXAMPLES: { label: string; text: string }[] = [
  { label: "“You never listen”", text: "You literally never listen to me. I don't even know why I bother telling you anything." },
  { label: "“Cancelled again”", text: "Wow. You cancelled AGAIN. You obviously don't care about me at all. Whatever." },
  { label: "“I do everything”", text: "I'm sick of doing everything around here while you sit on your phone all night." },
];

const MAX = 3000;

type Status = "idle" | "loading" | "done" | "error";

export function Rewriter() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [text, setText] = useState("");
  const [context, setContext] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RewriteResult | null>(null);
  const [exampleIdx, setExampleIdx] = useState(0);
  const regionRef = useRef<HTMLDivElement>(null);
  const loading = status === "loading";

  // Bring the results area into view when work starts, if it's below the fold.
  useEffect(() => {
    if (status !== "loading") return;
    const el = regionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    // Keep the submit button (and its "Finding calmer words…" label) in sight above it.
    if (top > window.innerHeight * 0.7) window.scrollTo({ top: window.scrollY + top - 210, behavior: reduce ? "auto" : "smooth" });
  }, [status, reduce]);

  const applyExample = (i: number) => {
    setText(EXAMPLES[i].text);
    setExampleIdx((i + 1) % EXAMPLES.length);
  };

  const submit = async () => {
    const t = text.trim();
    if (!t || loading) return;
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t, context: context.trim() || undefined }),
      });
      const j = await res.json().catch(() => null);
      if (!res.ok) {
        setError(j?.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      } else {
        setResult(j as RewriteResult);
        setStatus("done");
      }
    } catch {
      setError("I couldn't connect. Check your internet connection and try again.");
      setStatus("error");
    }
  };

  const talkItThrough = () => {
    try {
      sessionStorage.setItem("cg.prefill", `I want to send this message, but I'm not sure it'll land well:\n\n"${text.trim().slice(0, 1500)}"`);
    } catch {}
    router.push("/chat?mode=message");
  };

  return (
    <div className="mt-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="card overflow-hidden"
        aria-busy={loading}
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="rewrite-input" className="text-[15px] font-medium text-ink">
              The message you want to send
            </label>
            <span className="min-w-[6.5rem] text-right text-xs tabular-nums text-muted" aria-live="off">
              {text.length.toLocaleString("en-US")} / {MAX.toLocaleString("en-US")}
            </span>
          </div>
          <textarea
            id="rewrite-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void submit();
            }}
            rows={4}
            maxLength={MAX}
            placeholder="Paste or type what you want to say…"
            className="field mt-2.5 min-h-32 resize-y text-[17px] leading-relaxed"
          />

          <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Examples">
            <button
              type="button"
              onClick={() => applyExample(exampleIdx)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-2.5 text-sm font-medium text-primary transition-colors hover:bg-subtle"
            >
              <IconSparkle size={16} />
              Try an example
            </button>
            {EXAMPLES.map((ex, i) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => applyExample(i)}
                aria-label={`Use example: ${ex.label.replace(/[“”]/g, "")}`}
                aria-pressed={text === ex.text}
                className={`chip min-h-11 ${text === ex.text ? "!border-primary/50 !bg-bubble-coach" : ""}`}
              >
                {ex.label}
              </button>
            ))}
          </div>

          {showContext && (
            <label className="fade mt-3 block text-sm text-muted">
              Anything the rewriter should know? <span className="text-muted/80">(optional)</span>
              <input
                value={context}
                onChange={(e) => setContext(e.target.value)}
                maxLength={400}
                autoFocus
                className="field mt-1.5"
                placeholder="e.g. It's to my partner, after they forgot our anniversary"
              />
            </label>
          )}
        </div>

        <div className="flex flex-col-reverse items-stretch gap-2 border-t border-line bg-subtle/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          {showContext ? (
            <p className="hidden text-xs text-muted sm:block">⌘/Ctrl + Enter to rewrite</p>
          ) : (
            <button
              type="button"
              onClick={() => setShowContext(true)}
              className="inline-flex min-h-11 items-center justify-center gap-1.5 self-center rounded-full px-3 text-sm text-muted transition-colors hover:bg-subtle hover:text-ink sm:-ml-3"
            >
              <IconPlus size={15} /> Add context (optional)
            </button>
          )}
          <button
            type="submit"
            disabled={!text.trim()}
            aria-disabled={loading || undefined}
            className="btn-primary relative h-12 w-full shrink-0 overflow-hidden disabled:!bg-subtle disabled:!text-muted disabled:!opacity-100 disabled:shadow-none disabled:ring-1 disabled:ring-inset disabled:ring-line sm:w-60"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <m.span
                key={loading ? "loading" : "idle"}
                className="inline-flex items-center gap-2 whitespace-nowrap"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { duration: dur.base, ease: ease.calm } }}
                exit={{ opacity: 0, y: -8, transition: { duration: dur.fast, ease: ease.exit } }}
              >
                {loading ? (
                  <>
                    <span className="breathe inline-block h-2 w-2 rounded-full bg-on-primary" aria-hidden /> Finding calmer words…
                  </>
                ) : (
                  <>
                    Rewrite it <IconArrowRight size={17} />
                  </>
                )}
              </m.span>
            </AnimatePresence>
          </button>
        </div>
      </form>

      <p className="mt-3 text-center text-[13px] text-muted">Not saved anywhere. Sent securely to our AI provider to write the rewrite.</p>

      {/* Reserve height through the skeleton -> results swap so the page never collapses (and jumps) between them. */}
      <div ref={regionRef} className={`scroll-mt-24 ${status === "loading" || status === "done" ? "min-h-[42rem]" : ""}`}>
        <AnimatePresence mode="wait" initial={false}>
          {status === "loading" && <Skeleton key="skeleton" />}
          {status === "error" && error && (
            <m.div
              key="error"
              className="mt-8 flex items-start gap-3 rounded-[20px] border border-line bg-surface px-5 py-4 text-ink shadow-soft"
              role="alert"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0, transition: { duration: dur.base, ease: ease.calm } }}
              exit={{ opacity: 0, transition: { duration: dur.fast, ease: ease.exit } }}
            >
              <IconMessageSquare size={20} className="mt-0.5 shrink-0 text-muted" />
              <p className="leading-relaxed">{error}</p>
            </m.div>
          )}
          {status === "done" && result && <Results key="results" result={result} onTalk={talkItThrough} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Results({ result, onTalk }: { result: RewriteResult; onTalk: () => void }) {
  const blocked = !result.gentle && !result.direct && !result.brief;
  return (
    <m.section aria-label="Rewrites" className="mt-8" exit={{ opacity: 0, transition: { duration: dur.fast, ease: ease.exit } }}>
      <Stagger className="grid gap-4" stagger={stagger.tight + 0.01} amount={0}>
        {result.safety && (
          <StaggerItem y={8}>
            <div className="rounded-[20px] border border-safety/30 bg-safety-bg p-5 text-ink">
              <div className="flex items-center gap-2 font-medium text-safety">
                <IconLifebuoy size={18} /> A note from the coach
              </div>
              <p className="mt-1.5 leading-relaxed">{result.safety}</p>
              <Link href="/safety" className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-safety underline underline-offset-2">
                Find free, confidential support
              </Link>
            </div>
          </StaggerItem>
        )}
        {!blocked && result.feeling && (
          <StaggerItem y={8}>
            <p className="flex items-start gap-3 rounded-[20px] bg-subtle/70 px-5 py-4 text-[15px] leading-relaxed text-ink/85">
              <IconHeartHand size={20} className="mt-0.5 shrink-0 text-accent-text" />
              <span>
                What it sounds like underneath: <span className="font-medium text-accent-text">{result.feeling}</span>
              </span>
            </p>
          </StaggerItem>
        )}
        {!blocked &&
          LABELS.map(({ key, title, hint }) =>
            result[key] ? (
              <StaggerItem key={key} as="article" y={10}>
                <VariantCard title={title} hint={hint} text={result[key]} />
              </StaggerItem>
            ) : null,
          )}
        {!blocked && result.notes?.length > 0 && (
          <StaggerItem y={10}>
            <div className="rounded-[20px] border border-line/70 bg-subtle/50 p-5 sm:p-6">
              <h2 className="text-lg font-medium text-ink">What changed</h2>
              <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-ink/80">
                {result.notes.map((n) => (
                  <li key={n} className="flex gap-3">
                    <IconCheck size={17} className="mt-[3px] shrink-0 text-primary" />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>
        )}
        <StaggerItem y={10}>
          <div className="flex flex-col items-center gap-4 rounded-[20px] border border-line bg-surface p-5 text-center sm:flex-row sm:justify-between sm:p-6 sm:text-left">
            <div>
              <p className="font-medium text-ink">Not sure it&apos;s really about the message?</p>
              <p className="mt-0.5 text-[15px] text-muted">Talk through what&apos;s behind it first. Your words go with you, not into a link.</p>
            </div>
            <button type="button" onClick={onTalk} className="btn-outline min-h-12 w-full shrink-0 sm:w-auto">
              Talk it through with the coach
            </button>
          </div>
        </StaggerItem>
      </Stagger>
    </m.section>
  );
}

function VariantCard({ title, hint, text }: { title: string; hint: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <div className="rw-card card p-4 sm:p-5" data-copied={copied}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 pl-1">
          <h2 className="text-xl font-medium text-ink">{title}</h2>
          <p className="text-[13px] text-muted">{hint}</p>
        </div>
        <CopyButton
          text={text}
          label={`Copy ${title.toLowerCase()} version`}
          onCopied={() => {
            setCopied(true);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopied(false), 600);
          }}
        />
      </div>
      <p className="rw-bubble mt-3 whitespace-pre-wrap rounded-2xl bg-bubble-coach px-4 py-3.5 text-[17px] leading-relaxed text-ink">{text}</p>
    </div>
  );
}

function CopyButton({ text, label, onCopied }: { text: string; label: string; onCopied: () => void }) {
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          onCopied();
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setDone(false), 1600);
        } catch {}
      }}
      className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-line px-3.5 text-sm text-ink transition-colors hover:bg-subtle"
      aria-label={done ? "Copied" : label}
    >
      <span className="relative inline-flex h-4 w-4 items-center justify-center" aria-hidden>
        <AnimatePresence mode="popLayout" initial={false}>
          <m.span
            key={done ? "done" : "copy"}
            className={`inline-flex ${done ? "text-primary" : "text-muted"}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: dur.fast, ease: ease.calm } }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.12, ease: ease.exit } }}
          >
            {done ? <IconCheck size={16} /> : <IconCopy size={16} />}
          </m.span>
        </AnimatePresence>
      </span>
      <span className="inline-block w-[3.25rem] text-left">{done ? "Copied" : "Copy"}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */

/** Placeholder with the same outline and rhythm as the results. */
function Skeleton() {
  return (
    <m.div
      className="mt-8 grid gap-4"
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: dur.base, ease: ease.calm } }}
      exit={{ opacity: 0, transition: { duration: dur.fast, ease: ease.exit } }}
    >
      <div className="flex items-center gap-3 rounded-[20px] bg-subtle/70 px-5 py-4">
        <span className="rw-skel h-5 w-5 shrink-0 !rounded-md" />
        <span className="rw-skel h-3.5 w-3/4 max-w-md" />
      </div>
      {LABELS.map(({ key, title, hint }) => (
        <div key={key} className="card p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="pl-1">
              <div className="text-xl font-medium text-ink/35">{title}</div>
              <div className="text-[13px] text-muted/70">{hint}</div>
            </div>
            <span className="rw-skel h-11 w-[6.5rem] opacity-60" />
          </div>
          <div className="mt-3 space-y-3 rounded-2xl bg-bubble-coach/60 px-4 py-[1.15rem]">
            <span className="rw-skel block h-3.5 w-full !bg-surface/70" />
            <span className="rw-skel block h-3.5 w-11/12 !bg-surface/70" />
            {key !== "brief" && <span className="rw-skel block h-3.5 w-2/3 !bg-surface/70" />}
          </div>
        </div>
      ))}
      <p className="sr-only">Finding calmer words…</p>
    </m.div>
  );
}
