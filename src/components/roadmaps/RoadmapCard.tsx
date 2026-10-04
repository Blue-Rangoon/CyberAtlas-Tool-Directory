import Link from "next/link";
import { ArrowRight, Clock, Gauge, Layers, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { DIFFICULTY_LABEL } from "@/lib/constants";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Roadmap } from "@/types";

export function RoadmapCard({ roadmap, featured = false }: { roadmap: Roadmap; featured?: boolean }) {
  const Icon = getIcon(roadmap.icon);
  const range = roadmap.difficultyRange;

  return (
    <Card
      as="li"
      padded={false}
      className={cn(
        "group relative flex h-full flex-col transition-[border-color,transform,background-color] duration-150 hover:-translate-y-px hover:border-line-strong hover:bg-card-hover motion-reduce:transform-none",
        featured && "border-line-strong",
      )}
    >
      <Link href={`/roadmaps/${roadmap.slug}`} className="flex h-full flex-col p-4.5">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-[5px] border border-line bg-elevated text-ink-soft transition-colors group-hover:border-accent/35 group-hover:text-accent">
            <Icon className="size-4" aria-hidden />
          </span>
          <Badge tone="outline">
            {range
              ? `${DIFFICULTY_LABEL[range[0]]} → ${DIFFICULTY_LABEL[range[1]]}`
              : DIFFICULTY_LABEL[roadmap.difficulty]}
          </Badge>
          <span className="ml-auto font-mono text-[11px] text-ink-mute">
            {String(roadmap.stages.length).padStart(2, "0")} stages
          </span>
        </div>

        <h3 className="mt-3 text-[16.5px] leading-6 font-semibold text-ink">{roadmap.title}</h3>
        <p className="mt-1.5 line-clamp-3 text-[13px] leading-6 text-ink-soft">
          {roadmap.description}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-line/70 pt-3 text-[12px]">
          <Meta icon={Users} label="Audience" value={roadmap.audience} />
          <Meta icon={Clock} label="Time" value={roadmap.estimatedDuration} />
          <Meta icon={Layers} label="Prerequisites" value={`${roadmap.prerequisites.length} listed`} />
          <Meta
            icon={Gauge}
            label="Outcome"
            value={roadmap.outcome.length > 52 ? `${roadmap.outcome.slice(0, 52)}…` : roadmap.outcome}
          />
        </dl>

        <span className="mt-3.5 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-accent">
          Open roadmap
          <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
        </span>
      </Link>
    </Card>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] text-ink-mute uppercase">
        <Icon className="size-3" aria-hidden />
        {label}
      </dt>
      <dd className="mt-0.5 line-clamp-2 text-[12.5px] leading-5 text-ink-soft">{value}</dd>
    </div>
  );
}
