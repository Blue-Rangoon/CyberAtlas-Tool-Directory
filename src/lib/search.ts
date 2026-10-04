import { CATEGORIES } from "@/data/categories";
import { CHEATSHEETS } from "@/data/cheatsheets";
import { COMPARISONS } from "@/data/comparisons";
import { CONCEPTS, RESOURCES } from "@/data/learning";
import { ROADMAPS } from "@/data/roadmaps";
import { TOOLS } from "@/data/tools";
import type { SearchEntry } from "@/types";
import { normalize } from "./utils";

/**
 * Lightweight client-side search.
 *
 * The index is built once per session from the typed content objects and held
 * in a module-level cache. No search library, no network round-trip, no
 * artificial latency: ~150 entries scan in well under a frame.
 */

const TYPE_WEIGHT: Record<SearchEntry["type"], number> = {
  tool: 120,
  category: 80,
  roadmap: 72,
  concept: 66,
  subcategory: 60,
  command: 58,
  cheatsheet: 56,
  comparison: 52,
  stage: 30,
  resource: 20,
};

let cached: SearchEntry[] | null = null;

function buildIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];
  const push = (e: Omit<SearchEntry, "weight" | "haystack"> & { haystack?: string }) => {
    const haystack = normalize(
      (e.haystack ?? [e.title, e.subtitle, e.parent].filter(Boolean).join(" ")).toLowerCase(),
    );
    entries.push({ ...e, haystack, weight: TYPE_WEIGHT[e.type] });
  };

  for (const tool of TOOLS) {
    push({
      id: `tool:${tool.slug}`,
      type: "tool",
      title: tool.name,
      subtitle: tool.shortDescription,
      href: `/tools/${tool.slug}`,
      haystack: [tool.name, tool.shortDescription, tool.categoryName, tool.subcategoryName, tool.tags.join(" "), tool.license].join(" "),
    });

    for (const c of tool.commands) {
      push({
        id: `command:${tool.slug}:${c.id}`,
        type: "command",
        title: c.title,
        subtitle: c.command,
        parent: tool.name,
        href: `/tools/${tool.slug}#commands`,
        haystack: [c.title, c.description, c.command, (c.tags ?? []).join(" ")].join(" "),
      });
    }
  }

  for (const category of CATEGORIES) {
    push({
      id: `category:${category.slug}`,
      type: "category",
      title: category.name,
      subtitle: category.blurb,
      href: `/tools/${category.slug}`,
      haystack: [category.name, category.description].join(" "),
    });
    for (const sub of category.subcategories) {
      push({
        id: `subcategory:${category.slug}:${sub.slug}`,
        type: "subcategory",
        title: sub.name,
        subtitle: `${category.name} · ${sub.description}`,
        href: `/tools/${category.slug}/${sub.slug}`,
        haystack: [sub.name, sub.description, category.name].join(" "),
      });
    }
  }

  for (const roadmap of ROADMAPS) {
    push({
      id: `roadmap:${roadmap.slug}`,
      type: "roadmap",
      title: roadmap.title,
      subtitle: roadmap.description,
      href: `/roadmaps/${roadmap.slug}`,
      haystack: [roadmap.title, roadmap.description, roadmap.audience, roadmap.prerequisites.join(" ")].join(" "),
    });
    for (const stage of roadmap.stages) {
      push({
        id: `stage:${roadmap.slug}:${stage.slug}`,
        type: "stage",
        title: stage.title,
        subtitle: `${roadmap.title} · stage ${String(stage.number).padStart(2, "0")}`,
        parent: roadmap.title,
        href: `/roadmaps/${roadmap.slug}#stage-${stage.slug}`,
        haystack: [stage.title, stage.description, (stage.topics ?? []).map((t) => t.label).join(" ")].join(" "),
      });
    }
  }

  for (const concept of CONCEPTS) {
    push({
      id: `concept:${concept.slug}`,
      type: "concept",
      title: concept.title,
      subtitle: concept.summary,
      href: `/learning/concepts/${concept.slug}`,
      haystack: [concept.title, concept.question, concept.summary].join(" "),
    });
  }

  for (const sheet of CHEATSHEETS) {
    push({
      id: `cheatsheet:${sheet.slug}`,
      type: "cheatsheet",
      title: sheet.title,
      subtitle: sheet.description,
      href: `/cheatsheets/${sheet.slug}`,
      haystack: [
        sheet.title,
        sheet.description,
        ...sheet.sections.map((s) => `${s.title} ${s.entries.map((e) => `${e.label} ${e.command}`).join(" ")}`),
      ].join(" "),
    });
  }

  for (const comparison of COMPARISONS) {
    push({
      id: `comparison:${comparison.slug}`,
      type: "comparison",
      title: comparison.title,
      subtitle: comparison.description,
      href: `/comparisons/${comparison.slug}`,
      haystack: [comparison.title, comparison.description, comparison.toolA, comparison.toolB].join(" "),
    });
  }

  for (const resource of RESOURCES) {
    push({
      id: `resource:${resource.slug}`,
      type: "resource",
      title: resource.title,
      subtitle: `${resource.provider} · external`,
      href: `/learning#${resource.type}`,
      haystack: [resource.title, resource.description, (resource.tags ?? []).join(" ")].join(" "),
    });
  }

  return entries;
}

function getIndex(): SearchEntry[] {
  if (!cached) cached = buildIndex();
  return cached;
}

function score(entry: SearchEntry, query: string, tokens: string[]): number {
  const title = normalize(entry.title);
  const parent = normalize(entry.parent ?? "");
  let s = 0;

  if (title === query) s += 1000;
  if (title.startsWith(query)) s += 320;
  if (title.includes(query)) s += 200;

  for (const token of tokens) {
    if (title === token) s += 260;
    else if (title.startsWith(token)) s += 140;
    else if (new RegExp(`(^|[ ])${escapeRe(token)}`).test(title)) s += 90;
    else if (title.includes(token)) s += 55;

    if (parent.includes(token)) s += 26;
    if (entry.haystack.includes(token)) s += 14;
  }

  return s + entry.weight;
}

function escapeRe(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export interface SearchHit {
  entry: SearchEntry;
  score: number;
}

export const SEARCH_GROUP_LABEL: Record<SearchEntry["type"], string> = {
  tool: "Tools",
  command: "Commands",
  category: "Categories",
  subcategory: "Subcategories",
  roadmap: "Roadmaps",
  stage: "Roadmap stages",
  concept: "Concepts",
  cheatsheet: "Cheatsheets",
  comparison: "Comparisons",
  resource: "External resources",
};

export const SEARCH_GROUP_ORDER: SearchEntry["type"][] = [
  "tool",
  "command",
  "category",
  "subcategory",
  "roadmap",
  "concept",
  "cheatsheet",
  "comparison",
  "stage",
  "resource",
];

export function search(query: string, limit = 40): SearchHit[] {
  const q = normalize(query);
  if (q.length < 1) return [];
  const tokens = q.split(" ").filter(Boolean);
  const hits: SearchHit[] = [];

  for (const entry of getIndex()) {
    const value = score(entry, q, tokens);
    // Threshold keeps "nmap" from returning every entry that mentions a port.
    if (value > entry.weight + 12) hits.push({ entry, score: value });
  }

  return hits.sort((a, b) => b.score - a.score || a.entry.title.length - b.entry.title.length).slice(0, limit);
}

export function searchGrouped(query: string, perGroup = 5) {
  const hits = search(query, 120);
  const groups = new Map<SearchEntry["type"], SearchHit[]>();
  for (const hit of hits) {
    const bucket = groups.get(hit.entry.type) ?? [];
    if (bucket.length < perGroup) {
      bucket.push(hit);
      groups.set(hit.entry.type, bucket);
    }
  }
  return SEARCH_GROUP_ORDER.filter((type) => groups.has(type)).map((type) => ({
    type,
    label: SEARCH_GROUP_LABEL[type],
    hits: groups.get(type)!,
  }));
}

export function totalIndexed() {
  return getIndex().length;
}
