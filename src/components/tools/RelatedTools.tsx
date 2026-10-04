import Link from "next/link";
import { ArrowRight, Scale } from "lucide-react";
import { ToolRowLink } from "@/components/tools/ToolCard";
import { LinkButton } from "@/components/ui/Button";
import { COMPARISONS } from "@/data/comparisons";
import { getTool, getTools } from "@/data/tools";
import type { ResolvedTool } from "@/types";

/**
 * The hub of the knowledge graph: alternatives, comparisons and related tools
 * are resolved from slugs, so a link only appears when the target exists.
 */
export function RelatedTools({
  tool,
  variant = "alternatives",
}: {
  tool: ResolvedTool;
  variant?: "alternatives" | "related";
}) {
  const slugs = variant === "alternatives" ? (tool.alternatives ?? []) : (tool.relatedTools ?? []);
  const resolved = getTools(slugs).filter((t) => t.slug !== tool.slug);
  const missing = slugs.filter((slug) => !getTool(slug));

  if (!resolved.length && !missing.length) return null;

  return (
    <div className="space-y-4">
      {resolved.length ? (
        <ul className="rounded-md border border-line bg-card p-1.5">
          {resolved.map((related) => (
            <ToolRowLink key={related.slug} tool={related} showStatus />
          ))}
        </ul>
      ) : null}

      {variant === "alternatives" && missing.length ? (
        <p className="rounded-md border border-dashed border-line bg-surface/60 px-3.5 py-2.5 text-[12.5px] leading-5.5 text-ink-mute">
          Not documented yet:{" "}
          <span className="font-mono text-ink-soft">{missing.join(", ")}</span>. Request an entry
          and it will link up automatically.
          <span className="ml-1 inline-flex">
            <Link
              href={`/community/request-tool?tool=${missing[0]}`}
              className="text-accent-blue hover:underline"
            >
              Request a tool
            </Link>
          </span>
        </p>
      ) : null}
    </div>
  );
}

export function ComparisonLinks({ tool }: { tool: ResolvedTool }) {
  const links = COMPARISONS.filter(
    (c) => c.toolA === tool.slug || c.toolB === tool.slug,
  );
  if (!links.length) return null;
  return (
    <ul className="space-y-1.5">
      {links.map((comparison) => (
        <li key={comparison.slug}>
          <Link
            href={`/comparisons/${comparison.slug}`}
            className="group flex items-center gap-2.5 rounded-[5px] border border-line bg-card px-3 py-2 transition-colors hover:border-line-strong hover:bg-card-hover"
          >
            <Scale className="size-3.5 shrink-0 text-ink-mute transition-colors group-hover:text-accent" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium text-ink">
                {comparison.title}
              </span>
              <span className="block truncate text-[12px] text-ink-mute">
                Trade-offs, not a winner
              </span>
            </span>
            <ArrowRight className="size-3.5 shrink-0 text-ink-mute transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function AlternativesBanner({ tool }: { tool: ResolvedTool }) {
  const resolved = getTools(tool.alternatives ?? []).filter((t) => t.slug !== tool.slug);
  if (!resolved.length) return null;
  return (
    <section
      aria-labelledby="alternatives-cta"
      className="rounded-md border border-line bg-surface p-5"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="alternatives-cta" className="text-[16px] font-semibold text-ink">
            Looking for alternatives?
          </h2>
          <p className="mt-1 text-[13px] text-ink-soft">
            {resolved.map((t) => t.name).join(", ")} cover adjacent parts of the same job.
          </p>
        </div>
        <LinkButton href={`/comparisons/${COMPARISONS.find((c) => c.toolA === tool.slug || c.toolB === tool.slug)?.slug ?? ""}`} size="sm" variant="secondary">
          Compare side by side
        </LinkButton>
      </div>
      <ul className="mt-4 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
        {resolved.map((related) => (
          <ToolRowLink key={related.slug} tool={related} />
        ))}
      </ul>
    </section>
  );
}
