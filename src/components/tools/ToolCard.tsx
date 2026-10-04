import Link from "next/link";
import { ArrowUpRight, Command } from "lucide-react";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PlatformRow } from "@/components/common/PlatformBadge";
import { ToolGlyph } from "@/components/tools/CommandBlock";
import { CATEGORY_ACCENT } from "@/data/categories";
import { DIFFICULTY_LABEL } from "@/lib/constants";
import { formatISODate, cn } from "@/lib/utils";
import type { ResolvedTool } from "@/types";

/**
 * Directory entry card. Deliberately information-dense: identity, verification,
 * classification, platform coverage and content depth in one glance.
 */
export function ToolCard({
  tool,
  showCategory = true,
  className,
}: {
  tool: ResolvedTool;
  showCategory?: boolean;
  className?: string;
}) {
  const accent = CATEGORY_ACCENT[tool.categoryAccent];

  return (
    <Card
      as="li"
      padded={false}
      className={cn(
        "group relative flex h-full flex-col transition-[border-color,background-color,transform] duration-150 ease-out hover:-translate-y-px hover:border-line-strong hover:bg-card-hover motion-reduce:transform-none",
        className,
      )}
    >
      <Link href={tool.docsPath} className="flex h-full flex-col p-4">
        <div className="flex items-start gap-3">
          <ToolGlyph iconKey={tool.icon} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-[15px] leading-5 font-semibold text-ink">{tool.name}</h3>
              {tool.version ? (
                <span className="shrink-0 font-mono text-[11px] text-ink-mute">v{tool.version}</span>
              ) : null}
            </div>
            <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-ink-soft">
              {tool.shortDescription}
            </p>
          </div>
          {tool.status === "verified" ? (
            <StatusBadge status="verified" showLabel={false} />
          ) : (
            <StatusBadge status={tool.status} showLabel={false} />
          )}
        </div>

        {showCategory ? (
          <p className="mt-3 flex items-center gap-1.5 text-[12px] text-ink-mute">
            <span className={cn("size-1.5 rounded-full", accent.dot)} aria-hidden />
            <span className="truncate">
              {tool.categoryName}
              {tool.subcategoryName ? (
                <>
                  <span className="px-1 text-ink-mute/60">·</span>
                  {tool.subcategoryName}
                </>
              ) : null}
            </span>
          </p>
        ) : null}

        <div className="mt-auto pt-3.5">
          <PlatformRow platforms={tool.platforms} limit={4} />
          <div className="mt-3 flex items-center justify-between border-t border-line/70 pt-2.5 text-[11.5px] text-ink-mute">
            <span className="inline-flex items-center gap-1.5">
              <Command className="size-3" aria-hidden />
              {tool.commandCount} command{tool.commandCount === 1 ? "" : "s"}
              <span className="text-ink-mute/50">·</span>
              {DIFFICULTY_LABEL[tool.difficulty]}
            </span>
            <span className="inline-flex items-center gap-1 transition-colors group-hover:text-ink-soft">
              {formatISODate(tool.lastUpdated)}
              <ArrowUpRight className="size-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100" aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export function ToolGrid({
  tools,
  columns = "auto",
  className,
}: {
  tools: ResolvedTool[];
  /** `auto` = 1 / 2 / 3 / 4 across breakpoints; `feature` = 1 / 2 / 3. */
  columns?: "auto" | "feature" | "compact";
  className?: string;
}) {
  const grid =
    columns === "feature"
      ? "sm:grid-cols-2 xl:grid-cols-3"
      : columns === "compact"
        ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
        : "sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4";

  return (
    <ul className={cn("grid grid-cols-1 gap-3", grid, className)}>
      {tools.map((tool) => (
        <ToolCard key={tool.slug} tool={tool} />
      ))}
    </ul>
  );
}

/** Compact row list, used in sidebars, alternatives and stage cards. */
export function ToolRowLink({
  tool,
  showStatus = false,
}: {
  tool: ResolvedTool;
  showStatus?: boolean;
}) {
  return (
    <li>
      <Link
        href={tool.docsPath}
        className="group flex items-center gap-2.5 rounded-[5px] border border-transparent px-2 py-1.5 transition-colors duration-150 hover:border-line hover:bg-elevated"
      >
        <ToolGlyph iconKey={tool.icon} size="sm" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-ink">{tool.name}</span>
          <span className="block truncate text-[12px] text-ink-mute">{tool.shortDescription}</span>
        </span>
        {showStatus ? <StatusBadge status={tool.status} showLabel={false} /> : null}
        <Badge tone="outline" className="hidden sm:inline-flex">
          {tool.commandCount}
        </Badge>
      </Link>
    </li>
  );
}
