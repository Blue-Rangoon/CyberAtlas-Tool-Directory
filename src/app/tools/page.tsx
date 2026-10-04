import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Scale, ScrollText } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { ToolGridSkeleton } from "@/components/ui/States";
import { ToolsBrowser } from "@/components/pages/ToolsBrowser";
import { CATEGORIES } from "@/data/categories";
import { TOOLS, TOTAL_COMMANDS } from "@/data/tools";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cybersecurity Tools — Directory",
  description: `Browse ${TOOLS.length} curated cybersecurity tools by category, platform and difficulty, with ${TOTAL_COMMANDS} documented commands and installation notes.`,
  alternates: { canonical: "/tools" },
  openGraph: {
    title: `Cybersecurity Tools — ${SITE.name}`,
    description: `Browse ${TOOLS.length} tools for OSINT, pentesting, networking, forensics, wireless and cloud work.`,
  },
};

export default function ToolsPage() {
  return (
    <PageContainer width="wide" className="py-7 sm:py-9">
      <PageHeader
        eyebrow="Directory"
        title="Cybersecurity Tools"
        description="Explore tools for reconnaissance, OSINT, pentesting, networking, forensics, wireless and cloud work. Each entry documents what the tool does, how to install it, and what its commands actually mean."
        meta={
          <>
            <span className="rounded border border-line bg-card px-2 py-0.5 font-mono text-[11.5px] text-ink-soft">
              {TOOLS.length} tools
            </span>
            <span className="rounded border border-line bg-card px-2 py-0.5 font-mono text-[11.5px] text-ink-soft">
              {TOTAL_COMMANDS} commands
            </span>
            <span className="text-[12.5px] text-ink-mute">{CATEGORIES.length} categories</span>
          </>
        }
        actions={
          <>
            <LinkButton href="/comparisons" variant="ghost" size="sm" leadingIcon={<Scale className="size-3.5" />}>
              Compare tools
            </LinkButton>
            <LinkButton href="/cheatsheets" variant="ghost" size="sm" leadingIcon={<ScrollText className="size-3.5" />}>
              Cheatsheets
            </LinkButton>
          </>
        }
      />

      <nav aria-label="Jump to category" className="scroll-rail mt-5 mb-6 flex gap-1.5 pb-1">
        {CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={`/tools?category=${category.slug}`}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-[5px] border border-line bg-card px-2.5 py-1.5 text-[12.5px] text-ink-soft transition-colors hover:border-line-strong hover:text-ink",
            )}
          >
            <span className={cn("size-1.5 rounded-full", categoryAccentDot(category.accent))} aria-hidden />
            {category.name}
            <span className="font-mono text-[11px] text-ink-mute">
              {TOOLS.filter((t) => t.category === category.slug).length}
            </span>
          </Link>
        ))}
        <Link
          href="/tools/osint"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-[5px] border border-dashed border-line px-2.5 py-1.5 text-[12.5px] text-ink-mute transition-colors hover:border-line-strong hover:text-ink"
        >
          Browse category pages
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </nav>

      <Suspense fallback={<ToolGridSkeleton count={9} />}>
        <ToolsBrowser />
      </Suspense>
    </PageContainer>
  );
}

function categoryAccentDot(accent: keyof typeof ACCENT_DOT) {
  return ACCENT_DOT[accent] ?? ACCENT_DOT.accent;
}

const ACCENT_DOT = {
  osint: "bg-osint",
  correlation: "bg-correlation",
  accent: "bg-accent",
  "accent-blue": "bg-accent-blue",
  warning: "bg-warning",
} as const;
