"use client";

import { getMode } from "@/lib/modes";
import type { Conversation } from "@/lib/storage";
import { Logo } from "../Logo";
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
      <div className="flex items-center justify-between px-4 pb-3 pt-4">
        <Logo />
        {onClose && (
          <button type="button" onClick={onClose} className="rounded-full p-2 text-muted hover:bg-subtle hover:text-ink lg:hidden" aria-label="Close menu">
            <IconX />
          </button>
        )}
      </div>

      <div className="px-3">
        <button type="button" onClick={onNew} className="btn-outline w-full justify-start !rounded-2xl !px-4">
          <IconPlus size={18} /> New conversation
        </button>
      </div>

      <nav className="mt-4 flex-1 overflow-y-auto px-2" aria-label="Your conversations">
        {conversations.length === 0 ? (
          <p className="px-3 py-2 text-sm leading-relaxed text-muted">Your conversations will appear here. They&apos;re saved only on this device.</p>
        ) : (
          groups.map((g) => (
            <div key={g.label} className="mb-3">
              <div className="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-muted">{g.label}</div>
              <ul>
                {g.items.map((c) => {
                  const active = c.id === activeId;
                  return (
                    <li key={c.id} className="group relative">
                      <button
                        type="button"
                        onClick={() => onSelect(c.id)}
                        className={`flex w-full items-center gap-2.5 rounded-xl py-2 pl-3 pr-16 text-left text-[14.5px] transition-colors ${
                          active ? "bg-subtle font-medium text-ink" : "text-ink/85 hover:bg-subtle/70"
                        }`}
                        aria-current={active ? "true" : undefined}
                      >
                        <span aria-hidden className="text-[15px]">{getMode(c.mode).icon}</span>
                        <span className="truncate">{c.title}</span>
                      </button>
                      <div className={`absolute right-1.5 top-1/2 flex -translate-y-1/2 gap-0.5 ${active ? "opacity-100" : "opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-within:opacity-100"}`}>
                        <button type="button" onClick={() => onRename(c.id)} className="rounded-lg p-1.5 text-muted hover:bg-bg hover:text-ink" aria-label={`Rename “${c.title}”`}>
                          <IconPencil size={15} />
                        </button>
                        <button type="button" onClick={() => onDelete(c.id)} className="rounded-lg p-1.5 text-muted hover:bg-bg hover:text-ink" aria-label={`Delete “${c.title}”`}>
                          <IconTrash size={15} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </nav>

      <div className="space-y-1 border-t border-line p-3">
        <button type="button" onClick={onHelp} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[14.5px] font-medium text-safety hover:bg-safety-bg">
          <IconLifebuoy size={18} /> Talk to a person
        </button>
        <button type="button" onClick={onSettings} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[14.5px] text-ink hover:bg-subtle">
          <IconSettings size={18} /> Settings &amp; privacy
        </button>
        <p className="flex items-center gap-2 px-3 pt-1 text-xs text-muted">
          <IconLock size={13} /> Saved only on this device
        </p>
      </div>
    </div>
  );
}
