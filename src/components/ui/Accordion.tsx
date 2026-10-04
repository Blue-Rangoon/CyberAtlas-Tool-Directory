"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Two disclosure primitives:
 *  - `Disclosure` uses native <details> so it works with zero JS.
 *  - `ControlledDisclosure` is for "expand all / collapse all" contexts.
 */
export function Disclosure({
  title,
  children,
  meta,
  defaultOpen = false,
  className,
}: {
  title: ReactNode;
  children: ReactNode;
  meta?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <details
      open={defaultOpen}
      className={cn(
        "group/disclosure rounded-md border border-line bg-card open:bg-card-hover",
        className,
      )}
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 px-3.5 py-2.5 text-left [&::-webkit-details-marker]:hidden">
        <ChevronDown
          className="size-4 shrink-0 text-ink-mute transition-transform duration-200 group-open/disclosure:rotate-180"
          aria-hidden
        />
        <span className="min-w-0 flex-1">{title}</span>
        {meta ? <span className="shrink-0 text-[12px] text-ink-mute">{meta}</span> : null}
      </summary>
      <div className="border-t border-line/70 px-3.5 py-3">{children}</div>
    </details>
  );
}

export function ControlledDisclosure({
  title,
  children,
  open: controlledOpen,
  onToggle,
  className,
}: {
  title: ReactNode;
  children: ReactNode;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  className?: string;
}) {
  const [internal, setInternal] = useState(false);
  const open = controlledOpen ?? internal;
  const toggle = () => {
    const next = !open;
    setInternal(next);
    onToggle?.(next);
  };
  return (
    <div className={cn("rounded-md border border-line bg-card", className)}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left"
      >
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-ink-mute transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
        <span className="min-w-0 flex-1">{title}</span>
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-line/70 px-3.5 py-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
