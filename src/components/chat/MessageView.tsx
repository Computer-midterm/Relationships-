"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { memo, useEffect, useState } from "react";
import type { Msg } from "@/lib/storage";
import { dur, ease, exitFade, spring } from "@/lib/motion";
import { IconCheck, IconCopy, IconPrinter, IconRefresh } from "../icons";
import { Markdown } from "./Markdown";
import { useSmoothStream } from "./useSmoothStream";

const actionBtn =
  "inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[13.5px] text-muted transition-colors hover:bg-subtle hover:text-ink";

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1600);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
        } catch {}
      }}
      className={`${actionBtn} min-w-[5.4rem]`}
      aria-label={done ? "Copied" : label}
    >
      <span className="relative grid h-[15px] w-[15px] place-items-center" aria-hidden>
        <AnimatePresence mode="popLayout" initial={false}>
          <m.span
            key={done ? "done" : "copy"}
            className={`grid place-items-center ${done ? "text-primary" : ""}`}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1, transition: spring.snappy }}
            exit={{ opacity: 0, scale: 0.6, transition: exitFade }}
          >
            {done ? <IconCheck size={15} /> : <IconCopy size={15} />}
          </m.span>
        </AnimatePresence>
      </span>
      <span>{done ? "Copied" : label}</span>
    </button>
  );
}

/** Three breathing dots; after 4s a quiet line crossfades in. */
function Thinking() {
  const [long, setLong] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLong(true), 4000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="flex h-[1.65em] items-center gap-3 text-[15px] text-muted">
      <span className="flex items-center gap-1.5" aria-hidden>
        <span className="thinking-dot" />
        <span className="thinking-dot" />
        <span className="thinking-dot" />
      </span>
      <AnimatePresence initial={false}>
        {long && (
          <m.span
            key="long"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0, transition: { duration: dur.slow, ease: ease.calm } }}
            exit={{ opacity: 0, transition: exitFade }}
          >
            Taking a moment with this…
          </m.span>
        )}
      </AnimatePresence>
      <span className="sr-only">The coach is thinking</span>
    </div>
  );
}

const enter = { opacity: 0, y: 8, scale: 0.985 };
const shown = { opacity: 1, y: 0, scale: 1 };

export const MessageView = memo(function MessageView({
  msg,
  streaming,
  isLast,
  animateIn = false,
  actions = true,
  onRegenerate,
  onPrint,
  onSettled,
}: {
  msg: Msg;
  streaming: boolean;
  isLast: boolean;
  /** Only messages created in this session animate in; history appears as-is. */
  animateIn?: boolean;
  /** Show the copy / print / retry row (off for the canned greeting). */
  actions?: boolean;
  onRegenerate?: () => void;
  onPrint?: (id: string) => void;
  /** Called once the reply has finished streaming *and* the smooth reveal has caught up. */
  onSettled?: () => void;
}) {
  const { shown: text, caughtUp } = useSmoothStream(msg.content, streaming);
  const live = streaming || !caughtUp;

  useEffect(() => {
    if (!live) onSettled?.();
  }, [live, onSettled]);

  if (msg.role === "user") {
    return (
      <m.div
        className="flex justify-end"
        initial={animateIn ? enter : false}
        animate={shown}
        transition={spring.gentle}
        style={{ transformOrigin: "100% 100%" }}
      >
        <div className="max-w-[88%] whitespace-pre-wrap rounded-[22px] rounded-br-md bg-bubble-user px-4 py-3 text-[16.5px] leading-relaxed text-ink sm:max-w-[78%]">
          {msg.content}
        </div>
      </m.div>
    );
  }

  const thinking = live && !text;
  const isPrep = /prep sheet/i.test(msg.content) && msg.content.includes("**");

  return (
    <m.div
      className="group flex flex-col items-start"
      data-msg-id={msg.id}
      initial={animateIn ? enter : false}
      animate={shown}
      transition={spring.gentle}
      style={{ transformOrigin: "0% 100%" }}
    >
      <div className="min-h-[3.1rem] max-w-full rounded-[22px] rounded-bl-md bg-bubble-coach px-4 py-3 text-[16.5px] text-ink sm:max-w-[88%]">
        {thinking ? (
          <Thinking />
        ) : (
          <div className={live ? "caret-wrap" : undefined}>
            <Markdown text={text} />
          </div>
        )}
        {msg.stopped && !live && <p className="mt-2 text-xs text-muted">Stopped.</p>}
      </div>

      {msg.error && !live && (
        <m.div
          className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-line bg-surface px-4 py-2 text-sm text-ink"
          role="alert"
          initial={animateIn ? { opacity: 0, y: 4 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.base, ease: ease.calm }}
        >
          <span className="py-1.5">{msg.error}</span>
          {onRegenerate && (
            <button type="button" onClick={onRegenerate} className="-mx-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 font-medium text-primary hover:bg-subtle">
              <IconRefresh size={15} /> Try again
            </button>
          )}
        </m.div>
      )}

      {actions && !live && msg.content && (
        <m.div
          initial={animateIn ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: dur.base, ease: ease.calm, delay: 0.05 }}
          className="-ml-2 mt-0.5"
        >
          <div
            className={`flex items-center gap-0.5 transition-opacity duration-200 ${
              isLast ? "opacity-100" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100"
            }`}
          >
            <CopyButton text={msg.content} />
            {isPrep && onPrint && (
              <button type="button" onClick={() => onPrint(msg.id)} className={actionBtn}>
                <IconPrinter size={15} /> Print
              </button>
            )}
            {isLast && onRegenerate && !msg.error && (
              <button type="button" onClick={onRegenerate} className={actionBtn}>
                <IconRefresh size={15} /> Try another answer
              </button>
            )}
          </div>
        </m.div>
      )}
    </m.div>
  );
});

export { CopyButton };
