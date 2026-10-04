import type { InputHTMLAttributes, ReactNode } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const FIELD =
  "w-full rounded-[5px] border border-line bg-elevated px-3 text-[13.5px] text-ink placeholder:text-ink-mute transition-colors duration-150 hover:border-line-strong focus:border-accent/60";

export function Input({
  className,
  leadingIcon,
  trailing,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & {
  leadingIcon?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div className="relative flex min-w-0 items-center">
      {leadingIcon ? (
        <span className="pointer-events-none absolute left-3 text-ink-mute" aria-hidden>
          {leadingIcon}
        </span>
      ) : null}
      <input
        className={cn(
          FIELD,
          "h-9.5",
          leadingIcon ? "pl-9" : undefined,
          trailing ? "pr-16" : undefined,
          className,
        )}
        {...rest}
      />
      {trailing ? <span className="absolute right-2 flex items-center gap-1">{trailing}</span> : null}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search tools, commands, topics...",
  onSubmit,
  className,
  size = "md",
  shortcut,
  id,
  labelledBy,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  /** Keyboard hint shown inside the field; rendered only on wide screens. */
  shortcut?: string;
  id?: string;
  labelledBy?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-mute"
        aria-hidden
      />
      <input
        id={id}
        aria-labelledby={labelledBy}
        type="search"
        role="searchbox"
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") onSubmit?.();
          if (event.key === "Escape" && value) {
            event.stopPropagation();
            onChange("");
          }
        }}
        className={cn(
          FIELD,
          "pl-9",
          size === "lg" && "h-12 text-[15px]",
          size === "md" && "h-10 text-[14px]",
          size === "sm" && "h-9 text-[13px]",
          value ? "pr-9" : shortcut ? "pr-14" : "pr-3",
        )}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-ink-mute transition-colors hover:text-ink"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      ) : shortcut ? (
        <kbd className="absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded border border-line bg-card px-1.5 py-0.5 font-mono text-[10.5px] text-ink-mute md:block">
          {shortcut}
        </kbd>
      ) : null}
    </div>
  );
}

/**
 * NOTE: single-choice controls use AccordionSelect
 * (`@/components/ui/AccordionSelect`) instead of a native `<select>`, so every
 * dropdown on the site behaves as an accordion. There is intentionally no
 * Select export here.
 */
