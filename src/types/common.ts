/**
 * Shared primitives used by every content entity.
 *
 * Content is authored as typed TypeScript objects (see `src/data/**`), which
 * keeps the frontend static while leaving a clean mapping to a future API,
 * MDX pipeline or JSON store.
 */

/** Canonical platform identifiers. Never free-text these in the UI. */
export type PlatformId =
  | "windows"
  | "macos"
  | "linux"
  | "parrot"
  | "kali"
  | "arch"
  | "fedora"
  | "docker"
  | "source"
  | "web";

export interface PlatformDef {
  id: PlatformId;
  /** Display label used in badges, tabs and filters. */
  label: string;
  /** Short label for dense rows. */
  short: string;
  /** Key into the icon registry (src/lib/icons.ts). */
  icon: string;
  /** True for operating systems (used by the platform filter group). */
  isOs: boolean;
  /** Whether CyberAtlas documents first-class install instructions for it. */
  installable: boolean;
}

/** Content trust states. Always rendered as icon + label, never color alone. */
export type VerificationStatus =
  | "verified"
  | "community"
  | "needs-review"
  | "outdated"
  | "deprecated";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface SourceRef {
  label: string;
  url: string;
  /** What the reader can verify by following the link. */
  note?: string;
}

/** A single shell command with the context required to use it safely. */
export interface Command {
  id: string;
  title: string;
  /** What the command is for. Required: no bare commands in this product. */
  description: string;
  command: string;
  shell?: "bash" | "powershell" | "cmd" | "zsh" | "fish" | "sh";
  platform?: PlatformId;
  difficulty?: Difficulty;
  /** Concrete invocation a reader can copy. */
  example?: string;
  /** Illustrative only — the UI labels it as example output. */
  expectedOutput?: string;
  notes?: string[];
  warnings?: string[];
  tags?: string[];
}

export type InstallKind = "recommended" | "alternative" | "manual";

export interface InstallationMethod {
  platform: PlatformId;
  /** Package manager or technique name, e.g. "apt", "winget", "Source". */
  method: string;
  title: string;
  kind: InstallKind;
  description?: string;
  commands?: string[];
  requirements?: string[];
  notes?: string[];
  /** Set when the method is expected to need admin/root privileges. */
  requiresElevation?: boolean;
  official?: boolean;
  sourceUrl?: string;
}

export interface ErrorEntry {
  symptom: string;
  causes: string[];
  solution: string;
  commands?: string[];
}

export interface UseCase {
  title: string;
  description: string;
  commands?: string[];
}
