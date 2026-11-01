"use client";

import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";
import { getRegion, type RegionCode } from "@/lib/resources";
import { guessCountry, loadSettings } from "@/lib/storage";
import { IconPhone } from "../../icons";

type Ctx = { region: RegionCode; setRegion: (r: RegionCode) => void };

const RegionContext = createContext<Ctx>({ region: "US", setRegion: () => {} });

const noopSubscribe = () => () => {};

/** Shares the detected (or chosen) region between the safety band and the hotline list. */
export function SafetyRegionProvider({ children }: { children: ReactNode }) {
  const detected = useSyncExternalStore<RegionCode>(
    noopSubscribe,
    () => loadSettings().country ?? guessCountry(),
    () => "US",
  );
  const [override, setRegion] = useState<RegionCode | null>(null);
  const region = override ?? detected;
  return <RegionContext.Provider value={{ region, setRegion }}>{children}</RegionContext.Provider>;
}

export const useSafetyRegion = () => useContext(RegionContext);

/** First dialable number in an emergency string like "112 or 999". */
function dialable(emergency: string): string | null {
  return emergency.match(/\d+/)?.[0] ?? null;
}

/** Sticky "In danger now?" band under the site header. Calm safety blue, never red. */
export function SafetyBand() {
  const { region } = useSafetyRegion();
  const reg = getRegion(region);
  const tel = dialable(reg.emergency);
  return (
    <div className="sticky top-16 z-20 border-b border-safety/20 bg-safety-bg/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-12 max-w-6xl items-center justify-between gap-3 px-4 py-1.5 sm:px-6">
        <p className="min-w-0 text-[15px] leading-snug text-ink">
          <strong className="font-semibold">In danger now?</strong>{" "}
          <span>
            Call {reg.emergency}
            {region === "OTHER" ? "." : ""}
          </span>
          <span className="hidden text-muted md:inline"> &middot; Free hotlines below, or press Esc twice to leave quickly.</span>
        </p>
        {tel && (
          <a
            href={`tel:${tel}`}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-safety px-4 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
            aria-label={`Call ${tel}`}
          >
            <IconPhone size={16} /> Call {tel}
          </a>
        )}
      </div>
    </div>
  );
}
