import type { Tool } from "@/types";

export const wireshark: Tool = {
  slug: "wireshark",
  name: "Wireshark",
  shortDescription: "Protocol analyzer for capturing and inspecting network traffic",
  description: [
    "Wireshark captures packets from an interface and decodes them into protocol trees, so you can read exactly what crossed the wire: handshakes, retransmissions, credentials sent in the clear, application behaviour.",
    "It is primarily a diagnostic instrument. Engineers use it to explain why a connection is slow or failing; analysts use it to reconstruct what a host actually said during an incident. TShark is the same engine without the GUI, which makes it usable on servers and in scripts.",
  ],
  category: "networking",
  subcategory: "traffic-analysis",
  icon: "Waypoints",
  website: "https://www.wireshark.org",
  repository: "https://gitlab.com/wireshark/wireshark",
  documentation: "https://www.wireshark.org/docs/",
  license: "GPL-2.0-or-later",
  openSource: true,
  difficulty: "beginner",
  platforms: ["windows", "macos", "linux", "kali", "parrot", "arch", "fedora", "docker", "source"],
  tags: ["pcap", "capture", "protocol", "analysis", "display filter", "tshark"],
  status: "verified",
  lastUpdated: "2026-01-16",
  commonlyUsed: true,
  installation: [
    {
      platform: "windows",
      method: "installer",
      title: "Official installer (includes Npcap)",
      kind: "recommended",
      description:
        "The Windows installer bundles Npcap. During setup, keep the default capture settings unless your organisation's policy says otherwise.",
      official: true,
      sourceUrl: "https://www.wireshark.org/download.html",
      requiresElevation: true,
      notes: [
        "Installers are signed per release; compare the hash shown on the download page if you verify packages.",
      ],
    },
    {
      platform: "windows",
      method: "winget",
      title: "Winget",
      kind: "alternative",
      commands: ["winget install --id WiresharkFoundation.Wireshark -e"],
      requiresElevation: true,
    },
    {
      platform: "macos",
      method: "Homebrew",
      title: "Homebrew cask",
      kind: "recommended",
      commands: ["brew install --cask wireshark"],
      notes: [
        "ChmodBPF from the same cask is what lets non-root users capture; run it once per machine.",
      ],
    },
    {
      platform: "linux",
      method: "apt",
      title: "apt",
      kind: "recommended",
      commands: ["sudo apt update", "sudo apt install wireshark tshark"],
      requiresElevation: true,
      notes: [
        "On Debian-family systems the installer asks whether non-root users may capture. Adding yourself to the `wireshark` group is the safer answer than always running as root:",
        "sudo usermod -aG wireshark $USER",
      ],
    },
    {
      platform: "fedora",
      method: "dnf",
      title: "dnf",
      kind: "recommended",
      commands: ["sudo dnf install wireshark wireshark-cli"],
    },
    {
      platform: "arch",
      method: "pacman",
      title: "pacman",
      kind: "recommended",
      commands: ["sudo pacman -S wireshark-qt wireshark-cli"],
    },
  ],
  commands: [
    {
      id: "capture-interface",
      title: "Capture on a specific interface",
      description:
        "Live capture from one interface, bounded by packet count so the file stays reviewable.",
      command: "tshark -i eth0 -c 5000 -w /tmp/lab.pcapng",
      shell: "bash",
      platform: "linux",
      difficulty: "beginner",
      notes: [
        "List interfaces first: `tshark -D`. On Windows the interface names include \\Device\\NPF_ prefixes.",
      ],
      tags: ["capture"],
    },
    {
      id: "filter-host-port",
      title: "Show one conversation only",
      description:
        "Display filters narrow a capture while reading it, without losing the underlying packets.",
      command: "tcp.port == 443 && ip.addr == 192.0.2.10",
      shell: "bash",
      platform: "linux",
      difficulty: "beginner",
      example: "tshark -r lab.pcapng -Y 'http.request.method == \"GET\"' -T fields -e frame.number -e http.host",
      notes: [
        "`-Y` applies a display filter; `-f` applies a capture (BPF) filter while recording. They are different languages.",
      ],
      tags: ["display filter"],
    },
    {
      id: "follow-stream",
      title: "Reassemble a TCP stream",
      description:
        "Rebuilds the byte stream of one TCP conversation so the application-layer exchange reads as text.",
      command: "tshark -r lab.pcapng -q -z follow,tcp,ascii,0",
      shell: "bash",
      platform: "linux",
      difficulty: "intermediate",
      notes: [
        "In the GUI use Follow → TCP Stream. If the stream is TLS-encrypted you will see ciphertext unless you also have the session keys.",
      ],
      tags: ["stream", "tcp"],
    },
    {
      id: "decrypt-tls",
      title: "Decrypt TLS with a key log file",
      description:
        "When the client writes a key log, Wireshark can decrypt the session and decode HTTP/1.1 or HTTP/2 inside it.",
      command: "SSLKEYLOGFILE=/tmp/keys.log curl -s https://example.internal/ >/dev/null",
      shell: "bash",
      platform: "linux",
      difficulty: "advanced",
      notes: [
        "Point Preferences → Protocols → TLS at (Pre)-Master-Secret log filename, then capture. This only ever works for traffic where you legitimately hold the client keys — your own browser in a lab.",
        "Never attempt to decrypt sessions belonging to other parties without explicit authorization.",
      ],
      tags: ["tls", "decryption"],
    },
    {
      id: "capture-filter",
      title: "Reduce data at capture time",
      description:
        "BPF capture filters write only what you need, which matters on busy links.",
      command: "sudo tcpdump -i eth0 -w /tmp/dns.pcap 'port 53'",
      shell: "bash",
      platform: "linux",
      difficulty: "intermediate",
      notes: [
        "The same BPF expression works in Wireshark's capture options. Capture filters cannot match application content, only L2-L4 fields.",
      ],
      tags: ["capture filter", "bpf"],
    },
    {
      id: "stats-endpoints",
      title: "Rank endpoints and conversations",
      description:
        "Quick statistical view of who talked to whom and how much — the fastest way to orient in a large capture.",
      command: "tshark -r lab.pcapng -q -z conv,tcp",
      shell: "bash",
      difficulty: "beginner",
      notes: [
        "In the GUI: Statistics → Conversations / Endpoints / Protocol Hierarchy.",
      ],
      tags: ["statistics"],
    },
    {
      id: "expert-info",
      title: "Find retransmissions and errors",
      description:
        "Expert information aggregates anomalies so a slow-application investigation starts with evidence, not guesswork.",
      command: "tshark -r lab.pcapng -Y 'tcp.analysis.retransmission || tcp.analysis.zero_window' -T fields -e frame.time_relative -e ip.src -e ip.dst",
      shell: "bash",
      difficulty: "advanced",
      expectedOutput:
        "0.302114000\t192.0.2.10\t192.0.2.20\n0.641223000\t192.0.2.10\t192.0.2.20",
      notes: [
        "Retransmissions at one side plus a zero-window from the other points to a receive-buffer problem, not a network problem.",
      ],
      tags: ["performance", "tcp"],
    },
    {
      id: "export-objects",
      title: "Extract transferred files",
      description:
        "Pulls files reassembled from an SMB, HTTP or FTP stream — used in labs and incident review to recover a delivered artefact.",
      command: "tshark -r lab.pcapng -q -z export_objects,http",
      shell: "bash",
      difficulty: "intermediate",
      warnings: [
        "Treat extracted files as untrusted. Do not open recovered executables outside an isolated VM.",
      ],
      tags: ["forensics", "export"],
    },
  ],
  examples: [
    {
      title: "Why does this internal API feel slow?",
      scenario: "A service responds in 3 s on one segment and 200 ms on another.",
      steps: [
        {
          label: "Capture near the client with a bounded file size",
          command: "sudo tshark -i eth0 -f 'host 192.0.2.30 and port 8443' -a duration:60 -w api.pcapng",
        },
        {
          label: "Measure TCP-level delay per request",
          command: "tshark -r api.pcapng -Y 'tcp.analysis.flags' -T fields -e frame.time_relative -e tcp.analysis.type",
        },
        {
          label: "Compare handshake RTT to total response time",
          command: "tshark -r api.pcapng -Y 'tcp.handshake.time' -T fields -e tcp.handshake.time -e frame.time_relative",
        },
      ],
      outcome:
        "If the handshake RTT is small and the delay sits between request and response, the application is the bottleneck — not the network.",
    },
  ],
  useCases: [
    { title: "Protocol learning", description: "See what a handshake actually contains instead of reading about it." },
    { title: "Service troubleshooting", description: "Separate network faults from application faults with evidence." },
    { title: "Incident reconstruction", description: "Establish what a host transmitted during a window of interest." },
    { title: "Filter and rule validation", description: "Confirm a firewall or proxy behaved as intended." },
  ],
  commonErrors: [
    {
      symptom: "\"You don't have permission to capture on this adapter\"",
      causes: [
        "The user is not in the capture group (Linux) or Npcap/ChmodBPF is not configured (Windows/macOS).",
        "Pktmon is in use on Windows instead of Npcap.",
      ],
      solution:
        "On Linux add the user to the wireshark group and re-login. On macOS run the install_chmodbpf script from the Wireshark package. On Windows re-run the installer with Npcap selected.",
      commands: ["sudo usermod -aG wireshark $USER", "ls -l /dev/bpf*"],
    },
    {
      symptom: "Capture is full of 'TCP Out-Of-Order' or duplicate frames",
      causes: ["NIC offload features (GRO/TSO/LRO) rewrite packets before capture."],
      solution:
        "Disable offload on the capture interface for the duration of the test, or read the capture as indicative rather than authoritative.",
      commands: ["sudo ethtool -K eth0 gro off tso off lro off"],
    },
    {
      symptom: "Only 'TLS' and 'Continuation Data' lines, nothing readable",
      causes: ["Traffic is encrypted (expected) and no key log is loaded."],
      solution:
        "Decode only what you are allowed to: export your own browser's SSLKEYLOGFILE in a lab, or analyse certificate and timing metadata instead.",
    },
    {
      symptom: "Filtered on 'http' but the site clearly uses HTTP/2",
      causes: ["Field names differ per dissector."],
      solution: "Filter on `http2` fields (`http2.headers.path`) or expand the protocol tree to see the correct field names for your version.",
    },
  ],
  tips: [
    "Name your display filters (left-click a filter field while holding the modifier key) and reuse them — half of analysis is typing the same filter again.",
    "Enable time-shift display (`View → Time Display Format → Seconds Since Beginning of Capture`) before you compare two events.",
    "For long captures, capture to a ring buffer (`-b filesize:65536 -b files:10`) instead of one huge file.",
    "Read `frame.time_relative`, not wall-clock, when you are measuring durations.",
  ],
  alternatives: ["tcpdump", "tshark"],
  relatedTools: ["tcpdump", "nmap", "netcat"],
  references: [
    { label: "Wireshark User's Guide", url: "https://www.wireshark.org/docs/wsug_html_chunked/", note: "Official documentation for capture setup and profiles." },
    { label: "Display filter reference", url: "https://www.wireshark.org/docs/wsug_html_chunked/ChWorkBuildDisplayFilterSection.html", note: "Filter grammar and operators." },
    { label: "Capture file formats", url: "https://wiki.wireshark.org/CaptureSetup/CaptureFilters", note: "Community reference on capture filters and limits." },
  ],
};
