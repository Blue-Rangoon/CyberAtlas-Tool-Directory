"use client";

import Link from "next/link";
import { Cookie } from "lucide-react";
import { useConsent } from "@/hooks/useConsent";
import { useCookieBannerVisible } from "@/hooks/useCookieBanner";
import { cn } from "@/lib/utils";

/**
 * Cookie & storage notice — fixed bottom-left, never centred, theme-aware
 * because it only uses semantic tokens.
 *
 * Rules:
 *  - Appears after the reader scrolls down, not on arrival.
 *  - Accepted → saved; never shown again.
 *  - Declined → saved, hidden for this page view, shown again on the next
 *    visit (a fresh page load) until Accept is chosen.
 *  - Learn more → /cookies, where the same choice can be made.
 *  - Non-modal: no focus trap, no scroll lock, page stays fully usable.
 */
export function CookieBanner() {
  const { accept, decline } = useConsent();
  // Visibility (scroll threshold, accepted/declined state, policy page) is
  // defined once in useCookieBannerVisible — the assistant launcher consumes
  // the same rule so the two corner controls never fight for the bottom strip.
  const visible = useCookieBannerVisible();

  if (!visible) return null;

  return (
    <aside
      data-cookie-banner
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
      className={cn(
        "print-hide fixed bottom-4 left-4 z-[70] w-[calc(100vw-2rem)] max-w-[380px] animate-slide-up",
        "rounded-lg border border-line bg-surface p-4 text-ink shadow-pop",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-[5px] border border-line bg-elevated text-accent"
          aria-hidden
        >
          <Cookie className="size-4" />
        </span>
        <div className="min-w-0">
          <h2 id="cookie-title" className="text-[14px] leading-5 font-semibold text-ink">
            Cookies &amp; local storage
          </h2>
          <p id="cookie-desc" className="mt-1 text-[12.5px] leading-5.5 text-ink-soft">
            Your theme preference is saved in your browser&apos;s local storage. This site may also
            show ads, and ad partners may use cookies. Accept to allow it, or decline to opt out.
          </p>
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={accept}
          className="inline-flex h-8.5 items-center justify-center rounded-[5px] bg-accent px-3.5 text-[13px] font-semibold text-on-accent transition-colors hover:bg-accent-hover"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={decline}
          className="inline-flex h-8.5 items-center justify-center rounded-[5px] border border-line bg-elevated px-3.5 text-[13px] font-medium text-ink transition-colors hover:border-line-strong hover:bg-elevated-hover"
        >
          Decline
        </button>
        <Link
          href="/cookies"
          className="ml-auto inline-flex h-8.5 items-center rounded-[5px] px-2 text-[13px] text-accent-blue underline-offset-4 transition-colors hover:underline"
        >
          Learn more
        </Link>
      </div>
    </aside>
  );
}
