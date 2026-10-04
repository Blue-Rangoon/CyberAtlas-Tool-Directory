/**
 * Frequently asked questions. Answers are plain text plus optional bullets and
 * internal links so the same data can render the page and the JSON-LD schema.
 */

export type FaqCategory =
  | "general"
  | "tools"
  | "installation"
  | "learning"
  | "comparisons"
  | "community"
  | "safety";

export interface Faq {
  q: string;
  a: string[];
  bullets?: string[];
  links?: { label: string; href: string }[];
  category: FaqCategory;
}

export const FAQ_CATEGORIES: { key: FaqCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "general", label: "General" },
  { key: "tools", label: "Tools & commands" },
  { key: "installation", label: "Installation" },
  { key: "learning", label: "Learning" },
  { key: "comparisons", label: "Comparisons" },
  { key: "community", label: "Community" },
  { key: "safety", label: "Safety & legal" },
];

export const FAQ_CATEGORY_LABEL: Record<FaqCategory, string> = {
  general: "General",
  tools: "Tools & commands",
  installation: "Installation",
  learning: "Learning",
  comparisons: "Comparisons",
  community: "Community",
  safety: "Safety & legal",
};

export const FAQS: Faq[] = [
  {
    q: "What is the CyberAtlas Tool Directory?",
    a: [
      "A curated reference for cybersecurity tooling. For each tool it documents what the tool actually does, which platforms it runs on, how to install it, which commands matter, what those commands mean, where things go wrong, and what the alternatives are.",
      "Around the directory sit learning paths, tool-versus-tool comparisons, printable cheatsheets, beginner concept explainers, and practice resources — all cross-linked so browsing one page leads naturally to the next.",
    ],
    links: [
      { label: "Browse the tools directory", href: "/tools" },
      { label: "About the project", href: "/about" },
    ],
    category: "general",
  },
  {
    q: "Is this site free, and do I need an account?",
    a: [
      "Everything is free and nothing requires an account. There is no login system at all: your theme, cookie choice, roadmap progress ticks and contribution drafts are stored only in your own browser (localStorage), and the site sets no cookies of its own and runs no analytics.",
    ],
    links: [
      { label: "Privacy: what is stored where", href: "/about/privacy" },
      { label: "Cookie policy", href: "/cookies" },
    ],
    category: "general",
  },
  {
    q: "Is there a light theme, and will it be remembered?",
    a: [
      "Yes. Use the sun/moon button in the navigation bar to switch between dark and light. Your choice is saved in your browser's local storage and applied before the page paints on your next visit, so there is no flash of the other theme. Dark is the default until you choose.",
    ],
    links: [{ label: "What else is stored", href: "/cookies" }],
    category: "general",
  },
  {
    q: "What is the cookie notice, and what happens if I decline?",
    a: [
      "The notice appears at the bottom-left after you scroll. It explains that your theme preference is saved in local storage and that the site may show ads. Accept and it is remembered, so it never returns on that browser. Decline and ad partners are not allowed, but the notice comes back on your next visit until you accept.",
      "Your theme choice is functional storage, so it is saved either way.",
    ],
    links: [{ label: "Read the cookie policy", href: "/cookies" }],
    category: "safety",
  },
  {
    q: "Can I run the commands shown here directly from the site?",
    a: [
      "No — and that is deliberate. CyberAtlas is documentation, not a control panel. There is no shell, no playground and no server-side execution. Commands are shown with their purpose, examples and caveats so you can understand them before running anything in your own lab, against systems you own or are explicitly authorized to test.",
    ],
    links: [{ label: "Legal & ethical use", href: "/about/responsible-use" }],
    category: "general",
  },
  {
    q: "How do I find the right tool for a task?",
    a: [
      "Three routes, depending on how you think: browse the seven categories and their subtopics, type the task into global search (tool names, commands, tags and concepts are all indexed), or start from a comparison page when you already have two candidates in mind.",
      "Every tool page ends with alternatives and side-by-side comparisons, so even a wrong first guess leads somewhere useful.",
    ],
    links: [
      { label: "All tools", href: "/tools" },
      { label: "Search the index", href: "/search" },
      { label: "All comparisons", href: "/comparisons" },
    ],
    category: "tools",
  },
  {
    q: "Does a tool work on my operating system?",
    a: [
      "Each tool header lists its documented platforms with icons, and the installation section is grouped into per-platform tabs — Windows, macOS, Linux distributions, Docker and from-source builds where they exist. If your platform has no tab, the dataset has no verified install path for it yet.",
    ],
    links: [{ label: "Example: Nmap installation tabs", href: "/tools/nmap#installation" }],
    category: "tools",
  },
  {
    q: "Why does every command have an explanation attached?",
    a: [
      "Because a bare command is a hazard: the same flags mean different things across versions, some options need privileges, and output like “filtered” versus “closed” changes the conclusion entirely. Every command entry states its purpose, shows an example, labels sample output as illustrative, and calls out prerequisites and warnings.",
    ],
    links: [{ label: "What “Verified” means here", href: "/about/verification" }],
    category: "tools",
  },
  {
    q: "What do the status badges (Verified, Community, Needs review…) mean?",
    a: [
      "They describe where the entry sits in the review pipeline — always as icon plus text, never colour alone:",
    ],
    bullets: [
      "Verified: a maintainer checked the entry against the tool's own documentation.",
      "Community: contributor-submitted and structurally valid, but not independently re-checked.",
      "Needs review: may lag the current upstream release — confirm flags before relying on them.",
      "Outdated / Deprecated: kept for reference; not the recommended path.",
    ],
    links: [{ label: "Verification process", href: "/about/verification" }],
    category: "tools",
  },
  {
    q: "A command from this site failed on my machine. What should I check?",
    a: [
      "In order: the tool version you have versus the one the entry was written against, whether the command needs elevated privileges, whether you are on the platform the example assumes (flags differ between builds), and whether the target or network answers at all.",
      "Each tool page has a Common errors section for the failures people actually hit. If the entry itself is wrong, reporting it is one of the most useful contributions you can make.",
    ],
    links: [{ label: "Suggest an edit", href: "/community/suggest-edit" }],
    category: "tools",
  },
  {
    q: "How do I install a tool — the guide lists several methods?",
    a: [
      "Methods are labelled Recommended, Alternative or Manual. Recommended is the path most people should take (usually the system package manager or the official installer); alternatives cover other managers and release binaries; Manual covers building from source or containers.",
      "Any method needing sudo or Administrator rights is marked. Package names follow your distribution's repositories, so confirm the current release on the project's own download page — every tool page links to it.",
    ],
    links: [{ label: "Sources and citation policy", href: "/about/sources" }],
    category: "installation",
  },
  {
    q: "Do I need Kali Linux or a special OS to follow along?",
    a: [
      "No. Most documented tools install on ordinary Windows, macOS or Linux systems, and the installation tabs say so explicitly. Specialized distributions are convenient because they pre-install tooling and drivers, but every beginner path in this directory starts from a plain Linux virtual machine you own.",
    ],
    links: [{ label: "Absolute Beginner roadmap", href: "/roadmaps/absolute-beginner" }],
    category: "installation",
  },
  {
    q: "I'm completely new. Where do I start?",
    a: [
      "Read two short concepts (what an IP address is, what a port is), then open the Absolute Beginner roadmap: it orders lab setup, Linux basics, networking, HTTP/DNS and your first vulnerability class into stages with exercises. Pair each stage with an isolated lab rather than anything on a real network.",
    ],
    links: [
      { label: "Learning Hub", href: "/learning" },
      { label: "Absolute Beginner path", href: "/roadmaps/absolute-beginner" },
      { label: "Practice labs", href: "/learning#labs" },
    ],
    category: "learning",
  },
  {
    q: "What is the difference between a roadmap, a concept and a cheatsheet?",
    a: [
      "A roadmap is a study order: stages with topics, tools and exercises. A concept is a short explainer answering one question (“What is DNS?”) for readers who have not met the vocabulary yet. A cheatsheet is a retrieval document: one line per command, grouped by task, copyable and printable.",
      "They link to each other — roadmap stages name the tools they assume, tool pages name the concepts they assume.",
    ],
    links: [
      { label: "All roadmaps", href: "/roadmaps" },
      { label: "All cheatsheets", href: "/cheatsheets" },
    ],
    category: "learning",
  },
  {
    q: "Will completing a roadmap make me job-ready or certified?",
    a: [
      "No, and any site that promises that is selling something. A roadmap structures study; the proof is what you can demonstrate on targets you are allowed to touch. Certifications are separate exams with their own requirements — the Learning Hub lists several with a plain description of what each one actually measures.",
    ],
    links: [{ label: "Certifications", href: "/learning#certifications" }],
    category: "learning",
  },
  {
    q: "Where can I legally practise what I learn?",
    a: [
      "Only against systems you own or have explicit written permission to test: deliberately vulnerable applications you host yourself, CTF ranges, and vendor-provided labs. The Learning Hub's labs and CTF sections list concrete starting points, each labelled as an external project.",
    ],
    links: [
      { label: "Practice labs", href: "/learning#labs" },
      { label: "Responsible use", href: "/about/responsible-use" },
    ],
    category: "learning",
  },
  {
    q: "Why don't comparison pages declare a winner?",
    a: [
      "Because the better tool depends on the target, the network, the licence and the team — a page that ignored that would be marketing. Comparisons describe documented behaviour attribute by attribute, then say when each tool is the better fit, so you can decide against your own constraints.",
    ],
    links: [{ label: "Example: ffuf vs Gobuster", href: "/comparisons/ffuf-vs-gobuster" }],
    category: "comparisons",
  },
  {
    q: "The comparison I need isn't listed. Can I request it?",
    a: [
      "Yes. Request it through the tool-request form and name both tools — the pair can be documented once both tool pages exist, since comparisons reference the same typed entries rather than duplicating content.",
    ],
    links: [{ label: "Request a tool or comparison", href: "/community/request-tool" }],
    category: "comparisons",
  },
  {
    q: "How can I contribute?",
    a: [
      "Add a tool entry, fix a wrong flag or stale install step, extend a thin page, report outdated content, or improve the frontend (accessibility, responsive behaviour, search). The contribution guide walks through the data model file by file, and the request/edit forms build reviewable drafts locally in your browser.",
    ],
    links: [
      { label: "Contribution guide", href: "/community/contribute" },
      { label: "Community overview", href: "/community" },
    ],
    category: "community",
  },
  {
    q: "I found something wrong. What is the fastest way to report it?",
    a: [
      "Use Suggest an edit, pick the entry and section, quote what is wrong and link the upstream source that proves it. That produces a precise, reviewable draft. Entries with confirmed problems are marked Needs review rather than left silently wrong.",
    ],
    links: [{ label: "Suggest an edit", href: "/community/suggest-edit" }],
    category: "community",
  },
  {
    q: "Is my contribution reviewed before it goes live?",
    a: [
      "Yes. The workflow is contributor → submission → review → verification → publication. Community-submitted material is labelled as such until a maintainer has checked it against upstream documentation — nothing is automatically trusted.",
    ],
    links: [{ label: "How a change becomes content", href: "/community" }],
    category: "community",
  },
  {
    q: "Is it legal to use these tools?",
    a: [
      "Tools are documentation subjects here, and legality depends entirely on authorization: testing a system you do not own or lack explicit written permission to test is unlawful in most jurisdictions — including scans that “only” read a banner. In-scope testing with written permission, in an agreed window, against named assets, is the professional norm this site assumes throughout.",
    ],
    links: [{ label: "Legal & ethical use", href: "/about/responsible-use" }],
    category: "safety",
  },
  {
    q: "What should I do if I find a real vulnerability or exposed data?",
    a: [
      "Stop, do not collect or demonstrate further, and report it to the owner the same day with reproduction steps and no data you did not need. That applies during CTFs, bug bounty programs and assessments alike — and it is also what most professional codes of conduct require.",
    ],
    links: [{ label: "Responsible use", href: "/about/responsible-use" }],
    category: "safety",
  },
  {
    q: "Why does the site refuse to show download counts, stars or rankings?",
    a: [
      "Because this build cannot verify any of them, and invented metrics would be decoration pretending to be information. Counts on this site — tools, commands, cheatsheet entries, dataset revision — are all derived from the content itself, so they stay true as the dataset changes.",
    ],
    links: [{ label: "About the project", href: "/about" }],
    category: "general",
  },
];
