import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/data/categories";
import { CHEATSHEETS } from "@/data/cheatsheets";
import { COMPARISONS } from "@/data/comparisons";
import { CONCEPTS } from "@/data/learning";
import { ROADMAPS } from "@/data/roadmaps";
import { TOOLS } from "@/data/tools";

const BASE = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "";

function url(path: string, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"], priority: number) {
  return {
    url: `${BASE}${path}`,
    lastModified: new Date("2026-01-19T00:00:00Z"),
    changeFrequency,
    priority,
  } satisfies MetadataRoute.Sitemap[number];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    url("/", "weekly", 0.9),
    url("/tools", "weekly", 0.9),
    url("/roadmaps", "monthly", 0.8),
    url("/comparisons", "monthly", 0.75),
    url("/cheatsheets", "monthly", 0.75),
    url("/learning", "monthly", 0.75),
    url("/community", "monthly", 0.6),
    url("/faqs", "monthly", 0.6),
    url("/cookies", "yearly", 0.4),
    url("/about", "yearly", 0.5),
    url("/about/verification", "yearly", 0.4),
    url("/about/sources", "yearly", 0.4),
    url("/about/responsible-use", "yearly", 0.5),
    url("/about/privacy", "yearly", 0.3),
    url("/about/terms", "yearly", 0.3),
    ...CATEGORIES.map((c) => url(`/tools/${c.slug}`, "weekly", 0.7)),
    ...CATEGORIES.flatMap((c) =>
      c.subcategories.map((s) => url(`/tools/${c.slug}/${s.slug}`, "monthly", 0.55)),
    ),
    ...TOOLS.map((t) => url(t.docsPath, "monthly", 0.85)),
    ...ROADMAPS.map((r) => url(`/roadmaps/${r.slug}`, "monthly", 0.7)),
    ...COMPARISONS.map((c) => url(`/comparisons/${c.slug}`, "monthly", 0.7)),
    ...CHEATSHEETS.map((c) => url(`/cheatsheets/${c.slug}`, "monthly", 0.7)),
    ...CONCEPTS.map((c) => url(`/learning/concepts/${c.slug}`, "yearly", 0.6)),
  ];
}
