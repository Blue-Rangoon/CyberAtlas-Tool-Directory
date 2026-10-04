import Link from "next/link";
import { CircleCheck, ExternalLink, Info } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageContainer } from "@/components/layout/PageContainer";
import { CopyLinkButton } from "@/components/common/CopyLinkButton";
import { DocSection, StepList } from "@/components/common/DocSection";
import { Callout } from "@/components/ui/Callout";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { LinkButton } from "@/components/ui/Button";
import { CommandBlock, CommandRow } from "@/components/tools/CommandBlock";
import type { ResolvedTool } from "@/types";
import { ErrorAccordion } from "@/components/tools/ErrorAccordion";
import { InstallationSection } from "@/components/tools/InstallationSection";
import { AlternativesBanner, ComparisonLinks, RelatedTools } from "@/components/tools/RelatedTools";
import { ToolDocNav, type DocSection as NavSection } from "@/components/tools/ToolDocNav";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { getCheatsheet } from "@/data/cheatsheets";
import { cn } from "@/lib/utils";

/**
 * The tool detail template: documentation first, everything derived from the
 * typed entry. Sections that have no data render an explicit gap rather than
 * filler text.
 */
export function ToolDocsView({ tool }: { tool: ResolvedTool }) {
  const sheet = getCheatsheet(tool.slug);

  const sections: NavSection[] = [
    { id: "overview", label: "Overview" },
    { id: "installation", label: "Installation" },
    { id: "commands", label: "Commands", count: tool.commands.length },
    ...(tool.examples?.length ? [{ id: "examples", label: "Worked examples", count: tool.examples.length }] : []),
    ...(tool.useCases?.length ? [{ id: "use-cases", label: "Use cases", count: tool.useCases.length }] : []),
    ...(tool.commonErrors?.length ? [{ id: "errors", label: "Common errors", count: tool.commonErrors.length }] : []),
    ...(tool.tips?.length ? [{ id: "tips", label: "Tips" }] : []),
    ...(tool.alternatives?.length ? [{ id: "alternatives", label: "Alternatives" }] : []),
    { id: "references", label: "References" },
  ];

  return (
    <PageContainer width="content" className="py-6 sm:py-8">
      <Breadcrumbs
        items={[
          { label: "Tools", href: "/tools" },
          { label: tool.categoryName, href: `/tools/${tool.categorySlug}` },
          ...(tool.subcategoryName
            ? [
                {
                  label: tool.subcategoryName,
                  href: `/tools/${tool.categorySlug}/${tool.subcategory}`,
                },
              ]
            : []),
          { label: tool.name },
        ]}
        className="mb-5"
      />

      <ToolHeader tool={tool} />

      <div className="mt-7 flex flex-col gap-7 lg:flex-row lg:gap-9">
        <ToolDocNav sections={sections} />

        <div className="min-w-0 flex-1 space-y-10">
          <DocSection
            id="overview"
            title="Overview"
            aside={<span className="font-mono text-[11.5px]">{tool.commandCount} commands documented</span>}
          >
            <div className="space-y-3.5">
              {tool.description.map((paragraph, index) => (
                <p
                  key={index}
                  className={cn(
                    "max-w-3xl text-[14.5px] leading-7 text-ink-soft",
                    index === 0 && "text-[15.5px] leading-7.5 text-ink/95",
                  )}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Fact label="Supported platforms" value={tool.platforms.length} note="Documented install or usage guidance" />
              <Fact
                label="Learning curve"
                value={tool.difficulty}
                note="Difficulty of becoming productive, not of the underlying theory"
              />
              <Fact label="Tags" value={tool.tags.slice(0, 6).join(", ")} />
              <Fact
                label="Dataset entry"
                value={`${tool.slug}.ts`}
                note={`Reviewed ${tool.lastUpdated}`}
              />
            </div>

            {sheet ? (
              <Callout tone="tip" title="There is a one-page version">
                <p>
                  The{" "}
                  <Link href={`/cheatsheets/${sheet.slug}`} className="text-accent hover:underline">
                    {sheet.title} cheatsheet
                  </Link>{" "}
                  collects these commands in a printable list.
                </p>
              </Callout>
            ) : null}

            <Callout tone="info" title="Scope">
              <p>
                Commands here are documentation. Run them only against systems you own or are
                explicitly authorized to test, in an agreed window, with the owner informed.
              </p>
            </Callout>
          </DocSection>

          <DocSection id="installation" title="Installation" lede="Grouped by platform. Elevation requirements are marked per method.">
            <InstallationSection
              methods={tool.installation}
              toolName={tool.name}
              lastUpdated={tool.lastUpdated}
            />
          </DocSection>

          <DocSection
            id="commands"
            title="Commands"
            lede="Every command carries its purpose, an example where useful, and the limitations that change how you should read the output."
            aside={<span className="font-mono text-[11.5px]">{tool.commands.length} entries</span>}
          >
            {tool.commands.length ? (
              <div className="space-y-3.5">
                {tool.commands.map((command, index) => (
                  <CommandBlock key={command.id} command={command} toolName={tool.name} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No commands documented yet"
                description={`${tool.name} is listed in the directory, but nobody has written the command section. The upstream documentation is the authoritative source until then.`}
                actions={
                  <LinkButton href={`/community/suggest-edit?tool=${tool.slug}`} size="sm">
                    Add commands
                  </LinkButton>
                }
              />
            )}
          </DocSection>

          {tool.examples?.length ? (
            <DocSection id="examples" title="Worked examples" lede="Sequences of commands in the order they are used, with what you should expect to learn from each.">
              <div className="space-y-4">
                {tool.examples.map((example) => (
                  <article key={example.title} className="rounded-md border border-line bg-card p-4">
                    <h3 className="text-[15px] font-semibold text-ink">{example.title}</h3>
                    <p className="mt-1 text-[13.5px] leading-6 text-ink-soft">{example.scenario}</p>
                    <div className="mt-3.5">
                      <StepList
                        steps={example.steps.map((step) => (
                          <div key={`${example.title}-${step.label}`}>
                            <p className="mb-1 text-[13px] text-ink-soft">{step.label}</p>
                            <CommandRow command={step.command} />
                          </div>
                        ))}
                      />
                    </div>
                    <p className="mt-3.5 flex gap-2 border-t border-line/70 pt-3 text-[13px] leading-6 text-ink-soft">
                      <CircleCheck className="mt-1 size-3.5 shrink-0 text-success" aria-hidden />
                      {example.outcome}
                    </p>
                  </article>
                ))}
              </div>
            </DocSection>
          ) : null}

          {tool.useCases?.length ? (
            <DocSection id="use-cases" title="What it is used for">
              <ul className="grid gap-3 sm:grid-cols-2">
                {tool.useCases.map((useCase) => (
                  <li key={useCase.title} className="rounded-md border border-line bg-card p-3.5">
                    <h3 className="text-[14px] font-semibold text-ink">{useCase.title}</h3>
                    <p className="mt-1 text-[13px] leading-6 text-ink-soft">{useCase.description}</p>
                  </li>
                ))}
              </ul>
            </DocSection>
          ) : null}

          {tool.commonErrors?.length ? (
            <DocSection id="errors" title="Common errors" lede="Symptoms you will actually hit, with the cause and the legitimate fix.">
              <ErrorAccordion entries={tool.commonErrors} />
            </DocSection>
          ) : null}

          {tool.tips?.length ? (
            <DocSection id="tips" title="Tips">
              <ul className="space-y-2">
                {tool.tips.map((tip) => (
                  <li key={tip} className="flex gap-2.5 rounded-md border border-line bg-card px-3.5 py-2.5 text-[13.5px] leading-6 text-ink-soft">
                    <Info className="mt-1 size-3.5 shrink-0 text-ink-mute" aria-hidden />
                    {tip}
                  </li>
                ))}
              </ul>
            </DocSection>
          ) : null}

          {tool.alternatives?.length ? (
            <DocSection id="alternatives" title="Alternatives & comparisons">
              <div className="space-y-5">
                <RelatedTools tool={tool} variant="alternatives" />
                <div>
                  <p className="mb-2 font-mono text-[10.5px] tracking-[0.14em] text-ink-mute uppercase">
                    Side-by-side
                  </p>
                  <ComparisonLinks tool={tool} />
                </div>
              </div>
            </DocSection>
          ) : null}

          <DocSection id="references" title="References" lede="Where to verify anything on this page. External links open in a new tab.">
            {tool.references?.length ? (
              <ul className="space-y-2">
                {tool.references.map((reference) => (
                  <li key={reference.url}>
                    <a
                      href={reference.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 rounded-md border border-line bg-card px-3.5 py-2.5 transition-colors hover:border-line-strong hover:bg-elevated/50"
                    >
                      <ExternalLink className="mt-1 size-3.5 shrink-0 text-ink-mute" aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13.5px] font-medium text-ink group-hover:text-accent">
                          {reference.label}
                        </span>
                        {reference.note ? (
                          <span className="block text-[12.5px] leading-5.5 text-ink-mute">
                            {reference.note}
                          </span>
                        ) : null}
                      </span>
                      <Badge tone="outline" className="hidden sm:inline-flex">
                        external
                      </Badge>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No sources recorded"
                description="This entry has no reference links yet. That is a gap: content without a source should be treated as unverified."
                actions={
                  <LinkButton href={`/community/suggest-edit?tool=${tool.slug}`} size="sm">
                    Add a source
                  </LinkButton>
                }
              />
            )}

            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-4">
              <span className="text-[12.5px] text-ink-mute">Found something wrong?</span>
              <LinkButton href={`/community/suggest-edit?tool=${tool.slug}`} size="sm" variant="secondary">
                Suggest an edit
              </LinkButton>
              <LinkButton href={`/tools?category=${tool.categorySlug}`} size="sm" variant="ghost">
                More in {tool.categoryName}
              </LinkButton>
              <CopyLinkButton />
            </div>
          </DocSection>
        </div>
      </div>

      <div className="mt-12">
        <AlternativesBanner tool={tool} />
      </div>
    </PageContainer>
  );
}

function Fact({ label, value, note }: { label: string; value: React.ReactNode; note?: string }) {
  return (
    <div className="rounded-md border border-line bg-surface px-3.5 py-2.5">
      <p className="font-mono text-[10px] tracking-[0.14em] text-ink-mute uppercase">{label}</p>
      <p className="mt-1 text-[13.5px] font-medium text-ink capitalize">{value}</p>
      {note ? <p className="mt-0.5 text-[11.5px] leading-5 text-ink-mute">{note}</p> : null}
    </div>
  );
}


