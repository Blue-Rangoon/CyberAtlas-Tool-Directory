"use client";

import { usePathname } from "next/navigation";
import { wasDeclinedThisVisit } from "@/lib/consent";
import { useConsent } from "@/hooks/useConsent";
import { useScrolledPast } from "@/hooks/useScrolledPast";

/** Scroll distance (px) after which the cookie notice appears. Single source. */
export const CONSENT_SCROLL_TRIGGER = 240;

/**
 * Whether the cookie notice is currently on screen.
 *
 * One definition, used by both the banner and the assistant launcher (which
 * steps out of the bottom strip on small screens while the notice is there).
 */
export function useCookieBannerVisible(): boolean {
  const { status } = useConsent();
  const scrolled = useScrolledPast(CONSENT_SCROLL_TRIGGER);
  const pathname = usePathname();

  // "Declined during THIS page view" — the banner is hidden until the next
  // visit (a fresh page load), even though the decline is stored.
  const dismissed = status === "declined" && wasDeclinedThisVisit();
  const onPolicyPage = pathname === "/cookies";

  return scrolled && status !== "accepted" && !dismissed && !onPolicyPage;
}
