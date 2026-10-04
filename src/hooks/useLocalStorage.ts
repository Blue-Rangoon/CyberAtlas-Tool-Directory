"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * SSR-safe localStorage state. Used for roadmap progress and local contribution
 * drafts — the two places where per-user state is legitimately useful in a
 * frontend-only build. Nothing is sent anywhere.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* corrupt or unavailable storage: keep the initial value */
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or private mode: state stays in memory for this session */
    }
  }, [key, value, hydrated]);

  const reset = useCallback(() => setValue(initial), [initial]);

  return { value, setValue, reset, hydrated } as const;
}
