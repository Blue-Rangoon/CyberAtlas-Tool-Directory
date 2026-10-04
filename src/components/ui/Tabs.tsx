"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  /** Small right-aligned hint, e.g. a command count. */
  hint?: string;
  content: ReactNode;
}

/**
 * Accessible tablist: roving tabindex, arrow/Home/End keys, horizontally
 * scrollable rail on narrow viewports (never wrapped into an unreadable pile).
 */
export function Tabs({
  items,
  initialId,
  className,
  ariaLabel,
  size = "md",
}: {
  items: TabItem[];
  initialId?: string;
  className?: string;
  ariaLabel: string;
  size?: "sm" | "md";
}) {
  const [active, setActive] = useState(initialId ?? items[0]?.id);
  const listRef = useRef<HTMLDivElement>(null);
  const base = useId();

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const index = items.findIndex((i) => i.id === active);
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % items.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    const id = items[next]?.id;
    if (id) {
      setActive(id);
      listRef.current?.querySelector<HTMLButtonElement>(`#${base}-tab-${id}`)?.focus();
    }
  };

  if (!items.length) return null;

  return (
    <div className={cn("min-w-0", className)}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        className="scroll-rail no-scrollbar -mx-0.5 flex gap-1 border-b border-line px-0.5"
      >
        {items.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              id={`${base}-tab-${item.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${base}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.id)}
              className={cn(
                "relative shrink-0 border-b-2 border-transparent font-medium whitespace-nowrap transition-colors duration-150",
                size === "sm" ? "px-2.5 py-1.5 text-[12.5px]" : "px-3 py-2 text-[13.5px]",
                selected
                  ? "border-accent text-ink"
                  : "text-ink-mute hover:text-ink-soft",
              )}
            >
              {item.label}
              {item.hint ? (
                <span className="ml-1.5 font-mono text-[11px] text-ink-mute">{item.hint}</span>
              ) : null}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          id={`${base}-panel-${item.id}`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${item.id}`}
          tabIndex={0}
          hidden={item.id !== active}
          className="pt-4 focus-visible:outline-none"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
