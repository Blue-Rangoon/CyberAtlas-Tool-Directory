import {
  BookOpen,
  Layers,
  Radar,
  Scale,
  ScanSearch,
  ScrollText,
  Search,
  Terminal,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import type { SearchEntry } from "@/types";

/** Type → icon/label used by both the palette and the search results page. */
export const SEARCH_GROUPS_ICONS: Partial<Record<SearchEntry["type"], LucideIcon>> = {
  tool: Radar,
  command: Terminal,
  category: ScanSearch,
  subcategory: Waypoints,
  roadmap: Layers,
  stage: Layers,
  concept: BookOpen,
  cheatsheet: ScrollText,
  comparison: Scale,
  resource: Search,
};

export const PATH_LABEL: Record<SearchEntry["type"], string> = {
  tool: "tool",
  command: "command",
  category: "category",
  subcategory: "sub",
  roadmap: "roadmap",
  stage: "stage",
  concept: "concept",
  cheatsheet: "cheatsheet",
  comparison: "compare",
  resource: "external",
};

export const GROUP_BLURB: Record<SearchEntry["type"], string> = {
  tool: "Tools in the directory",
  command: "Documented commands with context",
  category: "Top-level categories",
  subcategory: "Category branches",
  roadmap: "Learning paths",
  stage: "Individual roadmap stages",
  concept: "Beginner concept explainers",
  cheatsheet: "Reference sheets",
  comparison: "Tool-versus-tool pages",
  resource: "External labs, books and frameworks",
};
