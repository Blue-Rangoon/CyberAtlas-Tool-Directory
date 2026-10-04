import type { Roadmap } from "@/types";

/**
 * Roadmaps are structured learning paths, not promises of competence.
 * Every stage links back into tools and concepts so the graph stays connected.
 */
export const ROADMAPS: Roadmap[] = [
  {
    slug: "absolute-beginner",
    title: "Absolute Beginner",
    description:
      "The foundations everything else assumes: how machines address each other, how a shell works, and how to read what a program actually outputs. No prior security knowledge required.",
    difficulty: "beginner",
    audience: "Complete newcomers, students, developers moving into security",
    estimatedDuration: "4–6 weeks at 4–6 hours per week",
    prerequisites: ["Basic computer literacy", "Willingness to read command output"],
    outcome:
      "You can set up a lab, navigate Linux comfortably, explain what happens between a URL and a response, and read tool output without guessing.",
    icon: "Layers",
    featured: true,
    relatedTools: ["nmap", "netcat", "tcpdump", "cyberchef"],
    stages: [
      {
        number: 1,
        slug: "lab-setup",
        title: "Build a safe lab",
        description:
          "A virtual machine you own, isolated from other networks, plus snapshots so mistakes are reversible.",
        duration: "3–5 hours",
        topics: [
          { label: "Virtualisation and network modes (NAT vs host-only)" },
          { label: "Snapshots and reset discipline" },
          { label: "Why practice ranges must be isolated" },
        ],
        tools: ["nmap"],
        exercises: [
          "Create a Linux VM on host-only networking and confirm it cannot reach your LAN.",
          "Snapshot before every experiment; restore once and note what you lost.",
        ],
      },
      {
        number: 2,
        slug: "linux-fundamentals",
        title: "Linux fundamentals",
        description:
          "Files, permissions, processes and services — the layer almost every security tool lives on.",
        duration: "1–2 weeks",
        topics: [
          { label: "Filesystem layout and paths" },
          { label: "Permissions, ownership and the umask" },
          { label: "Processes, systemd services and logs" },
          { href: "/learning/concepts/what-is-a-shell", label: "What a shell actually is" },
        ],
        tools: ["netcat"],
        exercises: [
          "List files by size in /var/log and open the newest with less.",
          "Find which process owns port 22 with `ss -ltnp`.",
        ],
      },
      {
        number: 3,
        slug: "networking-basics",
        title: "Networking basics",
        description:
          "Addresses, ports, protocols and the handshake. Everything below is unverifiable without this.",
        duration: "1–2 weeks",
        topics: [
          { href: "/learning/concepts/what-is-an-ip-address", label: "IP addresses" },
          { href: "/learning/concepts/what-is-a-port", label: "Ports" },
          { href: "/learning/concepts/tcp-vs-udp", label: "TCP vs UDP" },
          { href: "/learning/concepts/what-is-cidr", label: "CIDR notation" },
        ],
        tools: ["tcpdump", "nmap"],
        exercises: [
          "Capture your own DNS queries and read the response codes.",
          "Explain to a colleague why 'closed' and 'filtered' are different answers.",
        ],
      },
      {
        number: 4,
        slug: "http-and-dns",
        title: "HTTP and DNS",
        description:
          "The two protocols that carry most of the web: requests, responses, status classes, name resolution.",
        duration: "1 week",
        topics: [
          { href: "/learning/concepts/what-is-http", label: "HTTP request/response" },
          { href: "/learning/concepts/what-is-dns", label: "DNS resolution chain" },
          { label: "Headers, cookies and same-origin basics" },
        ],
        tools: ["cyberchef"],
        exercises: [
          "Print a request's headers with `curl -v` and label each one.",
          "Decode a Base64 header value and explain what it contained.",
        ],
      },
      {
        number: 5,
        slug: "reading-tool-output",
        title: "Reading tool output",
        description:
          "Turning raw output into a note: what a scanner claims, what it measured, and what it could not see.",
        duration: "4–6 hours",
        topics: [
          { label: "Evidence vs inference" },
          { label: "Saving output in a reproducible format" },
          { label: "Recording the exact command you ran" },
        ],
        tools: ["nmap", "wireshark"],
        exercises: [
          "Scan one host with `-oA` and produce a three-line summary from the XML.",
          "Write one paragraph that states a limitation of your own scan.",
        ],
      },
      {
        number: 6,
        slug: "data-and-encodings",
        title: "Data, hashes and encodings",
        description:
          "Encoding is not encryption. Learn the difference before touching anything credential-related.",
        duration: "1 week",
        topics: [
          { href: "/learning/concepts/hashing-vs-encryption", label: "Hashing vs encryption" },
          { label: "Base64, hex, URL encoding" },
          { label: "Checksums for download verification" },
        ],
        tools: ["cyberchef", "exiftool"],
        exercises: [
          "Verify a downloaded file against its published SHA-256.",
          "Encode then decode the same string through three encodings.",
        ],
      },
      {
        number: 7,
        slug: "first-vuln-class",
        title: "Your first vulnerability class",
        description:
          "Input handling, on a deliberately vulnerable app you own. Depth on one class beats a survey of ten.",
        duration: "1–2 weeks",
        topics: [
          { href: "/learning/concepts/what-is-a-vulnerability", label: "What a vulnerability is" },
          { label: "Injection, in theory and in a lab" },
          { label: "Output encoding and validation" },
        ],
        tools: ["sqlmap", "ffuf"],
        exercises: [
          "Trigger an error with a single quote, then explain why it happened.",
          "Re-test the same parameter after applying a fix.",
        ],
      },
      {
        number: 8,
        slug: "notes-and-reporting",
        title: "Notes, ethics and reporting",
        description:
          "Scope, permission and how to write something another person can act on.",
        duration: "4–6 hours",
        topics: [
          { label: "Rules of engagement in plain language" },
          { label: "Writing a finding: condition, evidence, impact" },
          { href: "/about/responsible-use", label: "CyberAtlas's responsible-use framing" },
        ],
        tools: ["nmap"],
        exercises: [
          "Write a one-page report on your lab finding for a non-specialist.",
          "Draft the scope statement you would need before testing anything real.",
        ],
      },
    ],
  },
  {
    slug: "osint-investigator",
    title: "OSINT Investigator",
    description:
      "Structured, defensible research using public information: method, source discipline, verification and reporting about people and infrastructure.",
    difficulty: "beginner",
    difficultyRange: ["beginner", "intermediate"],
    audience: "Analysts, journalists, defenders, anyone doing public-record research",
    estimatedDuration: "5–8 weeks",
    prerequisites: ["Careful note-taking", "Comfort with a browser and a shell"],
    outcome:
      "You can run a repeatable research process, distinguish corroboration from coincidence, and document findings so a third party can retrace them.",
    icon: "ScanSearch",
    featured: true,
    relatedTools: ["sherlock", "exiftool", "theharvester", "spiderfoot", "subfinder"],
    stages: [
      {
        number: 1,
        slug: "method",
        title: "Method before tools",
        description: "Questions, hypotheses, and the difference between an indicator and a conclusion.",
        duration: "4 hours",
        topics: [
          { label: "Writing a research question" },
          { label: "Source hierarchy and freshness" },
          { label: "Confirmation bias in correlation work" },
        ],
        tools: [],
        exercises: ["Document one negative result and why it does not prove absence."],
      },
      {
        number: 2,
        slug: "identifiers",
        title: "Identifiers and handles",
        description: "How usernames behave across platforms, and why automated checks mislead.",
        duration: "1 week",
        topics: [
          { label: "False positives from status codes" },
          { label: "Registration dates and profile text" },
        ],
        tools: ["sherlock"],
        exercises: [
          "Run a handle search, then manually confirm three results in a browser.",
          "List two ways a 200 response can be meaningless.",
        ],
      },
      {
        number: 3,
        slug: "domains",
        title: "Domains and infrastructure",
        description: "Certificate transparency, DNS records and WHOIS as durable public records.",
        duration: "1 week",
        topics: [
          { href: "/learning/concepts/what-is-dns", label: "DNS record types" },
          { label: "Reading a CT log entry" },
        ],
        tools: ["subfinder", "theharvester"],
        exercises: [
          "Build a subname list from two independent sources and diff them.",
          "Record which source produced each name.",
        ],
      },
      {
        number: 4,
        slug: "metadata",
        title: "Files and metadata",
        description: "What documents and images carry with them, and how to verify a claim of origin.",
        duration: "1 week",
        topics: [
          { label: "EXIF, XMP and document properties" },
          { label: "Sanitising before publication" },
        ],
        tools: ["exiftool"],
        exercises: [
          "Strip metadata from a copy of your own photo and verify.",
          "Write the caveat that metadata never proves authorship.",
        ],
      },
      {
        number: 5,
        slug: "correlation",
        title: "Correlation and link analysis",
        description: "Model relationships explicitly so an inference is visible as an inference.",
        duration: "1 week",
        topics: [
          { label: "Entities, links, confidence levels" },
          { label: "Reporting uncertainty" },
        ],
        tools: ["spiderfoot"],
        exercises: ["Draw a five-node graph of a case and label each edge's evidence."],
      },
      {
        number: 6,
        slug: "ethics-retention",
        title: "Legality, ethics and retention",
        description: "Public does not mean permissible to use. Data minimisation, purpose limitation, deletion.",
        duration: "3–5 hours",
        topics: [
          { href: "/about/responsible-use", label: "Responsible-use framing" },
          { label: "Handling personal data in a case folder" },
        ],
        tools: [],
        exercises: ["Write the retention rule you would apply to your own research output."],
      },
    ],
  },
  {
    slug: "web-pentester",
    title: "Web Pentester",
    description:
      "Application testing from an honest methodology: scope, exploration, verification, impact and retest. Tooling supports the method rather than replacing it.",
    difficulty: "intermediate",
    difficultyRange: ["intermediate", "advanced"],
    audience: "Developers moving into appsec, junior testers, bug bounty newcomers",
    estimatedDuration: "10–16 weeks",
    prerequisites: [
      "HTTP and headers fluency",
      "Reading HTML/JS without panic",
      "A lab application you own",
    ],
    outcome:
      "You can plan a test, find and verify issues manually, describe impact in business terms, and confirm a fix.",
    icon: "Target",
    featured: true,
    relatedTools: ["burp-suite", "ffuf", "gobuster", "sqlmap", "nuclei"],
    stages: [
      {
        number: 1,
        slug: "scope",
        title: "Scope, rules of engagement and safety",
        description: "What you may touch, how hard, when, and what to stop for immediately.",
        duration: "3 hours",
        topics: [
          { label: "Written authorisation and asset lists" },
          { label: "Rate limits and data handling" },
          { label: "Stop conditions" },
        ],
        tools: [],
        exercises: ["Draft a one-page rules-of-engagement document for a lab target."],
      },
      {
        number: 2,
        slug: "exploration",
        title: "Exploration and mapping",
        description: "Learn the application: features, roles, state changes, API surface.",
        duration: "1–2 weeks",
        topics: [
          { label: "Manual crawl before any automation" },
          { label: "Site map and parameter inventory" },
        ],
        tools: ["burp-suite", "gobuster"],
        exercises: [
          "Produce a parameter inventory for one authenticated flow.",
          "Note every place the app changes server state.",
        ],
      },
      {
        number: 3,
        slug: "authentication",
        title: "Authentication and session handling",
        description: "Login, token lifetime, password reset, MFA order — where logic flaws concentrate.",
        duration: "1 week",
        topics: [
          { label: "Token formats and expiry" },
          { label: "Reset flow analysis" },
        ],
        tools: ["burp-suite"],
        exercises: ["Map every endpoint reachable without a session and confirm intent with the owner."],
      },
      {
        number: 4,
        slug: "input-handling",
        title: "Input handling and injection",
        description: "Where untrusted data is interpreted as code: SQL, commands, templates, queries.",
        duration: "1–2 weeks",
        topics: [
          { label: "Error-based vs blind indications" },
          { label: "Parameterised queries as the mitigation" },
        ],
        tools: ["sqlmap"],
        exercises: [
          "Confirm one suspected parameter, then re-test after a fix.",
          "Write the exact evidence line a developer needs.",
        ],
      },
      {
        number: 5,
        slug: "access-control",
        title: "Access control",
        description: "Object-level and function-level authorisation — the class automation cannot see.",
        duration: "1–2 weeks",
        topics: [
          { label: "Two-account matrix method" },
          { label: "Indirect reference patterns" },
        ],
        tools: ["burp-suite"],
        exercises: ["Build a role/endpoint matrix for a lab app with two users."],
      },
      {
        number: 6,
        slug: "client-side",
        title: "Client-side and browser behaviour",
        description: "DOM sinks, CORS, cookie flags, caching and the origin model.",
        duration: "1 week",
        topics: [
          { label: "Where browser policy is and is not enforced" },
          { label: "PostMessage and third-party script risk" },
        ],
        tools: ["ffuf"],
        exercises: ["Explain one CORS response to a developer without using the word 'vulnerable'."],
      },
      {
        number: 7,
        slug: "verification",
        title: "Verification and false positives",
        description: "Reproduce from a clean session, then prove the negative case too.",
        duration: "1 week",
        topics: [
          { label: "Manual confirmation of scanner output" },
          { label: "Timing, caching and flakiness" },
        ],
        tools: ["nuclei"],
        exercises: ["Take five scanner findings and mark three as not reportable, with reasons."],
      },
      {
        number: 8,
        slug: "reporting-retest",
        title: "Reporting and retest",
        description: "Impact language, reproduction steps, remediation that fits the codebase.",
        duration: "1 week",
        topics: [
          { label: "Structure: condition, evidence, impact, fix" },
          { label: "Severity rationale over severity labels" },
        ],
        tools: [],
        exercises: ["Write one finding two ways: for a developer and for a manager."],
      },
    ],
  },
  {
    slug: "network-pentester",
    title: "Network Pentester",
    description:
      "Internal and external network assessment: discovery, enumeration, exposure review, evidence and the conversations that follow.",
    difficulty: "intermediate",
    audience: "Infrastructure testers, sysadmins moving into assessment work",
    estimatedDuration: "8–12 weeks",
    prerequisites: ["Networking fundamentals", "Linux command line", "Written scope for any testing"],
    outcome:
      "You can map an authorized segment, describe exposure accurately, and prioritise by reachability rather than by scanner score.",
    icon: "Network",
    relatedTools: ["nmap", "masscan", "wireshark", "tcpdump", "hydra"],
    stages: [
      {
        number: 1,
        slug: "model",
        title: "The network model",
        description: "Layering, routing, switching, NAT, segmentation.",
        duration: "1 week",
        topics: [
          { href: "/learning/concepts/what-is-an-ip-address", label: "Addresses" },
          { href: "/learning/concepts/what-is-cidr", label: "CIDR" },
          { href: "/learning/concepts/what-is-a-firewall", label: "What a firewall can and cannot do" },
        ],
        tools: ["tcpdump"],
      },
      {
        number: 2,
        slug: "discovery",
        title: "Host and service discovery",
        description: "Live hosts first, then ports, then services — in that order.",
        duration: "1–2 weeks",
        topics: [
          { label: "Ping sweep vs ARP vs SYN discovery" },
          { label: "Reading filtered vs closed" },
        ],
        tools: ["nmap", "masscan"],
        exercises: [
          "Compare `nmap -sn` with `nmap -Pn -p443` on the same host and explain the difference.",
        ],
      },
      {
        number: 3,
        slug: "enumeration",
        title: "Service enumeration",
        description: "Versions, banners, defaults, and what a banner does not tell you.",
        duration: "1–2 weeks",
        tools: ["nmap", "netcat"],
        topics: [
          { label: "Banner grabbing and its limits" },
          { label: "Script categories and what they send" },
        ],
      },
      {
        number: 4,
        slug: "traffic",
        title: "Traffic analysis",
        description: "Read the wire: handshakes, retries, cleartext protocols.",
        duration: "1 week",
        tools: ["wireshark", "tcpdump"],
        exercises: ["Identify whether a slow service is a network or application problem."],
      },
      {
        number: 5,
        slug: "exposure-review",
        title: "Exposure review",
        description: "What is reachable from where, and who should hear about it first.",
        duration: "1 week",
        tools: ["nmap"],
        topics: [
          { label: "Management interfaces and forgotten hosts" },
          { label: "Firewall rule verification" },
        ],
      },
      {
        number: 6,
        slug: "credentials-in-scope",
        title: "Credential policy in authorized scope",
        description: "How policy testing is agreed, executed and reported without causing lockouts.",
        duration: "1 week",
        tools: ["hydra", "hashcat"],
        topics: [
          { label: "Agreeing accounts, windows and rates" },
          { label: "Why offline hash review is often kinder" },
        ],
      },
      {
        number: 7,
        slug: "hardening-loop",
        title: "Hardening loop and retest",
        description: "Turn findings into configuration changes and prove them.",
        duration: "1–2 weeks",
        tools: ["nmap", "checkov"],
      },
    ],
  },
  {
    slug: "bug-bounty",
    title: "Bug Bounty",
    description:
      "A realistic route into responsible disclosure: program rules, asset knowledge, a repeatable testing loop, and report quality.",
    difficulty: "intermediate",
    audience: "Self-directed learners aiming at public disclosure programs",
    estimatedDuration: "Ongoing; 6–12 weeks to a first solid report",
    prerequisites: ["Web fundamentals", "Patience with duplicates and N/A responses"],
    outcome:
      "You read a policy before you touch a target, focus on classes the app genuinely exposes, and write reports triagers can act on.",
    icon: "Bug",
    relatedTools: ["ffuf", "burp-suite", "httpx", "subfinder"],
    stages: [
      {
        number: 1,
        slug: "policy",
        title: "Read the policy like a contract",
        description: "In-scope assets, prohibited testing types, rate expectations, safe harbour.",
        duration: "4 hours",
        topics: [{ label: "Out-of-scope list vs wildcard" }, { label: "What 'no destructive testing' means concretely" }],
        tools: [],
      },
      {
        number: 2,
        slug: "surface",
        title: "Build the asset list",
        description: "Passive discovery of names and services, then confirm what is in scope.",
        duration: "1 week",
        tools: ["subfinder", "httpx"],
      },
      {
        number: 3,
        slug: "app-understanding",
        title: "Understand the application",
        description: "Business logic beats payload libraries. What does this app protect, and for whom?",
        duration: "1–2 weeks",
        tools: ["burp-suite"],
      },
      {
        number: 4,
        slug: "class-selection",
        title: "Pick two issue classes",
        description: "Depth in authorisation and one input-handling class, revisited across features.",
        duration: "2–4 weeks",
        tools: ["ffuf", "sqlmap"],
      },
      {
        number: 5,
        slug: "reports",
        title: "Reports that get triaged",
        description: "Exact steps, clean impact statement, no drama.",
        duration: "1 week",
        topics: [{ label: "Reproduction from a fresh account" }, { label: "Writing impact for a product owner" }],
        tools: [],
      },
      {
        number: 6,
        slug: "discipline",
        title: "Disclosure discipline",
        description: "No publicPoC without agreement. Data you should not have, stop and report.",
        duration: "3 hours",
        topics: [{ href: "/about/responsible-use", label: "Responsible-use page" }],
        tools: [],
      },
    ],
  },
  {
    slug: "blue-team-foundations",
    title: "Blue Team Foundations",
    description:
      "Detection and response basics: logging you can trust, reading traffic, triaging alerts, and writing the timeline that survives review.",
    difficulty: "beginner",
    difficultyRange: ["beginner", "intermediate"],
    audience: "SOC newcomers, sysadmins, developers owning production",
    estimatedDuration: "8–10 weeks",
    prerequisites: ["Linux and Windows administration basics"],
    outcome:
      "You can tell whether an alert corresponds to real activity, build a timeline from logs and captures, and say what you do not know.",
    icon: "Shield",
    relatedTools: ["wireshark", "tcpdump", "volatility3", "trivy"],
    stages: [
      {
        number: 1,
        slug: "telemetry",
        title: "Telemetry inventory",
        description: "What is logged, where, at what fidelity and retention.",
        duration: "1 week",
        topics: [{ label: "Endpoint, network, identity, cloud control plane" }, { label: "Clock accuracy as a prerequisite" }],
        tools: [],
      },
      {
        number: 2,
        slug: "host-state",
        title: "Host state and memory",
        description: "Processes, connections, services, and the value of a capture over a guess.",
        duration: "1–2 weeks",
        tools: ["volatility3", "tcpdump"],
      },
      {
        number: 3,
        slug: "traffic-triage",
        title: "Traffic triage",
        description: "Beacons, handshakes, cleartext credentials, unusual destinations.",
        duration: "1 week",
        tools: ["wireshark"],
      },
      {
        number: 4,
        slug: "detection-logic",
        title: "Detection logic and noise",
        description: "Writing a rule you can defend, and tuning what you cannot.",
        duration: "1–2 weeks",
        topics: [{ label: "False-positive budget" }, { label: "Testing a rule against benign behaviour" }],
        tools: ["nuclei"],
      },
      {
        number: 5,
        slug: "supply-chain",
        title: "Build and supply chain posture",
        description: "What runs in production, from where, and how you would know.",
        duration: "1 week",
        tools: ["trivy", "checkov"],
      },
      {
        number: 6,
        slug: "response-practice",
        title: "Response practice",
        description: "Drills, timelines, evidence handling, communication under pressure.",
        duration: "ongoing",
        topics: [{ label: "Tabletop exercises" }, { label: "Evidence integrity" }],
        tools: ["volatility3"],
      },
    ],
  },
];

export const ROADMAP_BY_SLUG: ReadonlyMap<string, Roadmap> = new Map(
  ROADMAPS.map((r) => [r.slug, r]),
);

export function getRoadmap(slug: string | undefined): Roadmap | undefined {
  return slug ? ROADMAP_BY_SLUG.get(slug) : undefined;
}

export const TOTAL_STAGES = ROADMAPS.reduce(
  (sum, r) => sum + r.stages.length,
  0,
);
