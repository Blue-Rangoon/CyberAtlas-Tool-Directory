import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader, SectionHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { Badge } from "@/components/ui/Badge";
import { ToolGlyph } from "@/components/tools/CommandBlock";
import { COMPARISONS } from "@/data/comparisons";
import { getTool } from "@/data/tools";
import { formatISODate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tool Comparisons",
  description:
    "Side-by-side comparisons of security tools: documented behaviour, workflow differences and when each one is the better fit. No winner badges.",
  alternates: { canonical: "/comparisons" },
};

export default function ComparisonsPage() {
  return (
    <PageContainer width="wide" className="py-7 sm:py-9">
      <PageHeader
        eyebrow="Explore"
        title="Tool comparisons"
        description="Two tools, one job, spelled out attribute by attribute. These pages describe documented behaviour and trade-offs so you can decide against your own constraints."
        meta={
          <span className="font-mono text-[12px] text-ink-mute">
            {COMPARISONS.length} comparisons
          </span>
        }
      />

      <div className="mt-6">
        <Callout tone="info" title="Why there is no 'winner' column">
          <p>
            Ordering two tools depends on the target, the network, the licence and the team. Any
            page that ignored that would be marketing. Where a value depends on version or
            hardware, the row says so instead of inventing a number.
          </p>
        </Callout>
      </div>

      <section className="mt-8" aria-label="All comparisons">
        <SectionHeader title="Available comparisons" />
        <ul className="grid gap-3 md:grid-cols-2">
          {COMPARISONS.map((comparison) => {
            const a = getTool(comparison.toolA);
            const b = getTool(comparison.toolB);
            return (
              <li key={comparison.slug}>
                <Card padded={false} className="group h-full transition-colors hover:border-line-strong">
                  <Link href={`/comparisons/${comparison.slug}`} className="flex h-full flex-col p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5">
                        {a ? <ToolGlyph iconKey={a.icon} /> : null}
                        <span className="text-[14.5px] font-semibold text-ink">{comparison.toolA ?? a?.name}</span>
                      </span>
                      <span className="font-mono text-[11px] text-ink-mute">vs</span>
                      <span className="flex items-center gap-1.5">
                        {b ? <ToolGlyph iconKey={b.icon} /> : null}
                        <span className="text-[14.5px] font-semibold text-ink">{comparison.toolB ?? b?.name}</span>
                      </span>
                      <ArrowRight className="ml-auto size-4 text-ink-mute transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
                    </div>
                    <p className="mt-2.5 flex-1 text-[13.5px] leading-6 text-ink-soft">
                      {comparison.description}
                    </p>
                    <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-line/70 pt-3">
                      <Badge tone="outline" mono>
                        {comparison.features.length} attributes
                      </Badge>
                      <span className="text-[11.5px] text-ink-mute">
                        Revised {formatISODate(comparison.lastUpdated)}
                      </span>
                    </div>
                  </Link>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="mt-8 text-[13px] text-ink-mute">
        Missing a pairing?{" "}
        <Link href="/community/request-tool" className="text-accent-blue hover:underline">
          Request a comparison
        </Link>{" "}
        — the tool pages it references must be documented first.
      </p>
    </PageContainer>
  );
}
