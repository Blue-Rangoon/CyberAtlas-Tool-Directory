import type { Difficulty, PlatformId, ResolvedTool, VerificationStatus } from "@/types";
import { normalize } from "./utils";
import type { SortValue } from "./constants";

/** Directory filter state. URL params are the source of truth, never the DOM. */
export interface ToolFilterState {
  q: string;
  category?: string;
  subcategory?: string;
  platforms: PlatformId[];
  difficulties: Difficulty[];
  source: "all" | "open" | "proprietary";
  status?: VerificationStatus;
  sort: SortValue;
}

export const EMPTY_FILTERS: ToolFilterState = {
  q: "",
  category: undefined,
  subcategory: undefined,
  platforms: [],
  difficulties: [],
  source: "all",
  status: undefined,
  sort: "name",
};

const DIFFICULTIES: Difficulty[] = ["beginner", "intermediate", "advanced"];
const STATUSES: VerificationStatus[] = [
  "verified",
  "community",
  "needs-review",
  "outdated",
  "deprecated",
];

function list<T extends string>(raw: string | null, allowed: readonly T[]): T[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((v) => v.trim())
    .filter((v): v is T => (allowed as readonly string[]).includes(v));
}

export function parseFilters(params: URLSearchParams): ToolFilterState {
  const category = params.get("category") || params.get("cat") || undefined;
  return {
    q: params.get("q") ?? "",
    category,
    subcategory: params.get("subcategory") || undefined,
    platforms: list<PlatformId>(params.get("platform"), [
      "windows",
      "macos",
      "linux",
      "kali",
      "parrot",
      "arch",
      "fedora",
      "docker",
      "source",
      "web",
    ]),
    difficulties: list<Difficulty>(params.get("difficulty"), DIFFICULTIES),
    source: (params.get("source") as ToolFilterState["source"]) ?? "all",
    status: list<VerificationStatus>(params.get("status"), STATUSES)[0],
    sort: (params.get("sort") as SortValue) || "name",
  };
}

/** Serialize back into a flat search-param record (empty values omitted). */
export function serializeFilters(state: ToolFilterState): Record<string, string> {
  const out: Record<string, string> = {};
  if (state.q.trim()) out.q = state.q.trim();
  if (state.category) out.category = state.category;
  if (state.subcategory) out.subcategory = state.subcategory;
  if (state.platforms.length) out.platform = state.platforms.join(",");
  if (state.difficulties.length) out.difficulty = state.difficulties.join(",");
  if (state.source !== "all") out.source = state.source;
  if (state.status) out.status = state.status;
  if (state.sort !== "name") out.sort = state.sort;
  return out;
}

export function activeFilterCount(state: ToolFilterState): number {
  let n = 0;
  if (state.category) n += 1;
  if (state.subcategory) n += 1;
  if (state.subcategory && state.category) n -= 0;
  n += state.platforms.length;
  n += state.difficulties.length;
  if (state.source !== "all") n += 1;
  if (state.status) n += 1;
  if (state.q.trim()) n += 1;
  return n;
}

export function filterTools(
  tools: readonly ResolvedTool[],
  state: ToolFilterState,
): ResolvedTool[] {
  const q = normalize(state.q);
  const tokens = q ? q.split(" ") : [];

  const filtered = tools.filter((tool) => {
    if (state.category && tool.category !== state.category) return false;
    if (state.subcategory && tool.subcategory !== state.subcategory) return false;
    if (
      state.platforms.length &&
      !state.platforms.every((p) => tool.platforms.includes(p))
    )
      return false;
    if (state.difficulties.length && !state.difficulties.includes(tool.difficulty))
      return false;
    if (state.source === "open" && tool.openSource !== true) return false;
    if (state.source === "proprietary" && tool.openSource === true) return false;
    if (state.status && tool.status !== state.status) return false;

    if (tokens.length) {
      const haystack = normalize(
        [
          tool.name,
          tool.shortDescription,
          tool.description.join(" "),
          tool.categoryName,
          tool.subcategoryName ?? "",
          tool.tags.join(" "),
          tool.commands.map((c) => `${c.title} ${c.command}`).join(" "),
        ].join(" "),
      );
      if (!tokens.every((token) => haystack.includes(token))) return false;
    }
    return true;
  });

  return sortTools(filtered, state.sort);
}

export function sortTools(tools: ResolvedTool[], sort: SortValue): ResolvedTool[] {
  const copy = [...tools];
  switch (sort) {
    case "commands":
      return copy.sort((a, b) => b.commandCount - a.commandCount || a.name.localeCompare(b.name));
    case "updated":
      return copy.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated) || a.name.localeCompare(b.name));
    case "difficulty": {
      const rank: Record<Difficulty, number> = { beginner: 0, intermediate: 1, advanced: 2 };
      return copy.sort((a, b) => rank[a.difficulty] - rank[b.difficulty] || a.name.localeCompare(b.name));
    }
    default:
      return copy.sort((a, b) => a.name.localeCompare(b.name));
  }
}
