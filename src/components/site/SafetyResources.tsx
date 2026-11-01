"use client";

import { useState, useSyncExternalStore } from "react";
import type { RegionCode } from "@/lib/resources";
import { guessCountry, loadSettings } from "@/lib/storage";
import { RegionSelect, ResourceList } from "../Resources";

export function SafetyResources() {
  const detected = useSyncExternalStore<RegionCode>(
    () => () => {},
    () => loadSettings().country ?? guessCountry(),
    () => "US",
  );
  const [override, setRegion] = useState<RegionCode | null>(null);
  const region = override ?? detected;
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        <label htmlFor="safety-region" className="text-muted">
          Show help for
        </label>
        <RegionSelect id="safety-region" value={region} onChange={setRegion} />
      </div>
      <ResourceList region={region} />
    </div>
  );
}
