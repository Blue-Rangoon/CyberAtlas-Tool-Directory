import type { VerificationStatus } from "@/types";

/** Single place for product-level metadata. */
export const SITE = {
  name: "CyberAtlas Tool Directory",
  shortName: "CyberAtlas",
  tagline: "Cybersecurity Tools. Commands. Knowledge.",
  description:
    "A curated, community-maintained directory of cybersecurity tools: what they do, how to install them, the commands that matter and where they fit in a learning path.",
  /** Dataset revision — surfaced honestly instead of invented activity metrics. */
  datasetVersion: "1.0.0",
  datasetRevision: "2026-01-19",
} as const;

export const NAV_LINKS = [
  { href: "/tools", label: "Tools" },
  { href: "/roadmaps", label: "Roadmaps" },
  { href: "/comparisons", label: "Comparisons" },
  { href: "/cheatsheets", label: "Cheatsheets" },
  { href: "/learning", label: "Learning Hub" },
  { href: "/community", label: "Community" },
] as const;

export const MOBILE_NAV_GROUPS = [
  {
    title: "Explore",
    links: [
      { href: "/tools", label: "All tools" },
      { href: "/tools/osint", label: "OSINT" },
      { href: "/tools/pentesting", label: "Pentesting" },
      { href: "/tools/networking", label: "Networking" },
      { href: "/roadmaps", label: "Roadmaps" },
      { href: "/comparisons", label: "Comparisons" },
      { href: "/cheatsheets", label: "Cheatsheets" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/learning", label: "Learning Hub" },
      { href: "/learning/concepts/what-is-a-port", label: "Concept: ports" },
      { href: "/learning/concepts/tcp-vs-udp", label: "Concept: TCP vs UDP" },
      { href: "/learning#labs", label: "Practice labs" },
      { href: "/learning#certifications", label: "Certifications" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/community", label: "Overview" },
      { href: "/community/request-tool", label: "Request a tool" },
      { href: "/community/suggest-edit", label: "Suggest an edit" },
      { href: "/community/contribute", label: "Contribution guide" },
    ],
  },
  {
    title: "Project",
    links: [
      { href: "/about", label: "About" },
      { href: "/faqs", label: "FAQs" },
      { href: "/cookies", label: "Cookie policy" },
      { href: "/about/responsible-use", label: "Responsible use" },
      { href: "/about/verification", label: "Verification" },
    ],
  },
] as const;

export const STATUS_META: Record<
  VerificationStatus,
  { label: string; description: string; className: string; icon: "check" | "users" | "clock" | "alert" | "ban" }
> = {
  verified: {
    label: "Verified",
    description:
      "Reviewed by a CyberAtlas maintainer against the tool's own documentation.",
    className: "text-success",
    icon: "check",
  },
  community: {
    label: "Community",
    description: "Contributor-submitted. Not every claim has been re-checked.",
    className: "text-accent-blue",
    icon: "users",
  },
  "needs-review": {
    label: "Needs review",
    description: "May lag the current upstream release. Verify before relying on it.",
    className: "text-warning",
    icon: "clock",
  },
  outdated: {
    label: "Outdated",
    description: "Known to differ from the current version of the tool.",
    className: "text-warning",
    icon: "alert",
  },
  deprecated: {
    label: "Deprecated",
    description: "Kept for reference. Do not treat this as the recommended path.",
    className: "text-danger",
    icon: "ban",
  },
};

export const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const SORT_OPTIONS = [
  { value: "name", label: "Name A–Z" },
  { value: "commands", label: "Most commands" },
  { value: "updated", label: "Recently updated" },
  { value: "difficulty", label: "Easiest first" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

/** Keys used by the tools directory URL state. */
export const FILTER_KEYS = {
  category: "category",
  subcategory: "subcategory",
  platform: "platform",
  difficulty: "difficulty",
  source: "source",
  status: "status",
  q: "q",
  sort: "sort",
} as const;
