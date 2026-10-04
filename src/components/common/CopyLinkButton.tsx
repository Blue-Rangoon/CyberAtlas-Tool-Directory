"use client";

import { Link2 } from "lucide-react";
import { useCopy } from "@/hooks/useCopy";
import { Button } from "@/components/ui/Button";
import { CircleCheck } from "lucide-react";

/** Copies the current page URL — real behaviour, no placeholder button. */
export function CopyLinkButton({ label = "Copy link" }: { label?: string }) {
  const { copy, copiedKey, failed } = useCopy();
  const copied = copiedKey === "link";

  return (
    <Button
      variant="secondary"
      onClick={() => {
        const url = typeof window !== "undefined" ? window.location.href : "";
        void copy(url, "link");
      }}
      leadingIcon={
        copied ? (
          <CircleCheck className="size-3.5 text-success" aria-hidden />
        ) : (
          <Link2 className="size-3.5" aria-hidden />
        )
      }
      aria-live="polite"
    >
      {failed ? "Copy blocked" : copied ? "Link copied" : label}
    </Button>
  );
}
