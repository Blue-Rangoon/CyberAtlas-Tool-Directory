import Link from "next/link";
import { ArrowRight, Clock, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { DIFFICULTY_LABEL } from "@/lib/constants";
import { getIcon } from "@/lib/icons";
import type { Concept, LearningResource } from "@/types";

export function ConceptCard({ concept }: { concept: Concept }) {
  const Icon = getIcon(concept.icon);
  return (
    <Card
      as="li"
      padded={false}
      className="group flex h-full flex-col transition-[border-color,transform,background-color] duration-150 hover:-translate-y-px hover:border-line-strong hover:bg-card-hover motion-reduce:transform-none"
    >
      <Link href={`/learning/concepts/${concept.slug}`} className="flex h-full flex-col p-4">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-[5px] border border-line bg-elevated text-ink-soft transition-colors group-hover:border-accent/35 group-hover:text-accent">
            <Icon className="size-3.5" aria-hidden />
          </span>
          <Badge tone="outline">{DIFFICULTY_LABEL[concept.difficulty]}</Badge>
          <span className="ml-auto inline-flex items-center gap-1 font-mono text-[11px] text-ink-mute">
            <Clock className="size-3" aria-hidden />
            {concept.minutes} min
          </span>
        </div>
        <h3 className="mt-3 text-[15px] leading-6 font-semibold text-ink">{concept.title}</h3>
        <p className="mt-1.5 line-clamp-3 flex-1 text-[13px] leading-6 text-ink-soft">
          {concept.summary}
        </p>
        <span className="mt-3.5 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-accent">
          Read concept
          <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
        </span>
      </Link>
    </Card>
  );
}

const TYPE_LABEL: Record<LearningResource["type"], string> = {
  lab: "Practice lab",
  ctf: "CTF",
  guide: "Framework / reference",
  certification: "Certification",
  book: "Book",
  course: "Course",
};

/**
 * External destinations are always labelled as external: CyberAtlas content and
 * somebody else's content must never look interchangeable.
 */
export function ResourceCard({ resource }: { resource: LearningResource }) {
  return (
    <Card as="li" className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="outline">{TYPE_LABEL[resource.type]}</Badge>
        {resource.difficulty ? (
          <Badge tone="neutral">{DIFFICULTY_LABEL[resource.difficulty]}</Badge>
        ) : null}
        <span className="ml-auto text-[11.5px] text-ink-mute">{resource.provider}</span>
      </div>
      <h3 className="text-[14.5px] leading-6 font-semibold text-ink">{resource.title}</h3>
      <p className="text-[13px] leading-6 text-ink-soft">{resource.description}</p>
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center gap-1.5 pt-1 text-[12.5px] font-medium text-accent-blue transition-colors hover:underline"
      >
        Open external resource
        <ExternalLink className="size-3" aria-hidden />
      </a>
      {resource.issuer ? (
        <p className="text-[11.5px] text-ink-mute">Issued by {resource.issuer}</p>
      ) : null}
    </Card>
  );
}
