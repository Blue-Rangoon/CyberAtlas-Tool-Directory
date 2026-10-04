"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Route-level error boundary. No raw stack traces reach the reader; the console
 * keeps the detail for whoever is maintaining the site.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[CyberAtlas] route error", error);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-[760px] px-4 py-16 sm:px-6">
      <p className="font-mono text-[11px] tracking-[0.16em] text-ink-mute uppercase">
        Something broke
      </p>
      <h1 className="mt-3 text-[26px] font-semibold tracking-[-0.02em] text-ink">
        This page failed to render
      </h1>
      <p className="mt-3 text-[14.5px] leading-7 text-ink-soft">
        Retrying usually resolves it. If it keeps happening, the digest below is what a maintainer
        needs — content is static data, so a broken page is a code problem, not a content problem.
      </p>
      {error.digest ? (
        <p className="mt-3 inline-block rounded-[5px] border border-line bg-main px-2.5 py-1.5 font-mono text-[12px] text-ink-mute">
          digest: {error.digest}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="primary" onClick={reset}>
          Try again
        </Button>
        <Button variant="secondary" onClick={() => (window.location.href = "/tools")}>
          Go to the tools directory
        </Button>
      </div>
    </div>
  );
}
