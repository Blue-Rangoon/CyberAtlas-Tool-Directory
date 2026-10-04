import { CopyButton } from "@/components/common/CopyButton";
import { Badge } from "@/components/ui/Badge";
import { getIcon } from "@/lib/icons";
import { DIFFICULTY_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Command } from "@/types";
import { CircleCheck, TriangleAlert } from "lucide-react";

/**
 * The defining component of the product: a command plus the context required
 * to use it. A command is never rendered without its description.
 */
export function CommandBlock({
  command,
  toolName,
  index,
}: {
  command: Command;
  toolName: string;
  index?: number;
}) {
  const shell = command.shell ?? "bash";
  const warnings = command.warnings ?? [];
  const notes = command.notes ?? [];

  return (
    <article
      id={`cmd-${command.id}`}
      className="scroll-mt-28 overflow-hidden rounded-md border border-line bg-card"
    >
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line px-3.5 py-2.5">
        <h4 className="min-w-0 flex-1 text-[14px] leading-5 font-semibold text-ink">
          {typeof index === "number" ? (
            <span className="mr-2 font-mono text-[12px] text-ink-mute">
              {String(index + 1).padStart(2, "0")}
            </span>
          ) : null}
          {command.title}
        </h4>
        <div className="flex items-center gap-2">
          {command.difficulty ? (
            <span className="hidden text-[11.5px] text-ink-mute sm:inline">
              {DIFFICULTY_LABEL[command.difficulty]}
            </span>
          ) : null}
          <span className="rounded border border-line bg-main px-1.5 py-0.5 font-mono text-[10.5px] text-ink-mute">
            {shell}
          </span>
          <CopyButton value={command.command} id={`${toolName}-${command.id}`} />
        </div>
      </header>

      <div className="px-3.5 pt-3 pb-3.5">
        <p className="text-[13.5px] leading-6 text-ink-soft">{command.description}</p>

        <CodeSurface command={command.command} shell={shell} />

        {command.example ? (
          <div className="mt-3">
            <FieldLabel>Example</FieldLabel>
            <p className="mt-1 font-mono text-[12.5px] break-words text-ink">
              {command.example}
            </p>
          </div>
        ) : null}

        {command.expectedOutput ? (
          <div className="mt-3">
            <FieldLabel>Example output</FieldLabel>
            <p className="mt-1 text-[12px] text-ink-mute">
              Illustrative only — real output depends on the target, version and your position on the network.
            </p>
            <pre className="scroll-rail mt-1.5 rounded-[5px] border border-line bg-main px-3 py-2 font-mono text-[12px] leading-5 text-ink-soft">
              {command.expectedOutput}
            </pre>
          </div>
        ) : null}

        {warnings.length ? (
          <ul className="mt-3 space-y-1.5">
            {warnings.map((warning) => (
              <li
                key={warning}
                className="flex gap-2 rounded-[5px] border border-warning/30 bg-warning/[0.07] px-2.5 py-2 text-[12.5px] leading-5.5 text-ink-soft"
              >
                <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-warning" aria-hidden />
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {notes.length ? (
          <div className="mt-3 border-t border-line/70 pt-2.5">
            <FieldLabel>Notes</FieldLabel>
            <ul className="mt-1.5 space-y-1.5">
              {notes.map((note) => (
                <li key={note} className="flex gap-2 text-[12.5px] leading-5.5 text-ink-mute">
                  <CircleCheck className="mt-1 size-3 shrink-0 text-ink-mute/70" aria-hidden />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}

/** The dark, monospace, internally-scrolling command surface. */
export function CodeSurface({
  command,
  shell,
  compact = false,
}: {
  command: string;
  shell?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "mt-2.5 flex items-stretch overflow-hidden rounded-[5px] border border-line bg-main",
        compact && "mt-0",
      )}
    >
      <span
        className="hidden shrink-0 items-center border-r border-line px-2 font-mono text-[10.5px] tracking-wide text-ink-mute uppercase sm:flex"
        aria-hidden
      >
        $
      </span>
      <pre
        tabIndex={0}
        aria-label={shell ? `${shell} command` : "command"}
        className="scroll-rail min-w-0 flex-1 px-3 py-2.5 font-mono text-[12.8px] leading-5 whitespace-pre text-ink focus-visible:outline-2 focus-visible:-outline-offset-2"
      >
        {command}
      </pre>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10.5px] tracking-[0.12em] text-ink-mute uppercase">
      {children}
    </p>
  );
}

/** One command line with a copy affordance, used by installation + cheatsheets. */
export function CommandRow({
  command,
  label,
  note,
  badge,
}: {
  command: string;
  label?: string;
  note?: string;
  badge?: string;
}) {
  return (
    <div className="group/row">
      {label ? (
        <p className="mb-1 text-[12.5px] text-ink-soft">{label}</p>
      ) : null}
      <div className="flex items-stretch overflow-hidden rounded-[5px] border border-line bg-main transition-colors duration-150 group-hover/row:border-line-strong">
        <pre className="scroll-rail min-w-0 flex-1 px-3 py-2 font-mono text-[12.5px] leading-5 whitespace-pre text-ink">
          {command}
        </pre>
        <div className="flex shrink-0 items-center gap-1.5 border-l border-line px-2">
          {badge ? <Badge mono tone="outline">{badge}</Badge> : null}
          <CopyButton value={command} variant="icon" label={label ?? "Copy command"} />
        </div>
      </div>
      {note ? <p className="mt-1 text-[12px] text-ink-mute">{note}</p> : null}
    </div>
  );
}

/** Inline tool icon used in lists where a full card would be too heavy. */
const GLYPH_SIZES = {
  xs: { box: "size-5", icon: "size-3" },
  sm: { box: "size-6", icon: "size-3.5" },
  md: { box: "size-7", icon: "size-3.5" },
  lg: { box: "size-9", icon: "size-4" },
} as const;

export function ToolGlyph({
  iconKey,
  size = "md",
  bare = false,
  className,
}: {
  iconKey: string;
  size?: keyof typeof GLYPH_SIZES;
  /** Removes the framed background so the glyph can sit inside another surface. */
  bare?: boolean;
  className?: string;
}) {
  const Icon = getIcon(iconKey);
  const dims = GLYPH_SIZES[size];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded border transition-colors duration-150",
        dims.box,
        bare
          ? "border-transparent bg-transparent text-ink-soft"
          : "border-line bg-elevated text-ink-soft group-hover:border-accent/35 group-hover:text-accent",
        className,
      )}
      aria-hidden
    >
      <Icon className={dims.icon} />
    </span>
  );
}
