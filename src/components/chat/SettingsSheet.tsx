"use client";

import { useState } from "react";
import Link from "next/link";
import type { Settings } from "@/lib/storage";
import type { RegionCode } from "@/lib/resources";
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
        className="space-y-5"
      >
        <fieldset className="space-y-3">
          <legend className="mb-1 text-sm font-medium text-ink">About you <span className="font-normal text-muted">— optional, helps the coach</span></legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm text-muted">
              Your first name
              <input className="field mt-1" maxLength={60} value={draft.name ?? ""} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Sam" />
            </label>
            <label className="block text-sm text-muted">
              Their name
              <input className="field mt-1" maxLength={60} value={draft.partnerName ?? ""} onChange={(e) => set("partnerName", e.target.value)} placeholder="e.g. Alex" />
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <span>Country</span>
            <RegionSelect value={(draft.country ?? "US") as RegionCode} onChange={(c) => set("country", c)} />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <span>Age</span>
            <div className="inline-flex rounded-full border border-line bg-surface p-1">
              {(["adult", "under18"] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => set("ageGroup", a)}
                  className={`rounded-full px-3 py-1 text-sm ${draft.ageGroup === a ? "bg-primary text-on-primary" : "text-ink hover:bg-subtle"}`}
                  aria-pressed={draft.ageGroup === a}
                >
                  {a === "adult" ? "18 or older" : "Under 18"}
                </button>
              ))}
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="mb-1 text-sm font-medium text-ink">Appearance &amp; discretion</legend>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <span>Theme</span>
            <div className="inline-flex rounded-full border border-line bg-surface p-1">
              {(["system", "light", "dark"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("theme", t)}
                  className={`rounded-full px-3 py-1 text-sm capitalize ${(draft.theme ?? "system") === t ? "bg-primary text-on-primary" : "text-ink hover:bg-subtle"}`}
                  aria-pressed={(draft.theme ?? "system") === t}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-start gap-3 text-sm text-ink">
            <input type="checkbox" className="mt-0.5 h-4 w-4 accent-(--primary)" checked={!!draft.discreetTitle} onChange={(e) => set("discreetTitle", e.target.checked)} />
            <span>
              Discreet tab title
              <span className="block text-muted">Shows &ldquo;Notes&rdquo; in the browser tab instead of Common Ground.</span>
            </span>
          </label>
        </fieldset>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save
          </button>
        </div>
      </form>

      <div className="mt-6 rounded-2xl border border-line bg-surface p-4">
        <h3 className="font-sans text-sm font-medium text-ink">Your data</h3>
        <p className="mt-1 text-sm text-muted">
          Everything is stored in this browser only. Deleting removes all conversations and settings from this device. It can&apos;t be undone.{" "}
          <Link href="/privacy" className="underline underline-offset-2">
            How privacy works
          </Link>
        </p>
        {confirmWipe ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={onWipe} className="btn !bg-accent-text !px-4 !py-2 text-sm text-bg">
              Yes, delete everything
            </button>
            <button type="button" onClick={() => setConfirmWipe(false)} className="btn-ghost !px-4 !py-2 text-sm">
              Keep my data
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmWipe(true)} className="btn-outline mt-3 !px-4 !py-2 text-sm">
            Delete everything
          </button>
        )}
      </div>
    </>
  );
}
