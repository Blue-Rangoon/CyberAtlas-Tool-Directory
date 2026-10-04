import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Clipboard with inline feedback state. One `copiedKey` at a time so a page of
 * copy buttons never shows a dozen simultaneous "Copied" labels.
 */
export function useCopy(resetAfterMs = 1600) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const copy = useCallback(
    async (value: string, key = value) => {
      let ok = false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
          ok = true;
        } else {
          ok = legacyCopy(value);
        }
      } catch {
        ok = legacyCopy(value);
      }

      setFailed(!ok);
      if (ok) {
        setCopiedKey(key);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopiedKey(null), resetAfterMs);
      }
      return ok;
    },
    [resetAfterMs],
  );

  return { copy, copiedKey, failed };
}

/** Fallback for browsers without the async Clipboard API (or non-secure origins). */
function legacyCopy(value: string): boolean {
  if (typeof document === "undefined") return false;
  const area = document.createElement("textarea");
  area.value = value;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.top = "-1000px";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(area);
  return ok;
}
