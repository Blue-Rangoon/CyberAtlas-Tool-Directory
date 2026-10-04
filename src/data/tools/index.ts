import type { ResolvedTool, Tool } from "@/types";
import { CATEGORY_BY_SLUG } from "@/data/categories";
import { aircrackNg } from "./aircrack-ng";
import { burpSuite, gobuster, hydra, john, nuclei } from "./pentesting";
import { exiftool } from "./exiftool";
import { ffuf } from "./ffuf";
import { hashcat } from "./hashcat";
import { binwalk, checkov, cyberchef, trivy, volatility3, wifite } from "./forensics-cloud";
import { httpx, spiderFoot, subfinder, theHarvester } from "./osint";
import { masscan, netcat, rustscan, tcpdump } from "./networking";
import { nmap } from "./nmap";
import { sherlock } from "./sherlock";
import { sqlmap } from "./sqlmap";
import { wireshark } from "./wireshark";

/**
 * Tool registry.
 *
 * Adding a tool = create a typed file in this folder (or extend a grouped
 * area file), export it, and add it to `RAW_TOOLS` below. Everything else —
 * search, category pages, filters, related tools — derives from that entry.
 */
const RAW_TOOLS: Tool[] = [
  nmap,
  wireshark,
  ffuf,
  sherlock,
  sqlmap,
  hashcat,
  exiftool,
  aircrackNg,
  masscan,
  rustscan,
  tcpdump,
  netcat,
  gobuster,
  burpSuite,
  nuclei,
  hydra,
  john,
  theHarvester,
  spiderFoot,
  subfinder,
  httpx,
  volatility3,
  binwalk,
  wifite,
  checkov,
  trivy,
  cyberchef,
];

function resolve(tool: Tool): ResolvedTool {
  const category = CATEGORY_BY_SLUG.get(tool.category);
  const sub = tool.subcategory
    ? category?.subcategories.find((s) => s.slug === tool.subcategory)
    : undefined;
  return {
    ...tool,
    categoryName: category?.name ?? tool.category,
    categorySlug: tool.category,
    categoryAccent: category?.accent ?? "accent",
    subcategoryName: sub?.name,
    commandCount: tool.commands.length,
    docsPath: `/tools/${tool.slug}`,
  };
}

export const TOOLS: ResolvedTool[] = RAW_TOOLS
  .map(resolve)
  .sort((a, b) => a.name.localeCompare(b.name));

export const TOOL_BY_SLUG: ReadonlyMap<string, ResolvedTool> = new Map(
  TOOLS.map((t) => [t.slug, t]),
);

export function getTool(slug: string | undefined): ResolvedTool | undefined {
  return slug ? TOOL_BY_SLUG.get(slug) : undefined;
}

/** Resolve a list of slugs, silently dropping entries not in the dataset yet. */
export function getTools(slugs: readonly (string | undefined)[] | undefined): ResolvedTool[] {
  if (!slugs) return [];
  const out: ResolvedTool[] = [];
  for (const slug of slugs) {
    const tool = slug ? TOOL_BY_SLUG.get(slug) : undefined;
    if (tool) out.push(tool);
  }
  return out;
}

export function toolsByCategory(categorySlug: string): ResolvedTool[] {
  return TOOLS.filter((t) => t.category === categorySlug);
}

export function toolsBySubcategory(
  categorySlug: string,
  subcategorySlug: string,
): ResolvedTool[] {
  return toolsByCategory(categorySlug).filter(
    (t) => t.subcategory === subcategorySlug,
  );
}

export const POPULAR_TOOLS: ResolvedTool[] = TOOLS.filter(
  (t) => t.commonlyUsed,
).slice(0, 8);

/** Tools whose documentation is deliberately thin, used to invite edits. */
export function isSparse(tool: ResolvedTool): boolean {
  return tool.commandCount < 5 || tool.status === "needs-review";
}

export const TOTAL_COMMANDS = TOOLS.reduce(
  (sum, t) => sum + t.commandCount,
  0,
);
