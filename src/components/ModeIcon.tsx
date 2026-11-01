import type { ModeId } from "@/lib/modes";
import { IconCompass, IconConversation, IconEnvelope, IconRaincloud, IconSprout, IconTalk } from "./icons";

const MAP: Record<ModeId, typeof IconTalk> = {
  talk: IconTalk,
  conflict: IconCompass,
  prepare: IconConversation,
  message: IconEnvelope,
  dating: IconSprout,
  breakup: IconRaincloud,
};

/** Line icon for a coaching mode (replaces OS-dependent emoji). */
export function ModeIcon({ mode, size = 20, className }: { mode: ModeId; size?: number; className?: string }) {
  const I = MAP[mode] ?? IconTalk;
  return <I size={size} className={className} />;
}
