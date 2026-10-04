import type { ReactNode } from "react";
import { CircleCheck, Info, Lightbulb, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "info" | "warning" | "success" | "tip";

const TONE: Record<Tone, { wrap: string; icon: typeof Info; label: string }> = {
  info: {
    wrap: "border-accent-blue/30 bg-accent-blue/[0.07] text-ink-soft",
    icon: Info,
    label: "Note",
  },
  warning: {
    wrap: "border-warning/35 bg-warning/[0.07] text-ink-soft",
    icon: TriangleAlert,
    label: "Attention",
  },
  success: {
    wrap: "border-success/30 bg-success/[0.06] text-ink-soft",
    icon: CircleCheck,
    label: "Verified behaviour",
  },
  tip: {
    wrap: "border-line bg-elevated text-ink-soft",
    icon: Lightbulb,
    label: "Tip",
  },
};

export function Callout({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const meta = TONE[tone];
  const Icon = meta.icon;
  return (
    <aside
      className={cn(
        "flex gap-2.5 rounded-md border px-3.5 py-3 text-[13px] leading-6",
        meta.wrap,
        className,
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 size-4 shrink-0",
          tone === "warning" ? "text-warning" : tone === "success" ? "text-success" : tone === "info" ? "text-accent-blue" : "text-ink-mute",
        )}
        aria-hidden
      />
      <div className="min-w-0">
        <p className="font-semibold text-ink">{title ?? meta.label}</p>
        <div className="mt-0.5 empty:hidden">{children}</div>
      </div>
    </aside>
  );
}
