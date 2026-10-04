"use client";

import { useMemo, useState } from "react";
import { Printer, Search } from "lucide-react";
import { CopyButton } from "@/components/common/CopyButton";
import { Button } from "@/components/ui/Button";
import { includes } from "@/lib/utils";
import type { Cheatsheet } from "@/types";

/**
 * Cheatsheet reader: a local filter, one-line rows, per-line copy and a print
 * action that actually prints. Optimised for retrieval, not for reading prose.
 */
export function CheatsheetView({ cheatsheet }: { cheatsheet: Cheatsheet }) {
  const [query, setQuery] = useState("");

  const sections = useMemo(() => {
    if (!query.trim()) return cheatsheet.sections;
    return cheatsheet.sections
      .map((section) => ({
        ...section,
        entries: section.entries.filter(
          (entry) =>
            includes(entry.label, query) ||
            includes(entry.command, query) ||
            includes(section.title, query),
        ),
      }))
      .filter((section) => section.entries.length > 0);
  }, [cheatsheet, query]);

  const total = cheatsheet.sections.reduce((n, s) => n + s.entries.length, 0);
  const shown = sections.reduce((n, s) => n + s.entries.length, 0);

  return (
    <div>
      <div className="print-hide sticky top-14 z-20 -mx-4 mb-6 border-y border-line bg-surface/95 px-4 py-2.5 backdrop-blur-[6px] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mx-auto flex max-w-[1180px] items-center gap-2.5">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-ink-mute" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search this cheatsheet…"
              aria-label="Search this cheatsheet"
              className="h-9 w-full rounded-[5px] border border-line bg-elevated pr-3 pl-8 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-mute hover:border-line-strong focus:border-accent/60 [&::-webkit-search-cancel-button]:hidden"
            />
          </div>
          <span className="hidden font-mono text-[11.5px] text-ink-mute sm:inline">
            {shown}/{total}
          </span>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => window.print()}
            leadingIcon={<Printer className="size-3.5" aria-hidden />}
          >
            Print
          </Button>
        </div>
      </div>

      {sections.length === 0 ? (
        <p className="rounded-md border border-dashed border-line bg-surface/60 px-4 py-6 text-[13.5px] text-ink-soft">
          No entry matches “{query}”. This sheet holds {total} entries — clear the filter to see
          them all.
        </p>
      ) : (
        <div className="space-y-7">
          {sections.map((section) => (
            <section key={section.title} aria-labelledby={`sheet-${section.title}`}>
              <div className="mb-2 flex flex-wrap items-baseline gap-x-3">
                <h2
                  id={`sheet-${section.title}`}
                  className="font-mono text-[11.5px] tracking-[0.16em] text-accent uppercase"
                >
                  {section.title}
                </h2>
                {section.intro ? (
                  <p className="text-[12.5px] text-ink-mute">{section.intro}</p>
                ) : null}
              </div>
              <ul className="overflow-hidden rounded-md border border-line bg-card">
                {section.entries.map((entry, index) => (
                  <li
                    key={`${section.title}-${entry.command}-${index}`}
                    className="group grid items-center gap-x-3 gap-y-1 border-b border-line/70 px-3 py-2 transition-colors last:border-b-0 hover:bg-elevated/60 md:grid-cols-[minmax(140px,26%)_minmax(0,1fr)_auto]"
                  >
                    <span className="text-[12.5px] leading-5 font-medium text-ink-soft">
                      {entry.label}
                    </span>
                    <code className="scroll-rail block min-w-0 font-mono text-[12.5px] whitespace-pre text-ink">
                      {entry.command}
                    </code>
                    <span className="flex items-center gap-2 justify-self-end">
                      {entry.note ? (
                        <span className="hidden max-w-[240px] truncate text-[11.5px] text-ink-mute lg:block">
                          {entry.note}
                        </span>
                      ) : null}
                      <CopyButton value={entry.command} variant="icon" id={`${section.title}-${index}`} />
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
