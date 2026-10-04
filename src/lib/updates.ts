import { CHEATSHEETS } from "@/data/cheatsheets";
import { COMPARISONS } from "@/data/comparisons";
import { TOOLS } from "@/data/tools";
import type { ContentUpdate } from "@/types";

/**
 * Activity feed derived from dataset revision dates.
 *
 * It reports when *our documentation entry* was last revised — never invented
 * upstream activity, contributor names, stars or download counts.
 */
export function getRecentUpdates(limit = 8): ContentUpdate[] {
  const updates: ContentUpdate[] = [];

  for (const tool of TOOLS) {
    updates.push({
      slug: tool.slug,
      href: `/tools/${tool.slug}`,
      title: tool.name,
      kind: `${tool.commandCount} documented command${tool.commandCount === 1 ? "" : "s"}`,
      date: tool.lastUpdated,
      type: "tool",
    });
  }

  for (const sheet of CHEATSHEETS) {
    const entries = sheet.sections.reduce((n, s) => n + s.entries.length, 0);
    updates.push({
      slug: sheet.slug,
      href: `/cheatsheets/${sheet.slug}`,
      title: `${sheet.title} cheatsheet`,
      kind: `${entries} reference entries`,
      date: sheet.lastUpdated,
      type: "cheatsheet",
    });
  }

  for (const comparison of COMPARISONS) {
    updates.push({
      slug: comparison.slug,
      href: `/comparisons/${comparison.slug}`,
      title: comparison.title,
      kind: `${comparison.features.length} compared attributes`,
      date: comparison.lastUpdated,
      type: "comparison",
    });
  }

  return updates.sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}

export function latestRevision(): string {
  return getRecentUpdates(1)[0]?.date ?? "";
}
