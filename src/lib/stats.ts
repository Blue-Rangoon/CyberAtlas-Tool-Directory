import { CATEGORIES } from "@/data/categories";
import { CHEATSHEETS, TOTAL_CHEATSHEET_ENTRIES } from "@/data/cheatsheets";
import { COMPARISONS } from "@/data/comparisons";
import { CONCEPTS, RESOURCES } from "@/data/learning";
import { ROADMAPS, TOTAL_STAGES } from "@/data/roadmaps";
import { TOOLS, TOTAL_COMMANDS } from "@/data/tools";

/**
 * Dataset statistics, always derived from content — never hard-coded.
 * If a future contributor removes a tool, the homepage number follows.
 */
export function getStats() {
  const subcategories = new Set<string>();
  let installMethods = 0;
  let documentedPlatforms = new Set<string>();

  for (const tool of TOOLS) {
    if (tool.subcategory) subcategories.add(`${tool.category}/${tool.subcategory}`);
    installMethods += tool.installation.length;
    for (const p of tool.platforms) documentedPlatforms.add(p);
  }

  return {
    tools: TOOLS.length,
    commands: TOTAL_COMMANDS,
    categories: CATEGORIES.length,
    subcategories: subcategories.size,
    cheatSheetEntries: TOTAL_CHEATSHEET_ENTRIES,
    cheatSheets: CHEATSHEETS.length,
    roadmaps: ROADMAPS.length,
    stages: TOTAL_STAGES,
    comparisons: COMPARISONS.length,
    concepts: CONCEPTS.length,
    resources: RESOURCES.length,
    installMethods,
    platforms: documentedPlatforms.size,
  } as const;
}

export type Stats = ReturnType<typeof getStats>;

export const STAT_TILES: { key: keyof Stats; label: string; href: string; hint?: string }[] = [
  { key: "tools", label: "Documented tools", href: "/tools" },
  { key: "commands", label: "Commands with context", href: "/tools" },
  { key: "cheatSheetEntries", label: "Cheatsheet entries", href: "/cheatsheets" },
  { key: "categories", label: "Categories", href: "/tools" },
  { key: "roadmaps", label: "Learning paths", href: "/roadmaps" },
];
