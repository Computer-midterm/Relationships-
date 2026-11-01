import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = ({ size = 20, ...p }: P) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
});

export const IconPlus = (p: P) => (<svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>);
export const IconMenu = (p: P) => (<svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h10" /></svg>);
export const IconX = (p: P) => (<svg {...base(p)}><path d="M6 6l12 12M18 6L6 18" /></svg>);
export const IconSend = (p: P) => (<svg {...base(p)}><path d="M12 19V5M6 11l6-6 6 6" /></svg>);
export const IconStop = (p: P) => (<svg {...base(p)}><rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" stroke="none" /></svg>);
export const IconCopy = (p: P) => (<svg {...base(p)}><rect x="9" y="9" width="11" height="11" rx="2.5" /><path d="M5 15V6a2 2 0 0 1 2-2h8" /></svg>);
export const IconCheck = (p: P) => (<svg {...base(p)}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>);
export const IconTrash = (p: P) => (<svg {...base(p)}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" /></svg>);
export const IconDownload = (p: P) => (<svg {...base(p)}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>);
export const IconSettings = (p: P) => (<svg {...base(p)}><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></svg>);
export const IconLifebuoy = (p: P) => (<svg {...base(p)}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.5" /><path d="M5.6 5.6l3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9" /></svg>);
export const IconExit = (p: P) => (<svg {...base(p)}><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 16l-4-4 4-4M6 12h10" /></svg>);
export const IconRefresh = (p: P) => (<svg {...base(p)}><path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4" /></svg>);
export const IconLock = (p: P) => (<svg {...base(p)}><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></svg>);
export const IconDevice = (p: P) => (<svg {...base(p)}><rect x="7" y="3" width="10" height="18" rx="2.5" /><path d="M11 17.5h2" /></svg>);
export const IconUserOff = (p: P) => (<svg {...base(p)}><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 11.5-5.4M3 3l18 18" /></svg>);
export const IconArrowRight = (p: P) => (<svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const IconPencil = (p: P) => (<svg {...base(p)}><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z" /></svg>);
export const IconChevronDown = (p: P) => (<svg {...base(p)}><path d="M6 9l6 6 6-6" /></svg>);
export const IconScale = (p: P) => (<svg {...base(p)}><path d="M12 4v16M8 20h8M5 8h14M5 8l-2.5 6a3 3 0 0 0 5 0L5 8zM19 8l-2.5 6a3 3 0 0 0 5 0L19 8z" /></svg>);
export const IconHeartHand = (p: P) => (<svg {...base(p)}><path d="M3 15h3l4 2h4a1.5 1.5 0 0 0 0-3h-3M6 20l-3-1v-5M14 14l5-2a1.6 1.6 0 0 1 1.5 2.8L14 19H10" /><path d="M15.5 4.5c-1-1-2.6-.9-3.4.3-.8-1.2-2.4-1.3-3.4-.3-1 1.1-.8 2.7.3 3.7l3.1 2.8 3.1-2.8c1.1-1 1.3-2.6.3-3.7z" /></svg>);
export const IconPrinter = (p: P) => (<svg {...base(p)}><path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" /><rect x="7" y="14" width="10" height="7" rx="1" /></svg>);

/* ---------- Mode icons (line style, matches the illustration's 1.75 stroke) ---------- */
export const IconTalk = (p: P) => (<svg {...base(p)}><path d="M20 11.5a7.5 7.5 0 0 1-11 6.6L4 19.5l1.4-4.2A7.5 7.5 0 1 1 20 11.5z" /><path d="M9 11.5h.01M12.5 11.5h.01M16 11.5h.01" strokeWidth={2.4} /></svg>);
export const IconCompass = (p: P) => (<svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" /></svg>);
export const IconConversation = (p: P) => (<svg {...base(p)}><path d="M14 9.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4.5a2 2 0 0 0 2 2h1v3l3-3h3" /><path d="M10 14.5a2 2 0 0 0 2 2h3l3 3v-3h1a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2z" /></svg>);
export const IconEnvelope = (p: P) => (<svg {...base(p)}><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="M3.5 7l8.5 6 8.5-6" /></svg>);
export const IconSprout = (p: P) => (<svg {...base(p)}><path d="M12 21v-9" /><path d="M12 12c0-4-3-6.5-7.5-6.5 0 4.5 3 6.5 7.5 6.5z" /><path d="M12 14c0-3.5 2.5-6 6.5-6 0 4-2.5 6-6.5 6z" /><path d="M8 21h8" /></svg>);
export const IconRaincloud = (p: P) => (<svg {...base(p)}><path d="M7 15.5a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 8a3.75 3.75 0 0 1 .5 7.5H7z" /><path d="M8.5 18.5l-1 2M12.5 18.5l-1 2M16.5 18.5l-1 2" /></svg>);

/* ---------- Extra line icons ---------- */
export const IconShield = (p: P) => (<svg {...base(p)}><path d="M12 3l7.5 3v5.5c0 4.5-3.2 8.2-7.5 9.5-4.3-1.3-7.5-5-7.5-9.5V6L12 3z" /><path d="M9 12l2 2 4-4" /></svg>);
export const IconBook = (p: P) => (<svg {...base(p)}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15z" /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5" /></svg>);
export const IconKeyboard = (p: P) => (<svg {...base(p)}><rect x="2.5" y="6" width="19" height="12" rx="2.5" /><path d="M6.5 10h.01M10 10h.01M13.5 10h.01M17 10h.01M8 14h8" strokeWidth={2} /></svg>);
export const IconMoon = (p: P) => (<svg {...base(p)}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></svg>);
export const IconClipboard = (p: P) => (<svg {...base(p)}><rect x="5" y="4.5" width="14" height="16.5" rx="2.5" /><path d="M9 4.5V3.5h6v1M8.5 10h7M8.5 13.5h7M8.5 17h4" /></svg>);
export const IconEye = (p: P) => (<svg {...base(p)}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></svg>);
export const IconPause = (p: P) => (<svg {...base(p)}><path d="M9 6v12M15 6v12" strokeWidth={2.2} /></svg>);
export const IconPlay = (p: P) => (<svg {...base(p)}><path d="M8 5.5v13l10-6.5-10-6.5z" /></svg>);
export const IconServer = (p: P) => (<svg {...base(p)}><rect x="4" y="4" width="16" height="6.5" rx="2" /><rect x="4" y="13.5" width="16" height="6.5" rx="2" /><path d="M8 7.25h.01M8 16.75h.01" strokeWidth={2.4} /></svg>);
export const IconSparkle = (p: P) => (<svg {...base(p)}><path d="M12 3.5l1.8 5.2 5.2 1.8-5.2 1.8L12 17.5l-1.8-5.2L5 10.5l5.2-1.8L12 3.5z" /><path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z" /></svg>);
export const IconPhone = (p: P) => (<svg {...base(p)}><path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5L16 14l4 1.5V19a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>);
export const IconMessageSquare = (p: P) => (<svg {...base(p)}><path d="M20 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9z" /></svg>);
