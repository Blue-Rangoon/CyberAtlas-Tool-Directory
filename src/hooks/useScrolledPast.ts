"use client";

import { useEffect, useState } from "react";

/** True once the page has scrolled further than `px`. Shared by scroll-gated UI. */
export function useScrolledPast(px = 0): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > px);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [px]);

  return past;
}
