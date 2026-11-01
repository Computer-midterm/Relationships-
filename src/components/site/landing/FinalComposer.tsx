"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconArrowRight } from "@/components/icons";
import { PressButton } from "@/components/motion/primitives";

const STARTERS = ["We keep having the same fight", "I need to have a hard conversation", "I'm not sure what I'm feeling"];

/** A real composer: whatever is typed here is waiting in the chat box on /chat. */
export function FinalComposer() {
  const router = useRouter();
  const [text, setText] = useState("");

  const go = (t: string) => {
    const v = t.trim();
    try {
      // Kept out of the URL for privacy; /chat reads and clears it.
      if (v) sessionStorage.setItem("cg.prefill", v.slice(0, 2000));
    } catch {}
    router.push("/chat");
  };

  return (
    <form
      className="mx-auto mt-8 w-full max-w-xl text-left"
      onSubmit={(e) => {
        e.preventDefault();
        go(text);
      }}
    >
      <label htmlFor="cta-composer" className="sr-only">
        What&apos;s on your mind?
      </label>
      <div className="flex items-end gap-2 rounded-[24px] border border-line bg-surface p-2 shadow-soft transition-[border-color] duration-200 focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-(--ring)">
        <textarea
          id="cta-composer"
          rows={1}
          value={text}
          maxLength={2000}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              go(text);
            }
          }}
          placeholder="What's on your mind?"
          className="cta-composer max-h-40 min-h-11 w-full min-w-0 flex-1 resize-none rounded-2xl bg-transparent px-3 py-2.5 text-[17px] leading-normal text-ink placeholder:text-muted focus:outline-none focus-visible:outline-none"
        />
        <PressButton type="submit" className="btn-primary h-11 w-11 shrink-0 !p-0 !transition-colors active:!scale-100 sm:w-auto sm:!px-5">
          <span className="sr-only sm:not-sr-only">Start</span> <IconArrowRight size={18} />
        </PressButton>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {STARTERS.map((s) => (
          <button key={s} type="button" onClick={() => go(s)} className="chip min-h-11 px-4">
            {s}
          </button>
        ))}
      </div>
      <p className="mt-5 text-center text-sm text-muted">Free · No account · Saved only on your device</p>
    </form>
  );
}
