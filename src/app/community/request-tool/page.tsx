import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageContainer } from "@/components/layout/PageContainer";
import { DraftManager } from "@/components/community/DraftManager";
import { CATEGORIES } from "@/data/categories";
import { TOOLS } from "@/data/tools";

export const metadata: Metadata = {
  title: "Request a Tool",
  description:
    "Draft a tool request for the CyberAtlas directory. Drafts are stored locally in your browser and copied into the repository.",
  alternates: { canonical: "/community/request-tool" },
};

export default async function RequestToolPage({
  searchParams,
}: {
  searchParams: Promise<{ tool?: string; category?: string }>;
}) {
  const { tool, category } = await searchParams;

  return (
    <PageContainer width="content" className="py-7 sm:py-9">
      <Breadcrumbs
        items={[
          { label: "Community", href: "/community" },
          { label: "Request a tool" },
        ]}
        className="mb-5"
      />
      <header className="border-b border-line pb-5">
        <p className="font-mono text-[11px] tracking-[0.14em] text-ink-mute uppercase">
          Community · request
        </p>
        <h1 className="mt-1.5 text-[26px] leading-tight font-semibold text-ink sm:text-[32px]">
          Request a tool entry
        </h1>
        <p className="mt-2.5 max-w-2xl text-[14.5px] leading-7 text-ink-soft">
          Describe what should be documented and why it matters. This form builds a reviewable
          draft, stores it in this browser, and gives you markdown to paste into the repository —
          there is no server in this build, so nothing is transmitted.
        </p>
        {TOOLS.length ? (
          <p className="mt-3 text-[12.5px] text-ink-mute">
            {TOOLS.length} entries exist already; check{" "}
            <a href="/tools" className="text-accent-blue hover:underline">
              the directory
            </a>{" "}
            before requesting a duplicate.
          </p>
        ) : null}
      </header>

      <div className="mt-7">
        <DraftManager
          kind="tool-request"
          heading="What should we document?"
          description="One tool per draft. Concrete scope makes review fast: the official source, the commands you use most, and where it belongs in the category tree."
          initialValues={{ tool: tool ?? "", category: category ?? "" }}
          titleMode="tool-request"
          fields={[
            {
              name: "name",
              label: "Tool name",
              type: "text",
              required: true,
              placeholder: "e.g. feroxbuster",
            },
            {
              name: "tool",
              label: "Related existing entry",
              type: "select",
              options: TOOLS.map((t) => ({ value: t.slug, label: `${t.name} — ${t.shortDescription}` })),
              help: "Optional. Links the request to an entry a reviewer can extend instead.",
            },
            {
              name: "category",
              label: "Category",
              type: "select",
              options: CATEGORIES.map((c) => ({ value: c.slug, label: c.name })),
            },
            {
              name: "source",
              label: "Official documentation or repository",
              type: "text",
              required: true,
              placeholder: "https://…",
              help: "Content without a source cannot be marked verified.",
            },
            {
              name: "why",
              label: "Why it belongs here",
              type: "textarea",
              required: true,
              placeholder: "What task does it cover that the current entries do not?",
            },
            {
              name: "depth",
              label: "What to document first",
              type: "textarea",
              placeholder: "Install steps for Linux/macOS, the 6 commands you use weekly, and the two errors everyone hits.",
            },
          ]}
        />
      </div>
    </PageContainer>
  );
}
