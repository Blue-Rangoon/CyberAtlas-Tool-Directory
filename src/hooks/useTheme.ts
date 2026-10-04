"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  DEFAULT_THEME,
  THEME_EVENT,
  THEME_KEY,
  applyTheme,
  readTheme,
  type Theme,
} from "@/lib/theme";

function subscribe(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}

/**
 * Reads the live `data-theme` attribute through useSyncExternalStore, so SSR
 * markup (always the default) hydrates cleanly and then corrects itself.
 */
export function useTheme() {
  const theme = useSyncExternalStore<Theme>(subscribe, readTheme, () => DEFAULT_THEME);

  // Keep multiple tabs in step: another tab changing the preference updates this one.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_KEY) return;
      applyTheme(event.newValue === "light" ? "light" : "dark", false);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setTheme = useCallback((next: Theme) => applyTheme(next), []);
  const toggle = useCallback(() => applyTheme(readTheme() === "light" ? "dark" : "light"), []);

  return { theme, setTheme, toggle } as const;
}
