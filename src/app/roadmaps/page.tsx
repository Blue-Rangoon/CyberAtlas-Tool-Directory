import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader, SectionHeader } from "@/components/common/PageHeader";
import { RoadmapCard } from "@/components/roadmaps/RoadmapCard";
import { Callout } from "@/components/ui/Callout";
import { ROADMAPS, TOTAL_STAGES } from "@/data/roadmaps";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Learning Roadmaps",
  description: `${ROADMAPS.length} structured cybersecurity learning paths with ${TOTAL_STAGES} stages, prerequisites, exercises and linked tools.`,
  alternates: { canonical: "/roadmaps" },
  openGraph: { title: `Learning Roadmaps — ${SITE.name}`, description: metadata_description() },
};

function metadata_description() {
  return "Ordered stages, the tools that belong to each one, and honest framing about what a path can and cannot promise.";
}

export default function RoadmapsPage() {
  return (
    <PageContainer width="wide" className="py-7 sm:py-9">
      <PageHeader
        eyebrow="Learn"
        title="Cybersecurity roadmaps"
        description="Each roadmap is an ordered set of stages with the concepts, tools and exercises that belong to them. Progress is stored in your browser; nothing is tracked about you."
        meta={
          <span className="font-mono text-[12px] text-ink-mute">
            {ROADMAPS.length} paths · {TOTAL_STAGES} stages
          </span>
        }
      />

      <div className="mt-6">
        <Callout tone="info" title="What these paths are not">
          <p>
            They are a study order, not a certification and not a guarantee of competence. A
            completed stage list means you covered the material — the proof is what you can
            demonstrate on a target you are allowed to touch.
          </p>
        </Callout>
      </div>

      <section className="mt-8" aria-label="All roadmaps">
        <SectionHeader title="Available paths" description="Beginner through advanced. Estimated durations assume steady part-time study." />
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {ROADMAPS.map((roadmap) => (
            <RoadmapCard key={roadmap.slug} roadmap={roadmap} />
          ))}
        </ul>
      </section>
    </PageContainer>
  );
}
