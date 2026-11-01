"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { detectConcerns, type Concern } from "@/lib/crisis";
import { MODES, getMode, type ModeId } from "@/lib/modes";
import type { RegionCode } from "@/lib/resources";
import {
  guessCountry,
  loadConversations,
  loadSettings,
  saveConversations,
  saveSettings,
  titleFrom,
  toMarkdown,
  uid,
  wipeEverything,
  type Conversation,
  type Msg,
  type Settings,
} from "@/lib/storage";
import { applyTheme } from "../ThemeScript";
import { HelpPanel } from "../HelpPanel";
import { QuickExitButton } from "../QuickExit";
import { IconDownload, IconLifebuoy, IconMenu } from "../icons";
import { Composer, type ComposerHandle } from "./Composer";
import { CrisisCard } from "./CrisisCard";
import { MessageView } from "./MessageView";
import { SettingsSheet } from "./SettingsSheet";
import { Sidebar } from "./Sidebar";
import { WelcomeSheet } from "./WelcomeSheet";

type StreamEvent = { type: "text"; text: string } | { type: "done"; stop: string | null } | { type: "error"; message: string };

const REFUSAL_TEXT =
  "I'm not able to help with that particular request. If something hard is going on, I'm still here to talk it through — and if you need a person, tap “Talk to a person” for free, confidential support.";

export default function ChatApp() {
  const [initial] = useState(() => {
    const s = loadSettings();
    const country = s.country ?? guessCountry();
    const m = new URLSearchParams(window.location.search).get("mode");
    return { settings: { ...s, country } as Settings, mode: (MODES.some((x) => x.id === m) ? m : "talk") as ModeId };
  });
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draftMode, setDraftMode] = useState<ModeId>(initial.mode);
  const [settings, setSettings] = useState<Settings>(initial.settings);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dismissedCards, setDismissedCards] = useState<Set<string>>(new Set());
  const [helpRegion, setHelpRegion] = useState<RegionCode>(initial.settings.country ?? "US");
  const [printId, setPrintId] = useState<string | null>(null);
  const [storageWarning, setStorageWarning] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const composerRef = useRef<ComposerHandle>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const convRef = useRef<Conversation[]>([]);
  convRef.current = conversations;

  // ---------- one-time handoffs ----------
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("mode")) window.history.replaceState(null, "", "/chat");
    // Text handed over from the rewriter (kept out of the URL for privacy).
    let prefill: string | null = null;
    try {
      prefill = sessionStorage.getItem("cg.prefill");
      sessionStorage.removeItem("cg.prefill");
    } catch {}
    if (prefill) {
      const t = setTimeout(() => composerRef.current?.setText(prefill!.slice(0, 2000)), 50);
      return () => clearTimeout(t);
    }
  }, []);

  // ---------- persistence ----------
  const persist = useCallback((list: Conversation[]) => {
    const ok = saveConversations(list);
    setStorageWarning(!ok);
  }, []);

  const updateConversations = useCallback(
    (fn: (list: Conversation[]) => Conversation[], save = true) => {
      setConversations((prev) => {
        const next = fn(prev);
        if (save) persist(next);
        return next;
      });
    },
    [persist],
  );

  // ---------- title & theme ----------
  useEffect(() => {
    document.title = settings.discreetTitle ? "Notes" : "Coach · Common Ground";
  }, [settings.discreetTitle]);
  useEffect(() => {
    applyTheme(settings.theme ?? "system");
  }, [settings.theme]);

  const active = useMemo(() => conversations.find((c) => c.id === activeId) ?? null, [conversations, activeId]);
  const mode = getMode(active?.mode ?? draftMode);
  const region: RegionCode = settings.country ?? "US";

  const concerns: Concern[] = useMemo(() => {
    if (!active) return [];
    const text = active.messages.filter((m) => m.role === "user").map((m) => m.content).join("\n");
    return detectConcerns(text);
  }, [active]);
  const showCrisis = !!active && concerns.length > 0 && !dismissedCards.has(`${active.id}:${concerns.join(",")}`);

  // ---------- scrolling ----------
  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  };
  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [active?.messages, showCrisis]);

  // ---------- streaming ----------
  const streamReply = useCallback(
    async (convId: string, history: Msg[], assistantId: string, modeId: ModeId) => {
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setStreamingId(assistantId);
      stickToBottom.current = true;

      let text = "";
      let frame = 0;
      const patch = (p: Partial<Msg>, save = false) =>
        updateConversations(
          (list) =>
            list.map((c) =>
              c.id === convId ? { ...c, updatedAt: Date.now(), messages: c.messages.map((m) => (m.id === assistantId ? { ...m, ...p } : m)) } : c,
            ),
          save,
        );
      const flush = () => {
        frame = 0;
        patch({ content: text });
      };

      const s = loadSettings();
      const context = {
        name: s.name || undefined,
        partnerName: s.partnerName || undefined,
        country: s.country || undefined,
        ageGroup: s.ageGroup || undefined,
      };

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: ctrl.signal,
          body: JSON.stringify({
            mode: modeId,
            context,
            messages: history.filter((m) => m.content.trim() && !(m.role === "assistant" && m.error && !m.content)).map((m) => ({ role: m.role, content: m.content })),
          }),
        });
        if (!res.ok || !res.body) {
          let message = "Something went wrong. Please try again.";
          try {
            const j = await res.json();
            if (j?.error) message = j.error;
          } catch {}
          patch({ error: message }, true);
          return;
        }
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let buf = "";
        let finished = false;
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          let nl: number;
          while ((nl = buf.indexOf("\n")) >= 0) {
            const line = buf.slice(0, nl).trim();
            buf = buf.slice(nl + 1);
            if (!line) continue;
            let ev: StreamEvent;
            try {
              ev = JSON.parse(line);
            } catch {
              continue;
            }
            if (ev.type === "text") {
              text += ev.text;
              if (!frame) frame = requestAnimationFrame(flush);
            } else if (ev.type === "done") {
              finished = true;
              if (ev.stop === "refusal" && !text.trim()) text = REFUSAL_TEXT;
              else if (ev.stop === "refusal") text += `\n\n_${REFUSAL_TEXT}_`;
            } else if (ev.type === "error") {
              finished = true;
              if (frame) cancelAnimationFrame(frame);
              patch({ content: text, error: ev.message }, true);
              return;
            }
          }
        }
        if (frame) cancelAnimationFrame(frame);
        patch(finished ? { content: text } : { content: text, error: "The reply was cut off. Please try again." }, true);
      } catch (e) {
        if (frame) cancelAnimationFrame(frame);
        if ((e as Error).name === "AbortError") {
          patch({ content: text, stopped: true }, true);
        } else {
          patch({ content: text, error: "I couldn't connect. Check your internet connection and try again." }, true);
        }
      } finally {
        abortRef.current = null;
        setStreamingId(null);
      }
    },
    [updateConversations],
  );

  const send = useCallback(
    (text: string) => {
      if (streamingId) return;
      const userMsg: Msg = { id: uid(), role: "user", content: text };
      const assistantMsg: Msg = { id: uid(), role: "assistant", content: "" };
      let convId = activeId;
      let history: Msg[];
      let modeId: ModeId;

      if (!convId || !convRef.current.some((c) => c.id === convId)) {
        convId = uid();
        modeId = draftMode;
        const greeting: Msg = { id: uid(), role: "assistant", content: getMode(modeId).greeting };
        const conv: Conversation = {
          id: convId,
          title: titleFrom(text),
          mode: modeId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          messages: [greeting, userMsg, assistantMsg],
        };
        history = [greeting, userMsg];
        updateConversations((list) => [conv, ...list]);
        setActiveId(convId);
      } else {
        const conv = convRef.current.find((c) => c.id === convId)!;
        modeId = conv.mode;
        history = [...conv.messages.filter((m) => !(m.role === "assistant" && !m.content)), userMsg];
        updateConversations((list) => {
          const updated = list.map((c) => (c.id === convId ? { ...c, updatedAt: Date.now(), messages: [...history, assistantMsg] } : c));
          // keep most-recent first
          return updated.sort((a, b) => b.updatedAt - a.updatedAt);
        });
      }
      // The greeting is shown in the UI but the API needs a user-first history.
      const apiHistory = history[0]?.role === "assistant" ? history.slice(1) : history;
      void streamReply(convId, apiHistory, assistantMsg.id, modeId);
    },
    [activeId, draftMode, streamingId, streamReply, updateConversations],
  );

  const regenerate = useCallback(() => {
    if (!active || streamingId) return;
    const msgs = [...active.messages];
    while (msgs.length && msgs[msgs.length - 1].role === "assistant") msgs.pop();
    if (!msgs.length) return;
    const assistantMsg: Msg = { id: uid(), role: "assistant", content: "" };
    updateConversations((list) => list.map((c) => (c.id === active.id ? { ...c, messages: [...msgs, assistantMsg] } : c)));
    const apiHistory = msgs[0]?.role === "assistant" ? msgs.slice(1) : msgs;
    void streamReply(active.id, apiHistory, assistantMsg.id, active.mode);
  }, [active, streamingId, streamReply, updateConversations]);

  const stop = () => abortRef.current?.abort();

  // ---------- conversation management ----------
  const newConversation = () => {
    stop();
    setActiveId(null);
    setSidebarOpen(false);
    setTimeout(() => composerRef.current?.focus(), 50);
  };
  const selectConversation = (id: string) => {
    if (streamingId) stop();
    setActiveId(id);
    setSidebarOpen(false);
    stickToBottom.current = true;
  };
  const deleteConversation = (id: string) => {
    const c = convRef.current.find((x) => x.id === id);
    if (!c || !window.confirm(`Delete “${c.title}”? This can't be undone.`)) return;
    if (id === activeId) {
      stop();
      setActiveId(null);
    }
    updateConversations((list) => list.filter((x) => x.id !== id));
  };
  const renameConversation = (id: string) => {
    const c = convRef.current.find((x) => x.id === id);
    if (!c) return;
    const t = window.prompt("Rename conversation", c.title);
    if (t && t.trim()) updateConversations((list) => list.map((x) => (x.id === id ? { ...x, title: t.trim().slice(0, 80) } : x)));
  };
  const exportConversation = () => {
    if (!active) return;
    const blob = new Blob([toMarkdown(active, getMode(active.mode).label)], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${active.title.replace(/[^\w\- ]+/g, "").trim().slice(0, 40) || "conversation"}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const saveAllSettings = (s: Settings) => {
    setSettings(s);
    saveSettings(s);
    if (s.country) setHelpRegion(s.country);
  };

  const wipe = () => {
    stop();
    wipeEverything();
    setConversations([]);
    setActiveId(null);
    const fresh: Settings = { country: guessCountry() };
    setSettings(fresh);
    setSettingsOpen(false);
    applyTheme("system");
  };

  const openHelp = () => {
    setHelpRegion(region);
    setHelpOpen(true);
    setSidebarOpen(false);
  };

  // ---------- printing a prep sheet ----------
  useEffect(() => {
    if (!printId) return;
    const done = () => setPrintId(null);
    window.addEventListener("afterprint", done, { once: true });
    const t = setTimeout(() => window.print(), 50);
    return () => {
      clearTimeout(t);
      window.removeEventListener("afterprint", done);
    };
  }, [printId]);

  const busy = !!streamingId;
  const lastAssistant = active ? [...active.messages].reverse().find((m) => m.role === "assistant") : undefined;
  const showActions = !!active && !busy && !!lastAssistant?.content && !lastAssistant.error && active.messages.length > 2;

  return (
    <div className="flex h-dvh overflow-hidden bg-bg" data-print-id={printId ?? undefined}>
      {/* Sidebar: static on desktop, drawer on mobile */}
      <aside className="no-print hidden w-[288px] shrink-0 border-r border-line bg-bg lg:block">
        <Sidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={selectConversation}
          onNew={newConversation}
          onDelete={deleteConversation}
          onRename={renameConversation}
          onSettings={() => setSettingsOpen(true)}
          onHelp={openHelp}
        />
      </aside>
      {sidebarOpen && (
        <div className="no-print fixed inset-0 z-40 lg:hidden">
          <div className="fade absolute inset-0 bg-black/35" onClick={() => setSidebarOpen(false)} aria-hidden />
          <div className="rise absolute inset-y-0 left-0 w-[86%] max-w-[320px] border-r border-line bg-bg shadow-lift">
            <Sidebar
              conversations={conversations}
              activeId={activeId}
              onSelect={selectConversation}
              onNew={newConversation}
              onDelete={deleteConversation}
              onRename={renameConversation}
              onSettings={() => {
                setSidebarOpen(false);
                setSettingsOpen(true);
              }}
              onHelp={openHelp}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      <main className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="no-print flex items-center gap-2 border-b border-line/70 px-3 py-2.5 sm:px-5">
          <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-full p-2 text-ink hover:bg-subtle lg:hidden" aria-label="Open menu">
            <IconMenu />
          </button>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[15px] font-medium text-ink">{active ? active.title : "New conversation"}</div>
            <div className="truncate text-xs text-muted">
              {mode.icon} {mode.label}
            </div>
          </div>
          {active && (
            <button type="button" onClick={exportConversation} className="hidden rounded-full p-2 text-muted hover:bg-subtle hover:text-ink sm:inline-flex" aria-label="Download this conversation" title="Download as Markdown">
              <IconDownload size={19} />
            </button>
          )}
          <button
            type="button"
            onClick={openHelp}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-safety hover:bg-safety-bg"
          >
            <IconLifebuoy size={17} />
            <span className="hidden sm:inline">Talk to a person</span>
            <span className="sm:hidden">Help</span>
          </button>
          <QuickExitButton className="!px-2.5 sm:!px-3" />
        </header>

        {/* Messages */}
        <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-y-auto" aria-live="polite" aria-busy={busy}>
          <div className="mx-auto w-full max-w-[760px] px-4 pb-6 pt-6 sm:px-6">
            {!active ? (
              <EmptyState
                mode={draftMode}
                setMode={setDraftMode}
                name={settings.name}
                onStarter={(t) => send(t)}
              />
            ) : (
              <div className="space-y-5">
                {active.messages.map((m, i) => (
                  <div key={m.id} className={printId === m.id ? "print-target" : undefined}>
                    <MessageView
                      msg={m}
                      streaming={streamingId === m.id}
                      isLast={i === active.messages.length - 1 && i > 0}
                      onRegenerate={i === active.messages.length - 1 && m.role === "assistant" && i > 1 ? regenerate : undefined}
                      onPrint={setPrintId}
                    />
                  </div>
                ))}
                {showCrisis && (
                  <CrisisCard
                    concerns={concerns}
                    region={region}
                    onOpenHelp={openHelp}
                    onDismiss={() => setDismissedCards((s) => new Set(s).add(`${active.id}:${concerns.join(",")}`))}
                  />
                )}
                {showActions && (
                  <div className="no-print fade flex flex-wrap gap-2 pt-1" aria-label="Suggested next steps">
                    {getMode(active.mode).actions.map((a) => (
                      <button key={a.label} type="button" onClick={() => send(a.prompt)} className="chip">
                        {a.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="no-print border-t border-line/50 bg-bg/95 px-3 pt-3 pb-safe backdrop-blur sm:px-6">
          <div className="mx-auto w-full max-w-[760px]">
            {storageWarning && (
              <p className="mb-2 rounded-xl bg-subtle px-3 py-2 text-xs text-ink">
                Your browser isn&apos;t letting us save chats (private mode or storage full). This conversation will disappear when you close the tab.
              </p>
            )}
            <Composer ref={composerRef} onSend={send} onStop={stop} busy={busy} placeholder={active ? "Reply…" : "What's on your mind?"} />
            <p className="mt-2 text-center text-[11.5px] leading-snug text-muted">
              AI coach, not a therapist — it can make mistakes. Chats are saved only on this device.
            </p>
          </div>
        </div>
      </main>

      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} region={helpRegion} onRegionChange={setHelpRegion} focus={concerns} />
      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} settings={settings} onSave={saveAllSettings} onWipe={wipe} />
      <WelcomeSheet
        open={!settings.welcomed}
        defaultRegion={region}
        onDone={({ ageGroup, country }) => {
          saveAllSettings({ ...settings, ageGroup, country, welcomed: true });
          setTimeout(() => composerRef.current?.focus(), 80);
        }}
      />
    </div>
  );
}

function EmptyState({
  mode,
  setMode,
  name,
  onStarter,
}: {
  mode: ModeId;
  setMode: (m: ModeId) => void;
  name?: string;
  onStarter: (t: string) => void;
}) {
  const m = getMode(mode);
  return (
    <div className="fade">
      <div className="mb-6 pt-2 text-center sm:pt-8">
        <h1 className="text-[30px] font-medium leading-tight text-ink sm:text-[38px]">
          {name ? `Hi ${name}. ` : ""}What would help right now?
        </h1>
        <p className="mt-2 text-[15.5px] text-muted">Pick a starting point, or just start typing below.</p>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0" role="radiogroup" aria-label="Choose a mode">
        {MODES.map((x) => {
          const on = x.id === mode;
          return (
            <button
              key={x.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setMode(x.id)}
              className={`min-w-[150px] shrink-0 rounded-2xl border p-3.5 text-left transition-[border-color,background-color,box-shadow] duration-200 sm:min-w-0 ${
                on ? "border-primary bg-surface shadow-soft ring-4 ring-(--ring)" : "border-line bg-surface/60 hover:border-primary/40 hover:bg-surface"
              }`}
            >
              <div className="text-xl" aria-hidden>
                {x.icon}
              </div>
              <div className="mt-1.5 text-[15px] font-medium text-ink">{x.label}</div>
              <div className="mt-0.5 hidden text-[13px] leading-snug text-muted sm:block">{x.description}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-[20px] rounded-bl-md bg-bubble-coach px-4 py-3 text-[16.5px] leading-relaxed text-ink sm:max-w-[88%]" key={m.id}>
        <span className="fade">{m.greeting}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {m.starters.map((s) => (
          <button key={s} type="button" onClick={() => onStarter(s)} className="chip text-left">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
