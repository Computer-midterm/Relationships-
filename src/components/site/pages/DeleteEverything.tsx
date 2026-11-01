"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useState, useSyncExternalStore } from "react";
import { dur, ease } from "@/lib/motion";
import { loadConversations, loadSettings, wipeEverything } from "@/lib/storage";
import { IconCheck, IconTrash } from "../../icons";

type Phase = "idle" | "confirm" | "done";

const noopSubscribe = () => () => {};

/** Count of conversations saved in this browser; null on the server. */
function useSavedSummary(): { chats: number; hasSettings: boolean } | null {
  const raw = useSyncExternalStore<string | null>(
    noopSubscribe,
    () => `${loadConversations().length}|${Object.keys(loadSettings()).length > 0 ? 1 : 0}`,
    () => null,
  );
  if (raw === null) return null;
  const [c, s] = raw.split("|");
  return { chats: Number(c), hasSettings: s === "1" };
}

const swap = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: dur.base, ease: ease.calm } },
  exit: { opacity: 0, y: -4, transition: { duration: dur.fast, ease: ease.exit } },
};

export function DeleteEverything() {
  const [phase, setPhase] = useState<Phase>("idle");
  const summary = useSavedSummary();

  const status =
    phase === "done"
      ? "Done. Nothing from Common Ground is left in this browser."
      : summary === null
        ? " "
        : summary.chats > 0
          ? `This browser has ${summary.chats} saved conversation${summary.chats === 1 ? "" : "s"}${summary.hasSettings ? " and your settings" : ""}.`
          : summary.hasSettings
            ? "No conversations are saved in this browser, just your settings."
            : "Nothing from Common Ground is saved in this browser right now.";

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="font-sans text-[17px] font-semibold text-ink">Delete everything on this device</h3>
          <p className="mt-1 min-h-[1.5em] text-[15px] leading-relaxed text-muted" role="status">
            {status}
          </p>
        </div>
        <div className="min-h-12 shrink-0 sm:min-w-[17rem] sm:text-right">
          <AnimatePresence mode="wait" initial={false}>
            {phase === "idle" && (
              <m.div key="idle" {...swap}>
                <button type="button" onClick={() => setPhase("confirm")} className="btn-outline min-h-12 w-full sm:w-auto">
                  <IconTrash size={17} /> Delete everything on this device
                </button>
              </m.div>
            )}
            {phase === "confirm" && (
              <m.div key="confirm" {...swap} className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  autoFocus
                  onClick={() => {
                    wipeEverything();
                    setPhase("done");
                  }}
                  className="btn min-h-12 bg-ink text-bg hover:opacity-90"
                >
                  Yes, delete it all
                </button>
                <button type="button" onClick={() => setPhase("idle")} className="btn-ghost min-h-12">
                  Cancel
                </button>
              </m.div>
            )}
            {phase === "done" && (
              <m.div key="done" {...swap} className="inline-flex min-h-12 items-center gap-2 text-[15px] font-medium text-primary">
                <IconCheck size={18} /> Deleted
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {phase === "confirm" && (
        <p className="fade mt-4 rounded-2xl bg-subtle/70 px-4 py-3 text-[15px] leading-relaxed text-ink/85">
          This removes every conversation and setting Common Ground saved in this browser. It can&apos;t be undone &mdash; and because we never kept a
          copy, there&apos;s no way to get them back.
        </p>
      )}
    </div>
  );
}
