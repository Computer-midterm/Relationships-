"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { RewriteResult } from "@/lib/schemas";
import { CopyButton } from "../chat/MessageView";
import { IconArrowRight, IconLifebuoy } from "../icons";

const LABELS: { key: "gentle" | "direct" | "brief"; title: string; hint: string }[] = [
  { key: "gentle", title: "Gentle", hint: "Warm, leads with feelings" },
  { key: "direct", title: "Direct", hint: "Clear and honest, no blame" },
  { key: "brief", title: "Brief", hint: "Short enough for a quick text" },
];

const EXAMPLE = "You literally never listen to me. I don't even know why I bother telling you anything.";

export function Rewriter() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [context, setContext] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RewriteResult | null>(null);

  const submit = async () => {
    const t = text.trim();
    if (!t || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t, context: context.trim() || undefined }),
      });
      const j = await res.json().catch(() => null);
      if (!res.ok) setError(j?.error ?? "Something went wrong. Please try again.");
      else setResult(j as RewriteResult);
    } catch {
      setError("I couldn't connect. Check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const blocked = result && !result.gentle && !result.direct && !result.brief;

  return (
    <div className="mt-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="card p-4 sm:p-5"
      >
        <label htmlFor="rewrite-input" className="text-sm font-medium text-ink">
          Your message
        </label>
        <textarea
          id="rewrite-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void submit();
          }}
          rows={5}
          maxLength={3000}
          placeholder="Paste or type what you want to say…"
          className="field mt-2 resize-y leading-relaxed"
        />
        {showContext ? (
          <label className="mt-3 block text-sm text-muted">
            Anything the rewriter should know? <span className="text-muted/80">(optional)</span>
            <input
              value={context}
              onChange={(e) => setContext(e.target.value)}
              maxLength={400}
              className="field mt-1.5"
              placeholder="e.g. It's to my partner, after they forgot our anniversary"
            />
          </label>
        ) : (
          <button type="button" onClick={() => setShowContext(true)} className="mt-2 text-sm text-primary underline-offset-2 hover:underline">
            + Add context (optional)
          </button>
        )}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => setText(EXAMPLE)} className="text-sm text-muted underline-offset-2 hover:text-ink hover:underline">
            Try an example
          </button>
          <button type="submit" disabled={!text.trim() || loading} className="btn-primary">
            {loading ? (
              <>
                <span className="breathe inline-block h-2 w-2 rounded-full bg-on-primary" /> Rewriting…
              </>
            ) : (
              <>
                Rewrite it <IconArrowRight size={17} />
              </>
            )}
          </button>
        </div>
      </form>

      <p className="mt-3 text-center text-xs text-muted">Not saved anywhere. Sent securely to our AI provider to generate the rewrite.</p>

      {error && (
        <div className="mt-6 rounded-2xl border border-line bg-surface px-4 py-3 text-ink" role="alert">
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-8 grid gap-4" aria-hidden>
          {[0, 1, 2].map((k) => (
            <div key={k} className="card h-28 animate-pulse bg-surface/60" />
          ))}
        </div>
      )}

      {result && (
        <section className="mt-8 space-y-4" aria-label="Rewrites">
          {result.safety && (
            <div className="rounded-[20px] border border-safety/30 bg-safety-bg p-4 text-ink">
              <div className="flex items-center gap-2 font-medium text-safety">
                <IconLifebuoy size={18} /> A note from the coach
              </div>
              <p className="mt-1.5 leading-relaxed">{result.safety}</p>
              <Link href="/safety" className="mt-2 inline-block text-sm font-medium text-safety underline underline-offset-2">
                Find free, confidential support
              </Link>
            </div>
          )}
          {!blocked && (
            <>
              {result.feeling && (
                <p className="fade text-[15px] text-muted">
                  What it sounds like underneath: <span className="font-medium text-accent-text">{result.feeling}</span>
                </p>
              )}
              {LABELS.map(({ key, title, hint }, k) =>
                result[key] ? (
                  <article key={key} className="card rise p-5" style={{ animationDelay: `${k * 80}ms` }}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h2 className="font-sans text-[15px] font-semibold text-ink">{title}</h2>
                        <p className="text-xs text-muted">{hint}</p>
                      </div>
                      <CopyButton text={result[key]} />
                    </div>
                    <p className="mt-3 whitespace-pre-wrap rounded-2xl bg-bubble-coach px-4 py-3 text-[16px] leading-relaxed text-ink">{result[key]}</p>
                  </article>
                ) : null,
              )}
              {result.notes?.length > 0 && (
                <div className="rounded-[20px] bg-subtle/70 p-5">
                  <h2 className="font-sans text-sm font-semibold text-ink">What changed</h2>
                  <ul className="mt-2 space-y-1.5 text-[15px] text-muted">
                    {result.notes.map((n) => (
                      <li key={n} className="flex gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
          <div className="rounded-[20px] border border-line bg-surface p-5 text-center">
            <p className="text-ink">Want to talk through what&apos;s behind this message first?</p>
            <button
              type="button"
              onClick={() => {
                try {
                  sessionStorage.setItem("cg.prefill", `I want to send this message, but I'm not sure it'll land well:\n\n"${text.trim().slice(0, 1500)}"`);
                } catch {}
                router.push("/chat?mode=message");
              }}
              className="btn-outline mt-3"
            >
              Talk it through with the coach
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
