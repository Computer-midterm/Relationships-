"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { IconX } from "./icons";

/** Accessible modal: centered card on desktop, bottom sheet on mobile. */
export function Sheet({
  open,
  onClose,
  title,
  children,
  wide = false,
  dismissible = true,
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  wide?: boolean;
  dismissible?: boolean;
  labelledBy?: string;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const restore = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restore.current = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => {
      const el = panel.current?.querySelector<HTMLElement>("[data-autofocus], button, a, input, select, textarea");
      el?.focus();
    }, 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissible) onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
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
      restore.current?.focus?.();
    };
  }, [open, dismissible, onClose]);

  if (!open || typeof document === "undefined") return null;
  const titleId = labelledBy ?? "sheet-title";

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="presentation">
      <div className="fade absolute inset-0 bg-black/35 backdrop-blur-[2px]" onClick={dismissible ? onClose : undefined} aria-hidden />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={`rise relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[24px] border border-line bg-bg p-5 pb-safe shadow-lift sm:rounded-[24px] sm:p-7 ${wide ? "sm:max-w-3xl" : "sm:max-w-lg"}`}
      >
        {(title || dismissible) && (
          <div className="mb-4 flex items-start justify-between gap-4">
            {title ? (
              <h2 id={titleId} className="text-2xl font-medium text-ink">
                {title}
              </h2>
            ) : (
              <span />
            )}
            {dismissible && (
              <button type="button" onClick={onClose} className="-m-1 rounded-full p-2 text-muted hover:bg-subtle hover:text-ink" aria-label="Close">
                <IconX />
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
