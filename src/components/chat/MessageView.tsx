"use client";

import { memo, useState } from "react";
import type { Msg } from "@/lib/storage";
import { IconCheck, IconCopy, IconPrinter, IconRefresh } from "../icons";
import { Markdown } from "./Markdown";

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        } catch {}
      }}
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[13px] text-muted transition-colors hover:bg-subtle hover:text-ink"
      aria-label={done ? "Copied" : label}
    >
      {done ? <IconCheck size={15} /> : <IconCopy size={15} />}
      <span>{done ? "Copied" : label}</span>
    </button>
  );
}

export const MessageView = memo(function MessageView({
  msg,
  streaming,
  isLast,
  onRegenerate,
  onPrint,
}: {
  msg: Msg;
  streaming: boolean;
  isLast: boolean;
  onRegenerate?: () => void;
  onPrint?: (id: string) => void;
}) {
  if (msg.role === "user") {
    return (
      <div className="rise flex justify-end">
        <div className="max-w-[88%] whitespace-pre-wrap rounded-[20px] rounded-br-md bg-bubble-user px-4 py-3 text-[16.5px] leading-relaxed text-ink sm:max-w-[78%]">
          {msg.content}
        </div>
      </div>
    );
  }

  const thinking = streaming && !msg.content;
  const isPrep = /prep sheet/i.test(msg.content) && msg.content.includes("**");

  return (
    <div className="rise group flex flex-col items-start" data-msg-id={msg.id}>
      <div className="max-w-full rounded-[20px] rounded-bl-md bg-bubble-coach px-4 py-3 text-[16.5px] text-ink sm:max-w-[88%]">
        {thinking ? (
          <div className="flex items-center gap-2 py-1 text-[15px] text-muted" role="status">
            <span className="breathe inline-block h-2.5 w-2.5 rounded-full bg-primary" />
            Thinking it through…
          </div>
        ) : (
          <div className={streaming ? "caret-wrap" : undefined}>
            <Markdown text={msg.content} />
          </div>
        )}
        {msg.stopped && !streaming && <p className="mt-2 text-xs text-muted">Stopped.</p>}
      </div>

      {msg.error && !streaming && (
        <div className="mt-2 flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink" role="alert">
          <span>{msg.error}</span>
          {onRegenerate && (
            <button type="button" onClick={onRegenerate} className="inline-flex items-center gap-1 font-medium text-primary underline-offset-2 hover:underline">
              <IconRefresh size={15} /> Try again
            </button>
          )}
        </div>
      )}

      {!streaming && msg.content && (
        <div className={`mt-1 flex items-center gap-0.5 transition-opacity ${isLast ? "opacity-100" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100"}`}>
          <CopyButton text={msg.content} />
          {isPrep && onPrint && (
            <button
              type="button"
              onClick={() => onPrint(msg.id)}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[13px] text-muted hover:bg-subtle hover:text-ink"
            >
              <IconPrinter size={15} /> Print
            </button>
          )}
          {isLast && onRegenerate && !msg.error && (
            <button
              type="button"
              onClick={onRegenerate}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[13px] text-muted hover:bg-subtle hover:text-ink"
            >
              <IconRefresh size={15} /> Try another answer
            </button>
          )}
        </div>
      )}
    </div>
  );
});

export { CopyButton };
