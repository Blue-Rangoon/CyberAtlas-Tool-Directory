import type { ReactNode } from "react";
import {
  Ban,
  CircleCheck,
  Clock,
  TriangleAlert,
  Users,
  type LucideIcon,
} from "lucide-react";
import { STATUS_META } from "@/lib/constants";
import type { VerificationStatus } from "@/types";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "outline";

const TONES: Record<Tone, string> = {
  neutral: "bg-elevated text-ink-soft border-line",
  accent: "bg-accent/12 text-accent border-accent/25",
  success: "bg-success/12 text-success border-success/25",
  warning: "bg-warning/12 text-warning border-warning/25",
  danger: "bg-danger/12 text-danger border-danger/25",
  outline: "bg-transparent text-ink-soft border-line",
};

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
  /** Badges used as filters get square ends so they read as controls. */
  mono?: boolean;
}

export function Badge({ children, tone = "neutral", icon, className, mono }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 text-[11px] leading-4 font-medium whitespace-nowrap",
        mono && "font-mono text-[10.5px] tracking-tight",
        TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

const STATUS_ICONS: Record<VerificationStatus, LucideIcon> = {
  verified: CircleCheck,
  community: Users,
  "needs-review": Clock,
  outdated: TriangleAlert,
  deprecated: Ban,
};

/**
 * Verification status is always icon + text; colour is decoration only, so the
 * state survives greyscale, screen readers and colour-blindness.
 */
export function StatusBadge({
  status,
  showLabel = true,
}: {
  status: VerificationStatus;
  showLabel?: boolean;
}) {
  const meta = STATUS_META[status];
  const Icon = STATUS_ICONS[status];
  const tone: Tone =
    status === "verified"
      ? "success"
      : status === "community"
        ? "accent"
        : status === "deprecated"
          ? "danger"
          : "warning";

  return (
    <span
      className={cn("group/status relative inline-flex")}
      title={meta.description}
    >
      <Badge tone={tone} icon={<Icon className="size-3.5" aria-hidden />}>
        {showLabel ? meta.label : <span className="sr-only">{meta.label}</span>}
      </Badge>
    </span>
  );
}

export function DotBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12px] text-ink-soft", className)}>
      <span className="size-1.5 rounded-full bg-current opacity-70" aria-hidden />
      {children}
    </span>
  );
}
