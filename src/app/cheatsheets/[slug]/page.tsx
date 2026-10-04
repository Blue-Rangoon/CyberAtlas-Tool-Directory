import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { CheatsheetView } from "@/components/cheatsheets/CheatsheetView";
import { CHEATSHEETS, getCheatsheet } from "@/data/cheatsheets";
import { getTool } from "@/data/tools";
import { getCategory } from "@/data/categories";
import { formatISODate } from "@/lib/utils";

export function generateStaticParams() {
  return CHEATSHEETS.map((sheet) => ({ slug: sheet.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sheet = getCheatsheet(slug);
  if (!sheet) return { title: "Cheatsheet not found", robots: { index: false } };
  return {
    title: `${sheet.title} Cheatsheet`,
    description: sheet.description,
    alternates: { canonical: `/cheatsheets/${sheet.slug}` },
  };
}

export default async function CheatsheetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sheet = getCheatsheet(slug);
  if (!sheet) notFound();

  const tool = sheet.tool ? getTool(sheet.tool) : undefined;
  const category = getCategory(sheet.category);
  const entries = sheet.sections.reduce((n, s) => n + s.entries.length, 0);
  const others = CHEATSHEETS.filter((c) => c.slug !== sheet.slug).slice(0, 4);

  return (
    <PageContainer width="content" className="py-7 sm:py-9">
      <Breadcrumbs
        items={[
          { label: "Cheatsheets", href: "/cheatsheets" },
          ...(category ? [{ label: category.name, href: `/tools/${category.slug}` }] : []),
          { label: sheet.title },
        ]}
        className="mb-5"
      />

      <header className="print-doc border-b border-line pb-5">
        <p className="font-mono text-[11px] tracking-[0.14em] text-ink-mute uppercase">
          Cheatsheet
        </p>
        <h1 className="mt-1.5 text-[26px] leading-tight font-semibold tracking-[-0.02em] text-ink sm:text-[32px]">
          {sheet.title}
        </h1>
        <p className="mt-2.5 max-w-3xl text-[14px] leading-7 text-ink-soft">{sheet.description}</p>
        <div className="print-hide mt-3.5 flex flex-wrap items-center gap-2">
          <Badge tone="outline" mono>
            {entries} entries
          </Badge>
          <Badge tone="neutral">{sheet.sections.length} groups</Badge>
          <span className="text-[12px] text-ink-mute">
            Revised {formatISODate(sheet.lastUpdated)}
          </span>
          {tool ? (
            <Link
              href={tool.docsPath}
              className="group ml-auto inline-flex items-center gap-1.5 text-[12.5px] text-accent-blue transition-colors hover:underline"
            >
              Full {tool.name} documentation
              <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
            </Link>
          ) : null}
        </div>
      </header>

      <div className="print-doc mt-6">
        <CheatsheetView cheatsheet={sheet} />
      </div>

      <Callout tone="warning" title="Commands change" className="mt-8">
        <p>
          This sheet reflects what the dataset recorded on {formatISODate(sheet.lastUpdated)}.
          Flags move between releases — check `--help` or the upstream docs when a flag is
          rejected, and use these commands only against systems you are authorized to test.
        </p>
      </Callout>

      <nav aria-label="Other cheatsheets" className="mt-8 border-t border-line pt-5">
        <h2 className="mb-2.5 font-mono text-[10.5px] tracking-[0.16em] text-ink-mute uppercase">
          Other sheets
        </h2>
        <ul className="flex flex-wrap gap-2">
          {others.map((other) => (
            <li key={other.slug}>
              <Link
                href={`/cheatsheets/${other.slug}`}
                className="inline-flex items-center gap-1.5 rounded-[5px] border border-line bg-card px-2.5 py-1.5 text-[12.5px] text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
              >
                {other.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </PageContainer>
  );
}
