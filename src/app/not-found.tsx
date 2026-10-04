import Link from "next/link";
import { ArrowRight, Compass, ScanSearch } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CATEGORIES } from "@/data/categories";

export default function NotFound() {
  return (
    <PageContainer width="content" className="py-16 sm:py-24">
      <p className="font-mono text-[11px] tracking-[0.16em] text-ink-mute uppercase">
        404 · route not found
      </p>
      <h1 className="mt-3 text-[30px] leading-tight font-semibold tracking-[-0.02em] text-ink sm:text-[38px]">
        Looks like this path doesn't exist
      </h1>
      <p className="mt-3 max-w-xl text-[15px] leading-7 text-ink-soft">
        The address may be a typo, or a page that has not been documented yet. Nothing here is
        hidden behind a login — if it exists, it is reachable from the directory or the search
        index.
      </p>

      <div className="mt-7 flex flex-wrap gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-[5px] bg-accent px-3.5 py-2 text-[13.5px] font-semibold text-on-accent transition-colors hover:bg-accent-hover"
        >
          Go home
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 rounded-[5px] border border-line bg-elevated px-3.5 py-2 text-[13.5px] font-medium text-ink transition-colors hover:border-line-strong"
        >
          <ScanSearch className="size-3.5" aria-hidden />
          Explore tools
        </Link>
        <Link
          href="/roadmaps"
          className="inline-flex items-center gap-2 rounded-[5px] border border-line bg-elevated px-3.5 py-2 text-[13.5px] font-medium text-ink transition-colors hover:border-line-strong"
        >
          <Compass className="size-3.5" aria-hidden />
          Learning paths
        </Link>
      </div>

      <nav aria-label="Categories" className="mt-10 border-t border-line pt-6">
        <h2 className="mb-3 font-mono text-[10.5px] tracking-[0.16em] text-ink-mute uppercase">
          Jump to a category
        </h2>
        <ul className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/tools/${category.slug}`}
                className="inline-flex items-center gap-1.5 rounded-[5px] border border-line bg-card px-2.5 py-1.5 text-[12.5px] text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </PageContainer>
  );
}
