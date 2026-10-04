import { CHEATSHEET_BY_SLUG } from "@/data/cheatsheets";
import { COMPARISONS } from "@/data/comparisons";
import { CONCEPTS } from "@/data/learning";
import { ROADMAPS } from "@/data/roadmaps";
import { POPULAR_TOOLS, TOOLS } from "@/data/tools";
import { search } from "@/lib/search";
import { platformLabel } from "@/lib/platforms";
import { normalize, truncate } from "@/lib/utils";
import type { PlatformId, ResolvedTool, SearchEntry } from "@/types";

/**
 * Atlas's local directory guide. No API calls, model, command execution or
 * synthetic security advice: every result links back to authored site content.
 * This module is imported only by the lazy-loaded chat panel, not the shell.
 */
export interface AtlasResult {
  title: string;
  detail: string;
  href: string;
  type: string;
  /** Copiable documentation only, never executed. */
  command?: string;
  warning?: string;
}

export interface AtlasReply {
  text: string;
  results?: AtlasResult[];
}

export const ATLAS_PROMPTS = [
  "Where should I start?",
  "What does Nmap do?",
  "Install Nmap on Linux",
  "Show Nmap commands",
  "ffuf vs Gobuster",
] as const;

const CONCEPT_TERMS: Record<string, string[]> = {
  "what-is-an-ip-address": ["ip address", "ipv4", "ipv6"],
  "what-is-a-port": ["port", "ports"],
  "what-is-dns": ["dns", "domain name system"],
  "what-is-http": ["http", "https"],
  "tcp-vs-udp": ["tcp vs udp", "tcp versus udp", "udp vs tcp", "tcp", "udp"],
  "what-is-cidr": ["cidr", "subnet mask"],
  "hashing-vs-encryption": ["hashing vs encryption", "hashing", "encryption"],
  "what-is-a-vulnerability": ["vulnerability", "vulnerabilities"],
  "what-is-a-firewall": ["firewall"],
  "what-is-osint": ["osint", "open source intelligence"],
};

function mentioned(input: string, word: string): boolean {
  const normalizedWord = normalize(word);
  const escaped = normalizedWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`).test(input);
}

function findTool(input: string): ResolvedTool | undefined {
  // Long names first, so a multi-word name is not preempted by a substring.
  return [...TOOLS]
    .sort((a, b) => b.name.length - a.name.length)
    .find((tool) => mentioned(input, tool.name) || mentioned(input, tool.slug));
}

function findConcept(input: string) {
  const ordered = Object.entries(CONCEPT_TERMS).flatMap(([slug, terms]) =>
    terms.map((term) => ({ slug, term })),
  );
  ordered.sort((a, b) => b.term.length - a.term.length);
  const found = ordered.find(({ term }) => mentioned(input, term));
  return found ? CONCEPTS.find((c) => c.slug === found.slug) : undefined;
}

function inferPlatform(input: string): PlatformId | undefined {
  if (/\b(windows|winget|powershell|win10|win11)\b/.test(input)) return "windows";
  if (/\b(macos|mac os|macbook|homebrew|brew)\b/.test(input)) return "macos";
  if (/\bkali\b/.test(input)) return "kali";
  if (/\bparrot\b/.test(input)) return "parrot";
  if (/\barch\b/.test(input)) return "arch";
  if (/\b(fedora|dnf)\b/.test(input)) return "fedora";
  if (/\bdocker\b/.test(input)) return "docker";
  if (/\b(ubuntu|debian|linux|apt)\b/.test(input)) return "linux";
  return undefined;
}

function toolResult(tool: ResolvedTool): AtlasResult {
  return {
    title: tool.name,
    detail: tool.shortDescription,
    href: tool.docsPath,
    type: "Tool",
  };
}

function entryResult(entry: SearchEntry): AtlasResult {
  return {
    title: entry.parent ? `${entry.parent} · ${entry.title}` : entry.title,
    detail: truncate(entry.subtitle, 130),
    href: entry.href,
    type: entry.type === "resource" ? "External resource index" : entry.type,
    ...(entry.type === "command" ? { command: entry.subtitle } : {}),
  };
}

function help(): AtlasReply {
  return {
    text: "I can look up this directory's documented tools, installation steps, commands, concepts and learning paths. Try a question, a starter prompt, or one of these shortcuts. This is a local content guide — not a connected AI model.",
    results: [
      { title: "/tools", detail: "Browse the documented tool entries", href: "/tools", type: "Shortcut" },
      { title: "/commands nmap", detail: "Show a tool's documented commands", href: "/tools/nmap#commands", type: "Shortcut" },
      { title: "/install nmap linux", detail: "Look up installation instructions", href: "/tools/nmap#installation", type: "Shortcut" },
      { title: "/roadmaps", detail: "Explore structured learning paths", href: "/roadmaps", type: "Shortcut" },
    ],
  };
}

function installation(tool: ResolvedTool, input: string): AtlasReply {
  const requestedPlatform = inferPlatform(input);
  if (!requestedPlatform) {
    return {
      text: `Which platform are you using for ${tool.name}? Its documentation has platform-specific installation tabs. Try “Install ${tool.name} on Linux” or name your OS.`,
      results: [{ ...toolResult(tool), href: `${tool.docsPath}#installation` }],
    };
  }

  // Some distribution-specific entries use the generic Linux method.
  const methods = tool.installation.filter((m) => m.platform === requestedPlatform);
  const fallback = requestedPlatform !== "linux" && ["kali", "parrot"].includes(requestedPlatform)
    ? tool.installation.filter((m) => m.platform === "linux")
    : [];
  const available = methods.length ? methods : fallback;
  const method = available.find((m) => m.kind === "recommended") ?? available[0];

  if (!method) {
    return {
      text: `I don't have a documented ${platformLabel(requestedPlatform)} installation method for ${tool.name}. Check the tool's upstream download page rather than guessing a package name.`,
      results: [{ ...toolResult(tool), href: `${tool.docsPath}#installation` }],
    };
  }

  const isFallback = method.platform !== requestedPlatform;
  return {
    text: `The ${tool.name} entry lists ${method.title} for ${isFallback ? `Linux-based ${platformLabel(requestedPlatform)}` : platformLabel(requestedPlatform)}.${method.requiresElevation ? " It requires elevated privileges." : ""} Check the full instructions and upstream source before installing.`,
    results: [
      {
        title: method.title,
        detail: method.description ?? `Documented ${platformLabel(method.platform)} installation method`,
        href: `${tool.docsPath}#installation`,
        type: "Installation",
        command: method.commands?.join("\n"),
        warning: method.notes?.[0],
      },
    ],
  };
}

function commands(tool: ResolvedTool, input: string): AtlasReply {
  const matches = search(input, 18)
    .filter(({ entry }) => entry.type === "command" && entry.parent === tool.name)
    .map(({ entry }) => tool.commands.find((c) => `command:${tool.slug}:${c.id}` === entry.id))
    .filter((command): command is ResolvedTool["commands"][number] => Boolean(command));

  // Generic queries such as "show nmap commands" should start with the
  // documented first commands, not whichever record happens to mention "nmap".
  const specific = /-[a-z][a-z0-9-]*|service detection|syn scan|port scan/i.test(input);
  const selected = specific && matches.length ? matches.slice(0, 3) : tool.commands.slice(0, 3);

  if (!selected.length) {
    return {
      text: `There are no commands documented for ${tool.name} yet. Its official documentation is the reliable source until an entry is added.`,
      results: [toolResult(tool)],
    };
  }

  return {
    text: `Here are ${selected.length} documented ${tool.name} commands. These are examples for authorized environments, not commands run by this site. Open an entry for explanation, expected behaviour and caveats.`,
    results: selected.map((command) => ({
      title: command.title,
      detail: command.description,
      href: `${tool.docsPath}#cmd-${command.id}`,
      type: "Command",
      command: command.command,
      warning: command.warnings?.[0],
    })),
  };
}

function compare(input: string): AtlasReply {
  const match = COMPARISONS.find(
    (comparison) =>
      mentioned(input, comparison.title) ||
      (mentioned(input, comparison.toolA) && mentioned(input, comparison.toolB)),
  );
  if (match) {
    return {
      text: `${match.description} ${match.verdictNote}`,
      results: [
        { title: match.title, detail: `${match.features.length} documented attributes, plus when each tool fits`, href: `/comparisons/${match.slug}`, type: "Comparison" },
      ],
    };
  }
  return {
    text: "Comparisons here describe trade-offs, not universal winners. Name two tools — for example “ffuf vs Gobuster” — or browse the documented pairs.",
    results: COMPARISONS.slice(0, 3).map((item) => ({
      title: item.title,
      detail: item.description,
      href: `/comparisons/${item.slug}`,
      type: "Comparison",
    })),
  };
}

function roadmaps(input: string): AtlasReply {
  const found = ROADMAPS.find((roadmap) => mentioned(input, roadmap.title) || mentioned(input, roadmap.slug));
  const items = found ? [found] : ROADMAPS.slice(0, 3);
  return {
    text: found
      ? `${found.description} It has ${found.stages.length} stages and is intended for ${found.audience.toLowerCase()}.`
      : "The roadmaps sequence concepts, tools and exercises. They structure study; completing one does not certify competence. Start with a path that matches your current experience.",
    results: items.map((roadmap) => ({
      title: roadmap.title,
      detail: `${roadmap.stages.length} stages · ${roadmap.estimatedDuration}`,
      href: `/roadmaps/${roadmap.slug}`,
      type: "Roadmap",
    })),
  };
}

function concept(input: string): AtlasReply | undefined {
  const found = findConcept(input);
  if (!found) return undefined;
  return {
    text: found.summary,
    results: [
      {
        title: found.title,
        detail: `${found.minutes} min read · Includes examples and sources`,
        href: `/learning/concepts/${found.slug}`,
        type: "Concept",
      },
    ],
  };
}

function overview(tool: ResolvedTool): AtlasReply {
  const sheet = CHEATSHEET_BY_SLUG.get(tool.slug);
  return {
    text: `${tool.name} — ${tool.shortDescription}. ${truncate(tool.description[0] ?? "", 210)}`,
    results: [
      toolResult(tool),
      ...(sheet
        ? [{ title: `${sheet.title} cheatsheet`, detail: "Quick-reference commands with copy actions", href: `/cheatsheets/${sheet.slug}`, type: "Cheatsheet" }]
        : []),
    ],
  };
}

/** A deterministic, source-linked response to a local directory question. */
export function resolveAtlasInput(raw: string): AtlasReply {
  const input = normalize(raw.trim());
  if (!input) return help();
  if (/^\/?(help|hi|hello|hey|what can you do)\b/.test(input)) return help();

  if (/\b(permission|legal|authorized|authorised|ethic|responsible use|in scope)\b/.test(input)) {
    return {
      text: "Run security tools only against systems you own or have explicit written permission to test. Scope, rate limits and a stop condition matter more than a tool's flags. For practice, use isolated labs and CTF environments.",
      results: [
        { title: "Legal & ethical use", detail: "The testing boundaries this directory assumes", href: "/about/responsible-use", type: "Guide" },
        { title: "Practice labs", detail: "Deliberately vulnerable, authorized environments", href: "/learning#labs", type: "Learning" },
      ],
    };
  }

  if (/\b(compare|comparison|versus| vs |difference between)\b/.test(input) || input.startsWith("/compare")) {
    return compare(input);
  }

  if (/^\/tools\b/.test(input)) {
    return {
      text: "Browse the directory by category, platform or difficulty. Every tool entry includes its installation methods and documented commands.",
      results: [
        { title: "All tools", detail: "Filter the full directory", href: "/tools", type: "Directory" },
        ...POPULAR_TOOLS.slice(0, 2).map(toolResult),
      ],
    };
  }

  const tool = findTool(input);
  if (/\b(install|installation|setup|set up|download)\b/.test(input) || input.startsWith("/install")) {
    return tool
      ? installation(tool, input)
      : { text: "Name the tool and platform, for example “/install nmap linux”. I only show instructions actually documented in the directory.", results: [{ title: "Browse tools", detail: "Pick a documented tool first", href: "/tools", type: "Directory" }] };
  }

  const asksForCommand =
    /\b(command|commands|usage|syntax|flags?|example|examples|service detection)\b/.test(input) ||
    input.startsWith("/commands") ||
    // A pasted invocation such as "nmap -sV" is a command question too.
    (Boolean(tool) && /(?:^|\s)--?[a-z]/i.test(raw));
  if (asksForCommand) {
    return tool
      ? commands(tool, input)
      : { text: "Name a tool to see its documented commands — for example “/commands nmap”. I won't invent shell syntax for a tool I can't identify.", results: [{ title: "Browse tools", detail: "Choose a documented entry", href: "/tools", type: "Directory" }] };
  }

  if (/\b(start|beginner|learning path|roadmap|learn|study)\b/.test(input) || input.startsWith("/roadmaps")) {
    return roadmaps(input);
  }

  if (input.startsWith("/concept") || /\b(what is|explain|how does|meaning of|define)\b/.test(input)) {
    const answer = concept(input);
    if (answer) return answer;
  }

  if (tool) return overview(tool);

  // A bare term like "DNS" is a concept lookup; a task such as "find a port
  // scanning tool" must search the directory instead of being diverted to the
  // "What is a port?" explainer simply because it contains the word "port".
  const bareTopic = input.split(/\s+/).length <= 2 && !/\b(tool|tools|scan|scanner|find|install|command)\b/.test(input);
  if (bareTopic) {
    const conceptAnswer = concept(input);
    if (conceptAnswer) return conceptAnswer;
  }

  const hits = search(raw, 16);
  const unique = new Set<string>();
  const results = hits
    .filter(({ entry }) => {
      if (unique.has(entry.href)) return false;
      unique.add(entry.href);
      return true;
    })
    .slice(0, 4)
    .map(({ entry }) => entryResult(entry));

  if (results.length) {
    return {
      text: "These are the closest matches I found in CyberAtlas's local index. Open a page for its full context and references; I don't generate answers beyond the documented content.",
      results,
    };
  }

  return {
    text: "I couldn't find that in the local directory yet. Try a tool name, a command, or a topic like DNS. For broader lookup, use the site's full search.",
    results: [
      { title: "Search the directory", detail: "Search tools, commands and learning content", href: `/search?q=${encodeURIComponent(raw.trim())}`, type: "Search" },
      { title: "Request a tool", detail: "Help fill a gap in the dataset", href: "/community/request-tool", type: "Community" },
    ],
  };
}
