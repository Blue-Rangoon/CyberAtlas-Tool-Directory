import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  if (!items.length) return null;
  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="scroll-rail flex items-center gap-1 text-[12.5px] whitespace-nowrap">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="rounded px-1 py-0.5 text-ink-mute transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn("px-1 py-0.5", last ? "text-ink-soft" : "text-ink-mute")}
                >
                  {item.label}
                </span>
              )}
              {!last ? (
                <ChevronRight className="size-3.5 shrink-0 text-ink-mute/60" aria-hidden />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
