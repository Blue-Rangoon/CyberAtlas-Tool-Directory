import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Github,
  Radar,
  ScanSearch,
  Terminal,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageContainer, Section } from "@/components/layout/PageContainer";
import { SectionHeader } from "@/components/common/PageHeader";
import { ToolGrid } from "@/components/tools/ToolCard";
import { RoadmapCard } from "@/components/roadmaps/RoadmapCard";
import { OpenSearchButton } from "@/components/search/OpenSearchButton";
import { CATEGORIES, CATEGORY_ACCENT } from "@/data/categories";
import { POPULAR_TOOLS, TOOLS } from "@/data/tools";
import { ROADMAPS } from "@/data/roadmaps";
import { SITE } from "@/lib/constants";
import { getIcon } from "@/lib/icons";
import { repositoryHref, repositoryIsExternal } from "@/lib/repo";
import { getStats } from "@/lib/stats";
import { getRecentUpdates } from "@/lib/updates";
import { formatISODate, cn } from "@/lib/utils";

const ENTRY_POINTS = [
  {
    verb: "Discover",
    text: "Browse tools by category, platform and difficulty.",
    href: "/tools",
    icon: ScanSearch,
  },
  {
    verb: "Learn",
    text: "Concepts, roadmaps and structured paths from zero.",
    href: "/learning",
    icon: BookOpen,
  },
  {
    verb: "Use",
    text: "Commands with an explanation, an example and the caveats.",
    href: "/cheatsheets",
    icon: Terminal,
  },
  {
    verb: "Practice",
    text: "Labs, CTFs and ranges you are allowed to point tools at.",
    href: "/learning#labs",
    icon: Radar,
  },
  {
    verb: "Contribute",
    text: "Add a tool, fix a command, flag something outdated.",
    href: "/community",
    icon: Users,
  },
];

export default function HomePage() {
  const stats = getStats();
  const updates = getRecentUpdates(6);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section aria-labelledby="hero-title" className="relative border-b border-line">
        <div className="tech-grid pointer-events-none absolute inset-0" aria-hidden />
        <PageContainer width="wide" className="relative">
          <div className="grid items-start gap-10 py-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:py-20">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-2 rounded-[5px] border border-line bg-card/70 px-2 py-1 font-mono text-[11px] tracking-[0.1em] text-ink-mute uppercase">
                <span className="size-1.5 rounded-full bg-success" aria-hidden />
                Open dataset · v{SITE.datasetVersion}
              </p>

              <h1
                id="hero-title"
                className="mt-4 text-[34px] leading-[1.06] font-semibold tracking-[-0.03em] text-ink sm:text-[46px] lg:text-[54px]"
              >
                Cybersecurity Tools.
                <br />
                Commands. <span className="text-accent">Knowledge.</span>
              </h1>

              <p className="mt-4 max-w-xl text-[15.5px] leading-7 text-ink-soft">
                A curated directory of security tooling: what a tool actually does, how to install
                it on your platform, the commands that matter and what they mean — plus the learning
                paths that put them in order.
              </p>

              {/* Native GET form: search works before any JS has run. */}
              <form action="/search" method="get" className="mt-7 max-w-xl">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <label className="relative min-w-0 flex-1">
                    <span className="sr-only">Search tools, commands and topics</span>
                    <Terminal
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-mute"
                      aria-hidden
                    />
                    <input
                      type="search"
                      name="q"
                      placeholder="Search tools, commands, topics..."
                      autoComplete="off"
                      className="h-12 w-full rounded-[6px] border border-line bg-elevated pr-3 pl-9 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-mute hover:border-line-strong focus:border-accent/60 [&::-webkit-search-cancel-button]:hidden"
                    />
                  </label>
                  <button
                    type="submit"
                    className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-[6px] bg-accent px-4 text-[14px] font-semibold text-on-accent transition-colors hover:bg-accent-hover"
                  >
                    Search
                    <ArrowRight className="size-4" aria-hidden />
                  </button>
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[12px] text-ink-mute">
                  <span>Or open the command palette</span>
                  <OpenSearchButton size="sm" variant="ghost" className="!h-7 !px-2">
                    Jump to content
                  </OpenSearchButton>
                  <span className="hidden items-center gap-1 sm:inline-flex">
                    <kbd className="rounded border border-line bg-card px-1.5 py-0.5 font-mono text-[10.5px]">⌘K</kbd>
                    or
                    <kbd className="rounded border border-line bg-card px-1.5 py-0.5 font-mono text-[10.5px]">/</kbd>
                  </span>
                </div>
              </form>

              <dl className="mt-9 grid max-w-xl grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6 sm:grid-cols-4">
                <Stat value={stats.tools} label="Tools" href="/tools" />
                <Stat value={stats.commands} label="Commands" href="/tools" />
                <Stat value={stats.categories} label="Categories" href="/tools#categories" />
                <Stat value={stats.subcategories} label="Subtopics" href="/tools#categories" />
              </dl>
            </div>

            {/* Entry points double as the product's five verbs. */}
            <Card padded={false} className="overflow-hidden">
              <p className="border-b border-line px-4 py-2.5 font-mono text-[10.5px] tracking-[0.16em] text-ink-mute uppercase">
                Start here
              </p>
              <ul>
                {ENTRY_POINTS.map((entry) => (
                  <li key={entry.verb} className="border-b border-line/70 last:border-b-0">
                    <Link
                      href={entry.href}
                      className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-elevated/60"
                    >
                      <entry.icon className="size-4 shrink-0 text-ink-mute transition-colors group-hover:text-accent" aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13.5px] font-semibold text-ink">
                          {entry.verb}
                        </span>
                        <span className="block truncate text-[12.5px] text-ink-mute">
                          {entry.text}
                        </span>
                      </span>
                      <ArrowRight className="size-3.5 shrink-0 text-ink-mute opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </PageContainer>
      </section>

      {/* ── Categories ───────────────────────────────────────── */}
      <Section id="categories" ariaLabel="Browse by category">
        <PageContainer width="wide">
          <SectionHeader
            title="Explore by category"
            description="Seven areas of practice. Each category breaks into subtopics, and each tool sits in exactly one of them."
            action={
              <LinkButton href="/tools" variant="ghost" trailingIcon={<ArrowRight className="size-3.5" />}>
                All {stats.tools} tools
              </LinkButton>
            }
          />
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {CATEGORIES.map((category) => {
              const Icon = getIcon(category.icon);
              const accent = CATEGORY_ACCENT[category.accent];
              const count = TOOLS.filter((t) => t.category === category.slug).length;
              return (
                <li key={category.slug}>
                  <Link
                    href={`/tools/${category.slug}`}
                    className="group flex h-full flex-col rounded-md border border-line bg-card p-4 transition-[border-color,background-color,transform] duration-150 hover:-translate-y-px hover:border-line-strong hover:bg-card-hover motion-reduce:transform-none"
                  >
                    <span
                      className={cn(
                        "grid size-8 place-items-center rounded-[5px] border border-line",
                        accent.bg,
                        accent.text,
                      )}
                      aria-hidden
                    >
                      <Icon className="size-4" />
                    </span>
                    <h3 className="mt-3 text-[15px] font-semibold text-ink">{category.name}</h3>
                    <p className="mt-1 flex-1 text-[13px] leading-5.5 text-ink-soft">
                      {category.blurb}
                    </p>
                    <p className="mt-3 flex items-center gap-2 text-[12px] text-ink-mute">
                      <span className={cn("size-1.5 rounded-full", accent.dot)} aria-hidden />
                      {count} documented
                      <span className="text-ink-mute/50">·</span>
                      {category.subcategories.length} subtopics
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </PageContainer>
      </Section>

      {/* ── Popular tools ────────────────────────────────────── */}
      <Section tone="surface" ariaLabel="Popular tools">
        <PageContainer width="wide">
          <SectionHeader
            title="Most referenced entries"
            description="The tools readers open first, and the entries with the deepest documentation in this dataset."
            action={
              <LinkButton href="/tools" variant="ghost" trailingIcon={<ArrowRight className="size-3.5" />}>
                Browse directory
              </LinkButton>
            }
          />
          <ToolGrid tools={POPULAR_TOOLS} columns="feature" />
        </PageContainer>
      </Section>

      {/* ── Learning paths ───────────────────────────────────── */}
      <Section ariaLabel="Learning paths">
        <PageContainer width="wide">
          <SectionHeader
            title="Learning paths"
            description="Ordered stages, each with the concepts, tools and exercises that belong to it. A path structures study; it does not certify competence."
            action={
              <LinkButton href="/roadmaps" variant="ghost" trailingIcon={<ArrowRight className="size-3.5" />}>
                All {ROADMAPS.length} roadmaps
              </LinkButton>
            }
          />
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {ROADMAPS.map((roadmap) => (
              <RoadmapCard key={roadmap.slug} roadmap={roadmap} featured={roadmap.featured} />
            ))}
          </ul>
        </PageContainer>
      </Section>

      {/* ── Recently revised + community ─────────────────────── */}
      <Section tone="surface" ariaLabel="Content revisions and community">
        <PageContainer width="wide">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div>
              <SectionHeader
                title="Recently revised entries"
                description="Dates refer to this dataset's documentation, not to upstream releases."
                action={
                  <LinkButton href="/community#revisions" variant="ghost">
                    Full activity
                  </LinkButton>
                }
              />
              <ul className="overflow-hidden rounded-md border border-line bg-card">
                {updates.map((update) => (
                  <li
                    key={`${update.type}-${update.slug}`}
                    className="border-b border-line/70 last:border-b-0"
                  >
                    <Link
                      href={update.href}
                      className="group flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 transition-colors hover:bg-elevated/60"
                    >
                      <span className="min-w-0 flex-1 text-[13.5px] font-medium text-ink">
                        {update.title}
                      </span>
                      <Badge tone="outline" className="hidden sm:inline-flex">
                        {update.kind}
                      </Badge>
                      <span className="font-mono text-[11.5px] text-ink-mute">
                        {formatISODate(update.date)}
                      </span>
                      <ArrowRight className="size-3.5 text-ink-mute transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md border border-line bg-surface p-5">
              <h2 className="text-[17px] font-semibold text-ink">Built with the community</h2>
              <p className="mt-2 text-[13.5px] leading-6.5 text-ink-soft">
                Every entry is content in a repository: typed data files, reviewed before they are
                marked verified. Corrections, extra commands and new tools are the whole point of the
                project.
              </p>
              <ul className="mt-4 space-y-2 text-[13px] text-ink-soft">
                {[
                  "Add a tool or extend an existing entry",
                  "Flag documentation that has fallen behind",
                  "Improve examples, filters and accessibility",
                ].map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <LinkButton
                  href={repositoryHref()}
                  external={repositoryIsExternal}
                  variant="primary"
                  leadingIcon={<Github className="size-3.5" />}
                >
                  {repositoryIsExternal ? "Repository" : "Contribution guide"}
                </LinkButton>
                <LinkButton href="/community/contribute" variant="secondary">
                  How contributing works
                </LinkButton>
              </div>
            </div>
          </div>
        </PageContainer>
      </Section>
    </>
  );
}

function Stat({
  value,
  label,
  href,
}: {
  value: number | string;
  label: string;
  href: string;
}) {
  return (
    <div>
      <dt className="font-mono text-[11px] tracking-[0.12em] text-ink-mute uppercase">{label}</dt>
      <dd className="mt-1">
        <Link
          href={href}
          className="text-[24px] leading-none font-semibold text-ink transition-colors hover:text-accent"
        >
          {value}
        </Link>
      </dd>
    </div>
  );
}
