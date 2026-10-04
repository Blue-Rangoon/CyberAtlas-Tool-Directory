import type { Comparison } from "@/types";

/**
 * Comparisons are trade-off documentation, not verdicts.
 * Values describe documented behaviour; no benchmarks are invented here, so
 * anything hardware- or workload-dependent is written as a range of practice
 * rather than a number.
 */
export const COMPARISONS: Comparison[] = [
  {
    slug: "ffuf-vs-gobuster",
    title: "ffuf vs Gobuster",
    toolA: "ffuf",
    toolB: "gobuster",
    description:
      "Two content-discovery tools that solve the same first problem — 'what answers on this path?' — with different ergonomics around filtering and templating.",
    verdictNote:
      "Both are appropriate inside an agreed scope. Choose on filtering behaviour, output format and how your team keeps wordlists — not on speed alone.",
    categories: ["pentesting"],
    sides: [
      {
        tool: "ffuf",
        summary:
          "A fuzzer first: a FUZZ position anywhere in the request, plus a filtering language that makes noisy applications survivable.",
        strengths: [
          "Match/suppress filters on status, size, words, lines and regex",
          "Auto-calibration against soft-404 responses",
          "Multiple wordlists and replacer chain (URL encoding, case, append)",
          "JSON/CSV/HTML output suited to archiving results",
        ],
        limitations: [
          "Flag surface is larger, so tutorials drift out of date",
          "No DNS or SMB mode — it is HTTP-shaped",
        ],
        whenToUse: [
          "The application returns 200 for everything",
          "You need to fuzz headers, bodies or several positions at once",
          "Results must be re-filtered later without re-running",
        ],
      },
      {
        tool: "Gobuster",
        summary:
          "A brute forcer with modes: dir, vhost, dns, fuzz, smb. Fewer concepts to hold in your head, easy to drop into a script.",
        strengths: [
          "One binary, several protocols including DNS subdomain brute forcing",
          "Simple status suppression and extension lists",
          "Widely packaged in distribution repositories",
          "Small, stable flag surface per mode",
        ],
        limitations: [
          "Filtering is less expressive for weird soft-404 behaviour",
          "No calibrate equivalent; you tune suppression yourself",
        ],
        whenToUse: [
          "You want subdomain and directory work in one tool",
          "A pipeline step needs predictable exit and output",
          "The target's baseline is simple enough for status filtering",
        ],
      },
    ],
    features: [
      { group: "Scope", feature: "HTTP path discovery", a: true, b: true },
      { group: "Scope", feature: "Subdomain brute force via DNS", a: false, b: true },
      { group: "Scope", feature: "Virtual host discovery", a: true, b: true },
      {
        group: "Scope",
        feature: "Arbitrary fuzz positions (body, header, cookie)",
        a: "Full support",
        b: { text: "fuzz mode", note: "Templated syntax differs from ffuf's FUZZ" },
      },
      {
        group: "Filtering",
        feature: "Soft-404 handling",
        a: { text: "Automatic calibration", note: "-recalibrate" },
        b: { text: "Manual", note: "Suppress status codes / compare sizes yourself" },
      },
      { group: "Filtering", feature: "Regex match", a: true, b: false },
      { group: "Filtering", feature: "Word transformations", a: { text: "Replacer chain" }, b: { text: "Limited" } },
      {
        group: "Operation",
        feature: "Concurrency control",
        a: "Threads + per-request pause",
        b: "Threads + timeout",
        notes: "Both need explicit lowering against shared systems.",
      },
      { group: "Operation", feature: "Output formats", a: "JSON, CSV, HTML, MD, eJSON", b: "Plain text file" },
      { group: "Learning", feature: "Flag surface to learn", a: { text: "Broad" }, b: { text: "Small" } },
      {
        group: "Learning",
        feature: "Documentation stability",
        a: { text: "Check `ffuf -h` for your version", note: "Flags moved between major releases" },
        b: { text: "Stable within v3" },
      },
    ],
    workflowExamples: [
      {
        title: "Same job, two invocations",
        a: "ffuf -u https://app.internal/FUZZ -w common.txt -recalibrate -t 10 -p 0.1 -o out.json",
        b: "gobuster dir -u https://app.internal -w common.txt -t 10 -o out.txt",
        note: "The ffuf run is self-calibrating and archiveable; the Gobuster run is simpler to read on screen.",
      },
    ],
    relatedComparisons: ["nmap-vs-masscan", "nmap-vs-rustscan"],
    references: [
      { label: "ffuf README", url: "https://github.com/ffuf/ffuf" },
      { label: "Gobuster README", url: "https://github.com/OJ/gobuster" },
    ],
    lastUpdated: "2026-01-19",
  },
  {
    slug: "nmap-vs-masscan",
    title: "Nmap vs Masscan",
    toolA: "nmap",
    toolB: "masscan",
    description:
      "One tool optimises for knowing what a service is; the other optimises for asking a very large address range one question quickly.",
    verdictNote:
      "They are complementary: a rate-first sweep to find candidates, then targeted fingerprinting. Confirming Masscan output with Nmap is standard practice, not a workaround.",
    categories: ["networking"],
    sides: [
      {
        tool: "Nmap",
        summary:
          "Per-host state machine with adaptive timing, version probing, scriptable checks and structured output.",
        strengths: [
          "Service and version detection, OS fingerprinting",
          "NSE scripts for protocol-specific questions",
          "XML/grepable output designed for reporting",
          "Predictable behaviour across platforms",
        ],
        limitations: [
          "Not intended for /8-scale sweeps",
          "Per-port probing is slower by design",
        ],
        whenToUse: [
          "You need to know what a service is, not just that it answered",
          "Results go into a report or a ticket",
          "The scope is a handful of hosts to a few /24s",
        ],
      },
      {
        tool: "Masscan",
        summary:
          "Its own asynchronous packet engine, built to keep a stated packets-per-second rate across a wide range.",
        strengths: [
          "Very large ranges at a configurable rate",
          "Exclude-file support for protected infrastructure",
          "Simple list/JSON output for downstream tooling",
        ],
        limitations: [
          "Little service identification; banner grabbing is basic",
          "Needs careful adapter/route configuration off-subnet",
          "High rates can disrupt networks and trip controls",
        ],
        whenToUse: [
          "'Which of these 40,000 IPs answer on 443?'",
          "Re-verification after a mass certificate or firewall change",
          "Feeding a candidate list into a detailed tool",
        ],
      },
    ],
    features: [
      { group: "Purpose", feature: "Primary optimisation", a: "Accuracy and detail per host", b: "Packet rate across ranges" },
      { group: "Purpose", feature: "Version detection", a: { text: "Extensive" }, b: { text: "Banner only" } },
      { group: "Purpose", feature: "Scripted protocol checks", a: true, b: false },
      {
        group: "Control",
        feature: "Rate limiting",
        a: { text: "Indirect", note: "Timing templates, parallelism, host timeout" },
        b: { text: "Direct", note: "--rate is an explicit ceiling" },
      },
      { group: "Control", feature: "Exclude file", a: true, b: true, notes: "Both support --excludefile; use it every time." },
      { group: "Output", feature: "Machine-readable formats", a: "XML, grepable, normal", b: "List, JSON, XML" },
      { group: "Output", feature: "Needs a second tool for detail", a: false, b: true },
      {
        group: "Safety",
        feature: "Blast radius on a misconfiguration",
        a: { text: "Contained by default top-1000 ports" },
        b: { text: "Large", note: "A wrong range plus a high rate is a self-inflicted outage" },
      },
    ],
    workflowExamples: [
      {
        title: "Sweep then confirm",
        a: "nmap -Pn -sV -p 443,8443 -oA scans/candidate 203.0.113.24",
        b: "sudo masscan 203.0.113.0/24 -p443 --rate 500 --excludefile exclude.txt -oJ edge.json",
        note: "Rate must be agreed with the network owner; the JSON gives the candidate list the Nmap run consumes.",
      },
    ],
    relatedComparisons: ["nmap-vs-rustscan"],
    references: [
      { label: "Nmap reference guide", url: "https://nmap.org/book/man.html" },
      { label: "Masscan README", url: "https://github.com/robertdavidgraham/masscan#readme" },
    ],
    lastUpdated: "2026-01-06",
  },
  {
    slug: "nmap-vs-rustscan",
    title: "Nmap vs RustScan",
    toolA: "nmap",
    toolB: "rustscan",
    description:
      "RustScan finds open TCP ports fast and can hand them to Nmap for the detail. The comparison is mostly about whether you want that split.",
    verdictNote:
      "For most single-host work Nmap alone is simpler and produces better records. RustScan helps when the port-discovery phase is the bottleneck and you keep Nmap for interpretation.",
    categories: ["networking"],
    sides: [
      {
        tool: "Nmap",
        summary: "Full pipeline in one tool: discovery, port state, versions, scripts, output.",
        strengths: ["Depth", "Reporting-friendly output", "Documentation and community knowledge"],
        limitations: ["Full port range on many hosts takes time"],
        whenToUse: ["Anything producing findings for others", "When you need script-level detail"],
      },
      {
        tool: "RustScan",
        summary: "Socket-level port finder with an optional Nmap handoff.",
        strengths: ["Quick full-range port discovery", "Config-driven defaults", "Small output to reason about"],
        limitations: [
          "Needs raised file-descriptor limits for large batches",
          "No version detection without the handoff",
          "Fewer distribution packages; you often install a release binary",
        ],
        whenToUse: ["Many hosts, ports only", "Scripted pipelines where discovery time dominates"],
      },
    ],
    features: [
      { group: "Capability", feature: "TCP port discovery", a: true, b: true },
      { group: "Capability", feature: "Version detection", a: true, b: { text: "Via Nmap" } },
      { group: "Capability", feature: "UDP support", a: true, b: false },
      { group: "Capability", feature: "Script engine", a: true, b: { text: "Script hooks to external tools", note: "runs Nmap, not its own logic" } },
      { group: "Resources", feature: "File-descriptor tuning needed", a: false, b: true },
      { group: "Resources", feature: "Privileges for raw sockets", a: { text: "For SYN/OS scans" }, b: { text: "Not required for connect scans" } },
      { group: "Output", feature: "Structured scan files", a: { text: "XML/-oA" }, b: { text: "Plain text" } },
    ],
    workflowExamples: [
      {
        title: "Discovery then detail",
        b: "rustscan -a 192.0.2.10 -r 1-65535 --batch-size 2000 -- -sV -oA scans/host",
        note: "Everything after `--` reaches Nmap, which is where the report evidence comes from.",
      },
    ],
    relatedComparisons: ["nmap-vs-masscan", "ffuf-vs-gobuster"],
    references: [{ label: "RustScan documentation", url: "https://rustscan.github.io/RustScan/" }],
    lastUpdated: "2026-01-04",
  },
  {
    slug: "wireshark-vs-tcpdump",
    title: "Wireshark vs tcpdump",
    toolA: "wireshark",
    toolB: "tcpdump",
    description:
      "Both read the same capture format. One is an analysis environment; the other is a capture utility that fits on a server.",
    verdictNote:
      "Not really a contest: capture where the packets are, analyse where the time is. Many workflows are `tcpdump` on the host and Wireshark on the analyst's machine.",
    categories: ["networking"],
    sides: [
      {
        tool: "Wireshark",
        summary: "GUI analysis with protocol dissection, statistics, coloring rules, streams and filters over a full capture.",
        strengths: [
          "Deepest dissection catalogue of any open tool",
          "Follow-stream view for application exchanges",
          "Statistics: conversations, I/O graphs, expert info",
          "Profiles and saved display filters",
        ],
        limitations: ["GUI-centric", "Capture on a remote headless host is not its environment"],
        whenToUse: ["Detailed protocol questions", "Teaching and walkthroughs", "Large captures needing navigation"],
      },
      {
        tool: "tcpdump",
        summary: "libpcap capture with BPF filtering and text output, present on almost every Unix.",
        strengths: [
          "Runs anywhere, tiny dependency footprint",
          "Write bounded capture files for later analysis",
          "Read filters to re-query saved files",
        ],
        limitations: ["No dissection depth by default", "No interactive filtering while capturing"],
        whenToUse: ["On the server, in a container, over SSH", "Evidence capture with a size cap", "Quick yes/no on reachability"],
      },
    ],
    features: [
      { group: "Interface", feature: "Graphical analysis", a: true, b: false },
      { group: "Interface", feature: "CLI/headless operation", a: { text: "TShark", note: "same engine, separate binary" }, b: true },
      { group: "Filters", feature: "Capture-time filtering", a: true, b: true, notes: "Both use BPF syntax at capture time." },
      { group: "Filters", feature: "Post-capture display filters", a: { text: "Rich expression language" }, b: { text: "BPF expressions only" } },
      { group: "Analysis", feature: "Protocol dissection depth", a: { text: "Very high" }, b: { text: "Summary level" } },
      { group: "Analysis", feature: "Stream reassembly view", a: true, b: false },
      { group: "Analysis", feature: "Statistics and graphs", a: true, b: false },
      { group: "Deploy", feature: "Installed by default on most servers", a: false, b: { text: "Very common" } },
      { group: "Deploy", feature: "Capture file interoperability", a: "pcap/pcapng", b: "pcap", notes: "Files move freely between the two." },
    ],
    workflowExamples: [
      {
        title: "Capture on the host, analyse on the workstation",
        b: "sudo tcpdump -i eth0 -w /tmp/incident.pcap -C 50 -W 4 'host 192.0.2.10 and port 443'",
        a: "Open the file, apply `tcp.analysis.retransmission`, then follow the suspect stream",
        note: "Copy the capture off the host under the same evidence handling as any other artefact.",
      },
    ],
    relatedComparisons: ["hashcat-vs-john"],
    references: [
      { label: "Wireshark user's guide", url: "https://www.wireshark.org/docs/wsug_html_chunked/" },
      { label: "pcap-filter man page", url: "https://www.tcpdump.org/manpages/pcap-filter.7.html" },
    ],
    lastUpdated: "2026-01-16",
  },
  {
    slug: "hashcat-vs-john",
    title: "Hashcat vs John the Ripper",
    toolA: "hashcat"
,
    toolB: "john",
    description:
      "Both work offline against captured hashes. The practical difference is GPU throughput and kernel breadth versus format agility and rules tooling.",
    verdictNote:
      "Audit programmes usually run both: John for odd formats and rule experimentation, Hashcat for the volume work. Same legal constraint applies to either — only hashes you are authorized to test.",
    categories: ["pentesting"],
    sides: [
      {
        tool: "Hashcat",
        summary: "Kernel-based cracking on GPUs with explicit hash modes and attack modes.",
        strengths: [
          "Highest throughput on common formats",
          "Straight/rules/hybrid/mask/broadcast attack modes",
          "Benchmark mode for keyspace-vs-time planning",
          "Potfile + session restore for long audits",
        ],
        limitations: [
          "You choose the numeric mode yourself; wrong mode means zero results",
          "Driver and device setup is a real dependency",
        ],
        whenToUse: [
          "Large candidate volume against common digest formats",
          "Measuring how fast a policy falls on known hardware",
        ],
      },
      {
        tool: "John the Ripper",
        summary: "CPU-first auditor with format auto-detection, single-shot mode and a deep rule language.",
        strengths: [
          "Detects formats and handles unusual ones",
          "`unshadow` and friends for local policy review",
          "Session/potfile workflow is simple to script",
          "No GPU driver dependency",
        ],
        limitations: ["Lower raw speed on GPU-friendly formats", "Build variants differ in supported formats"],
        whenToUse: [
          "Unknown or exotic digest formats",
          "A quick `--single` pass over a local audit file",
          "Rule experimentation before committing a run",
        ],
      },
    ],
    features: [
      { group: "Engine", feature: "GPU acceleration", a: { text: "Primary design" }, b: { text: "Optional OpenCL/CUDA builds" } },
      { group: "Engine", feature: "Hash format detection", a: { text: "Manual mode selection" }, b: true },
      { group: "Modes", feature: "Mask/keyspace attacks", a: { text: "Extensive" }, b: { text: "Incremental modes" } },
      { group: "Modes", feature: "Rule language", a: { text: "Rule files" }, b: { text: "Rules + single-shot" } },
      { group: "Operation", feature: "Resume/restore", a: true, b: true },
      { group: "Operation", feature: "Benchmark built in", a: true, b: { text: "`--test` / `--stress`" } },
      { group: "Operation", feature: "Works without extra drivers", a: false, b: true },
      {
        group: "Handling",
        feature: "Sensitive output files",
        a: { text: "potfile + .restore", note: "Contain plaintext — protect and delete" },
        b: { text: "pot file + sessions", note: "Same obligation" },
      },
    ],
    workflowExamples: [
      {
        title: "Cheap first, expensive second",
        b: "john --single hashes.txt && john --wordlist=base.txt --rules hashes.txt",
        a: "hashcat -m 1000 -a 3 hashes.txt '?u?l?l?l?l?d?d' --session policy",
        note: "Order matters for the report: state which candidate space was actually covered.",
      },
    ],
    relatedComparisons: ["wireshark-vs-tcpdump"],
    references: [
      { label: "Hashcat wiki", url: "https://hashcat.net/wiki/" },
      { label: "John documentation", url: "https://www.openwall.com/john/doc/" },
    ],
    lastUpdated: "2026-01-10",
  },
];

export const COMPARISON_BY_SLUG: ReadonlyMap<string, Comparison> = new Map(
  COMPARISONS.map((c) => [c.slug, c]),
);

export function getComparison(slug: string | undefined): Comparison | undefined {
  return slug ? COMPARISON_BY_SLUG.get(slug) : undefined;
}
