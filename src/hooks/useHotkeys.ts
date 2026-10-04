"use client";

import { useEffect } from "react";

interface Hotkey {
  /** e.g. "mod+k" or "/" — "mod" maps to ⌘ on macOS and Ctrl elsewhere. */
  combo: string;
  handler: (event: KeyboardEvent) => void;
  /** Allow the shortcut while a text field has focus. */
  allowInInput?: boolean;
}

function matches(combo: string, event: KeyboardEvent): boolean {
  const parts = combo.toLowerCase().split("+");
  const key = parts[parts.length - 1];
  const needMod = parts.includes("mod");
  const needShift = parts.includes("shift");
  const hasMod = event.metaKey || event.ctrlKey;
  if (needMod !== hasMod) return false;
  if (needShift !== event.shiftKey) return false;
  return event.key.toLowerCase() === key;
}

/** Global keyboard handling for the search palette and dialogs. */
export function useHotkeys(hotkeys: Hotkey[], active = true) {
  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const inField =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      for (const hk of hotkeys) {
        if (inField && !hk.allowInInput) continue;
        if (matches(hk.combo, event)) {
          event.preventDefault();
          hk.handler(event);
          return;
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hotkeys, active]);
}
