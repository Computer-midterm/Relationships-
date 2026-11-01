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

/**
 * Leave-now button. `compact` shortens the visible label to "Exit" on small
 * screens (the accessible name stays "Quick exit") and uses a 44px target.
 */
export function QuickExitButton({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={quickExit}
      title="Leave this site quickly (or press Esc twice)"
      aria-label={compact ? "Quick exit" : undefined}
      className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-sm font-medium text-ink shadow-soft transition-colors hover:bg-subtle ${
        compact ? "min-h-11" : "py-1.5"
      } ${className}`}
    >
      <IconExit size={16} />
      {compact ? (
        <>
          <span className="sm:hidden">Exit</span>
          <span className="hidden sm:inline">Quick exit</span>
        </>
      ) : (
        <span>Quick exit</span>
      )}
    </button>
  );
}
