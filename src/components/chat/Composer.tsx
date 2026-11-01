"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { dur, ease, spring } from "@/lib/motion";
import { IconSend, IconStop } from "../icons";

const MAX = 6000;

export type ComposerHandle = { focus: () => void; setText: (t: string) => void };

const supportsFieldSizing = () => typeof CSS !== "undefined" && CSS.supports?.("field-sizing", "content");

const swap = {
  initial: { opacity: 0, rotate: -90, scale: 0.8 },
  animate: { opacity: 1, rotate: 0, scale: 1, transition: { duration: dur.fast, ease: ease.calm } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: dur.fast * 0.7, ease: ease.exit } },
};

export const Composer = forwardRef<
  ComposerHandle,
  {
    onSend: (text: string) => void;
    onStop: () => void;
    busy: boolean;
    placeholder?: string;
  }
>(function Composer({ onSend, onStop, busy, placeholder }, ref) {
  const [text, setText] = useState("");
  const ta = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => ta.current?.focus(),
    setText: (t: string) => {
      setText(t);
      requestAnimationFrame(() => ta.current?.focus());
    },
  }));

  // JS fallback for browsers without `field-sizing: content`.
  useEffect(() => {
    const el = ta.current;
    if (!el || supportsFieldSizing()) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [text]);

  const submit = () => {
    const t = text.trim();
    if (!t || busy || t.length > MAX) return;
    onSend(t);
    setText("");
  };

  const over = text.length > MAX;
  const near = text.length > MAX * 0.8;
  const canSend = !!text.trim() && !over;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="relative rounded-[26px] border border-line bg-surface shadow-soft transition-colors duration-200 focus-within:border-primary/45 focus-within:ring-4 focus-within:ring-primary/10"
    >
      <label htmlFor="composer" className="sr-only">
        Message the coach
      </label>
      <textarea
        id="composer"
        ref={ta}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={placeholder ?? "What's on your mind?"}
        className="composer-input block w-full resize-none rounded-[26px] bg-transparent py-3.5 pl-5 pr-16 text-base leading-relaxed text-ink placeholder:text-muted focus:outline-none focus-visible:outline-none"
        autoComplete="off"
        spellCheck
        aria-describedby={near ? "composer-count" : undefined}
      />

      {/* Character count sits above the box, so it never shifts the layout. */}
      {near && (
        <span
          id="composer-count"
          className={`absolute -top-6 right-3 text-xs tabular-nums ${over ? "font-medium text-accent-text" : "text-muted"}`}
          aria-live="polite"
        >
          {text.length.toLocaleString()}/{MAX.toLocaleString()}
        </span>
      )}

      {/* Fixed 40px box: send and stop swap in place. */}
      <div className="absolute bottom-[7px] right-[7px] h-10 w-10">
        <AnimatePresence mode="wait" initial={false}>
          {busy ? (
            <m.button
              key="stop"
              type="button"
              onClick={onStop}
              {...swap}
              whileTap={{ scale: 0.92 }}
              className="absolute inset-0 grid place-items-center rounded-full bg-ink text-bg"
              aria-label="Stop the reply"
            >
              <IconStop size={17} />
            </m.button>
          ) : (
            <m.button
              key="send"
              type="submit"
              disabled={!canSend}
              {...swap}
              whileTap={canSend ? { scale: 0.92 } : undefined}
              className="group absolute inset-0 grid place-items-center rounded-full bg-subtle text-muted"
              aria-label="Send message"
            >
              {/* The filled state fades/scales in over the quiet disabled state. */}
              <m.span
                aria-hidden
                className="absolute inset-0 rounded-full bg-primary group-hover:bg-primary-hover"
                initial={false}
                animate={canSend ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
                transition={spring.snappy}
              />
              <span className={`relative transition-colors duration-200 ${canSend ? "text-on-primary" : "text-muted"}`}>
                <IconSend size={19} />
              </span>
            </m.button>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
});
