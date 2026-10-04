import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CircleCheck,
  Clock,
  Github,
  PencilLine,
  PlusCircle,
  Users,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader, SectionHeader } from "@/components/common/PageHeader";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { TOOLS } from "@/data/tools";
import { STATUS_META } from "@/lib/constants";
import { repositoryHref, repositoryIsExternal } from "@/lib/repo";
import { getRecentUpdates } from "@/lib/updates";
import { formatISODate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Community",
  description:
    "How the CyberAtlas dataset is built and reviewed: contribution workflow, verification states, content revisions and ways to help.",
  alternates: { canonical: "/community" },
};

const WORKFLOW = [
  {
    step: "01",
    title: "Contributor",
    body: "Someone who uses the tool hits a gap: a missing flag, an outdated install step, a broken assumption.",
  },
  {
    step: "02",
    title: "Submission",
    body: "A change to a typed data file, or a request through the draft builders on this site. Provenance and sources included.",
  },
  {
    step: "03",
    title: "Review",
    body: "A maintainer checks the claim against upstream documentation, the command syntax, and whether the framing stays responsible.",
  },
  {
    step: "04",
    title: "Verification",
    body: "Only then does an entry move to Verified. Unreviewed material is labelled, never silently trusted.",
  },
  {
    step: "05",
    title: "Publication",
    body: "The dataset revision bumps; search, category counts and activity feeds all derive from the same content.",
  },
];

const WAYS = [
  {
    title: "Add a tool",
    body: "Create a typed entry: identity, platforms, installation per platform, commands with context, errors, references.",
    href: "/community/contribute",
    icon: PlusCircle,
  },
  {
    title: "Fix documentation",
    body: "A wrong flag, a stale package name, a misleading description. Small corrections are the most valuable contributions.",
    href: "/community/suggest-edit",
    icon: PencilLine,
  },
  {
    title: "Report outdated content",
    body: "Point at what changed upstream. The entry gets marked Needs review rather than quietly lying to readers.",
    href: "/community/suggest-edit?topic=outdated",
    icon: Clock,
  },
  {
    title: "Improve the product",
    body: "Accessibility, responsive behaviour, search ranking, print styles, performance. The frontend is part of the project.",
    href: "/community/contribute#frontend",
    icon: Users,
  },
];

export default function CommunityPage() {
  const updates = getRecentUpdates(14);

  return (
    <PageContainer width="wide" className="py-7 sm:py-9">
      <PageHeader
        eyebrow="Community"
        title="A directory built in the open"
        description="CyberAtlas is documentation as data: typed entries, reviewed before they are trusted, and open to correction. This page explains the process and where to start."
        actions={
          <>
            <LinkButton
              href={repositoryHref()}
              external={repositoryIsExternal}
              variant="primary"
              leadingIcon={<Github className="size-3.5" />}
            >
              {repositoryIsExternal ? "Repository" : "Contribution guide"}
            </LinkButton>
            <LinkButton href="/community/request-tool" variant="secondary">
              Request a tool
            </LinkButton>
          </>
        }
      />

      <section className="mt-8" aria-labelledby="workflow-title">
        <SectionHeader
          id="workflow-title"
          title="How a change becomes content"
          description="Nothing community-submitted is automatically verified. The status on every entry tells you where it sits in this pipeline."
        />
        <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {WORKFLOW.map((item) => (
            <li key={item.step}>
              <Card className="h-full">
                <span className="font-mono text-[11px] text-accent">{item.step}</span>
                <h3 className="mt-1.5 text-[14.5px] font-semibold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-[13px] leading-6 text-ink-soft">{item.body}</p>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]" aria-labelledby="ways-title">
        <div>
          <SectionHeader id="ways-title" title="Ways to help" />
          <ul className="grid gap-3 sm:grid-cols-2">
            {WAYS.map((way) => (
              <li key={way.title}>
                <Link
                  href={way.href}
                  className="group flex h-full flex-col rounded-md border border-line bg-card p-4 transition-[border-color,transform,background-color] duration-150 hover:-translate-y-px hover:border-line-strong hover:bg-card-hover motion-reduce:transform-none"
                >
                  <way.icon className="size-4 text-ink-mute transition-colors group-hover:text-accent" aria-hidden />
                  <h3 className="mt-2.5 text-[14.5px] font-semibold text-ink">{way.title}</h3>
                  <p className="mt-1.5 flex-1 text-[13px] leading-6 text-ink-soft">{way.body}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] text-accent">
                    Open
                    <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <SectionHeader title="Verification states" description="Always icon + label, never colour alone." />
          <ul className="space-y-2 rounded-md border border-line bg-card p-3">
            {(Object.keys(STATUS_META) as (keyof typeof STATUS_META)[]).map((status) => (
                  <li
                    key={status}
                    className="flex items-start gap-2.5 border-b border-line/70 pb-2 last:border-b-0 last:pb-0"
                  >
                <StatusBadge status={status} />
                <span className="min-w-0 flex-1 text-[12.5px] leading-5.5 text-ink-soft">
                  {STATUS_META[status].description}
                </span>
              </li>
            ))}
          </ul>
          <Callout tone="info" title="Contributors are named by the repository" className="mt-4">
            <p>
              This build does not display a contributor list, because a hand-written one would be
              invented. Attribution comes from the commit history of the repository; the site links
              to it rather than pretending to know who contributed.
            </p>
          </Callout>
        </div>
      </section>

      <section id="revisions" className="mt-11 scroll-mt-24" aria-labelledby="revisions-title">
        <SectionHeader
          id="revisions-title"
          title="Content revisions"
          description={`Dates describe when the dataset entry changed — ${TOOLS.length} tool entries currently tracked. Upstream release dates are not implied.`}
        />
        <ul className="overflow-hidden rounded-md border border-line bg-card">
          {updates.map((update) => (
            <li key={`${update.type}-${update.slug}`} className="border-b border-line/70 last:border-b-0">
              <Link
                href={update.href}
                className="group flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 transition-colors hover:bg-elevated/60"
              >
                <span className="w-28 shrink-0 font-mono text-[11.5px] text-ink-mute">
                  {formatISODate(update.date)}
                </span>
                <span className="min-w-0 flex-1 text-[13.5px] font-medium text-ink">
                  {update.title}
                </span>
                <Badge tone="outline" className="hidden sm:inline-flex">
                  {update.kind}
                </Badge>
                <span className="text-[11.5px] text-ink-mute">{update.type}</span>
                <ArrowRight className="size-3.5 text-ink-mute transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex items-center gap-2 text-[12.5px] text-ink-mute">
          <CircleCheck className="size-3.5" aria-hidden />
          The same feed drives the homepage, so nothing is maintained twice.
        </p>
      </section>
    </PageContainer>
  );
}
