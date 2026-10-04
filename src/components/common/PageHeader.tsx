import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Page header + section header. One rhythm everywhere: eyebrow, title,
 * supporting line, optional actions on the right for wide viewports.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
  size = "md",
  className,
}: {
  eyebrow?: ReactNode;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 border-b border-line pb-6",
        size === "lg" ? "md:flex-row md:items-end md:justify-between" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="min-w-0 max-w-3xl">
        {eyebrow ? (
          <p className="mb-2 font-mono text-[11.5px] tracking-[0.14em] text-accent uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={cn(
            "font-semibold tracking-[-0.02em] text-ink",
            size === "lg" ? "text-[30px] leading-[1.12] sm:text-[38px]" : size === "md" ? "text-[24px] leading-tight sm:text-[28px]" : "text-[20px] leading-tight",
          )}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              "mt-2 text-ink-soft",
              size === "lg" ? "max-w-2xl text-[15px] leading-7" : "text-[14px] leading-6.5",
            )}
          >
            {description}
          </p>
        ) : null}
        {meta ? <div className="mt-3 flex flex-wrap items-center gap-2">{meta}</div> : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  );
}

export function SectionHeader({
  title,
  description,
  action,
  id,
  className,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <div
      id={id}
      className={cn(
        "mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-2",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-ink sm:text-[19px]">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 max-w-2xl text-[13.5px] leading-6 text-ink-soft">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
