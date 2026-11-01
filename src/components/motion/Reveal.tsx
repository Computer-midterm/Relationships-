"use client";

import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { dur, ease } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li" | "article" | "header";
  amount?: number;
};

/** Fades + lifts content in once it scrolls into view. Below-the-fold only. */
export function Reveal({ children, className, delay = 0, y = 18, as = "div", amount = 0.25 }: Props) {
  const Comp = m[as];
  return (
    <Comp
      className={className}
      data-reveal=""
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: dur.reveal, ease: ease.calm, delay }}
    >
      {children}
    </Comp>
  );
}

/** Container that staggers its <StaggerItem> children into view. */
export function Stagger({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  as = "div",
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "ol" | "dl";
  amount?: number;
}) {
  const Comp = m[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, className, as = "div", y = 16 }: { children: ReactNode; className?: string; as?: "div" | "li" | "article"; y?: number }) {
  const Comp = m[as];
  return (
    <Comp
      className={className}
      data-reveal=""
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration: dur.reveal, ease: ease.calm } },
      }}
    >
      {children}
    </Comp>
  );
}
