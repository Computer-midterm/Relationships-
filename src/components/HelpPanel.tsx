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
      <p className="mb-4 text-[15px] leading-relaxed text-muted">
        These services are free, confidential, and staffed by trained people. You don&apos;t need to be in crisis to reach out.
      </p>
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        <label htmlFor="help-region" className="text-muted">
          Showing help for
        </label>
        <RegionSelect id="help-region" value={region} onChange={onRegionChange} />
      </div>
      <ResourceList region={region} focus={focus} animated />
      <p className="mt-5 text-sm leading-relaxed text-muted">
        If someone checks your devices, you can press <kbd className="kbd">Esc</kbd> twice to leave this site quickly. Read more about{" "}
        <Link href="/safety" className="underline underline-offset-2">
          safety and how the coach handles crisis
        </Link>
        .
      </p>
    </Sheet>
  );
}
