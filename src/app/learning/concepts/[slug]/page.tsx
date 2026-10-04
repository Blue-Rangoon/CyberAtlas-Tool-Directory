import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { Disclosure } from "@/components/ui/Accordion";
import { CodeSurface } from "@/components/tools/CommandBlock";
import { ToolRowLink } from "@/components/tools/ToolCard";
import { ConceptCard } from "@/components/learning/LearningCards";
import { CONCEPTS, getConcept } from "@/data/learning";
import { DIFFICULTY_LABEL } from "@/lib/constants";
import { getTools } from "@/data/tools";
import { truncate } from "@/lib/utils";

export function generateStaticParams() {
  return CONCEPTS.map((concept) => ({ slug: concept.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const concept = getConcept(slug);
  if (!concept) return { title: "Concept not found", robots: { index: false } };
  return {
    title: concept.title,
    description: truncate(concept.summary, 155),
    alternates: { canonical: `/learning/concepts/${concept.slug}` },
  };
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const concept = getConcept(slug);
  if (!concept) notFound();

  const related = (concept.relatedConcepts ?? [])
    .map((s) => CONCEPTS.find((c) => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const tools = getTools(concept.relatedTools ?? []);
  const index = CONCEPTS.findIndex((c) => c.slug === concept.slug);
  const next = CONCEPTS[(index + 1) % CONCEPTS.length];

  return (
    <PageContainer width="reading" className="py-7 sm:py-9 print-doc">
      <Breadcrumbs
        items={[
          { label: "Learning Hub", href: "/learning" },
          { label: "Concepts", href: "/learning#concepts" },
          { label: concept.title },
        ]}
        className="print-hide mb-5"
      />

      <header className="border-b border-line pb-6">
        <p className="font-mono text-[11px] tracking-[0.14em] text-ink-mute uppercase">
          Concept · {concept.minutes} min read
        </p>
        <h1 className="mt-2 text-[28px] leading-[1.15] font-semibold tracking-[-0.02em] text-ink sm:text-[34px]">
          {concept.title}
        </h1>
        <p className="mt-2.5 text-[15.5px] leading-7 text-ink-soft">{concept.question}</p>
        <div className="print-hide mt-3.5 flex flex-wrap items-center gap-2">
          <Badge tone="outline">{DIFFICULTY_LABEL[concept.difficulty]}</Badge>
          <Badge tone="neutral">CyberAtlas content</Badge>
        </div>
      </header>

      <p className="mt-6 text-[16px] leading-8 text-ink">{concept.summary}</p>

      <div className="mt-8 space-y-8">
        {concept.sections.map((section) => (
          <section key={section.heading} aria-labelledby={`sec-${slugify(section.heading)}`}>
            <h2
              id={`sec-${slugify(section.heading)}`}
              className="text-[19px] font-semibold tracking-[-0.01em] text-ink"
            >
              {section.heading}
            </h2>
            <div className="mt-2.5 space-y-3.5">
              {section.paragraphs?.map((paragraph, i) => (
                <p key={i} className="text-[14.5px] leading-7.5 text-ink-soft">
                  {paragraph}
                </p>
              ))}
              {section.bullets?.length ? (
                <ul className="space-y-1.5">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2.5 text-[14px] leading-7 text-ink-soft">
                      <span className="mt-3 size-1 shrink-0 rounded-full bg-accent/70" aria-hidden />
                      <span className="min-w-0">{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {section.code?.map((block) => (
                <div key={block.value} className="mt-3">
                  <p className="print-hide mb-1 font-mono text-[10.5px] tracking-[0.12em] text-ink-mute uppercase">
                    {block.language}
                  </p>
                  <pre className="scroll-rail rounded-[5px] border border-line bg-main px-3 py-2.5 font-mono text-[12.5px] leading-6 whitespace-pre text-ink">
                    {block.value}
                  </pre>
                </div>
              ))}
              {section.callout ? (
                <Callout tone={section.callout.tone === "warning" ? "warning" : "info"}>
                  <p>{section.callout.text}</p>
                </Callout>
              ) : null}
            </div>
          </section>
        ))}
      </div>

      {concept.checkYourUnderstanding?.length ? (
        <section className="mt-10" aria-labelledby="check-title">
          <SectionHeader
            id="check-title"
            title="Check your understanding"
            description="Answer before expanding. If you cannot explain it in one sentence, the section above needs a re-read."
          />
          <div className="space-y-2">
            {concept.checkYourUnderstanding.map((item, index) => (
              <Disclosure
                key={item.question}
                title={<span className="text-[13.5px] text-ink">{item.question}</span>}
                meta={`Q${index + 1}`}
              >
                <p className="text-[13.5px] leading-6.5 text-ink-soft">{item.answer}</p>
              </Disclosure>
            ))}
          </div>
        </section>
      ) : null}

      {tools.length ? (
        <section className="print-hide mt-10" aria-labelledby="tools-title">
          <SectionHeader id="tools-title" title="Where this shows up" description="Tools in the directory whose commands assume this knowledge." />
          <ul className="grid gap-1.5 rounded-md border border-line bg-card p-1.5 sm:grid-cols-2">
            {tools.map((tool) => (
              <ToolRowLink key={tool.slug} tool={tool} />
            ))}
          </ul>
        </section>
      ) : null}

      {concept.sources?.length ? (
        <section className="mt-10" aria-labelledby="sources-title">
          <h2 id="sources-title" className="mb-2.5 font-mono text-[10.5px] tracking-[0.16em] text-ink-mute uppercase">
            Primary sources
          </h2>
          <ul className="space-y-1.5">
            {concept.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2 text-[13px] leading-6 text-ink-soft transition-colors hover:text-ink"
                >
                  <ExternalLink className="mt-1 size-3.5 shrink-0 text-ink-mute" aria-hidden />
                  <span>
                    <span className="font-medium text-ink">{source.label}</span>
                    {source.note ? <span className="text-ink-mute"> — {source.note}</span> : null}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <nav className="print-hide mt-12 grid gap-3 border-t border-line pt-6 sm:grid-cols-2" aria-label="Related concepts">
        {related.slice(0, 2).map((item) => (
          <ConceptCard key={item.slug} concept={item} />
        ))}
      </nav>

      <div className="print-hide mt-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/learning" className="text-[13px] text-ink-soft transition-colors hover:text-ink">
          ← Learning Hub
        </Link>
        <Link
          href={`/learning/concepts/${next.slug}`}
          className="group inline-flex items-center gap-1.5 text-[13px] text-accent"
        >
          Next: {next.title}
          <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </div>
    </PageContainer>
  );
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
