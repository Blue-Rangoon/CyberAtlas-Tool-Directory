import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Width = "reading" | "content" | "wide" | "full";

const WIDTHS: Record<Width, string> = {
  /** Long-form documentation: comfortable measure, ~72ch. */
  reading: "max-w-[760px]",
  /** Default for most pages. */
  content: "max-w-[1180px]",
  /** Tool browser, comparison tables, category grids. */
  wide: "max-w-[1440px]",
  full: "max-w-none",
};

/**
 * One container rule for the whole product so page rhythm never changes:
 * outer padding, constrained measure, predictable vertical gaps.
 */
export function PageContainer({
  children,
  width = "content",
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  width?: Width;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        WIDTHS[width],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function Section({
  children,
  className,
  id,
  ariaLabel,
  tone = "transparent",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  ariaLabel?: string;
  tone?: "transparent" | "surface" | "line";
}) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "scroll-mt-24 py-12 sm:py-14",
        tone === "surface" && "border-y border-line bg-surface/70",
        tone === "line" && "border-y border-line",
        className,
      )}
    >
      {children}
    </section>
  );
}
