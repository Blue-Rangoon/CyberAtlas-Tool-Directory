/**
 * Cookie / storage consent contract.
 *
 *   accepted → stored; the banner never appears again on this browser.
 *   declined → stored (so ad code can honour it) but the banner returns on
 *              every new visit until the visitor accepts.
 *   unset    → no choice made yet.
 *
 * The theme preference is functional storage and is saved regardless of this
 * choice. Consent gates advertising and any future non-essential storage.
 */
export type ConsentStatus = "accepted" | "declined" | "unset";

export const CONSENT_KEY = "cyberatlas:cookie-consent";
export const CONSENT_EVENT = "cyberatlas:consent-change";

/**
 * True once the visitor declines during THIS page view. Module state survives
 * client-side navigation but is reset by a full page load, which is exactly the
 * "visit" boundary: declined visitors are asked again on their next visit.
 */
let declinedThisVisit = false;

export function wasDeclinedThisVisit(): boolean {
  return declinedThisVisit;
}

export function readConsent(): ConsentStatus {
  if (typeof window === "undefined") return "unset";
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "accepted" || value === "declined" ? value : "unset";
  } catch {
    return "unset";
  }
}

export function writeConsent(status: ConsentStatus) {
  declinedThisVisit = status === "declined";
  try {
    if (status === "unset") window.localStorage.removeItem(CONSENT_KEY);
    else window.localStorage.setItem(CONSENT_KEY, status);
  } catch {
    /* storage blocked: the choice applies to this page view only */
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/**
 * Gate for any future advertising or non-essential storage. Ad slots must
 * check this before loading a third-party script.
 */
export function hasAdConsent(): boolean {
  return readConsent() === "accepted";
}
