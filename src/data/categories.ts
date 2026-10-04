import type { Category } from "@/types";

/**
 * The category spine of the directory.
 *
 * Category accents are used sparingly (icons, badges, active nav, thin
 * indicators). The interface itself stays neutral so the product does not
 * turn into a rainbow of pills.
 */
export const CATEGORIES: Category[] = [
  {
    slug: "osint",
    name: "OSINT",
    blurb: "Investigate publicly available information.",
    description:
      "Open-source intelligence tooling for discovering, collecting and correlating information that is already public: identifiers, domains, social profiles, metadata and relationships.",
    icon: "ScanSearch",
    accent: "osint",
    subcategories: [
      {
        slug: "username",
        name: "Username Investigation",
        description:
          "Check how an identifier appears across public platforms and services.",
      },
      {
        slug: "email-domain",
        name: "Email & Domain",
        description:
          "Harvest and validate addresses, domains, DNS records and affiliated infrastructure.",
      },
      {
        slug: "social-media",
        name: "Social & Profiles",
        description:
          "Collect and organise public profile data from social platforms.",
      },
      {
        slug: "relationships",
        name: "Relationships & Link Analysis",
        description:
          "Model connections between people, hosts, accounts and artefacts.",
      },
      {
        slug: "metadata",
        name: "Metadata & Documents",
        description:
          "Inspect embedded metadata in images, documents and media files.",
      },
      {
        slug: "geolocation",
        name: "Geolocation",
        description:
          "Work with coordinates, EXIF location data and reverse lookups.",
      },
    ],
  },
  {
    slug: "pentesting",
    name: "Pentesting",
    blurb: "Assess systems and applications in authorized environments.",
    description:
      "Tools for authorized security assessment: content discovery, web application testing, vulnerability validation, credential auditing and reporting. Everything here assumes written scope.",
    icon: "Target",
    accent: "accent-blue",
    subcategories: [
      {
        slug: "web",
        name: "Web Application Testing",
        description:
          "Proxying, fuzzing, and application-layer assessment workflows.",
      },
      {
        slug: "content-discovery",
        name: "Content Discovery",
        description:
          "Directory, file and subdomain enumeration against authorized targets.",
      },
      {
        slug: "vulnerability-research",
        name: "Vulnerability Assessment",
        description:
          "Detection logic, scanners and validation of reported findings.",
      },
      {
        slug: "credentials",
        name: "Credential & Hash Auditing",
        description:
          "Password policy auditing and hash cracking in controlled labs.",
      },
      {
        slug: "reporting",
        name: "Reporting",
        description:
          "Turning findings into notes, evidence and client-ready reports.",
      },
    ],
  },
  {
    slug: "networking",
    name: "Networking",
    blurb: "Analyze networks, traffic, protocols and infrastructure.",
    description:
      "Host discovery, port scanning, protocol analysis and traffic capture. These tools explain what a network is actually doing rather than what a dashboard claims.",
    icon: "Network",
    accent: "accent",
    subcategories: [
      {
        slug: "reconnaissance",
        name: "Discovery & Recon",
        description: "Finding live hosts, open ports and exposed services.",
      },
      {
        slug: "traffic-analysis",
        name: "Traffic Analysis",
        description: "Capturing, filtering and reading protocol exchanges.",
      },
      {
        slug: "connectivity",
        name: "Connectivity & Transfer",
        description: "Listeners, banners, transfers and quick diagnostics.",
      },
      {
        slug: "services",
        name: "Services & Enumeration",
        description: "Identifying service versions and configurations.",
      },
      {
        slug: "defense",
        name: "Defense & Monitoring",
        description: "Detection-oriented reading of network behaviour.",
      },
    ],
  },
  {
    slug: "forensics",
    name: "Forensics",
    blurb: "Analyze digital evidence and investigate incidents.",
    description:
      "Disk, memory and file analysis for incident response and classroom investigations. Evidence handling rules matter more than clever flags.",
    icon: "Microscope",
    accent: "correlation",
    subcategories: [
      {
        slug: "disk",
        name: "Disk & Filesystem",
        description: "Carving, imaging and filesystem-level review.",
      },
      {
        slug: "memory",
        name: "Memory Analysis",
        description: "Process, network and malware artefacts in RAM images.",
      },
      {
        slug: "artifacts",
        name: "Artefacts & Metadata",
        description: "Embedded metadata, timelines and document history.",
      },
      {
        slug: "firmware",
        name: "Firmware & Containers",
        description: "Unpacking and inspecting images and filesystems.",
      },
    ],
  },
  {
    slug: "wireless",
    name: "Wireless",
    blurb: "Analyze wireless and radio-related environments.",
    description:
      "Wi-Fi and radio assessment tooling. Regulatory scope is strict here: test your own network or a network you have explicit permission to assess.",
    icon: "Radio",
    accent: "warning",
    subcategories: [
      {
        slug: "wifi-assessment",
        name: "Wi-Fi Assessment",
        description: "Capture, audit and troubleshoot wireless networks.",
      },
      {
        slug: "driver-support",
        name: "Adapter & Driver Support",
        description: "Monitor mode, injection and hardware compatibility.",
      },
      {
        slug: "wardriving",
        name: "Wardriving & Discovery",
        description: "Passive mapping of nearby broadcast identifiers.",
      },
    ],
  },
  {
    slug: "cloud-devsecops",
    name: "Cloud / DevSecOps",
    blurb: "Security tooling for cloud infrastructure and pipelines.",
    description:
      "Infrastructure-as-code scanning, container and supply-chain checking, and cloud posture auditing — the tooling that sits between a repository and a production account.",
    icon: "Cloud",
    accent: "accent",
    subcategories: [
      {
        slug: "iac",
        name: "Infrastructure as Code",
        description: "Policy checks for Terraform, CloudFormation and Kubernetes.",
      },
      {
        slug: "containers",
        name: "Containers & Supply Chain",
        description: "Image scanning, provenance and dependency risk.",
      },
      {
        slug: "posture",
        name: "Cloud Posture",
        description: "Read-only auditing of account configuration and IAM.",
      },
      {
        slug: "secrets",
        name: "Secrets & Configuration",
        description: "Finding credentials and unsafe defaults in code and configs.",
      },
    ],
  },
  {
    slug: "misc",
    name: "Misc",
    blurb: "Encoding, cryptography and supporting utilities.",
    description:
      "The workbench drawer: encoding, decoding, hashing, cipher playgrounds, and small utilities that show up in almost every workflow.",
    icon: "Wrench",
    accent: "correlation",
    subcategories: [
      {
        slug: "encoding",
        name: "Encoding & Decoding",
        description: "Base64, hex, URL, data URIs and chunked transformations.",
      },
      {
        slug: "cryptography",
        name: "Cryptography",
        description: "Hashes, ciphers and key operations in a sandbox.",
      },
      {
        slug: "utilities",
        name: "Utilities",
        description: "Small tools that support a larger workflow.",
      },
    ],
  },
];

export const CATEGORY_BY_SLUG: ReadonlyMap<string, Category> = new Map(
  CATEGORIES.map((c) => [c.slug, c]),
);

export function getCategory(slug: string | undefined): Category | undefined {
  return slug ? CATEGORY_BY_SLUG.get(slug) : undefined;
}

export function getSubcategory(
  categorySlug: string | undefined,
  subcategorySlug: string | undefined,
) {
  if (!subcategorySlug) return undefined;
  return getCategory(categorySlug)?.subcategories.find(
    (s) => s.slug === subcategorySlug,
  );
}

/** Tailwind-safe accent classes, declared once so category color stays subtle. */
export const CATEGORY_ACCENT: Record<
  Category["accent"],
  { text: string; bg: string; ring: string; dot: string }
> = {
  osint: {
    text: "text-osint",
    bg: "bg-osint/10",
    ring: "ring-osint/35",
    dot: "bg-osint",
  },
  correlation: {
    text: "text-correlation",
    bg: "bg-correlation/10",
    ring: "ring-correlation/35",
    dot: "bg-correlation",
  },
  accent: {
    text: "text-accent",
    bg: "bg-accent/10",
    ring: "ring-accent/35",
    dot: "bg-accent",
  },
  "accent-blue": {
    text: "text-accent-blue",
    bg: "bg-accent-blue/10",
    ring: "ring-accent-blue/35",
    dot: "bg-accent-blue",
  },
  warning: {
    text: "text-warning",
    bg: "bg-warning/10",
    ring: "ring-warning/35",
    dot: "bg-warning",
  },
};
