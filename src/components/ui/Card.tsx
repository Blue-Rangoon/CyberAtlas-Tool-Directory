import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Subtle hover lift + border accent. No scale, no glow. */
  interactive?: boolean;
  as?: "div" | "article" | "section" | "li";
  padded?: boolean;
}

export function Card({
  children,
  className,
  interactive = false,
  as: Tag = "div",
  padded = true,
}: CardProps) {
  return (
    <Tag
      className={cn(
        "relative rounded-md border border-line bg-card transition-[border-color,background-color,transform] duration-150 ease-out",
        padded && "p-4",
        interactive &&
          "lift group-hover:border-line-strong group-hover:bg-card-hover group-hover:-translate-y-px motion-reduce:transform-none",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Card that is entirely clickable — one focus stop, whole surface as target. */
export function LinkCard({
  href,
  children,
  className,
  padded = true,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  padded?: boolean;
  ariaLabel?: string;
}) {
  const isExternal = /^https?:\/\//.test(href);
  const classes = cn(
    "group relative flex flex-col rounded-md border border-line bg-card p-4 text-left transition-[border-color,background-color,transform] duration-150 ease-out",
    "lift hover:border-line-strong hover:bg-card-hover hover:-translate-y-px motion-reduce:transform-none",
    padded ? undefined : "p-0",
    className,
  );
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-[15px] leading-6 font-semibold text-ink", className)}>{children}</h3>
  );
}

export function CardMeta({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-[12.5px] leading-5 text-ink-mute", className)}>{children}</p>;
}
