"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, X } from "lucide-react";
import { useCookieBannerVisible } from "@/hooks/useCookieBanner";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

type AssistantWindow = Window & { __CW_ASSISTANT__?: boolean };

// The panel (and its local directory index) is downloaded only on first open.
const AtlasPanel = dynamic(
  () => import("./AtlasPanel").then((module) => module.AtlasPanel),
  { ssr: false },
);

/**
 * Floating, viewport-anchored launcher on every page.
 *
 * Atlas is a real, source-linked local guide while the AI integration is
 * pending. The panel has its own scroll area; the page stays scrollable outside
 * it. No fake model calls, no server command execution and no transcript sent
 * to any service. Chat history lives only in this mounted component's memory.
 *
 * The integration slot in src/app/layout.tsx still supports a future vendor
 * embed. Once window.__CW_ASSISTANT__ is set, this launcher hides so it cannot
 * compete with a vendor-provided one.
 */
export function AssistantButton() {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [integrated, setIntegrated] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const bannerVisible = useCookieBannerVisible();
  const narrow = useMediaQuery("(max-width: 639px)");

  useEffect(() => {
    const check = () => {
      if ((window as AssistantWindow).__CW_ASSISTANT__ === true) {
        delete document.body.dataset.atlasOpen;
        setOpen(false);
        setIntegrated(true);
      }
    };
    check();
    window.addEventListener("cyberatlas:assistant-ready", check);
    return () => window.removeEventListener("cyberatlas:assistant-ready", check);
  }, []);

  // Data attribute controls a CSS-only mobile collision rule in globals.css.
  // CookieBanner remains mounted and resumes as soon as Atlas closes.
  useEffect(() => {
    if (open) document.body.dataset.atlasOpen = "true";
    else delete document.body.dataset.atlasOpen;
    return () => {
      delete document.body.dataset.atlasOpen;
    };
  }, [open]);

  const close = useCallback(() => {
    delete document.body.dataset.atlasOpen;
    setOpen(false);
    requestAnimationFrame(() => {
      if (narrow && bannerVisible) {
        // The launcher steps aside for the consent notice on small screens.
        // Return focus to a visible control instead of an aria-hidden button.
        document.querySelector<HTMLButtonElement>("[data-cookie-banner] button")?.focus({
          preventScroll: true,
        });
      } else {
        launcherRef.current?.focus({ preventScroll: true });
      }
    });
  }, [bannerVisible, narrow]);

  const toggle = () => {
    if (open) {
      close();
      return;
    }
    // Set before React commits, so a just-appearing cookie notice does not
    // briefly overlap the newly opened panel on narrow viewports.
    document.body.dataset.atlasOpen = "true";
    setHasOpened(true);
    setOpen(true);
  };

  if (integrated) return null;

  // When the consent notice owns the bottom strip on a phone, the closed
  // launcher stays mounted (preserving the conversation) but is not tabbable or
  // clickable. If Atlas is already open, the panel stays open while the page
  // scrolls; CSS defers the notice until the panel is closed.
  const giveSpaceToConsent = narrow && bannerVisible && !open;
  const label = open ? "Close Atlas Assistant" : "Open Atlas Assistant";

  return (
    <div
      className="print-hide fixed right-4 z-[70]"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
    >
      {hasOpened ? <AtlasPanel open={open} onClose={close} /> : null}
      <button
        ref={launcherRef}
        type="button"
        onClick={toggle}
        aria-label={label}
        title={label}
        aria-expanded={open}
        aria-controls={hasOpened ? "atlas-assistant-panel" : undefined}
        aria-hidden={giveSpaceToConsent}
        tabIndex={giveSpaceToConsent ? -1 : 0}
        className={cn(
          "grid size-12 place-items-center rounded-full border border-line bg-surface text-ink-soft shadow-pop",
          "transition-[color,border-color,transform] duration-150",
          "hover:-translate-y-0.5 hover:border-accent/45 hover:text-accent motion-reduce:transform-none",
          giveSpaceToConsent && "pointer-events-none invisible",
          open && "border-accent/35 text-accent",
        )}
      >
        {open ? <X className="size-5" aria-hidden /> : <Bot className="size-5" aria-hidden />}
      </button>
    </div>
  );
}
