"use client";

import { ExternalLink, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getTool } from "@/data/tools";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import type { Roadmap } from "@/types";

/**
 * Roadmap timeline with local-only progress. Progress lives in localStorage and
 * never requires an account — and the copy says so explicitly.
 */
export function RoadmapView({ roadmap }: { roadmap: Roadmap }) {
  const key = `cyberatlas:progress:${roadmap.slug}`;
  const { value: done, setValue, reset } = useLocalStorage<string[]>(key, []);
  const completed = new Set(done);
  const percent = Math.round((completed.size / roadmap.stages.length) * 100);

  const toggle = (slug: string) => {
    const next = new Set(completed);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    setValue([...next]);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md border border-line bg-surface px-4 py-3">
        <div className="min-w-[190px] flex-1">
          <div className="flex items-baseline justify-between text-[12.5px]">
            <span className="text-ink-soft">
              Progress
              <span className="ml-1.5 font-mono text-ink">
                {completed.size} / {roadmap.stages.length}
              </span>
            </span>
            <span className="font-mono text-[11.5px] text-ink-mute">{percent}%</span>
          </div>
          <div
            className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Roadmap progress"
          >
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <p className="text-[11.5px] text-ink-mute">
          Stored in this browser only. No account, no sync.
        </p>
        {completed.size > 0 ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={reset}
            leadingIcon={<RefreshCcw className="size-3.5" aria-hidden />}
          >
            Reset
          </Button>
        ) : null}
      </div>

      <ol className="relative mt-6 space-y-3.5 border-l border-line pl-5 sm:pl-7">
        {roadmap.stages.map((stage) => {
          const isDone = completed.has(stage.slug);
          return (
            <li
              key={stage.slug}
              id={`stage-${stage.slug}`}
              className={cn(
                "relative scroll-mt-24 rounded-md border bg-card p-4 transition-colors duration-150",
                isDone ? "border-success/30" : "border-line",
              )}
            >
              <span
                className={cn(
                  "absolute top-5 -left-[30px] grid size-6 place-items-center rounded-full border bg-main font-mono text-[10.5px] transition-colors duration-150 sm:-left-[38px]",
                  isDone ? "border-success/50 text-success" : "border-line text-ink-mute",
                )}
                aria-hidden
              >
                {String(stage.number).padStart(2, "0")}
              </span>

              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15.5px] leading-6 font-semibold text-ink">{stage.title}</h3>
                  <p className="mt-1 max-w-2xl text-[13.5px] leading-6 text-ink-soft">
                    {stage.description}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="rounded border border-line bg-elevated px-1.5 py-0.5 font-mono text-[10.5px] text-ink-mute">
                    {stage.duration}
                  </span>
                  <label className="flex cursor-pointer items-center gap-2 rounded-[5px] border border-line px-2 py-1 text-[12px] text-ink-soft transition-colors hover:border-line-strong hover:text-ink">
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => toggle(stage.slug)}
                      className="size-3.5 accent-success"
                    />
                    {isDone ? "Completed" : "Mark done"}
                  </label>
                </div>
              </div>

              <div className="mt-3.5 grid gap-3.5 md:grid-cols-2">
                {stage.topics?.length ? (
                  <Block title="Learn">
                    <ul className="space-y-1">
                      {stage.topics.map((topic) => (
                        <li key={topic.label} className="flex gap-2 text-[13px] leading-6 text-ink-soft">
                          <span className="mt-2.5 size-1 shrink-0 rounded-full bg-accent/70" aria-hidden />
                          {topic.href ? (
                            <a href={topic.href} className="hover:text-accent">
                              {topic.label}
                            </a>
                          ) : (
                            topic.label
                          )}
                        </li>
                      ))}
                    </ul>
                  </Block>
                ) : null}

                {stage.exercises?.length ? (
                  <Block title="Do">
                    <ul className="space-y-1">
                      {stage.exercises.map((exercise) => (
                        <li key={exercise} className="flex gap-2 text-[13px] leading-6 text-ink-soft">
                          <span className="mt-2.5 size-1 shrink-0 rounded-full bg-success/70" aria-hidden />
                          {exercise}
                        </li>
                      ))}
                    </ul>
                  </Block>
                ) : null}
              </div>

              {stage.tools.length ? (
                <div className="mt-3.5 flex flex-wrap items-center gap-1.5 border-t border-line/70 pt-3">
                  <span className="font-mono text-[10px] tracking-[0.12em] text-ink-mute uppercase">
                    Tools
                  </span>
                  {stage.tools.map((slug) => {
                    const tool = getTool(slug);
                    if (!tool) return null;
                    return (
                      <a
                        key={slug}
                        href={tool.docsPath}
                        className="rounded-[4px] border border-line bg-elevated px-1.5 py-0.5 text-[12px] text-ink-soft transition-colors hover:border-accent/40 hover:text-ink"
                      >
                        {tool.name}
                      </a>
                    );
                  })}
                </div>
              ) : null}

              {stage.resources?.length ? (
                <div className="mt-2.5 flex flex-wrap gap-3">
                  {stage.resources.map((resource) => (
                    <a
                      key={resource.url}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[12px] text-accent-blue hover:underline"
                    >
                      {resource.label}
                      <ExternalLink className="size-3" aria-hidden />
                    </a>
                  ))}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 font-mono text-[10px] tracking-[0.14em] text-ink-mute uppercase">
        {title}
      </p>
      {children}
    </div>
  );
}
