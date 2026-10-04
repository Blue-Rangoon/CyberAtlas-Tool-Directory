import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeader } from "@/components/common/PageHeader";
import { Callout } from "@/components/ui/Callout";
import { LinkButton } from "@/components/ui/Button";
import { CommandRow } from "@/components/tools/CommandBlock";

export const metadata: Metadata = {
  title: "Contribution Guide",
  description:
    "How to add a tool, extend a command entry, add a cheatsheet or a roadmap to the CyberAtlas dataset.",
  alternates: { canonical: "/community/contribute" },
};

const ADD_TOOL = [
  "Create src/data/tools/<slug>.ts exporting a single typed `Tool` object.",
  "Set `category` and `subcategory` to existing slugs — add a subcategory in src/data/categories.ts first if the topic is genuinely new.",
  "Fill `installation` per platform. A method that needs sudo or Administrator must set requiresElevation.",
  "Add `commands` with `title`, `description` and `command` for each. A command without a description is rejected in review.",
  "Record `commonErrors`, `tips`, `alternatives` and `relatedTools` by slug so cross-links resolve automatically.",
  "List `references`: official docs, the repository, the man page. Content without a source stays unverified.",
  "Export the object from src/data/tools/index.ts and add it to RAW_TOOLS.",
  "Run the type check and build; the data model will catch most omissions for you.",
];

const TYPES = [
  {
    name: "Command",
    file: "src/types/common.ts",
    body: "id, title, description, command, shell, platform, difficulty, example, expectedOutput, notes[], warnings[], tags[]",
  },
  {
    name: "InstallationMethod",
    file: "src/types/common.ts",
    body: "platform, method, title, kind (recommended|alternative|manual), commands[], requirements[], notes[], requiresElevation, official, sourceUrl",
  },
  {
    name: "Roadmap / RoadmapStage",
    file: "src/types/learning.ts",
    body: "stages carry topics (optionally linking to internal pages), tools by slug, exercises and resources",
  },
  {
    name: "Comparison",
    file: "src/types/learning.ts",
    body: "features[] grouped by a `group` string; values may be boolean, string, or { text, note }",
  },
];

export default function ContributePage() {
  return (
    <PageContainer width="content" className="py-7 sm:py-9">
      <Breadcrumbs
        items={[
          { label: "Community", href: "/community" },
          { label: "Contribution guide" },
        ]}
        className="mb-5"
      />

      <header className="border-b border-line pb-6">
        <p className="font-mono text-[11px] tracking-[0.14em] text-ink-mute uppercase">
          Contribution guide
        </p>
        <h1 className="mt-1.5 text-[26px] leading-tight font-semibold text-ink sm:text-[32px]">
          Content is data here
        </h1>
        <p className="mt-2.5 max-w-2xl text-[14.5px] leading-7 text-ink-soft">
          There is no CMS and no markdown to guess at. Pages are rendered from typed objects, so a
          contributor edits a data file and the UI picks it up: navigation, counts, search, filters
          and cross-links all derive from the same entry.
        </p>
      </header>

      <section className="mt-8" aria-labelledby="add-tool">
        <SectionHeader id="add-tool" title="Add a tool" description="Eight steps, in order." />
        <ol className="space-y-2">
          {ADD_TOOL.map((line, index) => (
            <li key={line} className="flex gap-3 rounded-md border border-line bg-card px-3.5 py-2.5">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-line bg-elevated font-mono text-[10.5px] text-ink-soft">
                {index + 1}
              </span>
              <span className="min-w-0 text-[13.5px] leading-6 text-ink-soft">{line}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-9" aria-labelledby="commands-section">
        <SectionHeader
          id="commands-section"
          title="Writing a command entry"
          description="The bar is simple: a reader must understand what the command does, when it needs privileges, and how to read the output."
        />
        <div className="space-y-3">
          <CommandRow
            command={`{
  id: "service-version",
  title: "Service version detection",
  description: "Probes each open port and reports the banner or fingerprint it receives.",
  command: "nmap -sV 192.0.2.10",
  shell: "bash",
  notes: ["Version probes can disturb fragile embedded services."],
}`}
          />
          <ul className="grid gap-2 sm:grid-cols-2">
            {[
              ["Do", "Use documentation addresses (192.0.2.0/24, 203.0.113.0/24) in examples."],
              ["Do", "Mark privileges: requiresElevation on an install method, warnings[] on a command."],
              ["Don't", "Copy the manual. Summarise and link."],
              ["Don't", "Invent versions, dates, star counts or benchmarks."],
            ].map(([kind, text]) => (
              <li
                key={text}
                className="flex items-start gap-2 rounded-md border border-line bg-card px-3 py-2 text-[13px] leading-6 text-ink-soft"
              >
                <span
                  className={
                    kind === "Do"
                      ? "mt-1.5 size-1.5 shrink-0 rounded-full bg-success"
                      : "mt-1.5 size-1.5 shrink-0 rounded-full bg-danger"
                  }
                  aria-hidden
                />
                <span>
                  <strong className="font-semibold text-ink">{kind}</strong> — {text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="types" className="mt-9 scroll-mt-24" aria-labelledby="types-title">
        <SectionHeader
          id="types-title"
          title="Data model at a glance"
          description="Everything lives in src/types; components never invent their own shape."
        />
        <ul className="grid gap-3 sm:grid-cols-2">
          {TYPES.map((type) => (
            <li key={type.name} className="rounded-md border border-line bg-card p-3.5">
              <h3 className="font-mono text-[13px] text-ink">{type.name}</h3>
              <p className="mt-1 text-[12px] text-ink-mute">{type.file}</p>
              <p className="mt-2 text-[13px] leading-6 text-ink-soft">{type.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="frontend" className="mt-9 scroll-mt-24" aria-labelledby="frontend-title">
        <SectionHeader
          id="frontend-title"
          title="Frontend contributions"
          description="Components are primitives, pages are compositions, and design tokens live in one file."
        />
        <ul className="space-y-2 text-[13.5px] leading-6.5 text-ink-soft">
          <li>
            <strong className="text-ink">Tokens:</strong> src/app/globals.css declares every colour,
            font and motion. Components use semantic classes (bg-card, border-line, text-ink-soft) —
            raw hex in a component is a review comment.
          </li>
          <li>
            <strong className="text-ink">Primitives:</strong> Button, Card, Badge, Tabs, Callout,
            Disclosure, CodeSurface, States. Reuse them instead of restyling locally.
          </li>
          <li>
            <strong className="text-ink">Motion:</strong> transform and opacity only, under 200 ms
            for micro-interactions, and every decorative animation is switched off by the
            prefers-reduced-motion block.
          </li>
          <li>
            <strong className="text-ink">Breakpoints:</strong> each component decides where it
            reflows. Tool grids go 1 → 2 → 3 → 4; the docs sidebar only exists at lg and above.
          </li>
          <li>
            <strong className="text-ink">Accessibility:</strong> real buttons and links, labelled
            dialogs, focus trapped in overlays, visible focus ring, no state communicated by colour
            alone.
          </li>
        </ul>
      </section>

      <Callout tone="warning" title="Before you open a change" className="mt-9">
        <p>
          Every command must be traceable to the tool's own documentation or source. State the
          version you checked. If you cannot verify something, leave the field out — optional fields
          exist so that absence is honest rather than filled with a guess.
        </p>
      </Callout>

      <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-line pt-6">
        <LinkButton href="/community" variant="ghost" leadingIcon={<ArrowLeft className="size-3.5" />}>
          Community overview
        </LinkButton>
        <LinkButton href="/community/request-tool" variant="secondary">
          Request a tool instead
        </LinkButton>
        <Link
          href="/about/verification"
          className="text-[13px] text-accent-blue transition-colors hover:underline"
        >
          What “Verified” means here
        </Link>
      </div>
    </PageContainer>
  );
}
