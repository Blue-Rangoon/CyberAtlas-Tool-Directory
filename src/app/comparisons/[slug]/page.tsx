import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CircleCheck, TriangleAlert } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { ComparisonTable } from "@/components/comparisons/ComparisonTable";
import { CommandRow } from "@/components/tools/CommandBlock";
import { ToolGlyph } from "@/components/tools/CommandBlock";
import { COMPARISONS, getComparison } from "@/data/comparisons";
import { getTool } from "@/data/tools";
import { formatISODate, truncate } from "@/lib/utils";

export function generateStaticParams() {
  return COMPARISONS.map((comparison) => ({ slug: comparison.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) return { title: "Comparison not found", robots: { index: false } };
  return {
    title: `${comparison.title} — Comparison`,
    description: truncate(comparison.description, 155),
    alternates: { canonical: `/comparisons/${comparison.slug}` },
  };
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) notFound();

  const [sideA, sideB] = comparison.sides;
  const toolA = getTool(comparison.toolA);
  const toolB = getTool(comparison.toolB);

  return (
    <PageContainer width="content" className="py-7 sm:py-9">
      <Breadcrumbs
        items={[
          { label: "Comparisons", href: "/comparisons" },
          { label: comparison.title },
        ]}
        className="mb-5"
      />

      <header className="border-b border-line pb-6">
        <p className="font-mono text-[11px] tracking-[0.14em] text-ink-mute uppercase">
          Comparison · neutral framing
        </p>
        <h1 className="mt-1.5 text-[26px] leading-tight font-semibold tracking-[-0.02em] text-ink sm:text-[32px]">
          {comparison.toolA} <span className="text-ink-mute">vs</span> {comparison.toolB}
        </h1>
        <p className="mt-2.5 max-w-3xl text-[14.5px] leading-7 text-ink-soft">
          {comparison.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {toolA ? <ToolPill tool={toolA} /> : null}
          {toolB ? <ToolPill tool={toolB} /> : null}
          <Badge tone="outline" mono>
            revised {formatISODate(comparison.lastUpdated)}
          </Badge>
        </div>
      </header>

      <Callout tone="info" title="How to read this page" className="mt-6">
        <p>{comparison.verdictNote}</p>
      </Callout>

      <section className="mt-8" aria-label="Attribute comparison">
        <SectionHeader
          title="Attributes"
          description="Values describe documented behaviour. Anything workload- or hardware-dependent is written as a practice, not a number."
        />
        <ComparisonTable
          features={comparison.features}
          toolA={comparison.toolA}
          toolB={comparison.toolB}
        />
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2" aria-label="Per-tool summary">
        {[sideA, sideB].map((side) => (
          <div key={side.tool} className="rounded-md border border-line bg-card p-4">
            <h2 className="text-[16px] font-semibold text-ink">{side.tool}</h2>
            <p className="mt-1.5 text-[13.5px] leading-6 text-ink-soft">{side.summary}</p>

            <h3 className="mt-4 font-mono text-[10.5px] tracking-[0.14em] text-ink-mute uppercase">
              Strengths
            </h3>
            <ul className="mt-1.5 space-y-1.5">
              {side.strengths.map((item) => (
                <li key={item} className="flex gap-2 text-[13px] leading-6 text-ink-soft">
                  <CircleCheck className="mt-1 size-3.5 shrink-0 text-success" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="mt-4 font-mono text-[10.5px] tracking-[0.14em] text-ink-mute uppercase">
              Limitations
            </h3>
            <ul className="mt-1.5 space-y-1.5">
              {side.limitations.map((item) => (
                <li key={item} className="flex gap-2 text-[13px] leading-6 text-ink-soft">
                  <TriangleAlert className="mt-1 size-3.5 shrink-0 text-ink-mute" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t border-line/70 pt-3">
              <h3 className="font-mono text-[10.5px] tracking-[0.14em] text-ink-mute uppercase">
                Consider {side.tool} when
              </h3>
              <ul className="mt-1.5 space-y-1.5">
                {side.whenToUse.map((item) => (
                  <li key={item} className="text-[13px] leading-6 text-ink">
                    — {item}
                  </li>
                ))}
              </ul>
            </div>

            {side.tool === comparison.toolA && toolA ? (
              <LinkButton href={toolA.docsPath} size="sm" variant="ghost" className="mt-3 -ml-2">
                Open {toolA.name} documentation
              </LinkButton>
            ) : null}
            {side.tool === comparison.toolB && toolB ? (
              <LinkButton href={toolB.docsPath} size="sm" variant="ghost" className="mt-3 -ml-2">
                Open {toolB.name} documentation
              </LinkButton>
            ) : null}
          </div>
        ))}
      </section>

      {comparison.workflowExamples?.length ? (
        <section className="mt-10" aria-label="Same job, two tools">
          <SectionHeader title="The same job, both ways" />
          <div className="space-y-4">
            {comparison.workflowExamples.map((example) => (
              <div key={example.title} className="rounded-md border border-line bg-card p-4">
                <h3 className="text-[14.5px] font-semibold text-ink">{example.title}</h3>
                <div className="mt-3 space-y-3">
                  {example.a ? (
                    <LabeledCommand label={comparison.toolA} command={example.a} />
                  ) : null}
                  {example.b ? (
                    <LabeledCommand label={comparison.toolB} command={example.b} />
                  ) : null}
                </div>
                <p className="mt-3 border-t border-line/70 pt-3 text-[13px] leading-6 text-ink-soft">
                  {example.note}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {comparison.references?.length ? (
        <section className="mt-10" aria-label="Sources">
          <SectionHeader title="Sources" description="Both columns should be checkable against upstream documentation." />
          <ul className="flex flex-wrap gap-2">
            {comparison.references.map((reference) => (
              <li key={reference.url}>
                <a
                  href={reference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-[5px] border border-line bg-card px-2.5 py-1.5 text-[12.5px] text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
                >
                  {reference.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <nav aria-label="Related comparisons" className="mt-10 border-t border-line pt-6">
        <h2 className="mb-3 font-mono text-[10.5px] tracking-[0.16em] text-ink-mute uppercase">
          Related comparisons
        </h2>
        <ul className="flex flex-wrap gap-2">
          {comparison.relatedComparisons.map((related) => {
            const target = COMPARISONS.find((c) => c.slug === related);
            if (!target) return null;
            return (
              <li key={related}>
                <Link
                  href={`/comparisons/${target.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-[5px] border border-line bg-card px-2.5 py-1.5 text-[12.5px] text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
                >
                  {target.title}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-5">
          <LinkButton href="/comparisons" variant="ghost" size="sm" leadingIcon={<ArrowLeft className="size-3.5" />}>
            All comparisons
          </LinkButton>
        </div>
      </nav>
    </PageContainer>
  );
}

function ToolPill({ tool }: { tool: NonNullable<ReturnType<typeof getTool>> }) {
  return (
    <Link
      href={tool.docsPath}
      className="group inline-flex items-center gap-2 rounded-[5px] border border-line bg-card px-2 py-1 text-[12.5px] text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
    >
      <ToolGlyph iconKey={tool.icon} size="xs" bare />
      {tool.name}
    </Link>
  );
}

function LabeledCommand({ label, command }: { label: string; command: string }) {
  return (
    <div>
      <p className="mb-1 font-mono text-[10.5px] tracking-[0.14em] text-ink-mute uppercase">
        {label}
      </p>
      <CommandRow command={command} />
    </div>
  );
}
