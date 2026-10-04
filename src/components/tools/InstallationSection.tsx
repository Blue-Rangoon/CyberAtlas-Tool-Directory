import { ExternalLink, ShieldAlert } from "lucide-react";
import { CodeSurface, CommandRow } from "@/components/tools/CommandBlock";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { LinkButton } from "@/components/ui/Button";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { PLATFORMS, INSTALL_PLATFORM_ORDER } from "@/lib/platforms";
import { formatISODate } from "@/lib/utils";
import type { InstallationMethod, PlatformId } from "@/types";

const KIND_LABEL: Record<InstallationMethod["kind"], string> = {
  recommended: "Recommended",
  alternative: "Alternative",
  manual: "Manual",
};

/**
 * Installation is rendered entirely from structured data: the platform tabs are
 * derived from which methods exist, so a new platform needs no component change.
 */
export function InstallationSection({
  methods,
  toolName,
  lastUpdated,
}: {
  methods: InstallationMethod[];
  toolName: string;
  lastUpdated: string;
}) {
  if (!methods.length) {
    return (
      <EmptyState
        title="No installation notes yet"
        description={`Nobody has documented setup for ${toolName} in this dataset. The upstream project's download page is the reliable source until then.`}
        actions={
          <LinkButton href={`/community/suggest-edit`} size="sm">
            Add installation steps
          </LinkButton>
        }
      />
    );
  }

  const byPlatform = new Map<PlatformId, InstallationMethod[]>();
  for (const method of methods) {
    const bucket = byPlatform.get(method.platform) ?? [];
    bucket.push(method);
    byPlatform.set(method.platform, bucket);
  }

  const ordered = INSTALL_PLATFORM_ORDER.filter((p) => byPlatform.has(p));
  const items: TabItem[] = ordered.map((platform) => ({
    id: platform,
    label: PLATFORMS[platform].label,
    hint: String(byPlatform.get(platform)!.length),
    content: (
      <div className="space-y-3">
        {byPlatform.get(platform)!.map((method, index) => (
          <MethodCard key={`${method.platform}-${method.method}-${index}`} method={method} />
        ))}
      </div>
    ),
  }));

  return (
    <div>
      <Tabs items={items} ariaLabel="Installation methods by platform" size="sm" />
      <p className="mt-3 text-[12px] text-ink-mute">
        Package availability follows your distribution and enabled repositories. Entry revised{" "}
        {formatISODate(lastUpdated)} — confirm the current release on the project's own download page.
      </p>
    </div>
  );
}

function MethodCard({ method }: { method: InstallationMethod }) {
  return (
    <article className="rounded-md border border-line bg-card p-3.5">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="min-w-0 flex-1 text-[13.5px] font-semibold text-ink">{method.title}</h4>
        <Badge tone={method.kind === "recommended" ? "success" : "outline"}>
          {KIND_LABEL[method.kind]}
        </Badge>
        <Badge mono tone="outline">
          {method.method}
        </Badge>
        {method.official ? <Badge tone="accent">Official</Badge> : null}
      </div>

      {method.description ? (
        <p className="mt-1.5 text-[13px] leading-6 text-ink-soft">{method.description}</p>
      ) : null}

      {method.requiresElevation ? (
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-[5px] border border-warning/30 bg-warning/[0.07] px-2 py-1 text-[12px] text-ink-soft">
          <ShieldAlert className="size-3.5 text-warning" aria-hidden />
          Needs elevated privileges (sudo / Administrator).
        </p>
      ) : null}

      {method.commands?.length ? (
        <div className="mt-2.5 space-y-2">
          {method.commands.length === 1 ? (
            <CodeSurface command={method.commands[0]} />
          ) : (
            method.commands.map((command, index) => (
              <CommandRow key={`${command}-${index}`} command={command} />
            ))
          )}
        </div>
      ) : null}

      {method.requirements?.length ? (
        <p className="mt-2.5 text-[12.5px] text-ink-mute">
          <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase">Requires · </span>
          {method.requirements.join(", ")}
        </p>
      ) : null}

      {method.notes?.length ? (
        <ul className="mt-2.5 space-y-1 border-t border-line/70 pt-2.5">
          {method.notes.map((note) => (
            <li key={note} className="text-[12.5px] leading-5.5 text-ink-mute">
              {note}
            </li>
          ))}
        </ul>
      ) : null}

      {method.sourceUrl ? (
        <a
          href={method.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2.5 inline-flex items-center gap-1.5 text-[12.5px] text-accent-blue transition-colors hover:underline"
        >
          Open official source
          <ExternalLink className="size-3" aria-hidden />
        </a>
      ) : null}
    </article>
  );
}
