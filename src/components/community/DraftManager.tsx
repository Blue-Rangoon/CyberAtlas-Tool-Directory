"use client";

import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { CopyButton } from "@/components/common/CopyButton";
import { AccordionSelect } from "@/components/ui/AccordionSelect";
import { Button } from "@/components/ui/Button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { TOOL_BY_SLUG } from "@/data/tools";
import { formatISODate } from "@/lib/utils";

export interface DraftField {
  name: string;
  label: string;
  type: "text" | "textarea" | "select";
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  help?: string;
}

interface Draft {
  id: string;
  created: string;
  values: Record<string, string>;
}

/**
 * Local submission drafts.
 *
 * This build has no backend, so nothing is "sent". Instead the form assembles a
 * reviewable markdown draft, keeps it in this browser, and lets the contributor
 * copy it into a pull request or issue. Honest, and useful without a server.
 *
 * Props are serialisable only (no function props): server pages render this
 * component, and functions cannot cross the server→client boundary.
 */
export function DraftManager({
  kind,
  heading,
  description,
  fields,
  titleMode,
  initialValues,
}: {
  kind: string;
  heading: string;
  description: string;
  fields: DraftField[];
  /** Which title format to use for drafts and previews. */
  titleMode: "tool-request" | "edit";
  initialValues?: Record<string, string>;
}) {
  const storageKey = `cyberatlas:drafts:${kind}`;
  const { value: drafts, setValue, hydrated } = useLocalStorage<Draft[]>(storageKey, []);
  const [values, setValues] = useState<Record<string, string>>(() => ({ ...initialValues }));
  const [error, setError] = useState<string | null>(null);

  const markdown = useMemo(
    () => toMarkdown(kind, values, buildTitle(titleMode, values)),
    [kind, values, titleMode],
  );
  const valid = fields.every((f) => !f.required || (values[f.name] ?? "").trim().length > 1);

  const submit = () => {
    if (!valid) {
      setError("Fill the required fields first — an empty draft helps nobody reviewing it.");
      return;
    }
    const draft: Draft = {
      id: `${Date.now()}`,
      created: new Date().toISOString().slice(0, 10),
      values,
    };
    setValue([draft, ...(drafts ?? [])]);
    setValues({});
    setError(null);
  };

  const remove = (id: string) => setValue((drafts ?? []).filter((d) => d.id !== id));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:gap-8">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        aria-describedby={`${kind}-intro`}
        className="rounded-md border border-line bg-card p-4 sm:p-5"
      >
        <h2 className="text-[16px] font-semibold text-ink">{heading}</h2>
        <p id={`${kind}-intro`} className="mt-1 text-[13px] leading-6 text-ink-soft">
          {description}
        </p>

        <div className="mt-5 space-y-4">
          {fields.map((field) =>
            field.type === "select" ? (
              <AccordionSelect
                key={field.name}
                id={`${kind}-${field.name}`}
                label={field.label}
                required={field.required}
                value={values[field.name] ?? ""}
                placeholder="Select…"
                help={field.help}
                onChange={(next) => setValues((v) => ({ ...v, [field.name]: next }))}
                options={[
                  ...(field.required
                    ? []
                    : [{ value: "", label: "None", hint: "Leave unanswered" }]),
                  ...(field.options ?? []),
                ]}
              />
            ) : (
              <div key={field.name}>
                <label
                  htmlFor={`${kind}-${field.name}`}
                  className="mb-1.5 block text-[12.5px] font-medium text-ink-soft"
                >
                  {field.label}
                  {field.required ? <span className="ml-1 text-accent">required</span> : null}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    id={`${kind}-${field.name}`}
                    rows={4}
                    value={values[field.name] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(event) =>
                      setValues((v) => ({ ...v, [field.name]: event.target.value }))
                    }
                    className="w-full resize-y rounded-[5px] border border-line bg-elevated px-3 py-2 text-[13.5px] leading-6 text-ink placeholder:text-ink-mute"
                  />
                ) : (
                  <input
                    id={`${kind}-${field.name}`}
                    type="text"
                    value={values[field.name] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(event) =>
                      setValues((v) => ({ ...v, [field.name]: event.target.value }))
                    }
                    className="h-9.5 w-full rounded-[5px] border border-line bg-elevated px-3 text-[13.5px] text-ink placeholder:text-ink-mute"
                  />
                )}
                {field.help ? <p className="mt-1 text-[12px] text-ink-mute">{field.help}</p> : null}
              </div>
            ),
          )}
        </div>

        {error ? (
          <p role="alert" className="mt-4 rounded-[5px] border border-danger/35 bg-danger/[0.07] px-3 py-2 text-[12.5px] text-ink-soft">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <Button type="submit" variant="primary">
            Save draft locally
          </Button>
          <CopyButton value={markdown} label="Copy as markdown" id={`${kind}-md`} variant="inline" />
          <p className="text-[12px] text-ink-mute">
            Nothing is transmitted. Drafts live in this browser only.
          </p>
        </div>
      </form>

      <aside className="min-w-0">
        <h2 className="text-[13px] font-semibold text-ink">Preview</h2>
        <pre className="scroll-rail mt-2 max-h-[260px] overflow-auto rounded-md border border-line bg-main p-3 font-mono text-[11.5px] leading-5 whitespace-pre-wrap text-ink-soft">
          {markdown}
        </pre>

        <h2 className="mt-6 text-[13px] font-semibold text-ink">
          Saved drafts {drafts?.length ? <span className="text-ink-mute">({drafts.length})</span> : null}
        </h2>
        {!hydrated ? (
          <p className="mt-2 rounded-md border border-line bg-surface/60 px-3 py-2 text-[12.5px] text-ink-mute">
            Reading this browser's stored drafts…
          </p>
        ) : !drafts?.length ? (
          <p className="mt-2 rounded-md border border-dashed border-line bg-surface/60 px-3 py-3 text-[12.5px] leading-5.5 text-ink-mute">
            No drafts saved on this device yet. Saved drafts stay here until you delete them or
            clear site data.
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {drafts.map((draft) => {
              const title = buildTitle(titleMode, draft.values) || "Untitled draft";
              return (
                <li key={draft.id} className="rounded-md border border-line bg-card p-3">
                  <p className="text-[13px] font-medium text-ink">{title}</p>
                  <p className="mt-0.5 text-[11.5px] text-ink-mute">
                    Saved {formatISODate(draft.created)}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <CopyButton
                      value={toMarkdown(kind, draft.values, title)}
                      variant="inline"
                      label="Copy"
                      id={draft.id}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => remove(draft.id)}
                      leadingIcon={<Trash2 className="size-3.5" aria-hidden />}
                      aria-label={`Delete draft ${title}`}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </aside>
    </div>
  );
}

function buildTitle(
  mode: "tool-request" | "edit",
  values: Record<string, string>,
): string {
  if (mode === "tool-request") {
    return values.name ? `Add tool: ${values.name}` : "Add tool";
  }
  const name = values.tool ? (TOOL_BY_SLUG.get(values.tool)?.name ?? values.tool) : "an entry";
  return `Edit ${name}${values.section ? ` — ${values.section}` : ""}`;
}

function toMarkdown(kind: string, values: Record<string, string>, title: string): string {
  const lines = [`## ${title || "New submission"}`, "", `Type: ${kind}`, ""];
  for (const [key, value] of Object.entries(values)) {
    if (!value?.trim()) continue;
    lines.push(`### ${key}`, value.trim(), "");
  }
  lines.push("---", "Draft produced by the CyberAtlas Tool Directory (local only).");
  return lines.join("\n");
}
