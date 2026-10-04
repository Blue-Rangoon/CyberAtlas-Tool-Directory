import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, ExternalLink } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader, SectionHeader } from "@/components/common/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { ConceptCard, ResourceCard } from "@/components/learning/LearningCards";
import { CONCEPTS, RESOURCES, RESOURCE_GROUPS } from "@/data/learning";
import { ROADMAPS } from "@/data/roadmaps";
import { TOOLS } from "@/data/tools";

export const metadata: Metadata = {
  title: "Learning Hub",
  description:
    "Beginner concepts, practice labs, CTF resources, certifications and reference frameworks for cybersecurity study.",
  alternates: { canonical: "/learning" },
};

export default function LearningHubPage() {
  const externalCount = RESOURCES.length;

  return (
    <PageContainer width="wide" className="py-7 sm:py-9">
      <PageHeader
        eyebrow="Learn"
        title="Learning Hub"
        description="Short, structured explanations of the ideas every tool assumes, plus practice environments and reference material — clearly separated into CyberAtlas content and external destinations."
        meta={
          <>
            <Link
              href="#concepts"
              className="rounded border border-line bg-card px-2 py-0.5 font-mono text-[11.5px] text-ink-soft transition-colors hover:border-line-strong"
            >
              {CONCEPTS.length} concepts
            </Link>
            <Link
              href="#labs"
              className="rounded border border-line bg-card px-2 py-0.5 font-mono text-[11.5px] text-ink-soft transition-colors hover:border-line-strong"
            >
              labs & CTFs
            </Link>
            <Link
              href="#certifications"
              className="rounded border border-line bg-card px-2 py-0.5 font-mono text-[11.5px] text-ink-soft transition-colors hover:border-line-strong"
            >
              certifications
            </Link>
          </>
        }
        actions={
          <LinkButton href="/roadmaps" variant="secondary" size="sm" leadingIcon={<Compass className="size-3.5" />}>
            Learning paths
          </LinkButton>
        }
      />

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Callout tone="info" title="CyberAtlas vs external">
          <p>
            Concept pages are written here. Labs, books and exams are external projects listed with
            a link — being listed is not an endorsement or a review.
          </p>
        </Callout>
        <Card className="md:col-span-2">
          <h2 className="font-mono text-[10.5px] tracking-[0.16em] text-ink-mute uppercase">
            Suggested first hour
          </h2>
          <ol className="mt-2 space-y-1.5 text-[13.5px] leading-6 text-ink-soft">
            <li>
              1 · Read{" "}
              <Link href="/learning/concepts/what-is-a-port" className="text-accent hover:underline">
                what a port is
              </Link>{" "}
              and{" "}
              <Link href="/learning/concepts/what-is-an-ip-address" className="text-accent hover:underline">
                what an IP address is not
              </Link>
              .
            </li>
            <li>
              2 · Open the{" "}
              <Link href="/tools/nmap" className="text-accent hover:underline">
                Nmap entry
              </Link>{" "}
              and read the first three commands — do not run anything yet.
            </li>
            <li>
              3 · Pick the{" "}
              <Link href="/roadmaps/absolute-beginner" className="text-accent hover:underline">
                Absolute Beginner
              </Link>{" "}
              path and set up its stage-one lab.
            </li>
          </ol>
        </Card>
      </div>

      <section id="concepts" className="mt-11 scroll-mt-24" aria-labelledby="concepts-title">
        <SectionHeader
          id="concepts-title"
          title="Concepts"
          description="One question per page, written to be finished in a few minutes and re-read later with more context."
          action={
            <span className="font-mono text-[11.5px] text-ink-mute">{CONCEPTS.length} entries</span>
          }
        />
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CONCEPTS.map((concept) => (
            <ConceptCard key={concept.slug} concept={concept} />
          ))}
        </ul>
      </section>

      {RESOURCE_GROUPS.map((group) => {
        const items = RESOURCES.filter((resource) => resource.type === group.key);
        if (!items.length) return null;
        return (
          <section
            key={group.key}
            id={group.key}
            className="mt-11 scroll-mt-24"
            aria-labelledby={`${group.key}-title`}
          >
            <SectionHeader
              id={`${group.key}-title`}
              title={group.title}
              description={
                <>
                  {group.blurb} ·{" "}
                  <span className="inline-flex items-center gap-1 text-ink-mute">
                    {items.length} external destinations
                    <ExternalLink className="size-3" aria-hidden />
                  </span>
                </>
              }
              action={
                group.key === "lab" ? (
                  <span className="rounded-[5px] border border-line bg-card px-2 py-1 text-[11.5px] text-ink-mute">
                    Isolated environments only
                  </span>
                ) : null
              }
            />
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {items.map((resource) => (
                <ResourceCard key={resource.slug} resource={resource} />
              ))}
            </ul>
          </section>
        );
      })}

      <section className="mt-11" aria-labelledby="next-title">
        <div className="rounded-lg border border-line bg-surface p-5 sm:p-6">
          <SectionHeader
            id="next-title"
            title="Reading is not the whole path"
            description="Concepts and labs are inputs. A roadmap sequences them, and the tool pages carry the commands you will actually need."
          />
          <div className="grid gap-3 md:grid-cols-3">
            {ROADMAPS.slice(0, 3).map((roadmap) => (
              <Link
                key={roadmap.slug}
                href={`/roadmaps/${roadmap.slug}`}
                className="group rounded-md border border-line bg-card p-3.5 transition-colors hover:border-line-strong hover:bg-card-hover"
              >
                <p className="text-[14px] font-semibold text-ink">{roadmap.title}</p>
                <p className="mt-1 line-clamp-2 text-[12.5px] leading-5.5 text-ink-soft">
                  {roadmap.audience}
                </p>
                <span className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] text-accent">
                  {roadmap.stages.length} stages
                  <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-[12.5px] text-ink-mute">
            {TOOLS.length} tools and their commands sit behind every stage listed above.
          </p>
        </div>
      </section>
    </PageContainer>
  );
}
