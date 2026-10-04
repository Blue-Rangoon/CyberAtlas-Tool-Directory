"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FooterGroup } from "./Footer";

/**
 * Footer link groups. On phones each group is an accordion (tap the title to
 * expand); on `sm` and up the same content renders as static columns. Only one
 * heading variant is ever in the accessibility tree per breakpoint.
 */
export function FooterGroups({ groups }: { groups: FooterGroup[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const base = useId().replace(/[^a-zA-Z0-9-_]/g, "");

  const toggle = (title: string) =>
    setOpen((prev) => ({ ...prev, [title]: !prev[title] }));

  return (
    <nav
      aria-label="Footer"
      className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8"
    >
      {groups.map((group) => {
        const expanded = open[group.title] === true;
        const panelId = `${base}-${group.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        return (
          <div
            key={group.title}
            className="overflow-hidden rounded-md border border-line/70 bg-card/30 sm:overflow-visible sm:rounded-none sm:border-0 sm:bg-transparent"
          >
            {/* Mobile: accordion trigger. `sm:hidden` removes it from the a11y tree on desktop. */}
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => toggle(group.title)}
              className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left sm:hidden"
            >
              <span className="font-mono text-[11px] tracking-[0.16em] text-ink-soft uppercase">
                {group.title}
              </span>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-ink-mute transition-transform duration-200",
                  expanded && "rotate-180",
                )}
                aria-hidden
              />
            </button>
            {/* Desktop: static heading. Hidden from the a11y tree on mobile. */}
            <h2 className="hidden font-mono text-[10.5px] tracking-[0.16em] text-ink-mute uppercase sm:block">
              {group.title}
            </h2>

            <div
              id={panelId}
              className={cn(
                "grid transition-[grid-template-rows,visibility] duration-200 ease-out sm:grid-rows-[1fr] sm:visible",
                expanded ? "grid-rows-[1fr] visible" : "grid-rows-[0fr] invisible",
              )}
            >
              <div className="overflow-hidden">
                <ul className="space-y-1.5 border-t border-line/70 px-3 pt-2 pb-3 sm:border-0 sm:p-0 sm:pt-2.5">
                  {group.links.map((link) => (
                    <li key={`${group.title}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="block py-1 text-[13.5px] text-ink-soft transition-colors hover:text-accent sm:inline sm:py-0 sm:text-[13px]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
