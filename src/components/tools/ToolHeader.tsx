import { BookOpen, ExternalLink, Github, PencilLine } from "lucide-react";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { PlatformRow } from "@/components/common/PlatformBadge";
import { CopyLinkButton } from "@/components/common/CopyLinkButton";
import { ToolGlyph } from "@/components/tools/CommandBlock";
import { CATEGORY_ACCENT } from "@/data/categories";
import { DIFFICULTY_LABEL, STATUS_META } from "@/lib/constants";
import { repositoryHref } from "@/lib/repo";
import { formatISODate, cn } from "@/lib/utils";
import type { ResolvedTool } from "@/types";

export function ToolHeader({ tool }: { tool: ResolvedTool }) {
  const accent = CATEGORY_ACCENT[tool.categoryAccent];
  const hasContentGaps = tool.commandCount < 5 || tool.status === "needs-review";

  return (
    <header className="border-b border-line pb-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-start gap-3.5">
            <span
              className={cn(
                "mt-0.5 grid size-11 shrink-0 place-items-center rounded-md border border-line bg-elevated ring-1",
                accent.ring,
                accent.text,
              )}
            >
              <ToolGlyph iconKey={tool.icon} size="lg" bare className="text-current" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink sm:text-[34px]">
                  {tool.name}
                </h1>
                {tool.version ? (
                  <span className="rounded border border-line bg-card px-1.5 py-0.5 font-mono text-[11.5px] text-ink-soft">
                    v{tool.version}
                  </span>
                ) : null}
              </div>
              <p className="mt-1.5 max-w-2xl text-[14.5px] leading-6.5 text-ink-soft">
                {tool.shortDescription}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <StatusBadge status={tool.status} />
            <a
              href={`/tools/${tool.category}`}
              className={cn(
                "inline-flex items-center gap-1.5 rounded border border-line bg-card px-1.5 py-0.5 text-[11.5px] font-medium transition-colors hover:border-line-strong",
                accent.text,
              )}
            >
              <span className={cn("size-1.5 rounded-full", accent.dot)} aria-hidden />
              {tool.categoryName}
              {tool.subcategoryName ? (
                <span className="text-ink-mute">· {tool.subcategoryName}</span>
              ) : null}
            </a>
            <Badge tone="outline">{DIFFICULTY_LABEL[tool.difficulty]}</Badge>
            {tool.license ? (
              <Badge tone="outline" mono>
                {tool.license}
              </Badge>
            ) : null}
            {typeof tool.openSource === "boolean" ? (
              <Badge tone={tool.openSource ? "accent" : "neutral"}>
                {tool.openSource ? "Open source" : "Proprietary"}
              </Badge>
            ) : null}
            <span className="text-[12px] text-ink-mute">
              Entry revised {formatISODate(tool.lastUpdated)}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
            <PlatformRow platforms={tool.platforms} />
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {tool.website ? (
            <LinkButton href={tool.website} external size="sm" trailingIcon={<ExternalLink className="size-3.5" />}>
              Official site
            </LinkButton>
          ) : null}
          {tool.repository ? (
            <LinkButton
              href={tool.repository}
              external
              size="sm"
              leadingIcon={<Github className="size-3.5" />}
            >
              Source
            </LinkButton>
          ) : null}
          {tool.documentation ? (
            <LinkButton
              href={tool.documentation}
              external
              size="sm"
              variant="ghost"
              leadingIcon={<BookOpen className="size-3.5" />}
            >
              Docs
            </LinkButton>
          ) : null}
          <CopyLinkButton />
        </div>
      </div>

      {tool.status !== "verified" ? (
        <p className="mt-5 flex items-start gap-2 rounded-md border border-line bg-surface px-3.5 py-2.5 text-[12.5px] leading-5.5 text-ink-soft">
          <span className={cn("mt-1 size-1.5 shrink-0 rounded-full", accent.dot)} aria-hidden />
          <span>
            <strong className="font-semibold text-ink">{STATUS_META[tool.status].label}.</strong>{" "}
            {STATUS_META[tool.status].description} Cross-check against the upstream
            documentation before relying on a command.
          </span>
        </p>
      ) : null}

      {hasContentGaps ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-md border border-dashed border-line bg-surface/60 px-3.5 py-2.5 text-[12.5px] text-ink-mute">
          <PencilLine className="size-3.5" aria-hidden />
          This entry is thinner than the rest of the directory — missing sections are shown as
          such rather than filled with filler.
          <LinkButton
            href={`/community/suggest-edit?tool=${tool.slug}`}
            size="sm"
            variant="ghost"
            className="ml-auto"
          >
            Improve this page
          </LinkButton>
          <LinkButton href={repositoryHref()} size="sm" variant="ghost" external={repositoryHref().startsWith("http")}>
            Contribute
          </LinkButton>
        </div>
      ) : null}
    </header>
  );
}
