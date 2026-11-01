import { IconArrowRight, IconSparkle } from "../../icons";

/**
 * Static before -> after card for the rewriter hero. Server-rendered and
 * animated only with the CSS `.rise` keyframe, so it never ships hidden.
 */
export function RewriteHeroVisual() {
  return (
    <figure
      className="rise relative mx-auto w-full max-w-md rounded-[24px] border border-line bg-surface p-4 shadow-lift sm:p-5"
      style={{ animationDelay: "80ms" }}
      aria-label="Example: a heated message rewritten more calmly"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Before</span>
        <span className="text-xs text-muted">sounds like blame</span>
      </div>
      <p className="mt-2 rounded-2xl rounded-br-md bg-bubble-user px-4 py-3 text-[15px] leading-relaxed text-ink/75">
        <span className="rw-before-text">Wow. You cancelled AGAIN. You obviously don&apos;t care about me at all. Whatever.</span>
      </p>

      <div className="relative my-3 flex items-center gap-3" aria-hidden>
        <span className="h-px flex-1 bg-line" />
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-1 text-xs font-medium text-primary">
          <IconSparkle size={14} /> calmer, same point
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="rise" style={{ animationDelay: "380ms" }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">After · Gentle</span>
          <span className="inline-flex items-center gap-1 text-xs text-muted">
            easier to hear <IconArrowRight size={12} />
          </span>
        </div>
        <p className="rw-bubble mt-2 rounded-2xl rounded-br-md bg-bubble-coach px-4 py-3 text-[15px] leading-relaxed text-ink">
          I felt really hurt when tonight got cancelled again. I miss you &mdash; can we find a time we both protect?
        </p>
        <figcaption className="mt-3 text-[13px] text-muted">
          Underneath: <span className="font-medium text-accent-text">hurt · wanting to feel like a priority</span>
        </figcaption>
      </div>
    </figure>
  );
}
