import { CATEGORIES } from "@/data/categories";
import { CHEATSHEETS } from "@/data/cheatsheets";
import { COMPARISONS } from "@/data/comparisons";
import { FAQS } from "@/data/faqs";
import { CONCEPTS, RESOURCES } from "@/data/learning";
import { ROADMAPS } from "@/data/roadmaps";
import { TOOLS } from "@/data/tools";

export const dynamic = "force-static";

function list(items: readonly string[] | undefined): string {
  return items?.length ? items.map((item) => `- ${item}`).join("\n") : "";
}

function codeBlock(value: string, language = "text"): string {
  return `\n\n\`\`\`${language}\n${value}\n\`\`\``;
}

function valueText(value: string | boolean | { text: string; note?: string }): string {
  if (typeof value === "object") {
    return value.note ? `${value.text} (${value.note})` : value.text;
  }
  return String(value);
}

function buildFullContent(): string {
  const sections = [
    "# CyberAtlas Tool Directory: Full Content Bundle\n\n> Structured, curated cybersecurity tool documentation, commands, examples, concepts, comparisons, and learning paths. Use tools only on systems you own or are explicitly authorized to test.\n",
    `## Directory Categories\n\n${CATEGORIES.map((category) => `### ${category.name}\n\n${category.description}\n\n${category.subcategories.map((subcategory) => `- ${subcategory.name}: ${subcategory.description}`).join("\n")}`).join("\n\n")}`,
    `## Tools\n\n${TOOLS.map((tool) => {
      const parts = [
        `### ${tool.name}\n\n[Canonical page](${tool.docsPath})\n\n${tool.shortDescription}\n\n${tool.description.join("\n\n")}`,
        `Category: ${tool.categoryName}${tool.subcategoryName ? ` / ${tool.subcategoryName}` : ""}. Difficulty: ${tool.difficulty}. Platforms: ${tool.platforms.join(", ")}. Status: ${tool.status}.${tool.version ? ` Documented version: ${tool.version}.` : ""}`,
      ];

      if (tool.website) parts.push(`Website: ${tool.website}`);
      if (tool.repository) parts.push(`Repository: ${tool.repository}`);
      if (tool.documentation) parts.push(`Documentation: ${tool.documentation}`);

      const installs = tool.installation.map((install) => {
        const details = [
          `#### ${install.title} (${install.platform}, ${install.kind})`,
          install.description,
          install.commands?.length ? `Commands:\n${list(install.commands)}` : "",
          install.requirements?.length ? `Requirements:\n${list(install.requirements)}` : "",
          install.notes?.length ? `Notes:\n${list(install.notes)}` : "",
          install.sourceUrl ? `Source: ${install.sourceUrl}` : "",
        ].filter(Boolean);
        return details.join("\n\n");
      });
      if (installs.length) parts.push(`#### Installation\n\n${installs.join("\n\n")}`);

      const commands = tool.commands.map((command) => {
        const details = [
          `#### ${command.title}`,
          command.description,
          `Command:${codeBlock(command.command, command.shell ?? "text")}`,
          command.example ? `Example:${codeBlock(command.example, command.shell ?? "text")}` : "",
          command.expectedOutput ? `Illustrative output:${codeBlock(command.expectedOutput)}` : "",
          command.notes?.length ? `Notes:\n${list(command.notes)}` : "",
          command.warnings?.length ? `Warnings:\n${list(command.warnings)}` : "",
        ].filter(Boolean);
        return details.join("\n\n");
      });
      if (commands.length) parts.push(`#### Commands\n\n${commands.join("\n\n")}`);

      if (tool.examples?.length) {
        parts.push(`#### Worked Examples\n\n${tool.examples.map((example) => `##### ${example.title}\n\n${example.scenario}\n\n${example.steps.map((step) => `**${step.label}**${codeBlock(step.command, "bash")}`).join("\n\n")}\n\nOutcome: ${example.outcome}`).join("\n\n")}`);
      }
      if (tool.useCases?.length) parts.push(`#### Use Cases\n\n${tool.useCases.map((item) => `- **${item.title}:** ${item.description}${item.commands?.length ? `\n${list(item.commands)}` : ""}`).join("\n")}`);
      if (tool.commonErrors?.length) parts.push(`#### Common Errors\n\n${tool.commonErrors.map((error) => `- **${error.symptom}**\n  Causes: ${error.causes.join("; ")}\n  Solution: ${error.solution}${error.commands?.length ? `\n${list(error.commands)}` : ""}`).join("\n")}`);
      if (tool.tips?.length) parts.push(`#### Tips\n\n${list(tool.tips)}`);
      if (tool.alternatives?.length) parts.push(`#### Alternatives\n\n${list(tool.alternatives)}`);
      if (tool.references?.length) parts.push(`#### References\n\n${tool.references.map((reference) => `- [${reference.label}](${reference.url})${reference.note ? ` - ${reference.note}` : ""}`).join("\n")}`);
      return parts.join("\n\n");
    }).join("\n\n")}`,
    `## Roadmaps\n\n${ROADMAPS.map((roadmap) => `### ${roadmap.title}\n\n[Canonical page](/roadmaps/${roadmap.slug})\n\n${roadmap.description}\n\nAudience: ${roadmap.audience}. Difficulty: ${roadmap.difficulty}. Estimated duration: ${roadmap.estimatedDuration}.\n\nOutcome: ${roadmap.outcome}\n\nPrerequisites:\n${list(roadmap.prerequisites)}\n\n${roadmap.stages.map((stage) => `#### ${stage.number}. ${stage.title}\n\n${stage.description}\n\nDuration: ${stage.duration}\n\n${stage.topics?.length ? `Topics:\n${list(stage.topics.map((topic) => `${topic.label}${topic.href ? ` (${topic.href})` : ""}`))}\n\n` : ""}${stage.tools.length ? `Tools: ${stage.tools.map((slug) => `[${slug}](/tools/${slug})`).join(", ")}\n\n` : ""}${stage.exercises?.length ? `Exercises:\n${list(stage.exercises)}\n\n` : ""}${stage.resources?.length ? `Resources:\n${stage.resources.map((resource) => `- [${resource.label}](${resource.url})${resource.note ? ` - ${resource.note}` : ""}`).join("\n")}` : ""}`).join("\n\n")}`).join("\n\n")}`,
    `## Concepts\n\n${CONCEPTS.map((concept) => `### ${concept.title}\n\n[Canonical page](/learning/concepts/${concept.slug})\n\n${concept.question}\n\n${concept.summary}\n\nDifficulty: ${concept.difficulty}. Estimated reading time: ${concept.minutes} minutes.\n\n${concept.sections.map((section) => `#### ${section.heading}\n\n${section.paragraphs?.join("\n\n") ?? ""}${section.bullets?.length ? `\n\n${list(section.bullets)}` : ""}${section.code?.map((code) => codeBlock(code.value, code.language)).join("\n") ?? ""}${section.callout ? `\n\n> ${section.callout.text}` : ""}`).join("\n\n")}${concept.checkYourUnderstanding?.length ? `\n\n#### Check Your Understanding\n\n${concept.checkYourUnderstanding.map((item) => `**${item.question}**\n\n${item.answer}`).join("\n\n")}` : ""}`).join("\n\n")}`,
    `## Comparisons\n\n${COMPARISONS.map((comparison) => `### ${comparison.title}\n\n[Canonical page](/comparisons/${comparison.slug})\n\n${comparison.description}\n\n${comparison.verdictNote}\n\n${comparison.sides.map((side) => `#### ${side.tool}\n\n${side.summary}\n\nStrengths:\n${list(side.strengths)}\n\nLimitations:\n${list(side.limitations)}\n\nWhen to use:\n${list(side.whenToUse)}`).join("\n\n")}\n\n#### Feature Comparison\n\n${comparison.features.map((feature) => `- **${feature.group} / ${feature.feature}:** ${comparison.toolA}: ${valueText(feature.a)}; ${comparison.toolB}: ${valueText(feature.b)}${feature.notes ? ` (${feature.notes})` : ""}`).join("\n")}${comparison.workflowExamples?.length ? `\n\n#### Workflow Examples\n\n${comparison.workflowExamples.map((example) => `##### ${example.title}\n\n${example.note}${example.a ? `\n\n${comparison.toolA}:${codeBlock(example.a, "bash")}` : ""}${example.b ? `\n\n${comparison.toolB}:${codeBlock(example.b, "bash")}` : ""}`).join("\n\n")}` : ""}`).join("\n\n")}`,
    `## Cheatsheets\n\n${CHEATSHEETS.map((sheet) => `### ${sheet.title}\n\n[Canonical page](/cheatsheets/${sheet.slug})\n\n${sheet.description}\n\n${sheet.sections.map((section) => `#### ${section.title}\n\n${section.intro ?? ""}\n\n${section.entries.map((entry) => `- **${entry.label}:** \`${entry.command}\`${entry.note ? ` - ${entry.note}` : ""}`).join("\n")}`).join("\n\n")}`).join("\n\n")}`,
    `## Learning Resources\n\n${RESOURCES.map((resource) => `- **${resource.title}** (${resource.type}, ${resource.provider}): ${resource.description} [Resource](${resource.url})`).join("\n")}`,
    `## FAQs\n\n${FAQS.map((faq) => `### ${faq.q}\n\n${faq.a.join("\n\n")}${faq.bullets?.length ? `\n\n${list(faq.bullets)}` : ""}${faq.links?.length ? `\n\nRelated links: ${faq.links.map((link) => `[${link.label}](${link.href})`).join(", ")}` : ""}`).join("\n\n")}`,
  ];

  return `${sections.join("\n\n---\n\n")}\n`;
}

export function GET(): Response {
  return new Response(buildFullContent(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}