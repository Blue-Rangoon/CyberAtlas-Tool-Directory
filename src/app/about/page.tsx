import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Github, Scale, ShieldCheck } from "lucide-react";
import { PageContainer, Section } from "@/components/layout/PageContainer";
import { PageHeader, SectionHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { SITE } from "@/lib/constants";
import { repositoryHref, repositoryIsExternal } from "@/lib/repo";
import { getStats } from "@/lib/stats";

export const metadata: Metadata = {
  title: "About",
  description: `${SITE.name} is an open-source directory of cybersecurity tools, commands and learning material. What it is, what it refuses to be, and how the content is built.`,
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  {
    title: "Curate, do not scrape",
    body: "Summaries are written from upstream documentation and linked back to it. A page that only mirrors a manual adds nothing.",
  },
  {
    title: "Context over cleverness",
    body: "A command with no explanation is a hazard. Every entry states what it does, what it needs, and how to read the output.",
  },
  {
    title: "Honest metadata",
    body: "Versions, dates and counts appear only when they are real. Optional fields are optional, so absence is a statement rather than a gap filled with fiction.",
  },
  {
    title: "Documentation, not execution",
    body: "Nothing on this site runs a command. There is no shell, no playground, no server-side execution — deliberately.",
  },
];

export default function AboutPage() {
  const stats = getStats();

  return (
    <>
      <PageContainer width="content" className="py-7 sm:py-9">
        <PageHeader
          eyebrow="Project"
          title={`About ${SITE.name}`}
          description="A reference for security tooling that behaves like documentation and is built like software: typed content, reusable components, no backend, no accounts."
          actions={
            <LinkButton
              href={repositoryHref()}
              external={repositoryIsExternal}
              variant="secondary"
              leadingIcon={<Github className="size-3.5" />}
            >
              {repositoryIsExternal ? "Repository" : "Contribution guide"}
            </LinkButton>
          }
        />

        <div className="mt-7 space-y-6">
          <p className="text-[15.5px] leading-8 text-ink">
            The product answers a short list of questions for any tool: what it does, whether it runs
            on your platform, how to install it, which commands matter, what those commands actually
            do, where it goes wrong, what the alternatives are, and where it belongs in a learning
            path.
          </p>
          <p className="text-[14.5px] leading-7.5 text-ink-soft">
            Everything is connected on purpose. A tool page links to its alternatives, the
            comparisons that cover them, the cheatsheet that condenses them, and the roadmap stages
            that assume them — so browsing turns into study without a search box in between.
          </p>
          <Callout tone="info" title="Audience">
            <p>
              Beginners, students, developers moving into security work, practitioners who want a
              reference that does not waste their time, and contributors who would rather edit a data
              file than a CMS.
            </p>
          </Callout>
        </div>
      </PageContainer>

      <Section tone="surface" ariaLabel="Principles">
        <PageContainer width="content">
          <SectionHeader
            title="Four rules that shape the product"
            description="They also explain what is missing: no star counts, no leaderboard, no live target, no neon."
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {PRINCIPLES.map((principle) => (
              <li key={principle.title}>
                <Card className="h-full">
                  <h3 className="text-[15px] font-semibold text-ink">{principle.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-6.5 text-ink-soft">{principle.body}</p>
                </Card>
              </li>
            ))}
          </ul>
        </PageContainer>
      </Section>

      <PageContainer width="content" className="pb-4">
        <div className="grid gap-3 md:grid-cols-2">
          <Card className="p-5">
            <h2 className="text-[16px] font-semibold text-ink">How the content is organised</h2>
            <p className="mt-2 text-[13.5px] leading-6.5 text-ink-soft">
              Seven categories, each with subtopics; tools carry installation methods per platform and
              structured command entries; roadmaps, comparisons, cheatsheets and concepts reference
              tools by slug so links can never rot silently.
            </p>
            <p className="mt-3 font-mono text-[12px] text-ink-mute">
              {stats.tools} tools · {stats.commands} commands · {stats.subcategories} subtopics ·{" "}
              {stats.roadmaps} roadmaps · {stats.concepts} concepts
            </p>
            <LinkButton href="/community/contribute" size="sm" className="mt-4">
              Read the contribution guide
            </LinkButton>
          </Card>
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-[16px] font-semibold text-ink">
              <ShieldCheck className="size-4 text-accent" aria-hidden />
              Trust and safety
            </h2>
            <p className="mt-2 text-[13.5px] leading-6.5 text-ink-soft">
              Verification states are explicit and always labelled. Legal framing, responsible use and
              the source policy are separate pages because a security reference should be legible
              about its own boundaries.
            </p>
            <ul className="mt-4 space-y-1.5">
              {[
                { href: "/faqs", label: "Frequently asked questions" },
                { href: "/about/verification", label: "What “Verified” means" },
                { href: "/about/sources", label: "Sources and citation policy" },
                { href: "/about/responsible-use", label: "Legal & ethical use" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-[13px] text-accent-blue transition-colors hover:underline"
                  >
                    {link.label}
                    <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md border border-line bg-surface px-4 py-3 text-[13px] text-ink-soft">
          <Scale className="size-4 shrink-0 text-ink-mute" aria-hidden />
          Dataset v{SITE.datasetVersion}, revised {SITE.datasetRevision}. Content is static on purpose:
          a future API or MDX pipeline maps onto the same types.
        </div>
      </PageContainer>
    </>
  );
}
