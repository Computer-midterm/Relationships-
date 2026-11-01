"use client";

import Link from "next/link";
import type { RegionCode } from "@/lib/resources";
import { RegionSelect, ResourceList } from "./Resources";
import { Sheet } from "./Sheet";

export function HelpPanel({
  open,
  onClose,
  region,
  onRegionChange,
  focus,
}: {
  open: boolean;
  onClose: () => void;
  region: RegionCode;
  onRegionChange: (r: RegionCode) => void;
  focus?: string[];
}) {
  return (
    <Sheet open={open} onClose={onClose} title="Talk to a person" wide>
      <p className="-mt-2 mb-4 text-[15px] text-muted">
        These services are free, confidential, and staffed by trained people. You don&apos;t need to be in crisis to reach out.
      </p>
      <div className="mb-4 flex items-center gap-2 text-sm">
        <label htmlFor="help-region" className="text-muted">
          Showing help for
        </label>
        <RegionSelect id="help-region" value={region} onChange={onRegionChange} />
      </div>
      <ResourceList region={region} focus={focus} />
      <p className="mt-5 text-sm text-muted">
        If someone checks your devices, you can press <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 text-xs">Esc</kbd> twice to leave this site
        quickly. Read more about <Link href="/safety" className="underline underline-offset-2">safety and how the coach handles crisis</Link>.
      </p>
    </Sheet>
  );
}
