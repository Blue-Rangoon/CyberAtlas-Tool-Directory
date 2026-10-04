"use client";

import { useEffect, useRef } from "react";

/**
 * Shared behaviour for overlays (drawer, modal, command palette):
 * Escape to close, click-outside to close, focus trapped while open, focus
 * restored to the trigger afterwards, body scroll locked.
 */
export function useOverlay(
  open: boolean,
  onClose: () => void,
  options: { autoFocus?: boolean } = {},
) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const { autoFocus = true } = options;

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && (active === first || !panelRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);

    // Autofocus retries across frames: portalled panels mount one tick after
    // the overlay state flips, so a synchronous query would find nothing.
    let attempts = 0;
    let raf = 0;
    const focusFirst = () => {
      const target =
        panelRef.current?.querySelector<HTMLElement>("[data-autofocus]") ??
        panelRef.current?.querySelector<HTMLElement>("input, button, a[href]");
      if (target) {
        target.focus();
        return;
      }
      attempts += 1;
      if (autoFocus && attempts < 6) raf = requestAnimationFrame(focusFirst);
    };
    if (autoFocus) raf = requestAnimationFrame(focusFirst);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = overflow;
      restoreRef.current?.focus?.();
    };
  }, [open, onClose, autoFocus]);

  return panelRef;
}
