import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryView } from "@/components/pages/CategoryView";
import { CATEGORIES, getCategory, getSubcategory } from "@/data/categories";
import { TOOLS } from "@/data/tools";

export function generateStaticParams() {
  const params: { slug: string; sub: string }[] = [];
  for (const category of CATEGORIES) {
    for (const sub of category.subcategories) {
      params.push({ slug: category.slug, sub: sub.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}): Promise<Metadata> {
  const { slug, sub } = await params;
  const category = getCategory(slug);
  const subcategory = getSubcategory(slug, sub);
  if (!category || !subcategory) return { title: "Not found", robots: { index: false } };

  const count = TOOLS.filter(
    (t) => t.category === category.slug && t.subcategory === subcategory.slug,
  ).length;

  return {
    title: `${subcategory.name} — ${category.name} tools`,
    description: `${subcategory.description} ${count} documented ${count === 1 ? "tool" : "tools"} in this subtopic.`,
    alternates: { canonical: `/tools/${category.slug}/${subcategory.slug}` },
  };
}

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}) {
  const { slug, sub } = await params;
  const category = getCategory(slug);
  const subcategory = getSubcategory(slug, sub);
  if (!category || !subcategory) notFound();

  return (
    <CategoryView
      category={category}
      subcategory={subcategory}
    />
  );
}
