"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { IconSend, IconStop } from "../icons";

const MAX = 6000;

export type ComposerHandle = { focus: () => void; setText: (t: string) => void };

export const Composer = forwardRef<ComposerHandle, {
  onSend: (text: string) => void;
  onStop: () => void;
  busy: boolean;
  placeholder?: string;
}>(function Composer({ onSend, onStop, busy, placeholder }, ref) {
  const [text, setText] = useState("");
  const ta = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => ta.current?.focus(),
    setText: (t: string) => {
      setText(t);
      requestAnimationFrame(() => ta.current?.focus());
    },
  }));

  useEffect(() => {
    const el = ta.current;
    if (!el) return;
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="relative rounded-[24px] border border-line bg-surface shadow-soft transition-shadow focus-within:border-primary/50 focus-within:shadow-lift"
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
        className="block max-h-[220px] w-full resize-none bg-transparent py-3.5 pl-4 pr-14 text-base leading-relaxed text-ink placeholder:text-muted focus:outline-none"
        autoComplete="off"
        spellCheck
      />
      <div className="absolute bottom-2 right-2 flex items-center gap-2">
        {near && (
          <span className={`text-xs tabular-nums ${over ? "font-medium text-accent-text" : "text-muted"}`} aria-live="polite">
            {text.length}/{MAX}
          </span>
        )}
        {busy ? (
          <button type="button" onClick={onStop} className="grid h-10 w-10 place-items-center rounded-full bg-ink text-bg transition-transform active:scale-95" aria-label="Stop the reply">
            <IconStop size={18} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!text.trim() || over}
            className="grid h-10 w-10 place-items-center rounded-full bg-primary text-on-primary transition-[transform,opacity] active:scale-95 disabled:opacity-35"
            aria-label="Send message"
          >
            <IconSend size={19} />
          </button>
        )}
      </div>
    </form>
  );
});
