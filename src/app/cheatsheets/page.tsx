import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Printer } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader, SectionHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { getIcon } from "@/lib/icons";
import { CHEATSHEETS, TOTAL_CHEATSHEET_ENTRIES } from "@/data/cheatsheets";
import { getTool } from "@/data/tools";
import { formatISODate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cheatsheets",
  description: `${CHEATSHEETS.length} printable security reference sheets covering ${TOTAL_CHEATSHEET_ENTRIES} commands, each copyable and grouped by task.`,
  alternates: { canonical: "/cheatsheets" },
};

export default function CheatsheetsPage() {
  return (
    <PageContainer width="wide" className="py-7 sm:py-9">
      <PageHeader
        eyebrow="Reference"
        title="Cheatsheets"
        description="Built for retrieval: one line per command, grouped by task, copyable, and printable without the interface chrome. Explanations live on the tool pages."
        meta={
          <span className="font-mono text-[12px] text-ink-mute">
            {CHEATSHEETS.length} sheets · {TOTAL_CHEATSHEET_ENTRIES} entries
          </span>
        }
      />

      <section className="mt-7" aria-label="All cheatsheets">
        <SectionHeader
          title="Available sheets"
          description="Every sheet is derived from the same typed content model as the directory, so entries never drift apart."
        />
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {CHEATSHEETS.map((sheet) => {
            const Icon = getIcon(sheet.icon);
            const entries = sheet.sections.reduce((n, s) => n + s.entries.length, 0);
            const tool = sheet.tool ? getTool(sheet.tool) : undefined;
            return (
              <li key={sheet.slug}>
                <Link
                  href={`/cheatsheets/${sheet.slug}`}
                  className="group flex h-full flex-col rounded-md border border-line bg-card p-4 transition-[border-color,transform,background-color] duration-150 hover:-translate-y-px hover:border-line-strong hover:bg-card-hover motion-reduce:transform-none"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="grid size-8 place-items-center rounded-[5px] border border-line bg-elevated text-ink-soft transition-colors group-hover:border-accent/35 group-hover:text-accent">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <h3 className="min-w-0 flex-1 truncate text-[15px] font-semibold text-ink">
                      {sheet.title}
                    </h3>
                    <ArrowRight className="size-4 shrink-0 text-ink-mute transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
                  </span>
                  <p className="mt-2 flex-1 text-[13px] leading-6 text-ink-soft">
                    {sheet.description}
                  </p>
                  <span className="mt-3 flex flex-wrap items-center gap-2 border-t border-line/70 pt-2.5">
                    <Badge tone="outline" mono>
                      {entries} entries
                    </Badge>
                    <Badge tone="neutral">{sheet.sections.length} groups</Badge>
                    {tool ? (
                      <span className="text-[11.5px] text-ink-mute">
                        pairs with{" "}
                        <span className="text-ink-soft group-hover:text-accent">{tool.name}</span>
                      </span>
                    ) : null}
                    <span className="ml-auto inline-flex items-center gap-1 text-[11.5px] text-ink-mute">
                      <Printer className="size-3" aria-hidden />
                      {formatISODate(sheet.lastUpdated)}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <Callout tone="tip" title="Print behaviour" className="mt-8">
        <p>
          Each sheet has a Print action that removes navigation, filters and copy buttons via print
          styles, so the paper version is the commands only.
        </p>
      </Callout>
    </PageContainer>
  );
}
