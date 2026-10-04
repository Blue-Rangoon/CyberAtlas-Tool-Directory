"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Renders overlay content into document.body.
 *
 * This is a correctness requirement, not a preference: any ancestor with
 * `backdrop-filter`, `filter` or `transform` (the sticky site header uses
 * backdrop-blur) becomes the containing block for `fixed` descendants, which
 * traps drawers and palettes inside the header box instead of the viewport.
 * Every full-screen overlay must go through this component.
 */
export function Portal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}
