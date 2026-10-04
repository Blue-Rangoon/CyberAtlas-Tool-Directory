"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import { EmptyState } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import { FAQS, FAQ_CATEGORIES, FAQ_CATEGORY_LABEL, type FaqCategory } from "@/data/faqs";
import { includes } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * FAQ explorer: category chips, text filter, and independent accordion items
 * with expand-all / collapse-all. Filtering never unmounts the list structure,
 * so screen-reader context stays stable while typing.
 */
export function FaqExplorer() {
  const [category, setCategory] = useState<FaqCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Set<number>>(new Set([0]));

  const filtered = useMemo(() => {
    return FAQS.map((faq, index) => ({ faq, index })).filter(({ faq }) => {
      if (category !== "all" && faq.category !== category) return false;
      if (!query.trim()) return true;
      const hay = [faq.q, ...faq.a, ...(faq.bullets ?? [])].join(" ");
      return query
        .trim()
        .split(/\s+/)
        .every((token) => includes(hay, token));
    });
  }, [category, query]);

  const toggle = (index: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Filter questions</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-ink-mute"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter questions…"
            className="h-9.5 w-full rounded-[5px] border border-line bg-elevated pr-3 pl-8 text-[13.5px] text-ink outline-none transition-colors placeholder:text-ink-mute hover:border-line-strong focus:border-accent/60 [&::-webkit-search-cancel-button]:hidden"
          />
        </label>
        <div className="flex shrink-0 items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setOpen(new Set(filtered.map((f) => f.index)))}>
            Expand all
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setOpen(new Set())}>
            Collapse
          </Button>
        </div>
      </div>

      <div className="scroll-rail mt-3.5 flex gap-1.5 pb-1" role="group" aria-label="Filter by topic">
        {FAQ_CATEGORIES.map((item) => {
          const active = category === item.key;
          const count =
            item.key === "all" ? FAQS.length : FAQS.filter((f) => f.category === item.key).length;
          return (
            <button
              key={item.key}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(item.key)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-[5px] border px-2.5 py-1.5 text-[12.5px] transition-colors duration-150",
                active
                  ? "border-accent/45 bg-accent/12 text-ink"
                  : "border-line bg-card text-ink-soft hover:border-line-strong hover:text-ink",
              )}
            >
              {item.label}
              <span className="font-mono text-[11px] text-ink-mute">{count}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 font-mono text-[11.5px] text-ink-mute" role="status" aria-live="polite">
        Showing {filtered.length} of {FAQS.length} questions
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          className="mt-4"
          title="No questions match"
          description="Try fewer words, or browse a different topic. If the site genuinely doesn't answer your question, that gap is worth reporting."
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                }}
              >
                Clear filters
              </Button>
              <Link
                href="/community/suggest-edit"
                className="inline-flex items-center rounded-[5px] px-2.5 py-1.5 text-[13px] text-accent-blue hover:underline"
              >
                Suggest a question
              </Link>
            </>
          }
        />
      ) : (
        <ul className="mt-4 space-y-2">
          {filtered.map(({ faq, index }) => {
            const isOpen = open.has(index);
            return (
              <li
                key={`${faq.category}-${index}`}
                className={cn(
                  "overflow-hidden rounded-md border bg-card transition-colors duration-150",
                  isOpen ? "border-line-strong" : "border-line",
                )}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                  id={`faq-button-${index}`}
                  onClick={() => toggle(index)}
                  className="flex w-full items-center gap-3 px-3.5 py-3 text-left"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] leading-6 font-medium text-ink">{faq.q}</span>
                    <span className="mt-0.5 block font-mono text-[10.5px] tracking-[0.12em] text-ink-mute uppercase">
                      {FAQ_CATEGORY_LABEL[faq.category]}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-ink-mute transition-transform duration-200",
                      isOpen && "rotate-180 text-accent",
                    )}
                    aria-hidden
                  />
                </button>
                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-button-${index}`}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-200 ease-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-line/70 px-3.5 py-3.5">
                      {faq.a.map((paragraph, i) => (
                        <p key={i} className="mt-2.5 text-[13.5px] leading-6.5 text-ink-soft first:mt-0">
                          {paragraph}
                        </p>
                      ))}
                      {faq.bullets?.length ? (
                        <ul className="mt-2.5 space-y-1.5">
                          {faq.bullets.map((bullet) => (
                            <li key={bullet} className="flex gap-2 text-[13.5px] leading-6 text-ink-soft">
                              <span className="mt-2.5 size-1 shrink-0 rounded-full bg-accent/70" aria-hidden />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {faq.links?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2 border-t border-line/70 pt-3">
                          {faq.links.map((link) => (
                            <Link
                              key={link.href + link.label}
                              href={link.href}
                              className="inline-flex items-center rounded-[4px] border border-line bg-elevated px-2 py-1 text-[12.5px] text-accent-blue transition-colors hover:border-line-strong"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
