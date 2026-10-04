import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { RoadmapView } from "@/components/roadmaps/RoadmapView";
import { ToolRowLink } from "@/components/tools/ToolCard";
import { DIFFICULTY_LABEL } from "@/lib/constants";
import { getTools } from "@/data/tools";
import { ROADMAPS, getRoadmap } from "@/data/roadmaps";
import { getIcon } from "@/lib/icons";
import { truncate } from "@/lib/utils";

export function generateStaticParams() {
  return ROADMAPS.map((roadmap) => ({ slug: roadmap.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const roadmap = getRoadmap(slug);
  if (!roadmap) return { title: "Roadmap not found", robots: { index: false } };
  return {
    title: `${roadmap.title} roadmap`,
    description: truncate(roadmap.description, 155),
    alternates: { canonical: `/roadmaps/${roadmap.slug}` },
  };
}

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const roadmap = getRoadmap(slug);
  if (!roadmap) notFound();

  const Icon = getIcon(roadmap.icon);
  const relatedTools = getTools(roadmap.relatedTools);
  const index = ROADMAPS.findIndex((r) => r.slug === roadmap.slug);
  const next = ROADMAPS[(index + 1) % ROADMAPS.length];
  const range = roadmap.difficultyRange;

  return (
    <PageContainer width="content" className="py-7 sm:py-9">
      <Breadcrumbs
        items={[{ label: "Roadmaps", href: "/roadmaps" }, { label: roadmap.title }]}
        className="mb-5"
      />

      <header className="border-b border-line pb-6">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-md border border-line bg-elevated text-accent" aria-hidden>
            <Icon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[11px] tracking-[0.14em] text-ink-mute uppercase">
              Roadmap
            </p>
            <h1 className="mt-1 text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink sm:text-[34px]">
              {roadmap.title}
            </h1>
            <p className="mt-2.5 max-w-2xl text-[14.5px] leading-7 text-ink-soft">
              {roadmap.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge tone="outline">
                {range
                  ? `${DIFFICULTY_LABEL[range[0]]} → ${DIFFICULTY_LABEL[range[1]]}`
                  : DIFFICULTY_LABEL[roadmap.difficulty]}
              </Badge>
              <Badge tone="neutral">{roadmap.stages.length} stages</Badge>
              <Badge tone="neutral">{roadmap.estimatedDuration}</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="font-mono text-[10.5px] tracking-[0.16em] text-ink-mute uppercase">
            Prerequisites
          </h2>
          <ul className="mt-2 space-y-1.5">
            {roadmap.prerequisites.map((item) => (
              <li key={item} className="flex gap-2 text-[13.5px] leading-6 text-ink-soft">
                <span className="mt-2.5 size-1 shrink-0 rounded-full bg-ink-mute/60" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="font-mono text-[10.5px] tracking-[0.16em] text-ink-mute uppercase">
            Who it is for
          </h2>
          <p className="mt-2 text-[13.5px] leading-6 text-ink-soft">{roadmap.audience}</p>
          <p className="mt-3 border-t border-line/70 pt-3 text-[13px] leading-6 text-ink-soft">
            <span className="text-ink-mute">Outcome: </span>
            {roadmap.outcome}
          </p>
        </Card>
      </div>

      <section className="mt-9" aria-label="Stages">
        <SectionHeader
          title="Stages"
          description="Work them in order the first time. Ticking a stage only records your own progress, in this browser."
        />
        <RoadmapView roadmap={roadmap} />
      </section>

      {relatedTools.length ? (
        <section className="mt-10" aria-label="Tools used in this path">
          <SectionHeader title="Tools in this path" description="Each tool page carries installation steps, commands and the errors you will hit." />
          <ul className="grid gap-1.5 rounded-md border border-line bg-card p-1.5 md:grid-cols-2">
            {relatedTools.map((tool) => (
              <ToolRowLink key={tool.slug} tool={tool} showStatus />
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
        <LinkButton href="/roadmaps" variant="ghost" leadingIcon={<ArrowLeft className="size-3.5" />}>
          All roadmaps
        </LinkButton>
        <Link href={`/roadmaps/${next.slug}`} className="group inline-flex items-center gap-2 text-[13.5px] text-ink-soft transition-colors hover:text-ink">
          Next path: <span className="font-medium text-ink">{next.title}</span>
          <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </div>

      <Callout tone="tip" title="Practice needs a target you own" className="mt-6">
        <p>
          Pair each stage with a lab. See{" "}
          <Link href="/learning#labs" className="text-accent hover:underline">
            practice resources
          </Link>{" "}
          for isolated ranges, and{" "}
          <Link href="/about/responsible-use" className="text-accent hover:underline">
            responsible use
          </Link>{" "}
          for the boundaries that apply.
        </p>
      </Callout>
    </PageContainer>
  );
}
