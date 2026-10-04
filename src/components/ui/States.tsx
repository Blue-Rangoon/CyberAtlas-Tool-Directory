import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Content-shaped placeholders only. No full-page spinners, no fake latency. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-[4px]", className)} aria-hidden />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-md border border-line bg-card p-4" aria-hidden>
      <Skeleton className="size-7 rounded" />
      <Skeleton className="mt-3.5 h-4 w-1/3" />
      <Skeleton className="mt-2 h-3 w-3/4" />
      <div className="mt-4 flex gap-1.5">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  );
}

export function ToolGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Loading tools"
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actions,
  icon,
  className,
}: {
  title: string;
  description: ReactNode;
  actions?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-3 rounded-md border border-dashed border-line bg-surface/60 p-6",
        className,
      )}
    >
      {icon ? <span className="text-ink-mute">{icon}</span> : null}
      <div>
        <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
        <p className="mt-1 max-w-prose text-[13.5px] leading-6 text-ink-soft">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2 pt-1">{actions}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  action,
}: {
  title?: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div
      role="alert"
      className="rounded-md border border-danger/30 bg-danger/[0.06] p-5"
    >
      <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-[13.5px] leading-6 text-ink-soft">{description}</p>
      {action ? <div className="mt-3 flex gap-2">{action}</div> : null}
    </div>
  );
}
