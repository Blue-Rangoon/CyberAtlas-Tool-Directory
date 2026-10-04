"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { ToolFilters } from "@/components/tools/ToolFilters";
import { ToolGrid } from "@/components/tools/ToolCard";
import { EmptyState, ToolGridSkeleton } from "@/components/ui/States";
import { Button, LinkButton } from "@/components/ui/Button";
import { openSearch } from "@/components/search/OpenSearchButton";
import { TOOLS } from "@/data/tools";
import { EMPTY_FILTERS, filterTools, parseFilters, serializeFilters } from "@/lib/filters";
import type { ToolFilterState } from "@/lib/filters";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

/**
 * Tool browser. All filter state lives in the URL, so any filtered view is
 * shareable, survives refresh and works with back/forward.
 */
export function ToolsBrowser({ basePath }: { basePath?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [visible, setVisible] = useState(PAGE_SIZE);

  const state = useMemo<ToolFilterState>(
    () => parseFilters(new URLSearchParams(params.toString())),
    [params],
  );

  const results = useMemo(() => filterTools(TOOLS, state), [state]);

  const patch = useCallback(
    (partial: Partial<ToolFilterState>) => {
      const next = { ...state, ...partial };
      const search = serializeFilters(next);
      const query = new URLSearchParams(search).toString();
      setVisible(PAGE_SIZE);
      router.replace(query ? `${basePath ?? pathname}?${query}` : (basePath ?? pathname), {
        scroll: false,
      });
    },
    [basePath, pathname, router, state],
  );

  const clear = useCallback(() => {
    setVisible(PAGE_SIZE);
    const search = serializeFilters({ ...EMPTY_FILTERS, q: state.q });
    const query = new URLSearchParams(search).toString();
    router.replace(query ? `${basePath ?? pathname}?${query}` : (basePath ?? pathname), {
      scroll: false,
    });
  }, [basePath, pathname, router, state.q]);

  const shown = results.slice(0, visible);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      <div className="order-2 min-w-0 flex-1 lg:order-1">
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-ink-soft">
            <span className="font-mono text-ink">{results.length}</span>{" "}
            {results.length === 1 ? "tool" : "tools"}
            {state.category || state.subcategory ? " matching these filters" : " in the directory"}
          </p>
          <div className="order-3 w-full sm:order-none sm:w-auto sm:min-w-[260px] lg:w-[300px] lg:min-w-[300px]">
            <label className="relative block">
              <span className="sr-only">Filter the list by name, tag or command</span>
              <Search
                className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-ink-mute"
                aria-hidden
              />
              <input
                type="search"
                value={state.q}
                onChange={(event) => patch({ q: event.target.value })}
                placeholder="Filter these results…"
                className="h-9 w-full rounded-[5px] border border-line bg-elevated pr-3 pl-8 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-mute hover:border-line-strong focus:border-accent/60 [&::-webkit-search-cancel-button]:hidden"
              />
            </label>
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => document.getElementById("filters-anchor")?.scrollIntoView({ block: "start" })}
              leadingIcon={<SlidersHorizontal className="size-3.5" aria-hidden />}
            >
              Adjust
            </Button>
          </div>
        </div>

        {results.length === 0 ? (
          <EmptyState
            icon={<Search className="size-5" aria-hidden />}
            title="No tools match these filters"
            description={
              <>
                The directory currently documents {TOOLS.length} tools. Widen the filters, or clear
                them and search the whole index instead.
              </>
            }
            actions={
              <>
                <Button variant="primary" onClick={clear}>
                  Clear filters
                </Button>
                <Button variant="secondary" onClick={() => openSearch()}>
                  Search everything
                </Button>
                <LinkButton href="/community/request-tool" variant="ghost">
                  Request a tool
                </LinkButton>
              </>
            }
          />
        ) : (
          <>
            <div className={cn(state.q ? "opacity-95" : "opacity-100")}>
              <ToolGrid tools={shown} />
            </div>
            {visible < results.length ? (
              <div className="mt-6 flex flex-col items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  aria-label={`Load ${Math.min(PAGE_SIZE, results.length - visible)} more tools`}
                >
                  Load {Math.min(PAGE_SIZE, results.length - visible)} more
                </Button>
                <p className="font-mono text-[11.5px] text-ink-mute">
                  {shown.length} / {results.length}
                </p>
              </div>
            ) : null}
          </>
        )}
      </div>

      <div id="filters-anchor" className="order-1 lg:order-2">
        <ToolFilters
          state={state}
          onPatch={patch}
          onClear={clear}
          resultCount={results.length}
          total={TOOLS.length}
        />
      </div>

    </div>
  );
}

export function ToolsBrowserFallback() {
  return <ToolGridSkeleton count={6} />;
}
