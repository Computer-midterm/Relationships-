// Crisis and support resources, shared by the UI and the coach's system prompt.
// Numbers were cross-checked against multiple official/directory listings in
// Nov 2026. Re-verify on each service's official site before launch.

export type RegionCode = "US" | "UK" | "IE" | "CA" | "AU" | "OTHER";

export type Resource = {
  name: string;
  what: string;
  /** Human-readable contact line, e.g. "Call 988 · Text 988" */
  contact: string;
  /** Primary tel: target, digits only (optional) */
  tel?: string;
  /** sms: target (optional) */
  sms?: { number: string; body?: string };
  url?: string;
  tags: ("emergency" | "crisis" | "abuse" | "sexual-assault" | "youth" | "child" | "lgbtq" | "men")[];
};

export type Region = {
  code: RegionCode;
  label: string;
  emergency: string;
  resources: Resource[];
};

export const REGIONS: Region[] = [
  {
    code: "US",
    label: "United States",
    emergency: "911",
    resources: [
      {
        name: "988 Suicide & Crisis Lifeline",
        what: "Free, confidential support for anyone in emotional distress, 24/7.",
        contact: "Call or text 988 · chat at 988lifeline.org",
        tel: "988",
        sms: { number: "988" },
        url: "https://988lifeline.org",
        tags: ["crisis"],
      },
      {
        name: "National Domestic Violence Hotline",
        what: "Advocates help with safety planning — no pressure to leave. 24/7.",
        contact: "Call 1-800-799-7233 · text START to 88788",
        tel: "18007997233",
        sms: { number: "88788", body: "START" },
        url: "https://www.thehotline.org",
        tags: ["abuse"],
      },
      {
        name: "love is respect",
        what: "For teens and young adults (13–26) with questions about dating and relationships.",
        contact: "Call 1-866-331-9474 · text LOVEIS to 22522",
        tel: "18663319474",
        sms: { number: "22522", body: "LOVEIS" },
        url: "https://www.loveisrespect.org",
        tags: ["abuse", "youth"],
      },
      {
        name: "RAINN Sexual Assault Hotline",
        what: "Confidential support after sexual assault, 24/7.",
        contact: "Call 800-656-4673 · text HOPE to 64673",
        tel: "8006564673",
        sms: { number: "64673", body: "HOPE" },
        url: "https://rainn.org",
        tags: ["sexual-assault"],
      },
      {
        name: "Crisis Text Line",
        what: "Text with a trained crisis counselor, 24/7.",
        contact: "Text HOME to 741741",
        sms: { number: "741741", body: "HOME" },
        url: "https://www.crisistextline.org",
        tags: ["crisis"],
      },
      {
        name: "The Trevor Project",
        what: "Crisis support for LGBTQ+ young people, 24/7.",
        contact: "Call 1-866-488-7386 · text START to 678678",
        tel: "18664887386",
        sms: { number: "678678", body: "START" },
        url: "https://www.thetrevorproject.org",
        tags: ["crisis", "lgbtq", "youth"],
      },
      {
        name: "Childhelp National Child Abuse Hotline",
        what: "Support if a child is being hurt or is at risk.",
        contact: "Call or text 1-800-422-4453",
        tel: "18004224453",
        url: "https://www.childhelphotline.org",
        tags: ["child"],
      },
    ],
  },
  {
    code: "UK",
    label: "United Kingdom",
    emergency: "999",
    resources: [
      {
        name: "Samaritans",
        what: "Someone to talk to, any time, about anything. Free, 24/7.",
        contact: "Call 116 123",
        tel: "116123",
        url: "https://www.samaritans.org",
        tags: ["crisis"],
      },
      {
        name: "Shout",
        what: "Free, confidential text support, 24/7.",
        contact: "Text SHOUT to 85258",
        sms: { number: "85258", body: "SHOUT" },
        url: "https://giveusashout.org",
        tags: ["crisis"],
      },
      {
        name: "National Domestic Abuse Helpline (Refuge)",
        what: "Free, confidential support for anyone experiencing domestic abuse, 24/7.",
        contact: "Call 0808 2000 247",
        tel: "08082000247",
        url: "https://www.nationaldahelpline.org.uk",
        tags: ["abuse"],
      },
      {
        name: "Men's Advice Line",
        what: "Support for men experiencing domestic abuse.",
        contact: "Call 0808 801 0327",
        tel: "08088010327",
        url: "https://mensadviceline.org.uk",
        tags: ["abuse", "men"],
      },
      {
        name: "Galop",
        what: "Support for LGBT+ people experiencing abuse.",
        contact: "Call 0800 999 5428",
        tel: "08009995428",
        url: "https://galop.org.uk",
        tags: ["abuse", "lgbtq"],
      },
      {
        name: "Rape Crisis (England & Wales)",
        what: "Support after rape, sexual assault or abuse, 24/7.",
        contact: "Call 0808 500 2222",
        tel: "08085002222",
        url: "https://rapecrisis.org.uk",
        tags: ["sexual-assault"],
      },
      {
        name: "Childline",
        what: "For anyone under 19 — free and confidential.",
        contact: "Call 0800 1111",
        tel: "08001111",
        url: "https://www.childline.org.uk",
        tags: ["youth", "child"],
      },
    ],
  },
  {
    code: "IE",
    label: "Ireland",
    emergency: "112 or 999",
    resources: [
      {
        name: "Samaritans",
        what: "Someone to talk to, any time. Free, 24/7.",
        contact: "Call 116 123",
        tel: "116123",
        url: "https://www.samaritans.org/ireland",
        tags: ["crisis"],
      },
      {
        name: "Text 50808",
        what: "Free, confidential text support, 24/7.",
        contact: "Text HOME to 50808",
        sms: { number: "50808", body: "HOME" },
        url: "https://text50808.ie",
        tags: ["crisis"],
      },
      {
        name: "Women's Aid National Freephone Helpline",
        what: "Support for anyone affected by domestic abuse, 24/7.",
        contact: "Call 1800 341 900",
        tel: "1800341900",
        url: "https://www.womensaid.ie",
        tags: ["abuse"],
      },
      {
        name: "Rape Crisis Help",
        what: "National 24-hour helpline for anyone affected by sexual violence.",
        contact: "Call 1800 77 8888",
        tel: "1800778888",
        url: "https://www.rapecrisishelp.ie",
        tags: ["sexual-assault"],
      },
      {
        name: "Childline (ISPCC)",
        what: "For children and young people, 24/7.",
        contact: "Call 1800 66 66 66",
        tel: "1800666666",
        url: "https://www.childline.ie",
        tags: ["youth", "child"],
      },
    ],
  },
  {
    code: "CA",
    label: "Canada",
    emergency: "911",
    resources: [
      {
        name: "9-8-8 Suicide Crisis Helpline",
        what: "Support for anyone thinking about suicide, 24/7.",
        contact: "Call or text 988",
        tel: "988",
        sms: { number: "988" },
        url: "https://988.ca",
        tags: ["crisis"],
      },
      {
        name: "ShelterSafe",
        what: "Find a shelter or domestic-violence service near you, by map.",
        contact: "sheltersafe.ca",
        url: "https://sheltersafe.ca",
        tags: ["abuse"],
      },
      {
        name: "Assaulted Women's Helpline (Ontario)",
        what: "24/7 support for women experiencing abuse.",
        contact: "Call 1-866-863-0511",
        tel: "18668630511",
        url: "https://www.awhl.org",
        tags: ["abuse"],
      },
      {
        name: "Kids Help Phone",
        what: "For young people, 24/7.",
        contact: "Call 1-800-668-6868 · text CONNECT to 686868",
        tel: "18006686868",
        sms: { number: "686868", body: "CONNECT" },
        url: "https://kidshelpphone.ca",
        tags: ["youth", "crisis"],
      },
    ],
  },
  {
    code: "AU",
    label: "Australia",
    emergency: "000",
    resources: [
      {
        name: "Lifeline",
        what: "Crisis support and suicide prevention, 24/7.",
        contact: "Call 13 11 14 · text 0477 13 11 14",
        tel: "131114",
        sms: { number: "0477131114" },
        url: "https://www.lifeline.org.au",
        tags: ["crisis"],
      },
      {
        name: "1800RESPECT",
        what: "National domestic, family and sexual violence counselling, 24/7.",
        contact: "Call 1800 737 732 · text 0458 737 732",
        tel: "1800737732",
        sms: { number: "0458737732" },
        url: "https://www.1800respect.org.au",
        tags: ["abuse", "sexual-assault"],
      },
      {
        name: "Kids Helpline",
        what: "For young people aged 5–25, 24/7.",
        contact: "Call 1800 55 1800",
        tel: "1800551800",
        url: "https://kidshelpline.com.au",
        tags: ["youth", "child"],
      },
    ],
  },
  {
    code: "OTHER",
    label: "Somewhere else",
    emergency: "your local emergency number",
    resources: [
      {
        name: "Find A Helpline",
        what: "Verified, free helplines in 130+ countries — search by country and topic.",
        contact: "findahelpline.com",
        url: "https://findahelpline.com",
        tags: ["crisis", "abuse", "sexual-assault", "youth"],
      },
    ],
  },
];

export function getRegion(code: RegionCode | undefined | null): Region {
  return REGIONS.find((r) => r.code === code) ?? REGIONS[0];
}

/** Compact text version for the system prompt (kept byte-stable for caching). */
export function resourcesForPrompt(): string {
  return REGIONS.map((r) => {
    const lines = r.resources.map((res) => `  - ${res.name}: ${res.contact}${res.url && !res.contact.includes(".") ? ` (${res.url.replace(/^https:\/\//, "")})` : ""}`);
    return `${r.label} — emergency: ${r.emergency}\n${lines.join("\n")}`;
  }).join("\n");
}
