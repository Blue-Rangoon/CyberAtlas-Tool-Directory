"use client";

import { useState } from "react";
import { RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { useOverlay } from "@/hooks/useOverlay";
import { Portal } from "@/components/ui/Portal";
import { AccordionSelect } from "@/components/ui/AccordionSelect";
import { CATEGORIES } from "@/data/categories";
import { DIFFICULTY_LABEL, SORT_OPTIONS } from "@/lib/constants";
import { FILTERABLE_PLATFORMS } from "@/lib/platforms";
import { PLATFORMS } from "@/lib/platforms";
import { activeFilterCount, type ToolFilterState } from "@/lib/filters";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Difficulty, PlatformId, VerificationStatus } from "@/types";
import { Button } from "@/components/ui/Button";

const DIFFICULTIES: Difficulty[] = ["beginner", "intermediate", "advanced"];
const STATUSES: [VerificationStatus, string][] = [
  ["verified", "Verified"],
  ["community", "Community submitted"],
  ["needs-review", "Needs review"],
  ["outdated", "Outdated"],
  ["deprecated", "Deprecated"],
];

/**
 * Filter controls are pure state → the URL. The same component renders as a
 * desktop sidebar and as a mobile sheet, so behaviour cannot diverge.
 */
export function ToolFilters({
  state,
  onPatch,
  onClear,
  resultCount,
  total,
}: {
  state: ToolFilterState;
  onPatch: (patch: Partial<ToolFilterState>) => void;
  onClear: () => void;
  resultCount: number;
  total: number;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const activeCount = activeFilterCount(state);
  const category = CATEGORIES.find((c) => c.slug === state.category);

  const controls = (
    <div className="space-y-6">
      <FilterGroup title="Category">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => {
            const Icon = getIcon(c.icon);
            const active = state.category === c.slug;
            return (
              <Chip
                key={c.slug}
                active={active}
                onClick={() =>
                  onPatch({ category: active ? undefined : c.slug, subcategory: undefined })
                }
              >
                <Icon className="size-3.5" aria-hidden />
                {c.name}
              </Chip>
            );
          })}
        </div>
      </FilterGroup>

      {category ? (
        <FilterGroup title="Subcategory" hint={category.name}>
          <div className="flex flex-wrap gap-1.5">
            {category.subcategories.map((sub) => {
              const active = state.subcategory === sub.slug;
              return (
                <Chip
                  key={sub.slug}
                  active={active}
                  onClick={() => onPatch({ subcategory: active ? undefined : sub.slug })}
                >
                  {sub.name}
                </Chip>
              );
            })}
          </div>
        </FilterGroup>
      ) : null}

      <FilterGroup title="Platform" hint="must support all selected">
        <div className="flex flex-wrap gap-1.5">
          {FILTERABLE_PLATFORMS.map((platform: PlatformId) => {
            const active = state.platforms.includes(platform);
            return (
              <Chip
                key={platform}
                active={active}
                onClick={() =>
                  onPatch({
                    platforms: active
                      ? state.platforms.filter((p) => p !== platform)
                      : [...state.platforms, platform],
                  })
                }
              >
                {PLATFORMS[platform].label}
              </Chip>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Difficulty">
        <div className="flex flex-wrap gap-1.5">
          {DIFFICULTIES.map((difficulty) => {
            const active = state.difficulties.includes(difficulty);
            return (
              <Chip
                key={difficulty}
                active={active}
                onClick={() =>
                  onPatch({
                    difficulties: active
                      ? state.difficulties.filter((d) => d !== difficulty)
                      : [...state.difficulties, difficulty],
                  })
                }
              >
                {DIFFICULTY_LABEL[difficulty]}
              </Chip>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Licence model">
        <div className="inline-flex rounded-[5px] border border-line bg-card p-0.5">
          {(["all", "open", "proprietary"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={state.source === value}
              onClick={() => onPatch({ source: value })}
              className={cn(
                "rounded-[4px] px-2.5 py-1 text-[12.5px] transition-colors duration-150",
                state.source === value
                  ? "bg-elevated text-ink shadow-[inset_0_0_0_1px_var(--color-line-strong)]"
                  : "text-ink-mute hover:text-ink-soft",
              )}
            >
              {value === "all" ? "Any" : value === "open" ? "Open source" : "Proprietary"}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Content status">
        <AccordionSelect
          label="Content status"
          value={state.status ?? ""}
          placeholder="Any status"
          onChange={(next) =>
            onPatch({ status: next ? (next as VerificationStatus) : undefined })
          }
          options={[
            { value: "", label: "Any status", hint: "No status filter" },
            ...STATUSES.map(([value, label]) => ({ value, label })),
          ]}
        />
      </FilterGroup>

      <FilterGroup title="Sort">
        <AccordionSelect
          label="Sort tools"
          value={state.sort}
          onChange={(next) => onPatch({ sort: next as ToolFilterState["sort"] })}
          options={SORT_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
        />
      </FilterGroup>
    </div>
  );

  return (
    <>
      {/* Tablet + mobile: a single trigger that shows how many filters are on. */}
      <div className="lg:hidden">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setSheetOpen(true)}
            leadingIcon={<SlidersHorizontal className="size-3.5" aria-hidden />}
            trailingIcon={
              activeCount ? (
                <span className="rounded bg-accent/20 px-1 font-mono text-[11px] text-accent">
                  {activeCount}
                </span>
              ) : null
            }
          >
            Filters
          </Button>
          <p className="text-[12.5px] text-ink-mute">
            {resultCount} of {total} tools
          </p>
        </div>
      </div>

      <aside
        aria-label="Tool filters"
        className="hidden lg:sticky lg:top-20 lg:block lg:w-[248px] lg:shrink-0"
      >
        <div className="flex items-center justify-between border-b border-line pb-2">
          <h2 className="font-mono text-[10.5px] tracking-[0.16em] text-ink-mute uppercase">
            Filters {activeCount ? `(${activeCount})` : ""}
          </h2>
          {activeCount ? (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 rounded px-1 py-0.5 text-[12px] text-ink-mute transition-colors hover:text-accent"
            >
              <RotateCcw className="size-3" aria-hidden />
              Clear
            </button>
          ) : null}
        </div>
        <div className="pt-4">{controls}</div>
        <p className="mt-5 border-t border-line pt-3 text-[12px] leading-5 text-ink-mute">
          Showing <span className="text-ink-soft">{resultCount}</span> of {total} documented tools.
        </p>
      </aside>

      {sheetOpen ? (
        <FilterSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onClear={onClear} activeCount={activeCount}>
          {controls}
        </FilterSheet>
      ) : null}
    </>
  );
}

function FilterSheet({
  open,
  onClose,
  children,
  onClear,
  activeCount,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  onClear: () => void;
  activeCount: number;
}) {
  const ref = useOverlay(open, onClose, { autoFocus: false });
  if (!open) return null;
  return (
    <Portal>
    <div className="fixed inset-0 z-[80] lg:hidden" role="presentation">
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="absolute inset-0 bg-main/75 animate-fade-in"
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Filter tools"
        className="absolute inset-x-0 bottom-0 flex max-h-[86vh] flex-col rounded-t-lg border-t border-line bg-surface animate-panel-in sm:inset-x-auto sm:top-0 sm:right-0 sm:bottom-0 sm:max-h-none sm:w-[400px] sm:rounded-none sm:border-l"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="text-[14px] font-semibold text-ink">
            Filters {activeCount ? <span className="text-accent">({activeCount})</span> : null}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="grid size-9 place-items-center rounded-[5px] border border-line text-ink-soft hover:text-ink"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">{children}</div>
        <div className="flex gap-2 border-t border-line px-4 py-3">
          <Button onClick={onClear} variant="ghost" leadingIcon={<RotateCcw className="size-3.5" />}>
            Clear all
          </Button>
          <Button onClick={onClose} variant="primary" className="ml-auto">
            Show results
          </Button>
        </div>
        </div>
      </div>
    </Portal>
  );
}

function FilterGroup({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-2 flex items-baseline gap-2 font-mono text-[10.5px] tracking-[0.14em] text-ink-mute uppercase">
        {title}
        {hint ? <span className="text-[10px] normal-case opacity-70">· {hint}</span> : null}
      </h3>
      {children}
    </section>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[5px] border px-2 py-1 text-[12.5px] transition-[background-color,border-color,color] duration-150",
        active
          ? "border-accent/45 bg-accent/12 text-ink"
          : "border-line bg-card text-ink-soft hover:border-line-strong hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
