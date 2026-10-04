/** Tiny dependency-free helpers shared across the app. */

/** Conditional className joiner (avoids shipping a clsx/tailwind-merge dep). */
export function cn(
  ...parts: (string | false | null | undefined)[]
): string {
  return parts.filter((p): p is string => Boolean(p)).join(" ");
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** `2026-01-14` -> `14 Jan 2026` (ISO keeps sorting stable in data files). */
export function formatISODate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

const DAY = 86_400_000;

/** Relative label for activity feeds. Falls back to an absolute date beyond 60
 *  days so the copy never becomes misleading over time. */
export function relativeFromNow(iso: string, now = Date.now()): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const then = Date.UTC(y, m - 1, d);
  const days = Math.round((now - then) / DAY);
  if (Number.isNaN(days)) return iso;
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  if (days < 60) return "last month";
  return formatISODate(iso);
}

export function truncate(value: string, max: number): string {
  return value.length <= max ? value : `${value.slice(0, max - 1).trimEnd()}…`;
}

export function groupBy<T, K extends string>(
  items: readonly T[],
  key: (item: T) => K,
): Record<K, T[]> {
  const out = {} as Record<K, T[]>;
  for (const item of items) {
    const k = key(item);
    (out[k] ??= []).push(item);
  }
  return out;
}

/** Case-insensitive substring test used by lightweight in-page filters. */
export function includes(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.trim().toLowerCase());
}

/** Normalise text for fuzzy-ish scoring without a search library. */
export function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9 +./-]/g, " ").replace(/\s+/g, " ").trim();
}

/** Escapes HTML special chars for generated issue/markdown drafts. */
export function toMarkdownList(items: readonly string[]): string {
  return items.map((i) => `- ${i}`).join("\n");
}
