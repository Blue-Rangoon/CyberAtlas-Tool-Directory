"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionOption {
  value: string;
  label: string;
  hint?: string;
}

/**
 * Single-choice control rendered as an accordion instead of a native dropdown.
 *
 * Behaviour: the header button expands/collapses an option list with a height
 * animation; options use radiogroup semantics so the control stays a real
 * single-select for assistive technology. Closes on outside pointer-down,
 * Escape, or selection. Arrow keys move between options.
 */
export function AccordionSelect({
  label,
  required,
  value,
  onChange,
  options,
  placeholder = "Select…",
  help,
  id,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (next: string) => void;
  options: AccordionOption[];
  placeholder?: string;
  help?: string;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const rawId = useId().replace(/[^a-zA-Z0-9-_]/g, "");
  const base = id ?? `acc-select-${rawId}`;
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        rootRef.current?.querySelector<HTMLButtonElement>("[data-trigger]")?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open ]);

  const onGroupKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const buttons = Array.from(
      rootRef.current?.querySelectorAll<HTMLButtonElement>("[data-option]") ?? [],
    );
    if (!buttons.length) return;
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
    let next = 0;
    if (event.key === "ArrowDown") next = current < 0 ? 0 : (current + 1) % buttons.length;
    else if (event.key === "ArrowUp")
      next = current < 0 ? buttons.length - 1 : (current - 1 + buttons.length) % buttons.length;
    else if (event.key === "Home") next = 0;
    else next = buttons.length - 1;
    buttons[next]?.focus();
  };

  return (
    <div ref={rootRef} className="min-w-0">
      <span id={`${base}-label`} className="mb-1.5 block text-[12.5px] font-medium text-ink-soft">
        {label}
        {required ? <span className="ml-1 text-accent">required</span> : null}
      </span>

      <button
        type="button"
        data-trigger
        aria-expanded={open}
        aria-controls={`${base}-panel`}
        aria-labelledby={`${base}-label`}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-9.5 w-full items-center justify-between gap-2 rounded-[5px] border bg-elevated px-2.5 text-left text-[13px] transition-colors duration-150",
          open ? "border-accent/50" : "border-line hover:border-line-strong",
        )}
      >
        <span className={cn("min-w-0 flex-1 truncate", selected ? "text-ink" : "text-ink-mute")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-ink-mute transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
      </button>

      <div
        id={`${base}-panel`}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div
            role="radiogroup"
            aria-labelledby={`${base}-label`}
            onKeyDown={onGroupKeyDown}
            className={cn(
              "mt-1.5 rounded-[5px] border border-line bg-card p-1",
              !open && "invisible",
            )}
          >
            {options.map((option) => {
              const active = option.value === value;
              return (
                <button
                  key={option.value || "__none__"}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  data-option
                  tabIndex={open ? 0 : -1}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-[4px] px-2 py-2 text-left text-[13px] transition-colors duration-100",
                    active ? "bg-accent/12 text-ink" : "text-ink-soft hover:bg-elevated hover:text-ink",
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{option.label}</span>
                    {option.hint ? (
                      <span className="block truncate text-[11.5px] text-ink-mute">{option.hint}</span>
                    ) : null}
                  </span>
                  {active ? <Check className="size-3.5 shrink-0 text-accent" aria-hidden /> : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {help ? <p className="mt-1 text-[12px] text-ink-mute">{help}</p> : null}
    </div>
  );
}
