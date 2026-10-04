"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  CONSENT_EVENT,
  CONSENT_KEY,
  readConsent,
  writeConsent,
  type ConsentStatus,
} from "@/lib/consent";

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Live consent status, shared by the banner and the cookie-policy page. */
export function useConsent() {
  const status = useSyncExternalStore<ConsentStatus>(subscribe, readConsent, () => "unset");

  // Another tab accepting should also dismiss the banner here.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === CONSENT_KEY) window.dispatchEvent(new Event(CONSENT_EVENT));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const accept = useCallback(() => writeConsent("accepted"), []);
  const decline = useCallback(() => writeConsent("declined"), []);
  const reset = useCallback(() => writeConsent("unset"), []);

  return { status, accept, decline, reset } as const;
}
