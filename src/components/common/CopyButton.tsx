"use client";

import { CircleCheck, Copy } from "lucide-react";
import { useCopy } from "@/hooks/useCopy";
import { cn } from "@/lib/utils";

/**
 * Copy affordance used by every command block, install step and cheatsheet
 * row. Feedback is inline (Copy → Copied) — no toast for a clipboard write.
 */
export function CopyButton({
  value,
  label = "Copy",
  className,
  id,
  variant = "inline",
}: {
  value: string;
  label?: string;
  className?: string;
  id?: string;
  variant?: "inline" | "icon" | "solid";
}) {
  const { copy, copiedKey, failed } = useCopy();
  const copied = copiedKey === (id ?? value);

  const content =
    variant === "icon" ? null : (
      <span className="font-medium">{failed ? "Press Ctrl+C" : copied ? "Copied" : label}</span>
    );

  return (
    <button
      type="button"
      onClick={() => void copy(value, id ?? value)}
      aria-label={variant === "icon" ? `${label} to clipboard` : undefined}
      data-copied={copied || undefined}
      className={cn(
        "print-hide inline-flex shrink-0 items-center gap-1.5 rounded-[4px] border px-2 py-1 text-[12px] transition-colors duration-150",
        variant === "icon" && "size-7 justify-center px-0",
        copied
          ? "border-success/40 bg-success/10 text-success"
          : failed
            ? "border-warning/40 bg-warning/10 text-warning"
            : "border-line bg-elevated text-ink-soft hover:border-line-strong hover:text-ink",
        className,
      )}
    >
      {copied ? <CircleCheck className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      {content}
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
