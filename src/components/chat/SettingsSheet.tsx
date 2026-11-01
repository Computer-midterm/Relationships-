"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useId, useState, type ReactNode } from "react";
import Link from "next/link";
import type { Settings } from "@/lib/storage";
import type { RegionCode } from "@/lib/resources";
import { dur, ease, exitFade, spring } from "@/lib/motion";
import { Sheet } from "../Sheet";
import { RegionSelect } from "../Resources";

export function SettingsSheet({
  open,
  onClose,
  settings,
  onSave,
  onWipe,
}: {
  open: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (s: Settings) => void;
  onWipe: () => void;
}) {
  return (
    <Sheet open={open} onClose={onClose} title="Settings & privacy">
      <SettingsForm settings={settings} onClose={onClose} onSave={onSave} onWipe={onWipe} />
    </Sheet>
  );
}

/** Toggle buttons (aria-pressed) with a sliding selected pill. */
function PillToggle<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: ReactNode }[];
  value: T | undefined;
  onChange: (v: T) => void;
  label: string;
}) {
  const id = useId();
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-full border border-line bg-bg p-1">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={on}
            className={`relative min-h-9 rounded-full px-3.5 text-sm transition-colors duration-200 ${on ? "font-medium text-on-primary" : "text-ink hover:text-primary"}`}
          >
            {on && <m.span layoutId={`pill-${id}`} className="absolute inset-0 rounded-full bg-primary" transition={spring.layout} aria-hidden />}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Row({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-1">
      <span className="text-sm text-ink">{label}</span>
      {children}
    </div>
  );
}

function SettingsForm({
  settings,
  onClose,
  onSave,
  onWipe,
}: {
  settings: Settings;
  onClose: () => void;
  onSave: (s: Settings) => void;
  onWipe: () => void;
}) {
  const [draft, setDraft] = useState<Settings>(settings);
  const [confirmWipe, setConfirmWipe] = useState(false);

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ ...draft, name: draft.name?.trim() || undefined, partnerName: draft.partnerName?.trim() || undefined });
          onClose();
        }}
        className="space-y-6"
      >
        <fieldset className="space-y-3">
          <legend className="mb-2 text-[15px] font-medium text-ink">
            About you <span className="text-sm font-normal text-muted">— optional, helps the coach</span>
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm text-muted">
              Your first name
              <input className="field mt-1.5" maxLength={60} value={draft.name ?? ""} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Sam" />
            </label>
            <label className="block text-sm text-muted">
              Their name
              <input className="field mt-1.5" maxLength={60} value={draft.partnerName ?? ""} onChange={(e) => set("partnerName", e.target.value)} placeholder="e.g. Alex" />
            </label>
          </div>
          <Row label="Country">
            <RegionSelect value={(draft.country ?? "US") as RegionCode} onChange={(c) => set("country", c)} />
          </Row>
          <Row label="Age">
            <PillToggle
              label="Age"
              value={draft.ageGroup}
              onChange={(a) => set("ageGroup", a)}
              options={[
                { value: "adult", label: "18 or older" },
                { value: "under18", label: "Under 18" },
              ]}
            />
          </Row>
        </fieldset>

        <fieldset className="space-y-3 border-t border-line pt-5">
          <legend className="sr-only">Appearance &amp; discretion</legend>
          <div aria-hidden className="-mt-1 text-[15px] font-medium text-ink">
            Appearance &amp; discretion
          </div>
          <Row label="Theme">
            <PillToggle
              label="Theme"
              value={draft.theme ?? "system"}
              onChange={(t) => set("theme", t)}
              options={(["system", "light", "dark"] as const).map((t) => ({ value: t, label: t }))}
            />
          </Row>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl py-1 text-sm text-ink">
            <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-(--primary)" checked={!!draft.discreetTitle} onChange={(e) => set("discreetTitle", e.target.checked)} />
            <span>
              Discreet tab title
              <span className="block text-muted">Shows &ldquo;Notes&rdquo; in the browser tab instead of Common Ground.</span>
            </span>
          </label>
        </fieldset>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-ghost min-h-11">
            Cancel
          </button>
          <button type="submit" className="btn-primary min-h-11 px-6">
            Save
          </button>
        </div>
      </form>

      <div className="mt-6 rounded-2xl border border-line bg-subtle/45 p-4">
        <h3 className="font-sans text-sm font-medium text-ink">Your data</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Everything is stored in this browser only. Deleting removes all conversations and settings from this device. It can&apos;t be undone.{" "}
          <Link href="/privacy" className="underline underline-offset-2">
            How privacy works
          </Link>
        </p>
        <div className="mt-3 min-h-11">
          <AnimatePresence mode="wait" initial={false}>
            {confirmWipe ? (
              <m.div
                key="confirm"
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0, transition: { duration: dur.base, ease: ease.calm } }}
                exit={{ opacity: 0, transition: exitFade }}
              >
                <button type="button" onClick={onWipe} className="btn min-h-11 !bg-accent-text !px-4 text-sm text-bg">
                  Yes, delete everything
                </button>
                <button type="button" onClick={() => setConfirmWipe(false)} className="btn-ghost min-h-11 !px-4 text-sm">
                  Keep my data
                </button>
              </m.div>
            ) : (
              <m.div key="ask" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: dur.base, ease: ease.calm } }} exit={{ opacity: 0, transition: exitFade }}>
                <button type="button" onClick={() => setConfirmWipe(true)} className="btn-outline min-h-11 !px-4 text-sm">
                  Delete everything
                </button>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
