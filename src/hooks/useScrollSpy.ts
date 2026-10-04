"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which documentation section is in view so the local nav can mark the
 * active section. IntersectionObserver instead of scroll math: no per-frame
 * work, no jank on long pages.
 */
export function useScrollSpy(ids: string[], rootMargin = "0px 0px -72% 0px") {
  const [active, setActive] = useState<string | undefined>(ids[0]);

  useEffect(() => {
    if (!ids.length) return;
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let best: string | undefined;
        let bestRatio = 0;
        for (const id of ids) {
          const ratio = visible.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (best) setActive(best);
      },
      { rootMargin, threshold: [0, 0.15, 0.35, 0.6, 1] },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join("|"), rootMargin]);

  return active;
}
