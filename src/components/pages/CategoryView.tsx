import Link from "next/link";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeader } from "@/components/common/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { ToolGrid } from "@/components/tools/ToolCard";
import { CATEGORIES, CATEGORY_ACCENT } from "@/data/categories";
import { toolsByCategory, toolsBySubcategory } from "@/data/tools";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Category, Subcategory } from "@/types";

/**
 * Category and subcategory pages share one template: context first, then the
 * branches, then the tools. A reader always knows where they are.
 */
export function CategoryView({
  category,
  subcategory,
}: {
  category: Category;
  subcategory?: Subcategory;
}) {
  const Icon = getIcon(category.icon);
  const accent = CATEGORY_ACCENT[category.accent];
  const all = toolsByCategory(category.slug);
  const tools = subcategory ? toolsBySubcategory(category.slug, subcategory.slug) : all;

  return (
    <PageContainer width="wide" className="py-7 sm:py-9">
      <Breadcrumbs
        items={[
          { label: "Tools", href: "/tools" },
          { label: category.name, href: subcategory ? `/tools/${category.slug}` : undefined },
          ...(subcategory ? [{ label: subcategory.name }] : []),
        ]}
        className="mb-5"
      />

      <header className="border-b border-line pb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 max-w-3xl">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "grid size-10 place-items-center rounded-md border border-line",
                  accent.bg,
                  accent.text,
                )}
                aria-hidden
              >
                <Icon className="size-5" />
              </span>
              <div>
                <p className="font-mono text-[11px] tracking-[0.14em] text-ink-mute uppercase">
                  {subcategory ? "Subtopic" : "Category"}
                </p>
                <h1 className="text-[26px] leading-tight font-semibold tracking-[-0.02em] text-ink sm:text-[32px]">
                  {subcategory ? subcategory.name : category.name}
                </h1>
              </div>
            </div>
            <p className="mt-3.5 text-[14.5px] leading-7 text-ink-soft">
              {subcategory ? subcategory.description : category.description}
            </p>
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <Badge tone="outline" mono>
                {tools.length} of {all.length} tools
              </Badge>
              <Badge tone="neutral">{category.subcategories.length} subtopics</Badge>
              {subcategory ? (
                <Link
                  href={`/tools/${category.slug}`}
                  className="text-[12.5px] text-accent-blue transition-colors hover:underline"
                >
                  Back to {category.name}
                </Link>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <LinkButton
              href={`/tools?category=${category.slug}${subcategory ? `&subcategory=${subcategory.slug}` : ""}`}
              variant="secondary"
              size="sm"
              leadingIcon={<SlidersHorizontal className="size-3.5" />}
            >
              Refine with filters
            </LinkButton>
            <LinkButton href="/community/request-tool" variant="ghost" size="sm">
              Request a tool
            </LinkButton>
          </div>
        </div>
      </header>

      {/* Secondary navigation for the category's branches. */}
      <nav
        aria-label={`${category.name} subtopics`}
        className="scroll-rail mt-5 flex gap-1.5 border-b border-line pb-3"
      >
        <CategoryChip
          label="Overview"
          href={`/tools/${category.slug}`}
          active={!subcategory}
          count={all.length}
        />
        {category.subcategories.map((sub) => {
          const count = toolsBySubcategory(category.slug, sub.slug).length;
          return (
            <CategoryChip
              key={sub.slug}
              label={sub.name}
              href={`/tools/${category.slug}/${sub.slug}`}
              active={subcategory?.slug === sub.slug}
              count={count}
            />
          );
        })}
      </nav>

      {subcategory ? (
        <section className="mt-7" aria-label="Tools in this subtopic">
          {tools.length ? (
            <ToolGrid tools={tools} />
          ) : (
            <EmptyState
              title="Nothing documented here yet"
              description={
                <>
                  <strong className="text-ink">{subcategory.name}</strong> is a defined subtopic of{" "}
                  {category.name}, but this dataset has no entry for it yet. That gap is intentional —
                  the alternative is listing tools nobody has verified.
                </>
              }
              actions={
                <>
                  <LinkButton
                    href={`/community/request-tool?category=${category.slug}&tool=${subcategory.slug}`}
                    variant="primary"
                    size="sm"
                  >
                    Request a tool for this subtopic
                  </LinkButton>
                  <LinkButton href={`/tools/${category.slug}`} variant="secondary" size="sm">
                    See all {category.name} tools
                  </LinkButton>
                </>
              }
            />
          )}
        </section>
      ) : (
        <>
          <section className="mt-7" aria-label="Subtopics">
            <SectionHeader
              title="Subtopics"
              description="The branches this category is organised into. Counts reflect documented entries, not the number of tools that exist."
            />
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {category.subcategories.map((sub) => {
                const count = toolsBySubcategory(category.slug, sub.slug).length;
                return (
                  <li key={sub.slug}>
                    <Link
                      href={`/tools/${category.slug}/${sub.slug}`}
                      className="group flex h-full flex-col rounded-md border border-line bg-card p-3.5 transition-[border-color,transform,background-color] duration-150 hover:-translate-y-px hover:border-line-strong hover:bg-card-hover motion-reduce:transform-none"
                    >
                      <span className="flex items-center gap-2">
                        <span className={cn("size-1.5 rounded-full", accent.dot)} aria-hidden />
                        <h3 className="text-[14.5px] font-semibold text-ink">{sub.name}</h3>
                        <span className="ml-auto font-mono text-[11.5px] text-ink-mute">{count}</span>
                      </span>
                      <p className="mt-1.5 flex-1 text-[13px] leading-6 text-ink-soft">
                        {sub.description}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] text-accent">
                        {count ? "Open subtopic" : "Unfilled — contribute"}
                        <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="mt-9" aria-label="All tools in category">
            <SectionHeader
              title={`${category.name} tools`}
              description="Sorted alphabetically; use the directory filters for platform or difficulty narrowing."
              action={
                <LinkButton href={`/tools?category=${category.slug}`} variant="ghost" size="sm">
                  Filter within {category.name}
                </LinkButton>
              }
            />
            {tools.length ? (
              <ToolGrid tools={tools} />
            ) : (
              <EmptyState
                title={`No ${category.name} tools documented yet`}
                description="This category is defined in the structure, and its subtopics are listed above, but the dataset has no verified entry here yet."
                actions={
                  <LinkButton href="/community/request-tool" size="sm" variant="primary">
                    Request a tool
                  </LinkButton>
                }
              />
            )}
          </section>
        </>
      )}

      <nav aria-label="Other categories" className="mt-12 border-t border-line pt-6">
        <h2 className="mb-3 font-mono text-[10.5px] tracking-[0.16em] text-ink-mute uppercase">
          Adjacent categories
        </h2>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.filter((c) => c.slug !== category.slug).map((other) => {
            const OtherIcon = getIcon(other.icon);
            const otherAccent = CATEGORY_ACCENT[other.accent];
            return (
              <li key={other.slug}>
                <Link
                  href={`/tools/${other.slug}`}
                  className="group flex items-center gap-2 rounded-md border border-line bg-card px-3 py-2 transition-colors hover:border-line-strong hover:bg-elevated"
                >
                  <OtherIcon className={cn("size-3.5 shrink-0", otherAccent.text)} aria-hidden />
                  <span className="min-w-0 flex-1 truncate text-[13px] text-ink-soft group-hover:text-ink">
                    {other.name}
                  </span>
                  <span className="font-mono text-[11px] text-ink-mute">
                    {toolsByCategory(other.slug).length}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </PageContainer>
  );
}

function CategoryChip({
  label,
  href,
  active,
  count,
}: {
  label: string;
  href: string;
  active: boolean;
  count: number;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-[5px] border px-2.5 py-1.5 text-[12.5px] transition-colors duration-150",
        active
          ? "border-accent/40 bg-accent/10 text-ink"
          : "border-line bg-card text-ink-soft hover:border-line-strong hover:text-ink",
      )}
    >
      {label}
      <span className="font-mono text-[11px] text-ink-mute">{count}</span>
    </Link>
  );
}


