"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, List } from "lucide-react";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { cn } from "@/lib/utils";

export interface DocSection {
  id: string;
  label: string;
  /** Optional count shown right-aligned (commands, examples, errors). */
  count?: number;
}

/**
 * Local documentation navigation.
 * lg+: sticky rail. < lg: collapsible "On this page" sheet, so the content keeps
 * the full viewport width on phones.
 */
export function ToolDocNav({ sections }: { sections: DocSection[] }) {
  const ids = sections.map((s) => s.id);
  const active = useScrollSpy(ids);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const list = (
    <ul className="space-y-px">
      {sections.map((section) => {
        const isActive = active === section.id;
        return (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "relative flex items-center gap-2 rounded-[4px] py-1.5 pr-2 pl-3 text-[13px] transition-colors duration-150",
                isActive
                  ? "bg-elevated text-ink"
                  : "text-ink-mute hover:bg-elevated/60 hover:text-ink-soft",
              )}
            >
              <span
                className={cn(
                  "absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full transition-colors duration-200",
                  isActive ? "bg-accent" : "bg-transparent",
                )}
                aria-hidden
              />
              <span className="min-w-0 flex-1 truncate">{section.label}</span>
              {typeof section.count === "number" ? (
                <span className="font-mono text-[11px] text-ink-mute">{section.count}</span>
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <nav
        aria-label="On this page"
        className="hidden lg:sticky lg:top-20 lg:block lg:w-[196px] lg:shrink-0"
      >
        <p className="mb-2 font-mono text-[10.5px] tracking-[0.16em] text-ink-mute uppercase">
          On this page
        </p>
        {list}
      </nav>

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center gap-2 rounded-[5px] border border-line bg-card px-3 py-2 text-left text-[13px] text-ink-soft"
        >
          <List className="size-3.5" aria-hidden />
          <span className="min-w-0 flex-1 truncate">
            On this page
            {active ? <span className="text-ink-mute"> · {labelOf(sections, active)}</span> : null}
          </span>
          <ChevronDown className={cn("size-4 transition-transform duration-200", open && "rotate-180")} aria-hidden />
        </button>
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-200 ease-out",
            open ? "mt-1.5 grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            <div className="rounded-[5px] border border-line bg-card p-1.5">{list}</div>
          </div>
        </div>
      </div>
    </>
  );
}

function labelOf(sections: DocSection[], id: string): string {
  return sections.find((s) => s.id === id)?.label ?? "";
}
