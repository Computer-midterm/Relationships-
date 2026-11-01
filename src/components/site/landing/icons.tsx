// Landing-only line icons (same style as src/components/icons.tsx).
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

export const IconTag = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h7.4l9.1 9.1a1.5 1.5 0 0 1 0 2.1l-6.8 6.8a1.5 1.5 0 0 1-2.1 0L3 11.9z" />
    <circle cx="8.5" cy="8.5" r="1.4" />
  </svg>
);
