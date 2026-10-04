import type {
  Command,
  Difficulty,
  ErrorEntry,
  InstallationMethod,
  PlatformId,
  SourceRef,
  UseCase,
  VerificationStatus,
} from "./common";

export interface Subcategory {
  slug: string;
  name: string;
  description: string;
}

export interface Category {
  slug: string;
  name: string;
  /** One-line summary shown on the category card. */
  blurb: string;
  /** Longer framing shown at the top of a category page. */
  description: string;
  icon: string;
  /** Accent token name from globals.css, e.g. "osint". */
  accent: "osint" | "correlation" | "accent" | "accent-blue" | "warning";
  subcategories: Subcategory[];
}

export interface ToolExample {
  title: string;
  scenario: string;
  steps: { label: string; command: string }[];
  outcome: string;
}

export interface Tool {
  slug: string;
  name: string;
  /** Directory subtitle, e.g. "Network discovery and port scanning". */
  shortDescription: string;
  /** Overview paragraphs — curated summary, not copied manual text. */
  description: string[];
  category: string;
  subcategory?: string;
  /** Key into the icon registry. */
  icon: string;
  website?: string;
  repository?: string;
  documentation?: string;
  license?: string;
  openSource?: boolean;
  difficulty: Difficulty;
  platforms: PlatformId[];
  tags: string[];
  status: VerificationStatus;
  /** Upstream release the documentation was written against. Optional:
   *  omitted entirely when it cannot be verified (no invented values). */
  version?: string;
  /** Date the CyberAtlas documentation entry last changed (dataset metadata). */
  lastUpdated: string;
  commonlyUsed?: boolean;
  installation: InstallationMethod[];
  commands: Command[];
  examples?: ToolExample[];
  useCases?: UseCase[];
  commonErrors?: ErrorEntry[];
  tips?: string[];
  alternatives?: string[];
  relatedTools?: string[];
  references?: SourceRef[];
}

/** Tool + derived navigation data, produced once in the registry. */
export interface ResolvedTool extends Tool {
  categoryName: string;
  categorySlug: string;
  categoryAccent: Category["accent"];
  subcategoryName?: string;
  commandCount: number;
  docsPath: string;
}
