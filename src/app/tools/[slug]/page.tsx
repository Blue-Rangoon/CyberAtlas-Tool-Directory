import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryView } from "@/components/pages/CategoryView";
import { ToolDocsView } from "@/components/pages/ToolDocsView";
import { CATEGORIES, getCategory } from "@/data/categories";
import { TOOLS, getTool } from "@/data/tools";
import { SITE } from "@/lib/constants";
import { truncate } from "@/lib/utils";

/**
 * One dynamic segment serves two page kinds, so URLs stay human:
 *   /tools/nmap        → tool documentation
 *   /tools/osint       → category page
 * Resolution order is tool-first, then category, then 404.
 */
export function generateStaticParams() {
  return [
    ...TOOLS.map((tool) => ({ slug: tool.slug })),
    ...CATEGORIES.map((category) => ({ slug: category.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (tool) {
    const title = `${tool.name} — Commands, Installation & Examples`;
    return {
      title,
      description: `${truncate(tool.shortDescription, 150)} ${tool.commandCount} documented commands with explanations, install steps per platform and common errors.`,
      alternates: { canonical: `/tools/${tool.slug}` },
      openGraph: {
        title: `${tool.name} — ${SITE.name}`,
        description: tool.shortDescription,
      },
    };
  }

  const category = getCategory(slug);
  if (category) {
    const count = TOOLS.filter((t) => t.category === category.slug).length;
    return {
      title: `${category.name} tools`,
      description: `${truncate(category.description, 155)} ${count} documented tools in this category.`,
      alternates: { canonical: `/tools/${category.slug}` },
    };
  }

  return { title: "Not found", robots: { index: false } };
}

export default async function ToolsSegmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const tool = getTool(slug);
  if (tool) return <ToolDocsView tool={tool} />;

  const category = getCategory(slug);
  if (category) return <CategoryView category={category} />;

  notFound();
}
