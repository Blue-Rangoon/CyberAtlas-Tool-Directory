import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** One documentation section: anchor, heading, optional lede, content. */
export function DocSection({
  id,
  title,
  lede,
  children,
  aside,
  className,
}: {
  id: string;
  title: string;
  lede?: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("scroll-mt-24", className)}>
      <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line pb-2">
        <h2
          id={`${id}-title`}
          className="text-[18px] font-semibold tracking-[-0.01em] text-ink sm:text-[20px]"
        >
          {title}
        </h2>
        {aside ? <div className="text-[12.5px] text-ink-mute">{aside}</div> : null}
      </div>
      {lede ? <p className="mb-4 max-w-3xl text-[14px] leading-7 text-ink-soft">{lede}</p> : null}
      {children}
    </section>
  );
}

/** Numbered step list used by examples/workflows. */
export function StepList({ steps }: { steps: ReactNode[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, index) => (
        <li key={index} className="flex gap-3">
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-line bg-elevated font-mono text-[10.5px] text-ink-soft">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">{step}</div>
        </li>
      ))}
    </ol>
  );
}
