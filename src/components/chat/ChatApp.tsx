"use client";

import { AnimatePresence, LayoutGroup, useIsPresent, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { detectConcerns, type Concern } from "@/lib/crisis";
import { MODES, getMode, type ModeId } from "@/lib/modes";
import { dur, ease, exitFade, spring } from "@/lib/motion";
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
import { ModeIcon } from "../ModeIcon";
import { Composer, type ComposerHandle } from "./Composer";
import { CrisisCard } from "./CrisisCard";
import { EmptyState } from "./EmptyState";
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
  // Assistant reply that has finished streaming but is still being revealed.
  const [drainingId, setDrainingId] = useState<string | null>(null);
  // Sr-only announcement of the latest completed reply.
  const [announce, setAnnounce] = useState("");
  // Messages created in this session animate in; history doesn't.
  const [fresh] = useState(() => new Set<string>());
  // Held until the smooth reveal has caught up, so the announcement matches the screen.
  const pendingAnnounce = useRef<string | null>(null);
  const clearDraining = useCallback(() => {
    setDrainingId(null);
    if (pendingAnnounce.current) {
      setAnnounce(pendingAnnounce.current);
      pendingAnnounce.current = null;
    }
  }, []);
  useEffect(() => {
    if (!announce) return;
    const t = setTimeout(() => setAnnounce(""), 6000);
    return () => clearTimeout(t);
  }, [announce]);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const abortRef = useRef<AbortController | null>(null);
  const composerRef = useRef<ComposerHandle>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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
  const hasActive = !!active;
  useEffect(() => {
    const el = scrollRef.current;
    if (el && hasActive && stickToBottom.current) el.scrollTop = el.scrollHeight;
    else if (el && !hasActive) el.scrollTop = 0;
  }, [hasActive, active?.messages, showCrisis]);
  // Follow content growth (the smooth reveal, crisis card, chips) while pinned to the bottom.
  useEffect(() => {
    const el = scrollRef.current;
    const inner = contentRef.current;
    if (!el || !inner || !hasActive) return;
    const ro = new ResizeObserver(() => {
      if (stickToBottom.current) el.scrollTop = el.scrollHeight;
    });
    ro.observe(inner);
    return () => ro.disconnect();
  }, [hasActive]);

  // ---------- streaming ----------
  const streamReply = useCallback(
    async (convId: string, history: Msg[], assistantId: string, modeId: ModeId) => {
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setStreamingId(assistantId);
      setDrainingId(assistantId);
      setAnnounce("");
      pendingAnnounce.current = null;
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
        if (finished && text.trim()) pendingAnnounce.current = `The coach replied: ${text.replace(/[*_>#`]+/g, "").trim()}`;
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
      fresh.add(userMsg.id).add(assistantMsg.id);
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
    [activeId, draftMode, fresh, streamingId, streamReply, updateConversations],
  );

  const regenerate = useCallback(() => {
    if (!active || streamingId) return;
    const msgs = [...active.messages];
    while (msgs.length && msgs[msgs.length - 1].role === "assistant") msgs.pop();
    if (!msgs.length) return;
    const assistantMsg: Msg = { id: uid(), role: "assistant", content: "" };
    fresh.add(assistantMsg.id);
    updateConversations((list) => list.map((c) => (c.id === active.id ? { ...c, messages: [...msgs, assistantMsg] } : c)));
    const apiHistory = msgs[0]?.role === "assistant" ? msgs.slice(1) : msgs;
    void streamReply(active.id, apiHistory, assistantMsg.id, active.mode);
  }, [active, fresh, streamingId, streamReply, updateConversations]);

  const stop = () => abortRef.current?.abort();

  // ---------- conversation management ----------
  const newConversation = () => {
    stop();
    setActiveId(null);
    setDrainingId(null);
    setSidebarOpen(false);
    setTimeout(() => composerRef.current?.focus(), 50);
  };
  const selectConversation = (id: string) => {
    if (streamingId) stop();
    setDrainingId(null);
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
  const settling = busy || !!drainingId;
  const lastAssistant = active ? [...active.messages].reverse().find((m) => m.role === "assistant") : undefined;
  const showActions = !!active && !settling && !!lastAssistant?.content && !lastAssistant.error && active.messages.length > 2;
  const fromHistory = !!active && !active.messages.some((m) => fresh.has(m.id));

  const sidebarProps = {
    conversations,
    activeId,
    onSelect: selectConversation,
    onNew: newConversation,
    onDelete: deleteConversation,
    onRename: renameConversation,
    onHelp: openHelp,
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-bg" data-print-id={printId ?? undefined}>
      {/* Sidebar: static on desktop, drawer on mobile */}
      <aside className="no-print hidden w-[288px] shrink-0 border-r border-line bg-bg lg:block">
        <LayoutGroup id="sidebar-desktop">
          <Sidebar {...sidebarProps} onSettings={() => setSettingsOpen(true)} />
        </LayoutGroup>
      </aside>
      <AnimatePresence>
        {sidebarOpen && (
          <Drawer key="drawer" onClose={closeSidebar}>
            <LayoutGroup id="sidebar-drawer">
              <Sidebar
                {...sidebarProps}
                onSettings={() => {
                  setSidebarOpen(false);
                  setSettingsOpen(true);
                }}
                onClose={closeSidebar}
              />
            </LayoutGroup>
          </Drawer>
        )}
      </AnimatePresence>

      <main className="flex min-w-0 flex-1 flex-col">
        {/* Header: one line — title, mode chip, actions */}
        <header className="no-print flex h-[60px] shrink-0 items-center gap-1 border-b border-line/70 px-2 sm:gap-1.5 sm:px-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-subtle lg:hidden"
            aria-label="Open menu"
          >
            <IconMenu />
          </button>
          <div className="flex min-w-0 flex-1 items-center gap-2.5 pl-1 lg:pl-2">
            <span className={`min-w-0 truncate text-[15px] font-medium text-ink ${active ? "" : "hidden sm:inline"}`}>{active ? active.title : "New conversation"}</span>
            <span
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-[12.5px] font-medium text-muted"
              title={mode.label}
            >
              <ModeIcon mode={mode.id} size={14} className="text-primary" />
              <span className={active ? "sr-only sm:not-sr-only" : undefined}>{mode.short}</span>
            </span>
          </div>
          {active && (
            <button
              type="button"
              onClick={exportConversation}
              className="hidden h-11 w-11 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-ink sm:grid"
              aria-label="Download this conversation"
              title="Download as Markdown"
            >
              <IconDownload size={19} />
            </button>
          )}
          <button
            type="button"
            onClick={openHelp}
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-safety transition-colors hover:bg-safety-bg"
          >
            <IconLifebuoy size={18} />
            <span className="hidden sm:inline">Talk to a person</span>
            <span className="sm:hidden">Help</span>
          </button>
          <QuickExitButton compact className="ml-0.5 shrink-0" />
        </header>

        {/* Messages */}
        <div ref={scrollRef} onScroll={onScroll} className={`flex-1 overflow-y-auto ${active ? "" : "chat-dusk"}`} aria-busy={busy}>
          <div ref={contentRef} className="mx-auto w-full max-w-[760px] px-4 pb-6 pt-6 sm:px-6">
            {!active ? (
              <EmptyState mode={draftMode} setMode={setDraftMode} name={settings.name} onStarter={(t) => send(t)} />
            ) : (
              <m.div
                key={active.id}
                className="space-y-5"
                initial={fromHistory ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={{ duration: dur.base, ease: ease.calm }}
              >
                {active.messages.map((msg, i) => (
                  <div key={msg.id} className={printId === msg.id ? "print-target" : undefined}>
                    <MessageView
                      msg={msg}
                      streaming={streamingId === msg.id}
                      animateIn={fresh.has(msg.id)}
                      isLast={i === active.messages.length - 1 && i > 0}
                      actions={i > 0}
                      onRegenerate={i === active.messages.length - 1 && msg.role === "assistant" && i > 1 ? regenerate : undefined}
                      onPrint={setPrintId}
                      onSettled={msg.id === drainingId ? clearDraining : undefined}
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
                {showActions && lastAssistant && (
                  <m.div
                    key={lastAssistant.id}
                    className="no-print flex flex-wrap gap-2 pt-1"
                    role="group"
                    aria-label="Suggested next steps"
                    initial={fresh.has(lastAssistant.id) ? "hidden" : false}
                    animate="visible"
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } } }}
                  >
                    {getMode(active.mode).actions.map((a) => (
                      <m.button
                        key={a.label}
                        type="button"
                        onClick={() => send(a.prompt)}
                        className="chip min-h-11"
                        variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0, transition: spring.gentle } }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {a.label}
                      </m.button>
                    ))}
                  </m.div>
                )}
              </m.div>
            )}
          </div>
        </div>

        {/* Completed coach replies are announced here (not the streaming text). */}
        <div role="status" className="sr-only">
          {announce}
        </div>

        {/* Composer */}
        <div className="no-print relative px-3 pb-safe pt-2 sm:px-6">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-bg to-transparent" />
          <div className="mx-auto w-full max-w-[760px]">
            {storageWarning && (
              <p className="mb-2 rounded-xl bg-subtle px-3 py-2 text-sm text-ink">
                Your browser isn&apos;t letting us save chats (private mode or storage full). This conversation will disappear when you close the tab.
              </p>
            )}
            <Composer ref={composerRef} onSend={send} onStop={stop} busy={busy} placeholder={active ? "Reply…" : "What's on your mind?"} />
            <p className="mt-2 text-center text-[12px] leading-snug text-muted">AI coach, not a therapist — it can make mistakes.</p>
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

/** Mobile drawer: slides in from the left; drag or swipe left to close. */
function Drawer({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  const isPresent = useIsPresent();
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>('[aria-label="Close menu"]')?.focus({ preventScroll: true }), 40);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className={`no-print fixed inset-0 z-40 lg:hidden ${isPresent ? "" : "pointer-events-none"}`}
      aria-hidden={isPresent ? undefined : true}
      inert={!isPresent}
    >
      <m.div
        className="absolute inset-0 bg-[rgb(20_18_24/0.38)]"
        onClick={onClose}
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.2, ease: ease.calm } }}
        exit={{ opacity: 0, transition: { duration: 0.2, ease: ease.exit } }}
      />
      <m.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="absolute inset-y-0 left-0 w-[86%] max-w-[320px] border-r border-line bg-surface shadow-lift"
        initial={reduce ? { opacity: 0 } : { x: "-100%" }}
        animate={reduce ? { opacity: 1 } : { x: 0 }}
        exit={reduce ? { opacity: 0, transition: exitFade } : { x: "-100%", transition: { duration: 0.22, ease: ease.exit } }}
        transition={spring.drawer}
        drag={reduce ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 1, right: 0 }}
        dragMomentum={false}
        onDragEnd={(_, info) => {
          if (info.offset.x < -80 || info.velocity.x < -400) onClose();
        }}
      >
        {children}
      </m.div>
    </div>
  );
}
