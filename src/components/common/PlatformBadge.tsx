import { getIcon } from "@/lib/icons";
import { PLATFORMS } from "@/lib/platforms";
import type { PlatformId } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Platform indicators for cards and headers. Compact labels on purpose:
 * "Windows Linux macOS" has to fit in one dense row without becoming pills.
 */
export function PlatformBadge({
  platform,
  showLabel = true,
  className,
}: {
  platform: PlatformId;
  showLabel?: boolean;
  className?: string;
}) {
  const def = PLATFORMS[platform];
  if (!def) return null;
  const Icon = getIcon(def.icon);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[11.5px] text-ink-soft",
        className,
      )}
      title={`Documented for ${def.label}`}
    >
      <Icon className="size-3.5 text-ink-mute" aria-hidden />
      <span className={showLabel ? undefined : "sr-only"}>{def.short}</span>
    </span>
  );
}

export function PlatformRow({
  platforms,
  className,
  limit,
}: {
  platforms: PlatformId[];
  className?: string;
  limit?: number;
}) {
  const shown = limit ? platforms.slice(0, limit) : platforms;
  const rest = platforms.length - shown.length;
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", className)}>
      {shown.map((p) => (
        <li key={p}>
          <PlatformBadge platform={p} />
        </li>
      ))}
      {rest > 0 ? (
        <li className="text-[11.5px] text-ink-mute">+{rest} more</li>
      ) : null}
    </ul>
  );
}
