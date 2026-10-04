import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { SITE } from "@/lib/constants";

interface DocPage {
  title: string;
  eyebrow: string;
  lede: string;
  sections: { heading: string; paragraphs?: string[]; bullets?: string[] }[];
  callout?: { tone: "info" | "warning" | "tip"; title: string; text: string };
  badge?: string;
}

/**
 * Static policy pages share one template; content is written here rather than
 * scattered across near-duplicate route files.
 */
const PAGES: Record<string, DocPage> = {
  verification: {
    title: "Verification",
    eyebrow: "Project · trust model",
    badge: "process",
    lede: "What the badge on an entry is claiming, and what it is not.",
    sections: [
      {
        heading: "The four states",
        bullets: [
          "Verified — a maintainer read the entry against the tool's own documentation and confirmed the commands, install paths and platform claims for the recorded version.",
          "Community — contributed and structurally valid (it type-checks, links resolve, no placeholder text), but not independently re-checked.",
          "Needs review — known to possibly lag upstream. Treat every flag on the page as unconfirmed.",
          "Outdated / Deprecated — kept for reference; not the recommended path.",
        ],
      },
      {
        heading: "What verification is not",
        paragraphs: [
          "It is not an endorsement of the tool, an audit of its source code, or a guarantee that a command is safe in your environment. It is a statement about the accuracy of this documentation at the recorded revision.",
          "Verification never extends to results. Whether a command produces what you expect depends on version, privileges, target configuration and your position on the network.",
        ],
      },
      {
        heading: "Re-verification triggers",
        bullets: [
          "A contributor reports a mismatch with current upstream behaviour.",
          "A documented command's syntax moved between major versions.",
          "An install method disappears from a distribution's repository.",
          "A tool changes licence model or stops being maintained.",
        ],
      },
      {
        heading: "Dates",
        paragraphs: [
          `Entries carry a last-revised date for the dataset (${SITE.datasetRevision} is the current revision). There are no per-entry “verified on” dates, because that data would be invented. When precision matters, the upstream changelog is the reference — every tool page links to it.`,
        ],
      },
    ],
    callout: {
      tone: "warning",
      title: "If a badge and reality disagree",
      text: "That is a bug in this project. Suggest an edit with the version you tested and the source; the status changes to Needs review until it is resolved.",
    },
  },
  sources: {
    title: "Sources",
    eyebrow: "Project · citation policy",
    badge: "provenance",
    lede: "Where the content comes from and how you can check it.",
    sections: [
      {
        heading: "Priority of sources",
        bullets: [
          "The tool's own repository and manual pages — the only authoritative description of behaviour.",
          "Official release notes and changelogs for version-dependent statements.",
          "Distribution package metadata for install claims (which package provides which binary).",
          "Established reference works (RFCs, NIST publications, OWASP guidance) for concepts.",
        ],
      },
      {
        heading: "Explicitly not used",
        bullets: [
          "Blog posts restating another blog post.",
          "Tutorial text that a tool's current --help contradicts.",
          "Vendor marketing pages as a source for capability claims beyond their own product description.",
        ],
      },
      {
        heading: "How sources appear",
        paragraphs: [
          "Every tool page has a References section with what each link lets you verify. Where a page quotes a specific flag, the flag's meaning is described in the tool's own documentation — no source should be needed to trust a summary, so summaries stay short and link out.",
        ],
      },
      {
        heading: "Wordlists, addresses and sample data",
        paragraphs: [
          "Examples use RFC 5737 documentation ranges (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24) or private lab ranges, never live hosts. Example output is labelled as illustrative and must not be quoted as a guarantee.",
        ],
      },
    ],
    callout: {
      tone: "info",
      title: "Missing source on a page?",
      text: "Treat that entry as unverified and say so on the issue tracker; content without provenance is a documentation defect, not a stylistic choice.",
    },
  },
  "responsible-use": {
    title: "Legal & ethical use",
    eyebrow: "Project · boundaries",
    badge: "required reading",
    lede: "This is a reference for people with permission to test. What that means in practice.",
    sections: [
      {
        heading: "The rule",
        paragraphs: [
          "Testing a system you do not own, or do not have explicit written permission to test, is unlawful in most jurisdictions — including scans that “only” read a banner. Authorization is not a formality you clear before the interesting part starts; for network and wireless work it is the entire boundary.",
        ],
      },
      {
        heading: "Scope in concrete terms",
        bullets: [
          "Written permission naming the assets, the window and the techniques allowed.",
          "A rate agreed with whoever operates the target; a default wordlist run can degrade a small service.",
          "Data minimisation: never collect or retain personal data you did not need to prove a point.",
          "A stop condition: anything touching real user data, availability or a third party halts and gets reported immediately.",
        ],
      },
      {
        heading: "Where to practise instead",
        paragraphs: [
          "Use deliberately vulnerable applications you host yourself, CTF ranges, or vendor-provided labs. The Learning Hub lists practice environments; none of them require inventing targets.",
        ],
      },
      {
        heading: "What this site will not do",
        bullets: [
          "Execute commands for you, in a browser or on a server.",
          "Provide material aimed at access to systems without authorisation.",
          "Present disruption as entertainment, or frame tools as weapons.",
        ],
      },
    ],
    callout: {
      tone: "warning",
      title: "If you find something you should not have",
      text: "Stop, do not exfiltrate or demonstrate further, and report it to the owner the same day. That is also the correct answer in most professional codes of conduct.",
    },
  },
  privacy: {
    title: "Privacy",
    eyebrow: "Project · data handling",
    badge: "no tracking",
    lede: "There is no account system, no analytics and no server-side storage in this build. A few preferences live in your own browser.",
    sections: [
      {
        heading: "What is stored where",
        bullets: [
          "Your browser only (localStorage): your light/dark theme, your cookie choice, roadmap progress ticks and any drafts you save.",
          "Server: nothing about you. Content is static and rendered from the dataset.",
          "No cookies are set by the application itself. The cookie policy lists every storage key.",
          "Advertising may be shown; if an ad network is ever enabled it is loaded only after you accept, and the cookie policy is updated first.",
          "No analytics, pixels, fingerprinting or third-party embeds.",
        ],
      },
      {
        heading: "Clearing it",
        paragraphs: [
          "Delete drafts and progress in the UI where a control exists, or clear site data in your browser. Nothing persists on any server because there is nothing to persist to.",
        ],
      },
      {
        heading: "Fonts and external requests",
        paragraphs: [
          "The interface links a webfont stylesheet from a third-party CDN with a system-font fallback. If you want a build with zero third-party requests, self-host the two families and delete the link in src/app/layout.tsx — no other change is required.",
        ],
      },
      {
        heading: "Submissions",
        paragraphs: [
          "The request and correction forms do not transmit anything in this build; they assemble a draft you copy into the repository. If you later deploy a backend for submissions, this page must be rewritten to describe it.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms",
    eyebrow: "Project · licence and disclaimer",
    badge: "legal",
    lede: "Short, because the surface area is a documentation project.",
    sections: [
      {
        heading: "Content",
        paragraphs: [
          "Documentation text written for this project is offered for learning and reference. Tool names, logos, manuals and behaviour belong to their respective projects; each tool page links to its own licence and upstream.",
        ],
      },
      {
        heading: "Disclaimer",
        bullets: [
          "Provided “as is”, without warranty of any kind, express or implied.",
          "No liability for damage arising from following documented commands, in a lab or anywhere else.",
          "Version-dependent detail may be wrong for your environment; the linked upstream is authoritative.",
        ],
      },
      {
        heading: "Trademarks and third-party links",
        paragraphs: [
          "Mentioning a product is not a relationship with it. External links exist for verification; this project does not control, endorse or review their content beyond what was needed to document a claim.",
        ],
      },
      {
        heading: "Contributions",
        paragraphs: [
          "Contributions are submitted under the project's licence, and are reviewed for accuracy and framing before publication. Verified status is a statement about documentation accuracy only.",
        ],
      },
    ],
    callout: {
      tone: "info",
      title: "Not legal advice",
      text: "If you are deploying this as part of an organisation's internal documentation, have that organisation's counsel review the licence and disclaimer terms before publication.",
    },
  },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) return { title: "Page not found", robots: { index: false } };
  return {
    title: page.title,
    description: page.lede,
    alternates: { canonical: `/about/${slug}` },
  };
}

export default async function AboutDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();

  const related = Object.entries(PAGES)
    .filter(([key]) => key !== slug)
    .slice(0, 4);

  return (
    <PageContainer width="reading" className="py-7 sm:py-9">
      <Breadcrumbs
        items={[
          { label: "About", href: "/about" },
          { label: page.title },
        ]}
        className="mb-5"
      />

      <header className="border-b border-line pb-5">
        <p className="font-mono text-[11px] tracking-[0.14em] text-ink-mute uppercase">
          {page.eyebrow}
        </p>
        <h1 className="mt-1.5 text-[28px] leading-tight font-semibold text-ink sm:text-[32px]">
          {page.title}
        </h1>
        <p className="mt-2.5 text-[15px] leading-7 text-ink-soft">{page.lede}</p>
        {page.badge ? <Badge tone="outline" className="mt-3">{page.badge}</Badge> : null}
      </header>

      <div className="mt-7 space-y-8">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <SectionHeader title={section.heading} />
            {section.paragraphs?.map((paragraph, index) => (
              <p key={index} className="mt-2 text-[14.5px] leading-7.5 text-ink-soft first:mt-0">
                {paragraph}
              </p>
            ))}
            {section.bullets?.length ? (
              <ul className="mt-2.5 space-y-2">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2.5 text-[14px] leading-7 text-ink-soft">
                    <span className="mt-3 size-1 shrink-0 rounded-full bg-accent/70" aria-hidden />
                    <span className="min-w-0">{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      {page.callout ? (
        <Callout tone={page.callout.tone} title={page.callout.title} className="mt-8">
          <p>{page.callout.text}</p>
        </Callout>
      ) : null}

      <nav aria-label="Related pages" className="mt-10 border-t border-line pt-5">
        <h2 className="mb-2.5 font-mono text-[10.5px] tracking-[0.16em] text-ink-mute uppercase">
          Also in the project
        </h2>
        <ul className="flex flex-wrap gap-2">
          {related.map(([key, value]) => (
            <li key={key}>
              <Link
                href={`/about/${key}`}
                className="inline-flex items-center gap-1.5 rounded-[5px] border border-line bg-card px-2.5 py-1.5 text-[12.5px] text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
              >
                {value.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </PageContainer>
  );
}
