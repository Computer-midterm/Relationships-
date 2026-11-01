"use client";

import type { ModeId } from "./modes";
import type { RegionCode } from "./resources";

export type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** Set when the reply failed or was stopped. */
  error?: string;
  stopped?: boolean;
};

export type Conversation = {
  id: string;
  title: string;
  mode: ModeId;
  createdAt: number;
  updatedAt: number;
  messages: Msg[];
};

export type Settings = {
  name?: string;
  partnerName?: string;
  country?: RegionCode;
  ageGroup?: "adult" | "under18";
  theme?: "system" | "light" | "dark";
  discreetTitle?: boolean;
  welcomed?: boolean;
};

const CONV_KEY = "cg.conversations.v1";
const SETTINGS_KEY = "cg.settings.v1";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export const loadConversations = (): Conversation[] =>
  read<Conversation[]>(CONV_KEY, []).filter((c) => c && Array.isArray(c.messages)).sort((a, b) => b.updatedAt - a.updatedAt);
export const saveConversations = (list: Conversation[]) => write(CONV_KEY, list);

export const loadSettings = (): Settings => read<Settings>(SETTINGS_KEY, {});
export const saveSettings = (s: Settings) => write(SETTINGS_KEY, s);

export function wipeEverything() {
  try {
    localStorage.removeItem(CONV_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    sessionStorage.clear();
  } catch {}
}

export const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export function titleFrom(text: string): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > 48 ? `${t.slice(0, 46).trimEnd()}…` : t || "New conversation";
}

export function guessCountry(): RegionCode {
  try {
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const l of langs) {
      const region = l.split("-")[1]?.toUpperCase();
      if (region === "US") return "US";
      if (region === "GB") return "UK";
      if (region === "IE") return "IE";
      if (region === "CA") return "CA";
      if (region === "AU") return "AU";
    }
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.startsWith("America/")) return "US";
    if (tz === "Europe/London") return "UK";
    if (tz === "Europe/Dublin") return "IE";
    if (tz.startsWith("Australia/")) return "AU";
  } catch {}
  return "OTHER";
}

export function toMarkdown(c: Conversation, modeLabel: string): string {
  const date = new Date(c.createdAt).toLocaleString();
  const body = c.messages
    .filter((m) => m.content.trim())
    .map((m) => `**${m.role === "user" ? "You" : "Coach"}:**\n\n${m.content.trim()}`)
    .join("\n\n---\n\n");
  return `# ${c.title}\n\n_${modeLabel} · ${date} · Common Ground (AI coach, not a therapist)_\n\n${body}\n`;
}
