// Lightweight, model-independent detection that surfaces a calm support card.
// It is a safety net, not a classifier: false positives just show resources.

export type Concern = "crisis" | "abuse" | "sexual-assault";

const PATTERNS: Record<Concern, RegExp[]> = {
  crisis: [
    /\b(kill|killing|hurt|hurting|harm|harming|cut|cutting)\s+myself\b/i,
    /\bsuicid(e|al)\b/i,
    /\b(end|ending|take|taking)\s+(it all|my (own )?life)\b/i,
    /\b(don'?t|do not|no longer)\s+want\s+to\s+(live|be alive|be here|exist|wake up)\b/i,
    /\bwant(ed)?\s+to\s+die\b/i,
    /\bbetter off (dead|without me)\b/i,
    /\bno (reason|point) (to|in) (living|live|going on)\b/i,
    /\boverdose\b/i,
  ],
  abuse: [
    /\b(he|she|they|partner|husband|wife|boyfriend|girlfriend|bf|gf|ex)\s+(hit|hits|punched|punches|slapped|slaps|kicked|kicks|choked|chokes|strangled|strangles|beat|beats|shoved|shoves|pushed|pushes)\s+me\b/i,
    /\b(choked|strangled|choking|strangling)\s+me\b/i,
    /\bthreaten(s|ed)?\s+to\s+(kill|hurt|take the (kids|children))\b/i,
    /\b(afraid|scared|terrified)\s+(of|for)\s+(him|her|them|my (partner|husband|wife|boyfriend|girlfriend))\b/i,
    /\b(afraid|scared|terrified)\s+(to go home|for my life|he'?ll|she'?ll|they'?ll)\b/i,
    /\b(tracks|tracking|monitors|monitoring)\s+my\s+(phone|location)\b/i,
    /\bwon'?t let me (see|talk to|leave|have)\b/i,
    /\b(gun|knife|weapon)\b.*\b(threat|threaten|pointed|held)\b/i,
    /\bdomestic (violence|abuse)\b/i,
  ],
  "sexual-assault": [
    /\b(raped|rape|sexually assaulted|sexual assault)\b/i,
    /\b(forced|forces|pressured|pressures)\s+me\s+(to have sex|into sex|to do sexual)\b/i,
    /\bmade me have sex\b/i,
  ],
};

export function detectConcerns(text: string): Concern[] {
  return (Object.keys(PATTERNS) as Concern[]).filter((k) => PATTERNS[k].some((re) => re.test(text)));
}
