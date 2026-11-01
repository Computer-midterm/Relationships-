"use client";

import { useEffect } from "react";
import { IconExit } from "./icons";

const SAFE_URL = "https://www.google.com/search?q=weather";

export function quickExit() {
  try {
    sessionStorage.clear();
  } catch {}
  // replace() so the Back button doesn't return here.
  window.location.replace(SAFE_URL);
}

/** Press Escape twice quickly to leave the site. */
export function QuickExitListener() {
  useEffect(() => {
    let last = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const now = Date.now();
      if (now - last < 600) quickExit();
      last = now;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return null;
}

export function QuickExitButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={quickExit}
      title="Leave this site quickly (or press Esc twice)"
      className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-medium text-ink shadow-soft transition-colors hover:bg-subtle ${className}`}
    >
      <IconExit size={16} />
      <span>Quick exit</span>
    </button>
  );
}
