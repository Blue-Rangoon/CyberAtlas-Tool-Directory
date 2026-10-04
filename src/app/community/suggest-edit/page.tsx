import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageContainer } from "@/components/layout/PageContainer";
import { DraftManager } from "@/components/community/DraftManager";
import { TOOLS } from "@/data/tools";

export const metadata: Metadata = {
  title: "Suggest an Edit",
  description:
    "Correct or extend a CyberAtlas dataset entry: outdated commands, wrong install steps, missing caveats or absent sources.",
  alternates: { canonical: "/community/suggest-edit" },
};

const SECTIONS = [
  "Overview",
  "Installation",
  "Commands",
  "Worked examples",
  "Common errors",
  "Tips",
  "Alternatives & related",
  "References / sources",
  "Metadata (version, status, platforms)",
];

export default async function SuggestEditPage({
  searchParams,
}: {
  searchParams: Promise<{ tool?: string; topic?: string }>;
}) {
  const { tool, topic } = await searchParams;

  return (
    <PageContainer width="content" className="py-7 sm:py-9">
      <Breadcrumbs
        items={[
          { label: "Community", href: "/community" },
          { label: "Suggest an edit" },
        ]}
        className="mb-5"
      />
      <header className="border-b border-line pb-5">
        <p className="font-mono text-[11px] tracking-[0.14em] text-ink-mute uppercase">
          Community · correction
        </p>
        <h1 className="mt-1.5 text-[26px] leading-tight font-semibold text-ink sm:text-[32px]">
          Suggest an edit
        </h1>
        <p className="mt-2.5 max-w-2xl text-[14.5px] leading-7 text-ink-soft">
          Corrections are the most useful contributions this project can receive. Name the entry,
          the section and the source that contradicts it — the draft you build here converts into a
          precise edit for the data file.
        </p>
      </header>

      <div className="mt-7">
        <DraftManager
          kind="edit"
          heading="What is wrong, and what is right?"
          description="A good draft quotes the current text, states the correction, and links the upstream source that proves it. Add the version you checked."
          initialValues={{ tool: tool ?? "", topic: topic ?? "" }}
          titleMode="edit"
          fields={[
            {
              name: "tool",
              label: "Entry",
              type: "select",
              required: true,
              options: TOOLS.map((t) => ({ value: t.slug, label: `${t.name} (${t.categoryName})` })),
              help: "Only tool entries are selectable; roadmap and comparison content is edited the same way in the repository.",
            },
            {
              name: "section",
              label: "Section",
              type: "select",
              options: SECTIONS.map((section) => ({ value: section, label: section })),
            },
            {
              name: "issue",
              label: "What is incorrect or missing",
              type: "textarea",
              required: true,
              placeholder: "The apt package name is wrong on Debian 13; the install fails with “Unable to locate package”.",
            },
            {
              name: "correction",
              label: "Suggested replacement text",
              type: "textarea",
              placeholder: "sudo apt install libimage-exiftool-perl",
            },
            {
              name: "source",
              label: "Source proving it",
              type: "text",
              required: true,
              placeholder: "https://upstream.docs/example — plus the version you checked",
            },
            {
              name: "version",
              label: "Tool version you verified against",
              type: "text",
              placeholder: "e.g. 7.95, or “package in Debian 13”",
              help: "Optional but valuable: it lets a reviewer date the claim honestly.",
            },
          ]}
        />
      </div>
    </PageContainer>
  );
}
