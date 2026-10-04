"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Github, Layers, Radar, ScanSearch, Search, Terminal } from "lucide-react";
import { useOverlay } from "@/hooks/useOverlay";
import { Portal } from "@/components/ui/Portal";
import { PATH_LABEL, SEARCH_GROUPS_ICONS } from "@/components/search/resultMeta";
import { searchGrouped } from "@/lib/search";
import { SITE } from "@/lib/constants";
import { repositoryHref, repositoryIsExternal } from "@/lib/repo";
import { TOOLS } from "@/data/tools";
import { ROADMAPS } from "@/data/roadmaps";
import { cn } from "@/lib/utils";
import type { SearchEntry } from "@/types";

/**
 * Command-palette search. Same component serves mobile (full-screen sheet) and
 * desktop (centered panel), because the interaction model is identical.
 */
export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const groups = useMemo(() => searchGrouped(deferredQuery, 6), [deferredQuery]);
  const flat = useMemo(() => groups.flatMap((g) => g.hits.map((h) => h.entry)), [groups]);

  const panelRef = useOverlay(open, onClose, { autoFocus: false });

  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
    setQuery("");
    setActiveIndex(0);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [deferredQuery]);

  useEffect(() => {
    if (!listRef.current) return;
    const node = listRef.current.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const go = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router],
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const hit = flat[activeIndex];
      if (hit) go(hit.href);
      else if (query.trim()) go(`/search?q=${encodeURIComponent(query.trim())}`);
    } else if (event.key === "Home") {
      setActiveIndex(0);
    } else if (event.key === "End") {
      setActiveIndex(Math.max(0, flat.length - 1));
    }
  };

  if (!open) return null;

  let counter = -1;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[80] flex items-start justify-center p-0 sm:p-6 sm:pt-[12vh]"
        role="presentation"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
      <div className="absolute inset-0 bg-main/80 animate-fade-in" aria-hidden />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search CyberAtlas"
        className="relative flex h-full max-h-full w-full flex-col overflow-hidden border border-line bg-surface shadow-pop animate-panel-in sm:h-auto sm:max-h-[76vh] sm:max-w-2xl sm:rounded-lg"
      >
        <div className="flex items-center gap-2.5 border-b border-line px-3.5 py-3">
          <Search className="size-4 shrink-0 text-ink-mute" aria-hidden />
          <input
            ref={inputRef}
            data-autofocus
            type="search"
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results"
            aria-autocomplete="list"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search tools, commands, roadmaps, concepts…"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-mute [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-[5px] border border-line px-1.5 py-0.5 font-mono text-[10.5px] text-ink-mute transition-colors hover:border-line-strong hover:text-ink sm:hidden"
          >
            ESC
          </button>
          <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[10.5px] text-ink-mute sm:inline">
            ESC
          </kbd>
        </div>

        <div
          id="search-results"
          ref={listRef}
          role="listbox"
          aria-label="Search results"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2"
        >
          {query.trim() === "" ? (
            <StartState onPick={go} onClose={onClose} />
          ) : flat.length === 0 ? (
            <NoResults query={query} onBrowseAll={() => go("/tools")} />
          ) : (
            <div className="space-y-4">
              {groups.map((group) => {
                const Icon = SEARCH_GROUPS_ICONS[group.type] ?? Radar;
                return (
                  <div key={group.type}>
                    <p className="flex items-center gap-1.5 px-2 pt-1 pb-1.5 font-mono text-[10.5px] tracking-[0.14em] text-ink-mute uppercase">
                      <Icon className="size-3.5" aria-hidden />
                      {group.label}
                    </p>
                    <ul>
                      {group.hits.map((hit) => {
                        counter += 1;
                        const index = counter;
                        return (
                          <li key={hit.entry.id}>
                            <ResultRow
                              entry={hit.entry}
                              active={index === activeIndex}
                              index={index}
                              onHover={() => setActiveIndex(index)}
                              onSelect={() => go(hit.entry.href)}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line px-3.5 py-2 text-[11.5px] text-ink-mute">
          <div className="hidden items-center gap-3 sm:flex">
            <Hint keys="↑↓" label="navigate" />
            <Hint keys="↵" label="open" />
            <Hint keys="esc" label="close" />
          </div>
          <span className="truncate">{SITE.shortName} · index of {query ? flat.length : "curated content"}</span>
        </div>
        </div>
      </div>
    </Portal>
  );
}

function ResultRow({
  entry,
  active,
  index,
  onHover,
  onSelect,
}: {
  entry: SearchEntry;
  active: boolean;
  index: number;
  onHover: () => void;
  onSelect: () => void;
}) {
  return (
    <a
      href={entry.href}
      onClick={(event) => {
        event.preventDefault();
        onSelect();
      }}
      onMouseEnter={onHover}
      role="option"
      aria-selected={active}
      data-index={index}
      className={cn(
        "flex items-center gap-3 rounded-[5px] px-2 py-2 transition-colors duration-100",
        active ? "bg-elevated ring-1 ring-line-strong" : "hover:bg-elevated/70",
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-medium text-ink">
          {entry.parent ? (
            <span className="mr-1.5 text-ink-mute">{entry.parent}</span>
          ) : null}
          {entry.title}
        </span>
        <span
          className={cn(
            "mt-0.5 block truncate text-[12px] text-ink-soft",
            entry.type === "command" && "font-mono text-[11.5px] text-accent",
          )}
        >
          {entry.subtitle}
        </span>
      </span>
      <span className="shrink-0 rounded border border-line bg-card px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-ink-mute uppercase">
        {PATH_LABEL[entry.type]}
      </span>
    </a>
  );
}

function Hint({ keys, label }: { keys: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <kbd className="rounded border border-line bg-card px-1.5 py-0.5 font-mono text-[10px]">
        {keys}
      </kbd>
      {label}
    </span>
  );
}

function StartState({
  onPick,
  onClose,
}: {
  onPick: (href: string) => void;
  onClose: () => void;
}) {
  const jumps = [
    ...TOOLS.filter((t) => t.commonlyUsed)
      .slice(0, 4)
      .map((t) => ({ label: t.name, href: `/tools/${t.slug}`, hint: t.shortDescription, kind: "Tool" })),
    ...ROADMAPS.filter((r) => r.featured)
      .slice(0, 3)
      .map((r) => ({ label: r.title, href: `/roadmaps/${r.slug}`, hint: r.audience, kind: "Roadmap" })),
  ];

  return (
    <div className="space-y-4">
      <div>
        <p className="px-2 pb-1.5 font-mono text-[10.5px] tracking-[0.14em] text-ink-mute uppercase">
          Frequently opened
        </p>
        <ul>
          {jumps.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => {
                  onClose();
                  onPick(item.href);
                }}
                className="flex items-center gap-3 rounded-[5px] px-2 py-2 transition-colors hover:bg-elevated"
              >
                <Layers className="size-3.5 shrink-0 text-ink-mute" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] text-ink">{item.label}</span>
                  <span className="block truncate text-[12px] text-ink-mute">{item.hint}</span>
                </span>
                <span className="font-mono text-[10px] tracking-wide text-ink-mute uppercase">
                  {item.kind}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap gap-1.5 px-2 pb-1">
        <QuickLink href="/tools/osint" icon={ScanSearch} label="OSINT tools" onClick={onPick} onDone={onClose} />
        <QuickLink href="/cheatsheets/nmap" icon={Terminal} label="Nmap cheatsheet" onClick={onPick} onDone={onClose} />
        <QuickLink href="/learning" icon={Radar} label="Learning hub" onClick={onPick} onDone={onClose} />
        <a
          href={repositoryHref()}
          {...(repositoryIsExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-[5px] border border-line bg-card px-2 py-1 text-[12px] text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
        >
          <Github className="size-3.5" aria-hidden />
          Contribute
        </a>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  label,
  icon: Icon,
  onClick,
  onDone,
}: {
  href: string;
  label: string;
  icon: typeof Radar;
  onClick: (href: string) => void;
  onDone: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        onDone();
        onClick(href);
      }}
      className="inline-flex items-center gap-1.5 rounded-[5px] border border-line bg-card px-2 py-1 text-[12px] text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
    >
      <Icon className="size-3.5" aria-hidden />
      {label}
    </button>
  );
}

function NoResults({ query, onBrowseAll }: { query: string; onBrowseAll: () => void }) {
  return (
    <div className="px-2 py-6 text-center">
      <p className="text-[14px] text-ink">
        Nothing matches <span className="font-mono text-accent">“{query}”</span>
      </p>
      <p className="mx-auto mt-1.5 max-w-sm text-[12.5px] leading-5.5 text-ink-soft">
        Search covers tool names, commands, categories, roadmaps, concepts, cheatsheets and
        comparisons. Try a tool name, a protocol, or a task such as “dns enumeration”.
      </p>
      <button
        type="button"
        onClick={onBrowseAll}
        className="mt-3.5 inline-flex items-center gap-1.5 rounded-[5px] border border-line bg-elevated px-2.5 py-1.5 text-[12.5px] text-ink transition-colors hover:border-line-strong"
      >
        Browse all tools
        <ArrowRight className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}


