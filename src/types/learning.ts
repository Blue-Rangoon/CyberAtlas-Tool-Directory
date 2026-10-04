import type { Command, Difficulty, SourceRef } from "./common";

export interface RoadmapTopic {
  /** Optional internal link target, e.g. "/tools/nmap" or a concept page. */
  href?: string;
  label: string;
}

export interface RoadmapStage {
  number: number;
  slug: string;
  title: string;
  description: string;
  duration: string;
  /** Optional: a stage may legitimately be exercises and tools only. */
  topics?: RoadmapTopic[];
  tools: string[];
  exercises?: string[];
  resources?: SourceRef[];
}

export interface Roadmap {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  /** Difficulty span when a path starts easy and ends advanced. */
  difficultyRange?: [Difficulty, Difficulty];
  audience: string;
  estimatedDuration: string;
  prerequisites: string[];
  outcome: string;
  icon: string;
  stages: RoadmapStage[];
  relatedTools: string[];
  featured?: boolean;
}

export type ComparisonValue =
  | string
  | boolean
  | { text: string; note?: string };

export interface ComparisonFeature {
  group: string;
  feature: string;
  a: ComparisonValue;
  b: ComparisonValue;
  notes?: string;
}

export interface ComparisonSide {
  tool: string;
  summary: string;
  strengths: string[];
  limitations: string[];
  whenToUse: string[];
}

export interface Comparison {
  slug: string;
  title: string;
  toolA: string;
  toolB: string;
  description: string;
  /** Framing that keeps the page neutral rather than a verdict. */
  verdictNote: string;
  categories: string[];
  sides: [ComparisonSide, ComparisonSide];
  features: ComparisonFeature[];
  workflowExamples?: { title: string; a?: string; b?: string; note: string }[];
  relatedComparisons: string[];
  references?: SourceRef[];
  lastUpdated: string;
}

export interface CheatsheetSection {
  title: string;
  intro?: string;
  entries: { label: string; command: string; note?: string }[];
}

export interface Cheatsheet {
  slug: string;
  title: string;
  description: string;
  category: string;
  tool?: string;
  icon: string;
  sections: CheatsheetSection[];
  lastUpdated: string;
}

export interface ConceptSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  code?: { language: string; value: string }[];
  callout?: { tone: "info" | "warning"; text: string };
}

export interface Concept {
  slug: string;
  title: string;
  question: string;
  summary: string;
  difficulty: Difficulty;
  minutes: number;
  icon: string;
  sections: ConceptSection[];
  checkYourUnderstanding?: { question: string; answer: string }[];
  relatedConcepts?: string[];
  relatedTools?: string[];
  sources?: SourceRef[];
}

export type ResourceType =
  | "lab"
  | "ctf"
  | "guide"
  | "certification"
  | "book"
  | "course";

/** Deliberately small: practice resources mostly point at external projects and
 *  are always labelled as external, never as CyberAtlas content. */
export interface LearningResource {
  slug: string;
  type: ResourceType;
  title: string;
  provider: string;
  description: string;
  url: string;
  difficulty?: Difficulty;
  /** Only listing credentials an exam body actually publishes. */
  issuer?: string;
  tags?: string[];
}

export interface SearchEntry {
  id: string;
  type:
    | "tool"
    | "command"
    | "category"
    | "subcategory"
    | "roadmap"
    | "stage"
    | "concept"
    | "cheatsheet"
    | "comparison"
    | "resource";
  title: string;
  subtitle: string;
  href: string;
  /** Parent context, e.g. "Nmap" for a command. */
  parent?: string;
  haystack: string;
  weight: number;
}

export interface ContentUpdate {
  slug: string;
  href: string;
  title: string;
  kind: string;
  date: string;
  type: "tool" | "cheatsheet" | "roadmap" | "comparison" | "concept";
}
