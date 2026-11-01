// Coaching modes — shared by client (UI copy) and server (prompt addenda).

export type ModeId = "talk" | "conflict" | "prepare" | "message" | "dating" | "breakup";

export type Mode = {
  id: ModeId;
  label: string;
  short: string;
  icon: string;
  description: string;
  greeting: string;
  starters: string[];
  /** Follow-up actions offered under the coach's latest reply. */
  actions: { label: string; prompt: string }[];
};

const SEE_THEIR_SIDE = {
  label: "See their side",
  prompt:
    "Can you help me see this from their side? What might they be feeling, needing, or afraid of — even if I don't agree with how they handled it?",
};

export const MODES: Mode[] = [
  {
    id: "talk",
    label: "Talk it through",
    short: "Talk",
    icon: "💬",
    description: "Say what's on your mind. Vent, untangle, figure out what you actually feel.",
    greeting:
      "I'm here to listen. What's going on? You can start anywhere — messy is fine.",
    starters: [
      "We had a fight last night and I can't stop replaying it",
      "I feel lonely even when we're together",
      "I'm not sure if what I'm feeling is normal",
      "My partner and I want different things",
    ],
    actions: [SEE_THEIR_SIDE, { label: "What could I say?", prompt: "What could I actually say to them about this? Can you give me a couple of ways to open the conversation?" }],
  },
  {
    id: "conflict",
    label: "Understand a conflict",
    short: "Conflict",
    icon: "🧭",
    description: "Map the pattern you keep getting stuck in — and what's underneath it.",
    greeting:
      "Let's look at the pattern together. Tell me about a recent argument — what started it, and how did it go from there?",
    starters: [
      "We keep having the same fight about chores",
      "The more I try to talk, the more they shut down",
      "Small things turn into huge arguments",
      "We argue about money constantly",
    ],
    actions: [
      SEE_THEIR_SIDE,
      { label: "Name the cycle", prompt: "Can you describe the cycle we seem to get stuck in, in a way that doesn't blame either of us?" },
      { label: "How do we repair?", prompt: "What could a repair look like after this fight?" },
    ],
  },
  {
    id: "prepare",
    label: "Prepare for a hard talk",
    short: "Prepare",
    icon: "🗣️",
    description: "Plan what to say, how to open gently, and what to do if it heats up.",
    greeting:
      "Let's get you ready. What's the conversation you need to have, and who is it with?",
    starters: [
      "I need to tell my partner I'm unhappy",
      "I want to ask for more help at home without a fight",
      "I need to set a boundary with my mother-in-law",
      "I want to bring up our sex life",
    ],
    actions: [
      { label: "Make my prep sheet", prompt: "Can you put together my conversation prep sheet now?" },
      { label: "Role-play it", prompt: "Can we role-play it? You play them, realistically — not too easy on me. I'll start." },
      SEE_THEIR_SIDE,
    ],
  },
  {
    id: "message",
    label: "Write a message",
    short: "Message",
    icon: "✉️",
    description: "Draft a text, email or letter that says what you mean — and lands well.",
    greeting:
      "Let's write it together. Who's it for, and what do you want them to understand? If you already have a draft, paste it in.",
    starters: [
      "Help me apologize without making excuses",
      "I want to text them after our fight",
      "Help me say no kindly but clearly",
      "I want to reach out to an ex for closure",
    ],
    actions: [
      { label: "Make it gentler", prompt: "Can you make that gentler?" },
      { label: "Make it shorter", prompt: "Can you make it shorter?" },
      { label: "How might they read it?", prompt: "How might they read this message? Anything that could land differently than I mean it?" },
    ],
  },
  {
    id: "dating",
    label: "Dating & early days",
    short: "Dating",
    icon: "🌱",
    description: "Mixed signals, first dates, defining the relationship, knowing what you want.",
    greeting:
      "Early days can be exciting and confusing at the same time. What's happening?",
    starters: [
      "I can't tell if they're interested",
      "How do I bring up 'what are we?'",
      "I keep attracting the same kind of person",
      "Dating apps are wearing me out",
    ],
    actions: [
      SEE_THEIR_SIDE,
      { label: "What do I want?", prompt: "Can you help me figure out what I actually want here?" },
    ],
  },
  {
    id: "breakup",
    label: "After a breakup",
    short: "Breakup",
    icon: "🌧️",
    description: "Grief, closure, no-contact, and slowly feeling like yourself again.",
    greeting:
      "I'm sorry you're going through this. Breakups can hurt in a way that's hard to explain. How are you doing today?",
    starters: [
      "I can't stop checking their social media",
      "Should I reach out to them?",
      "I don't understand why it ended",
      "How do I stop blaming myself?",
    ],
    actions: [
      { label: "Something for tonight", prompt: "What's one small thing I could do tonight to take care of myself?" },
      { label: "Help me understand", prompt: "Can you help me make some sense of why it might have ended, without blaming me or them?" },
    ],
  },
];

export const MODE_IDS = MODES.map((m) => m.id) as [ModeId, ...ModeId[]];

export function getMode(id: string | undefined | null): Mode {
  return MODES.find((m) => m.id === id) ?? MODES[0];
}
