"use client";

import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/Button";

export const OPEN_SEARCH_EVENT = "cyberatlas:open-search";

export function openSearch() {
  window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
}

/**
 * Small bridge so any server-rendered page can focus the global palette without
 * a context provider or a store.
 */
export function OpenSearchButton({
  children = "Open search",
  variant = "secondary",
  size = "md",
  className,
  showShortcut = true,
}: {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  showShortcut?: boolean;
}) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={openSearch}
      trailingIcon={
        showShortcut ? (
          <kbd className="ml-1 hidden rounded border border-line bg-main px-1 py-0.5 font-mono text-[10px] text-ink-mute sm:inline">
            ⌘K
          </kbd>
        ) : null
      }
    >
      {children}
    </Button>
  );
}
