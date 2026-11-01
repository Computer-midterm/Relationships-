import "server-only";
import type { ModeId } from "./modes";

// Development-only canned replies (COACH_MOCK=1) so the UI can be exercised
// without an API key. Never enabled unless the env var is set.

export function mockReply(mode: ModeId, lastUser: string): string {
  const t = lastUser.toLowerCase();
  if (/kill myself|suicid|end it all|want to die|don.t want to (live|be here)/.test(t)) {
    return "I'm really glad you told me, and I want to make sure you're okay. **Are you thinking about killing yourself?**\n\nIf you're in the US or Canada, you can call or text **988** right now — it's free, confidential, and there's someone there 24/7. In the UK or Ireland, Samaritans are on **116 123**. If you're in immediate danger, please call your local emergency number.\n\nI'm here, and I'm not going anywhere. Is there someone you trust who could be with you tonight?";
  }
  if (/see this from their side/.test(t)) {
    return "Let's try. From what you've described, they might be feeling **overwhelmed** — like no matter what they do, it isn't quite enough. When people feel that way, they often go quiet, not because they don't care, but because they're afraid of making it worse.\n\nUnderneath, they may need the same thing you do: to feel like a team.\n\nDoes any of that ring true, or does it feel off?";
  }
  if (/prep sheet/.test(t) || mode === "prepare") {
    return "**Your conversation prep sheet**\n- **What I want them to understand:** I've been feeling alone with the housework, and I want us to feel like a team.\n- **Best time and place:** A calm weekend morning, not right after work.\n- **Opening line:** \"I've been feeling stretched thin lately, and I'd love for us to figure out a plan together.\"\n- **Key points:**\n  - How it's been affecting me\n  - One specific request\n- **Things to avoid:** \"You never\", bringing up last month's fight\n- **If they get defensive:** \"I'm not saying it's all on you — I just want us to sort it out together.\"\n- **If it gets heated:** \"Can we take twenty minutes and come back to this?\"\n- **A good outcome looks like:** One small, concrete change you both agree to try for a week.";
  }
  const byMode: Record<ModeId, string> = {
    talk: "That sounds exhausting — replaying a fight over and over usually means something in it really mattered to you.\n\nCan I ask what part keeps coming back to you most? Is it something they said, or something you wish you'd said?",
    conflict: "It sounds like you two might be caught in a pretty common cycle: the more you push to talk, the more they pull back, and the more they pull back, the harder you push. **Neither of you is the problem — the cycle is.**\n\nWhen they go quiet, what do you feel in that moment? Hurt, scared, angry?",
    prepare: "",
    message: "Here's a calmer version you could send:\n\n> Hey — I've been thinking about last night. I'm sorry for how I said things. I was hurt, and I'd really like to talk when you're ready.\n\nIt owns your part without over-apologizing, and it leaves the door open without pressure.",
    dating: "Mixed signals are genuinely confusing. One thing that often helps: instead of decoding, notice how *you* feel after spending time with them — calm and wanted, or anxious and unsure?\n\nWhat's been happening that's making it hard to tell?",
    breakup: "I'm so sorry. Checking their profile is incredibly common after a breakup — it's your mind trying to find closure. It usually keeps the wound open, though.\n\nHow are you sleeping and eating at the moment?",
  };
  return byMode[mode] || byMode.talk;
}

export async function* mockStream(text: string, signal: AbortSignal): AsyncGenerator<string> {
  const parts = text.match(/\S+\s*/g) ?? [];
  await new Promise((r) => setTimeout(r, 450));
  for (const p of parts) {
    if (signal.aborted) return;
    yield p;
    await new Promise((r) => setTimeout(r, 18));
  }
}
