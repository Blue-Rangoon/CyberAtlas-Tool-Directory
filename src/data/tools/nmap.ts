import type { Tool } from "@/types";

export const nmap: Tool = {
  slug: "nmap",
  name: "Nmap",
  shortDescription: "Network discovery and security auditing",
  description: [
    "Nmap (Network Mapper) sends purpose-built packets to hosts and infers what services are available, what their versions appear to be, and how a network filters traffic. It is the reference tool for host discovery, port scanning and service enumeration.",
    "Beyond plain port checks it ships a scripting engine (NSE) for protocol-specific probing, output formats designed for later processing, and timing controls that let you trade network load for speed. Nmap is designed for authorized assessment of networks you own or are contracted to test.",
  ],
  category: "networking",
  subcategory: "reconnaissance",
  icon: "Radar",
  website: "https://nmap.org",
  repository: "https://github.com/nmap/nmap",
  documentation: "https://nmap.org/book/man.html",
  license: "NPSL (Nmap Public Source License)",
  openSource: true,
  difficulty: "beginner",
  platforms: ["windows", "macos", "linux", "kali", "parrot", "arch", "fedora", "docker", "source"],
  tags: ["port scanning", "service detection", "recon", "network", "nse", "discovery"],
  status: "verified",
  version: "7.95",
  lastUpdated: "2026-01-18",
  commonlyUsed: true,
  installation: [
    {
      platform: "windows",
      method: "winget",
      title: "Winget (recommended)",
      kind: "recommended",
      description:
        "Installs the official Windows binary package, which bundles Npcap for raw-socket scanning.",
      commands: ["winget install --id Insecure.Nmap -e"],
      requiresElevation: true,
      notes: [
        "The Windows installer also offers Zenmap (GUI) and Ncat. Npcap is required for SYN scans and OS detection.",
      ],
    },
    {
      platform: "windows",
      method: "installer",
      title: "Official installer",
      kind: "alternative",
      description:
        "Download the signed Windows installer from the project's download page.",
      official: true,
      sourceUrl: "https://nmap.org/download.html",
      notes: ["Verify the version on the download page before installing on managed workstations."],
    },
    {
      platform: "macos",
      method: "Homebrew",
      title: "Homebrew",
      kind: "recommended",
      commands: ["brew install nmap"],
      notes: ["Homebrew builds against Npcap-equivalent BPF interfaces available in macOS."],
    },
    {
      platform: "macos",
      method: "MacPorts",
      title: "MacPorts",
      kind: "alternative",
      commands: ["sudo port install nmap"],
    },
    {
      platform: "linux",
      method: "apt",
      title: "apt (Debian, Ubuntu, Kali, Parrot)",
      kind: "recommended",
      commands: ["sudo apt update", "sudo apt install nmap"],
      requiresElevation: true,
      notes: ["Nmap is in the main Debian repository; no extra sources are needed."],
    },
    {
      platform: "fedora",
      method: "dnf",
      title: "dnf",
      kind: "recommended",
      commands: ["sudo dnf install nmap"],
    },
    {
      platform: "arch",
      method: "pacman",
      title: "pacman",
      kind: "recommended",
      commands: ["sudo pacman -S nmap"],
    },
    {
      platform: "source",
      method: "source",
      title: "Build from source",
      kind: "manual",
      description:
        "Use this when your distribution package lags behind a release you need, or when you want the newest NSE scripts.",
      commands: [
        "git clone --depth=1 https://github.com/nmap/nmap.git",
        "cd nmap && ./configure",
        "make -j$(nproc) && sudo make install",
      ],
      requiresElevation: true,
      notes: [
        "Libpcap (Linux/macOS) or Npcap development headers (Windows) must be present before configuring.",
      ],
    },
    {
      platform: "docker",
      method: "docker",
      title: "Containerized runner",
      kind: "manual",
      description:
        "Running Nmap in a container still requires raw packet access, so the image must be started with the network capability below.",
      commands: [
        "docker build -t nmap https://github.com/nmap/nmap.git",
        "docker run --rm --net=host --cap-add=NET_RAW --cap-add=NET_ADMIN nmap -sV 192.0.2.10",
      ],
      notes: [
        "Prefer `--net=host`; NAT inside a bridge network changes source ports and breaks timing heuristics.",
      ],
    },
  ],
  commands: [
    {
      id: "basic-scan",
      title: "Basic scan of a single host",
      description:
        "Scans Nmap's 1,000 most common TCP ports and reports which are open. A sensible first pass on an authorized host.",
      command: "nmap 192.0.2.10",
      shell: "bash",
      platform: "linux",
      difficulty: "beginner",
      example: "nmap 192.0.2.10",
      expectedOutput:
        "PORT     STATE  SERVICE\n22/tcp   open   ssh\n80/tcp   open   http\n443/tcp  closed https",
      notes: [
        "Without `-sV`, the SERVICE column is derived from port number only — it is a guess, not confirmation.",
      ],
      tags: ["scan", "baseline"],
    },
    {
      id: "service-version",
      title: "Service version detection",
      description:
        "Probes each open port with protocol-specific queries and reports the banner or fingerprint it receives.",
      command: "nmap -sV 192.0.2.10",
      shell: "bash",
      platform: "linux",
      difficulty: "beginner",
      example: "nmap -sV -p 80,443,8080 192.0.2.10",
      expectedOutput:
        "80/tcp open  http    nginx 1.22.1\n443/tcp open  ssl/http  Apache httpd 2.4.57",
      notes: [
        "`--version-intensity 0-9` trades probe count for accuracy; the default of 7 is fine for most work.",
        "Version probes can disturb fragile embedded services — enumerate ports first on industrial gear.",
      ],
      tags: ["version", "enumeration"],
    },
    {
      id: "default-scripts",
      title: "Default NSE scripts",
      description:
        "Runs the script category marked `default`, which gathers safe, high-signal information such as TLS certificates, title banners and well-known misconfigurations.",
      command: "nmap -sC -sV 192.0.2.10",
      shell: "bash",
      platform: "linux",
      difficulty: "intermediate",
      example: "nmap -sC -sV -p- -oA scans/web-01 192.0.2.10",
      notes: [
        "Scripts live in `scripts/*.nse`; `-sC` is shorthand for `--script=default`.",
        "Some scripts emit verbose requests. Check the script entry with `nmap --script-help http-slowloris` before running anything outside the default category.",
      ],
      tags: ["nse", "scripts"],
    },
    {
      id: "syn-scan",
      title: "TCP SYN scan (half-open)",
      description:
        "Sends SYN packets and reads the response without completing the handshake. Faster and less noisy than a full connect scan.",
      command: "sudo nmap -sS 192.0.2.10",
      shell: "bash",
      platform: "linux",
      difficulty: "intermediate",
      warnings: ["Requires raw-socket privileges: root/admin on Linux, Npcap on Windows."],
      notes: [
        "On Linux Nmap may also need `CAP_NET_RAW`/`CAP_NET_ADMIN` if you run it as a non-root user.",
        "If SYN scanning is unavailable, Nmap falls back to `-sT` (full connect) — note the difference in your findings.",
      ],
      tags: ["scan", "privileges"],
    },
    {
      id: "os-detection",
      title: "Operating system fingerprinting",
      description:
        "Compares TCP/IP stack quirks against a fingerprint database and reports the most likely operating systems.",
      command: "sudo nmap -O 192.0.2.10",
      shell: "bash",
      platform: "linux",
      difficulty: "intermediate",
      expectedOutput:
        "Device type: general purpose\nRunning: Linux 5.X\nOS CPE: cpe:/o:linux:linux_kernel:5.15",
      warnings: ["Requires root (or CAP_NET_RAW) because it uses raw IP probes."],
      notes: [
        "Results are probabilistic. `--osscan-limit` restricts probing to hosts with at least one open and one closed port, which improves reliability.",
      ],
      tags: ["os", "fingerprint"],
    },
    {
      id: "all-ports",
      title: "Scan all 65,535 TCP ports",
      description:
        "Replaces the default top-1000 port list with the full TCP port range so nothing is missed by assumption.",
      command: "nmap -p- 192.0.2.10",
      shell: "bash",
      platform: "linux",
      difficulty: "beginner",
      notes: [
        "Combine with `--top-ports 100` for a fast second pass on large ranges.",
        "`-p 0-65535` is equivalent; `-p U:53,T:53` mixes UDP and TCP in a single invocation.",
      ],
      tags: ["ports", "coverage"],
    },
    {
      id: "no-ping",
      title: "Skip host discovery (filtered hosts)",
      description:
        "Treats hosts as up even when ICMP is blocked, so ports are probed even if the host does not answer pings.",
      command: "nmap -Pn 192.0.2.10",
      shell: "bash",
      platform: "linux",
      difficulty: "beginner",
      notes: [
        "Without discovery Nmap scans every address in a range — on a /24 that is 256 hosts. Scope carefully.",
        "Use `-PS22,80,443` (TCP SYN ping) or `-PA80` when you want discovery through a specific allowed port.",
      ],
      tags: ["firewall", "discovery"],
    },
    {
      id: "subnet-sweep",
      title: "Ping sweep a local subnet",
      description:
        "Performs host discovery only, to list live addresses before any port work. The polite way to size a network.",
      command: "nmap -sn 192.0.2.0/24",
      shell: "bash",
      platform: "linux",
      difficulty: "beginner",
      expectedOutput:
        "Nmap scan report for 192.0.2.1\nHost is up (0.0021s latency).\nMAC Address: AA:BB:CC:00:11:22 (Vendor)",
      notes: [
        "On a local segment Nmap also uses ARP, which is far more reliable than ICMP — this usually needs root.",
      ],
      tags: ["discovery", "subnet"],
    },
    {
      id: "udp-scan",
      title: "Targeted UDP service scan",
      description:
        "Probes common UDP ports. UDP is slow and unreliable, so restrict it to a known port list.",
      command: "sudo nmap -sU -p 53,67,68,123,161,500,5353 192.0.2.10",
      shell: "bash",
      platform: "linux",
      difficulty: "advanced",
      warnings: [
        "A full UDP port range scan is very slow and can flood low-power devices. Always restrict the port list.",
      ],
      notes: [
        "Ports reported `open|filtered` are ambiguous: Nmap received no response, which is also what a firewall drop looks like.",
      ],
      tags: ["udp", "enumeration"],
    },
    {
      id: "output-all",
      title: "Save output in all formats",
      description:
        "Writes normal, XML and grepable output with one prefix, which keeps evidence organised for reporting.",
      command: "nmap -sV -sC -oA scans/target-01 192.0.2.10",
      shell: "bash",
      platform: "linux",
      difficulty: "beginner",
      notes: [
        "Produces `target-01.nmap`, `.xml` and `.gnmap`. XML is what most tools and note-taking frameworks import.",
        "`-oG` output is convenient for `grep`, but the format is officially frozen and should not be relied on for long-lived parsers.",
      ],
      tags: ["output", "reporting"],
    },
    {
      id: "timing",
      title: "Adjust scan timing",
      description:
        "Sets the timing template, which controls parallelism and retry timeouts.",
      command: "nmap -T3 --max-parallelism 32 192.0.2.10",
      shell: "bash",
      platform: "linux",
      difficulty: "intermediate",
      warnings: [
        "Higher templates (T4-T5) increase load on the target and on intermediate firewalls. On shared or production systems prefer T2-T3.",
      ],
      notes: [
        "Use `--host-timeout 10m --max-retries 1` so one stubborn host does not dominate a scan window.",
      ],
      tags: ["performance", "timing"],
    },
  ],
  examples: [
    {
      title: "First pass on an authorized web host",
      scenario:
        "You have written scope for one host and need a defensible inventory of exposed TCP services.",
      steps: [
        { label: "Confirm the host answers", command: "nmap -sn 192.0.2.10" },
        {
          label: "Enumerate services and default scripts, saving everything",
          command: "nmap -Pn -sV -sC -p- -oA scans/web-01 192.0.2.10",
        },
        {
          label: "Extract just the open ports for notes",
          command: "grep open scans/web-01.gnmap",
        },
      ],
      outcome:
        "You end up with a full port list, version guesses, script output in XML for import, and a plain-text file to quote in a report.",
    },
    {
      title: "Verifying a firewall change",
      scenario:
        "The network team says only 443 is reachable from the guest VLAN. Prove it from that segment.",
      steps: [
        {
          label: "Scan the ports that should be closed",
          command: "nmap -Pn -p 22,80,443,445,3389 203.0.113.5",
        },
        {
          label: "Distinguish filtered from closed",
          command: "nmap -Pn -sV -p 80,443 --reason 203.0.113.5",
        },
      ],
      outcome:
        "`closed` means a host answered with RST; `filtered` means nothing came back. Only the second result proves a rule is doing the blocking.",
    },
  ],
  useCases: [
    {
      title: "Authorized scope inventory",
      description:
        "Build a factual list of exposed network services before an assessment or during a periodic review.",
    },
    {
      title: "Hardening verification",
      description:
        "Confirm that a disabled service, patched banner or firewall rule actually behaves as documented.",
    },
    {
      title: "Lab and CTF enumeration",
      description:
        "Standard first step in isolated ranges to see what a machine exposes.",
    },
    {
      title: "Incident triage support",
      description:
        "Rapidly answer 'what was listening on this host at that time' when combined with logs.",
    },
  ],
  commonErrors: [
    {
      symptom: "\"Only root may use a SYN scan on this system\"",
      causes: [
        "The process lacks raw-socket privileges on Linux/macOS.",
        "Windows install without Npcap, or Npcap installed without the raw-open feature.",
      ],
      solution:
        "Re-run with sudo (or grant CAP_NET_RAW/CAP_NET_ADMIN to the binary), or use a full connect scan with -sT, which does not need raw sockets.",
      commands: [
        "sudo nmap -sS 192.0.2.10",
        "sudo setcap cap_net_raw,cap_net_admin=eip $(which nmap)",
      ],
    },
    {
      symptom: "All 1000 ports show \"filtered\" although the host is clearly live",
      causes: [
        "An upstream firewall drops the probe range and only allows specific ports.",
        "Host discovery passed on a different protocol than the port probes.",
      ],
      solution:
        "Scan only the allowed ports, and use `-Pn` with `-sV --reason`. If ICMP/ACK probes are being dropped you will see no difference between filtered and dropped, so note it as a limitation in your report.",
      commands: ["nmap -Pn -sV --reason -p 443,8443 192.0.2.10"],
    },
    {
      symptom: "Windows: \"Couldn't find device Npcap Loopback\" or libpcap error",
      causes: [
        "Npcap not installed, or installed without 'Install Npcap in WinPcap API-compatible Mode'.",
        "Scanning localhost requires the loopback adapter option.",
      ],
      solution:
        "Reinstall Npcap from the Nmap download page and enable 'Support for loopback adapter' when scanning 127.0.0.1.",
    },
    {
      symptom: "Scan hangs on one host while the rest finish",
      causes: [
        "A host is rate-limiting, or a script is waiting on an unresponsive service.",
        "No host timeout was configured.",
      ],
      solution:
        "Add per-host and per-script limits so a single target cannot stall the run.",
      commands: [
        "nmap -Pn --host-timeout 5m --script-timeout 20s --max-retries 1 192.0.2.10",
      ],
    },
    {
      symptom: "\"Failed to resolve given hostname\"",
      causes: ["Typo, missing DNS record, or the target is only reachable by IP."],
      solution:
        "Verify resolution with the platform resolver first, then scan the address directly and record the mapping in your notes.",
      commands: ["Resolve-DnsName example.internal", "getent hosts example.internal"],
    },
  ],
  tips: [
    "Scan twice: once for coverage (`-p-`), once for detail (`-sV -sC` on the ports you found). It is faster than one giant scan with everything enabled.",
    "Save XML (`-oX`) from the beginning. Re-formatting a completed scan is impossible without re-scanning the target.",
    "`--script-help <name>` and the NSE category list tell you what a script actually sends. Read it before using anything outside `default`.",
    "For internal ranges, resolve MAC vendors with `-Pn -sL` first; it is often enough to spot unexpected hardware.",
    "Time templates change packet volume, not cleverness. On production networks stay at T3 or below.",
  ],
  alternatives: ["masscan", "rustscan", "zmap"],
  relatedTools: ["tcpdump", "wireshark", "nuclei"],
  references: [
    {
      label: "Nmap Reference Guide",
      url: "https://nmap.org/book/man.html",
      note: "Authoritative explanation of every scan type, timing option and output format.",
    },
    {
      label: "NSE script categories",
      url: "https://nmap.org/book/nse-usage.html",
      note: "How to select and audit NSE scripts.",
    },
    {
      label: "Official downloads & changelog",
      url: "https://nmap.org/download.html",
      note: "Version and platform-specific installer verification point.",
    },
  ],
};
