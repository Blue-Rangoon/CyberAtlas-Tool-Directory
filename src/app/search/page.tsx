import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { OpenSearchButton } from "@/components/search/OpenSearchButton";
import { PATH_LABEL } from "@/components/search/resultMeta";
import { searchGrouped } from "@/lib/search";
import { TOOLS } from "@/data/tools";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Search results",
  description: "Search across tools, commands, categories, roadmaps, concepts, cheatsheets and comparisons.",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const groups = q.trim() ? searchGrouped(q, 12) : [];
  const total = groups.reduce((n, group) => n + group.hits.length, 0);

  return (
    <PageContainer width="content" className="py-7 sm:py-9">
      <header className="border-b border-line pb-5">
        <p className="font-mono text-[11px] tracking-[0.14em] text-ink-mute uppercase">
          Global search
        </p>
        <h1 className="mt-1.5 text-[24px] leading-tight font-semibold text-ink sm:text-[28px]">
          {q.trim() ? (
            <>
              Results for <span className="font-mono text-accent">“{q.trim()}”</span>
            </>
          ) : (
            "Search the directory"
          )}
        </h1>
        <p className="mt-2 text-[13.5px] text-ink-soft">
          {q.trim()
            ? `${total} matching ${total === 1 ? "entry" : "entries"} across tools, commands, roadmaps, concepts, cheatsheets and comparisons.`
            : `Tools, commands, categories, subtopics, roadmaps, concepts, cheatsheets and comparisons — ${TOOLS.length} tool entries indexed.`}
        </p>
      </header>

      {/* Native GET form: refine without JavaScript. */}
      <form action="/search" method="get" className="mt-5 flex flex-col gap-2 sm:flex-row">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search query</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-mute" aria-hidden />
          <input
            type="search"
            name="q"
            defaultValue={q}
            autoFocus
            placeholder="Search tools, commands, topics..."
            className="h-10 w-full rounded-[5px] border border-line bg-elevated pr-3 pl-9 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-mute hover:border-line-strong focus:border-accent/60 [&::-webkit-search-cancel-button]:hidden"
          />
        </label>
        <button
          type="submit"
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-[5px] bg-accent px-4 text-[13.5px] font-semibold text-on-accent transition-colors hover:bg-accent-hover"
        >
          Search
        </button>
        <OpenSearchButton variant="secondary" size="lg" showShortcut={false} className="shrink-0">
          Palette
        </OpenSearchButton>
      </form>

      {q.trim() === "" ? (
        <EmptyState
          className="mt-6"
          title="Type a query"
          description="Try a tool name (nmap), a task (dns enumeration), a protocol (tls), or a concept (cidr). Ranking favours titles, so 'nmap' returns the Nmap page before anything that merely mentions it."
        />
      ) : !groups.length ? (
        <EmptyState
          className="mt-6"
          title={`Nothing matches “${q.trim()}”`}
          description={
            <>
              The index covers tool names, commands, categories, roadmap stages, concepts,
              cheatsheets and comparisons. Spelling variants and broader terms usually work better.
            </>
          }
          actions={
            <>
              <Link
                href="/tools"
                className="inline-flex items-center gap-1.5 rounded-[5px] bg-accent px-3 py-1.5 text-[13px] font-semibold text-on-accent"
              >
                Browse all tools
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
              <Link
                href="/community/request-tool"
                className="inline-flex items-center gap-1.5 rounded-[5px] border border-line bg-elevated px-3 py-1.5 text-[13px] text-ink"
              >
                Request this entry
              </Link>
            </>
          }
        />
      ) : (
        <div className="mt-7 space-y-8">
          {groups.map((group) => (
            <section key={group.type} aria-labelledby={`group-${group.type}`}>
              <h2
                id={`group-${group.type}`}
                className="mb-2 flex items-center gap-2 font-mono text-[10.5px] tracking-[0.16em] text-ink-mute uppercase"
              >
                {group.label}
                <span className="text-ink-mute/60">({group.hits.length})</span>
              </h2>
              <ul className="overflow-hidden rounded-md border border-line bg-card">
                {group.hits.map((hit) => (
                  <li key={hit.entry.id} className="border-b border-line/70 last:border-b-0">
                    <Link
                      href={hit.entry.href}
                      className={cn(
                        "flex items-start gap-3 px-3.5 py-2.5 transition-colors hover:bg-elevated/60",
                      )}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14px] font-medium text-ink">
                          {hit.entry.parent ? (
                            <span className="mr-1.5 text-ink-mute">{hit.entry.parent}</span>
                          ) : null}
                          {hit.entry.title}
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 block text-[12.5px] leading-5.5 text-ink-soft",
                            hit.entry.type === "command" && "font-mono text-accent",
                          )}
                        >
                          {hit.entry.subtitle}
                        </span>
                      </span>
                      <Badge tone="outline" className="hidden shrink-0 sm:inline-flex">
                        {PATH_LABEL[hit.entry.type]}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
