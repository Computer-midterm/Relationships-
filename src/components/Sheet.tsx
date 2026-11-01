"use client";

import { AnimatePresence, useDragControls, useIsPresent, useReducedMotion, type PanInfo } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useId, useRef, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { dur, ease, exitFade, spring } from "@/lib/motion";
import { IconX } from "./icons";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  wide?: boolean;
  dismissible?: boolean;
  labelledBy?: string;
};

const DESKTOP_Q = "(min-width: 640px)";
const subscribeDesktop = (cb: () => void) => {
  const mq = window.matchMedia(DESKTOP_Q);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
/** true on tablet/desktop, where the sheet is a centred card. */
export function useIsDesktop() {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_Q).matches,
    () => true,
  );
}

/**
 * Accessible modal: a centred card on desktop, a bottom sheet on mobile.
 * Always rendered inside AnimatePresence so it can animate out; focus returns
 * to whatever opened it once the exit has finished.
 */
export function Sheet(props: SheetProps) {
  const restore = useRef<HTMLElement | null>(null);
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence
      onExitComplete={() => {
        const a = document.activeElement;
        // Don't steal focus from something the app focused on purpose (e.g. the composer).
        if ((!a || a === document.body) && restore.current?.isConnected) restore.current.focus();
        restore.current = null;
      }}
    >
      {props.open && <SheetPanel key="sheet" {...props} restoreRef={restore} />}
    </AnimatePresence>,
    document.body,
  );
}

function SheetPanel({
  onClose,
  title,
  children,
  wide = false,
  dismissible = true,
  labelledBy,
  restoreRef,
}: SheetProps & { restoreRef: RefObject<HTMLElement | null> }) {
  const panel = useRef<HTMLDivElement>(null);
  const isPresent = useIsPresent();
  const reduce = useReducedMotion();
  const desktop = useIsDesktop();
  const drag = useDragControls();
  const autoId = useId();
  const titleId = labelledBy ?? `sheet-title-${autoId}`;

  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!restoreRef.current) restoreRef.current = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => {
      const p = panel.current;
      const el = p?.querySelector<HTMLElement>("[data-autofocus]") ?? p?.querySelector<HTMLElement>("button, a, input, select, textarea");
      el?.focus({ preventScroll: true });
    }, 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissible) closeRef.current();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [dismissible, restoreRef]);

  // Stop listening for keys as soon as the exit starts.
  useEffect(() => {
    if (!isPresent && panel.current?.contains(document.activeElement)) (document.activeElement as HTMLElement).blur();
  }, [isPresent]);

  const motionProps = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: dur.base, ease: ease.calm } },
        exit: { opacity: 0, transition: exitFade },
      }
    : desktop
      ? {
          initial: { opacity: 0, y: 8, scale: 0.97 },
          animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 260, damping: 30 } },
          exit: { opacity: 0, y: 6, scale: 0.98, transition: exitFade },
        }
      : {
          initial: { y: "100%" },
          animate: { y: 0, transition: spring.sheet },
          exit: { y: "100%", transition: { duration: dur.fast + 0.04, ease: ease.exit } },
        };

  const canDrag = dismissible && !desktop && !reduce;
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 500) closeRef.current();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6 ${isPresent ? "" : "pointer-events-none"}`}
      role="presentation"
      aria-hidden={isPresent ? undefined : true}
      inert={!isPresent}
    >
      <m.div
        className="absolute inset-0 bg-[rgb(20_18_24/0.38)] backdrop-blur-[2px]"
        onClick={dismissible ? () => closeRef.current() : undefined}
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.2, ease: ease.calm } }}
        exit={{ opacity: 0, transition: exitFade }}
      />
      <m.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : labelledBy}
        {...motionProps}
        drag={canDrag ? "y" : false}
        dragControls={drag}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 1 }}
        onDragEnd={canDrag ? onDragEnd : undefined}
        className={`relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[26px] border border-b-0 border-line bg-surface shadow-lift sm:rounded-[24px] sm:border-b ${wide ? "sm:max-w-3xl" : "sm:max-w-lg"}`}
      >
        {canDrag ? (
          <div
            className="flex h-6 shrink-0 cursor-grab touch-none items-start justify-center pt-2.5 active:cursor-grabbing"
            onPointerDown={(e) => drag.start(e)}
            aria-hidden
          >
            <span className="h-1 w-10 rounded-full bg-line" />
          </div>
        ) : (
          <div className="h-2 shrink-0 sm:hidden" aria-hidden />
        )}
        {(title || dismissible) && (
          <div
            className={`flex shrink-0 items-center justify-between gap-4 px-5 pb-1 sm:px-7 sm:pt-5 ${canDrag ? "touch-none" : ""}`}
            onPointerDown={canDrag ? (e) => {
              if (!(e.target as HTMLElement).closest("button")) drag.start(e);
            } : undefined}
          >
            {title ? (
              <h2 id={titleId} className="text-[24px] font-medium leading-tight text-ink">
                {title}
              </h2>
            ) : (
              <span />
            )}
            {dismissible && (
              <button
                type="button"
                onClick={() => closeRef.current()}
                className="-mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-ink"
                aria-label="Close"
              >
                <IconX />
              </button>
            )}
          </div>
        )}
        <div className={`min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-safe sm:px-7 sm:pb-7 ${title || dismissible ? "pt-3" : "pt-3 sm:pt-7"}`}>
          {children}
        </div>
      </m.div>
    </div>
  );
}
