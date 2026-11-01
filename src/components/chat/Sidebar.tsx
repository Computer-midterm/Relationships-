"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import type { Conversation } from "@/lib/storage";
import { exitFade, spring } from "@/lib/motion";
import { Logo } from "../Logo";
import { ModeIcon } from "../ModeIcon";
import { IconLifebuoy, IconLock, IconPencil, IconPlus, IconSettings, IconTrash, IconX } from "../icons";

function groupLabel(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const start = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((start(now) - start(d)) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return "This week";
  return "Earlier";
}

const iconBtn =
  "grid h-10 w-10 place-items-center rounded-lg text-muted transition-colors hover:bg-bg hover:text-ink lg:h-8 lg:w-8";

export function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onRename,
  onSettings,
  onHelp,
  onClose,
}: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string) => void;
  onSettings: () => void;
  onHelp: () => void;
  onClose?: () => void;
}) {
  const groups: { label: string; items: Conversation[] }[] = [];
  for (const c of conversations) {
    const label = groupLabel(c.updatedAt);
    const g = groups.find((x) => x.label === label);
    if (g) g.items.push(c);
    else groups.push({ label, items: [c] });
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-[60px] items-center justify-between pl-4 pr-2 pt-1">
        <Logo />
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-ink lg:hidden"
            aria-label="Close menu"
          >
            <IconX />
          </button>
        )}
      </div>

      <div className="px-3 pt-1">
        <button type="button" onClick={onNew} className="btn-outline min-h-11 w-full justify-start !rounded-2xl !px-4">
          <IconPlus size={18} /> New conversation
        </button>
      </div>

      <nav className="mt-4 flex-1 overflow-y-auto overscroll-contain px-2 pb-2" aria-label="Your conversations">
        {conversations.length === 0 ? (
          <p className="px-3 py-2 text-sm leading-relaxed text-muted">Your conversations will appear here. They&apos;re saved only on this device.</p>
        ) : (
          groups.map((g) => (
            <div key={g.label} className="mb-3">
              <div className="px-3 pb-1.5 pt-1 text-xs font-medium uppercase tracking-[0.12em] text-muted">{g.label}</div>
              <ul>
                <AnimatePresence initial={false}>
                  {g.items.map((c) => {
                    const active = c.id === activeId;
                    return (
                      <m.li
                        key={c.id}
                        layout="position"
                        className="group relative"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8, transition: exitFade }}
                        transition={spring.layout}
                      >
                        <button
                          type="button"
                          onClick={() => onSelect(c.id)}
                          className={`relative flex min-h-11 w-full items-center gap-2.5 rounded-xl py-2 pl-3 pr-[5.5rem] text-left text-[14.5px] transition-colors lg:pr-[4.5rem] ${
                            active ? "font-medium text-ink" : "text-ink/85 hover:bg-subtle/60"
                          }`}
                          aria-current={active ? "true" : undefined}
                        >
                          {active && (
                            <m.span layoutId="conv-active" className="absolute inset-0 rounded-xl bg-subtle" transition={spring.layout} aria-hidden />
                          )}
                          <ModeIcon mode={c.mode} size={17} className={`relative shrink-0 ${active ? "text-primary" : "text-muted"}`} />
                          <span className="relative truncate">{c.title}</span>
                        </button>
                        <div
                          className={`absolute right-1 top-1/2 flex -translate-y-1/2 gap-0.5 transition-opacity duration-150 ${
                            active ? "opacity-100" : "opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-within:opacity-100"
                          }`}
                        >
                          <button type="button" onClick={() => onRename(c.id)} className={iconBtn} aria-label={`Rename “${c.title}”`}>
                            <IconPencil size={15} />
                          </button>
                          <button type="button" onClick={() => onDelete(c.id)} className={iconBtn} aria-label={`Delete “${c.title}”`}>
                            <IconTrash size={15} />
                          </button>
                        </div>
                      </m.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            </div>
          ))
        )}
      </nav>

      <div className="space-y-0.5 border-t border-line p-3 pb-safe">
        <button
          type="button"
          onClick={onHelp}
          className="flex min-h-11 w-full items-center gap-2.5 rounded-xl px-3 text-[14.5px] font-medium text-safety transition-colors hover:bg-safety-bg"
        >
          <IconLifebuoy size={18} /> Talk to a person
        </button>
        <button
          type="button"
          onClick={onSettings}
          className="flex min-h-11 w-full items-center gap-2.5 rounded-xl px-3 text-[14.5px] text-ink transition-colors hover:bg-subtle"
        >
          <IconSettings size={18} /> Settings &amp; privacy
        </button>
        <p className="flex items-center gap-2 px-3 pt-1.5 text-xs text-muted">
          <IconLock size={13} /> Saved only on this device
        </p>
      </div>
    </div>
  );
}
