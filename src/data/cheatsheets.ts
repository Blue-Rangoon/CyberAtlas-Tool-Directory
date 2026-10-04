import type { Cheatsheet } from "@/types";

/**
 * Cheatsheets are retrieval documents: every entry is one line you can scan,
 * copy and use. Explanatory depth belongs on tool pages.
 */
export const CHEATSHEETS: Cheatsheet[] = [
  {
    slug: "nmap",
    title: "Nmap",
    description: "Scan types, port selection, output and timing switches, in the order you reach for them.",
    category: "networking",
    tool: "nmap",
    icon: "Radar",
    lastUpdated: "2026-01-18",
    sections: [
      {
        title: "Discovery",
        intro: "Establish what is present before scanning ports.",
        entries: [
          { label: "Ping sweep a subnet", command: "nmap -sn 192.0.2.0/24" },
          { label: "ARP-style local discovery (needs privileges)", command: "sudo nmap -sn 192.0.2.0/24", note: "On-LAN ARP is more reliable than ICMP" },
          { label: "TCP SYN ping on allowed ports", command: "nmap -PS22,80,443 192.0.2.0/24" },
          { label: "Treat hosts as up (ICMP blocked)", command: "nmap -Pn 192.0.2.10" },
          { label: "List targets only, send nothing", command: "nmap -sL 192.0.2.0/24" },
        ],
      },
      {
        title: "Ports & protocols",
        entries: [
          { label: "Top 1000 ports (default)", command: "nmap 192.0.2.10" },
          { label: "All 65535 TCP ports", command: "nmap -p- 192.0.2.10" },
          { label: "Port list and ranges", command: "nmap -p 22,80,443,8000-8100 192.0.2.10" },
          { label: "Top N ports by frequency", command: "nmap --top-ports 100 192.0.2.10" },
          { label: "UDP on a short list", command: "sudo nmap -sU -p 53,123,161 192.0.2.10" },
          { label: "Mixed TCP+UDP", command: "sudo nmap -sSU -p U:53,T:53,443 192.0.2.10" },
        ],
      },
      {
        title: "Scan techniques",
        entries: [
          { label: "TCP connect (no raw sockets)", command: "nmap -sT 192.0.2.10" },
          { label: "SYN half-open (privileged)", command: "sudo nmap -sS 192.0.2.10" },
          { label: "Version detection", command: "nmap -sV 192.0.2.10" },
          { label: "Default NSE scripts", command: "nmap -sC 192.0.2.10" },
          { label: "OS detection", command: "sudo nmap -O --osscan-limit 192.0.2.10" },
          { label: "Why a port is filtered", command: "nmap -Pn --reason -p 80 192.0.2.10" },
          { label: "One named script with args", command: "nmap --script http-headers --script-args http-headers.path=/ 192.0.2.10" },
        ],
      },
      {
        title: "Output & performance",
        entries: [
          { label: "All formats with a prefix", command: "nmap -oA scans/host-01 192.0.2.10" },
          { label: "XML only", command: "nmap -oX scans/host.xml 192.0.2.10" },
          { label: "Append open ports for notes", command: "grep 'open' scans/host-01.gnmap" },
          { label: "Timing template (stay <=T3 on production)", command: "nmap -T3 192.0.2.10" },
          { label: "Cap parallelism and retries", command: "nmap --max-parallelism 20 --max-retries 1 192.0.2.10" },
          { label: "Don't let one host stall the run", command: "nmap --host-timeout 5m --script-timeout 20s 192.0.2.10" },
          { label: "Resume from previous state", command: "nmap --resume" },
        ],
      },
      {
        title: "Privilege checklist",
        entries: [
          { label: "Grant raw-socket capability once", command: "sudo setcap cap_net_raw,cap_net_admin=eip $(which nmap)" },
          { label: "Confirm version and paths", command: "nmap --version" },
          { label: "Test before a long scan", command: "nmap -v -p 22,80 192.0.2.10", note: "-v shows which scan type was actually selected" },
        ],
      },
    ],
  },
  {
    slug: "wireshark-display-filters",
    title: "Wireshark display filters",
    description: "Filter expressions to type from memory, grouped by what you are usually asking.",
    category: "networking",
    tool: "wireshark",
    icon: "Waypoints",
    lastUpdated: "2026-01-16",
    sections: [
      {
        title: "Addressing",
        entries: [
          { label: "One host either direction", command: "ip.addr == 192.0.2.10" },
          { label: "As source only", command: "ip.src == 192.0.2.10" },
          { label: "Subnet", command: "ip.addr == 192.0.2.0/24" },
          { label: "Either endpoint in a list", command: "ip.addr in {192.0.2.10 192.0.2.11 192.0.2.12}" },
          { label: "MAC address", command: "eth.addr == aa:bb:cc:00:11:22" },
          { label: "Not this address", command: "!ip.addr == 192.0.2.1" },
        ],
      },
      {
        title: "Ports & protocols",
        entries: [
          { label: "Port on either side", command: "tcp.port == 443" },
          { label: "Port range", command: "tcp.port in {80 443 8000-8100}" },
          { label: "UDP only", command: "udp && port 53" },
          { label: "DNS queries only", command: "dns.flags.response == 0" },
          { label: "NXDOMAIN answers", command: "dns.flags.rcode == 3" },
          { label: "TLS handshake failures", command: "tls.alert_message" },
          { label: "HTTP requests", command: "http.request" },
          { label: "HTTP status 500+", command: "http.response.code >= 500" },
        ],
      },
      {
        title: "TCP behaviour",
        entries: [
          { label: "SYNs (connection attempts)", command: "tcp.flags.syn == 1 && tcp.flags.ack == 0" },
          { label: "RSTs", command: "tcp.flags.reset == 1" },
          { label: "Retransmissions", command: "tcp.analysis.retransmission" },
          { label: "Zero window / back-pressure", command: "tcp.analysis.zero_window" },
          { label: "Handshake duration field", command: "tcp.handshake.time > 0.25" },
          { label: "One conversation", command: "tcp.stream eq 42" },
        ],
      },
      {
        title: "Content and size",
        entries: [
          { label: "Contains a string", command: "frame contains \"401 \"" },
          { label: "Matches a regex (case-insensitive)", command: "http.host matches \"(?i)api\\.\""},
          { label: "Bigger than a threshold", command: "frame.len > 1400" },
          { label: "Only the first 30 seconds", command: "frame.time_relative < 30" },
          { label: "A header value exists", command: "http.authorization" },
        ],
      },
    ],
  },
  {
    slug: "linux-essentials",
    title: "Linux essentials",
    description: "The commands that appear in almost every security workflow, with the flags that matter.",
    category: "misc",
    icon: "Terminal",
    lastUpdated: "2026-01-12",
    sections: [
      {
        title: "Where am I",
        entries: [
          { label: "Network interfaces and addresses", command: "ip -br addr" },
          { label: "Routes", command: "ip route" },
          { label: "Listening sockets with owning process", command: "ss -ltnp" },
          { label: "All established connections", command: "ss -tnp state established" },
          { label: "DNS resolution actually in use", command: "resolvectl status | head -20" },
          { label: "Kernel and release", command: "uname -a && cat /etc/os-release" },
        ],
      },
      {
        title: "Processes",
        entries: [
          { label: "Tree view", command: "ps auxf | less" },
          { label: "Newest first", command: "ps -eo pid,ppid,etime,comm --sort=-etime | head -20" },
          { label: "What a PID has open", command: "sudo ls -l /proc/<pid>/fd", note: "Also: lsof -p <pid>" },
          { label: "Live overview", command: "top -o %CPU" },
          { label: "Kill politely, then forcefully", command: "kill -TERM <pid>; kill -KILL <pid>", note: "Give the graceful signal a moment first" },
        ],
      },
      {
        title: "Files and permissions",
        entries: [
          { label: "Find by name", command: "find /etc -name '*.conf' -maxdepth 2" },
          { label: "Newer than a reference file", command: "find . -newer /etc/hostname -type f" },
          { label: "Setuid/setgid binaries", command: "find / -perm -4000 -o -perm -2000 2>/dev/null", note: "Review, do not treat as findings by themselves" },
          { label: "Change mode recursively on a copy", command: "chmod -R u+rwX,go-rwx ./copy" },
          { label: "Show effective ACLs", command: "getfacl -p path/to/file" },
        ],
      },
      {
        title: "Text work",
        entries: [
          { label: "Count matches per file", command: "grep -rc 'error' logs/" },
          { label: "Only the match, de-duplicated", command: "grep -ohE '([0-9]{1,3}\\.){3}[0-9]{1,3}' file | sort -u" },
          { label: "Fields 1 and 4 of a column file", command: "awk '{print $1, $4}' out.txt" },
          { label: "Top values of a column", command: "cut -d' ' -f7 access.log | sort | uniq -c | sort -rn | head" },
          { label: "Diff two directories quietly", command: "diff -rq a/ b/ | head -40" },
        ],
      },
      {
        title: "Services and boot",
        entries: [
          { label: "Status and recent log lines", command: "systemctl status ssh --no-pager" },
          { label: "Journal for one unit, since 1h", command: "journalctl -u nginx --since -1h --no-pager | tail -50" },
          { label: "Enabled units at boot", command: "systemctl list-unit-files --state enabled" },
          { label: "Cron for the current user", command: "crontab -l" },
        ],
      },
    ],
  },
  {
    slug: "bash",
    title: "Bash",
    description: "Scripting patterns that make security tooling output safe to handle.",
    category: "misc",
    icon: "SquareTerminal",
    lastUpdated: "2026-01-08",
    sections: [
      {
        title: "Safety settings",
        intro: "Put these at the top of any script that touches real files.",
        entries: [
          { label: "Fail on errors and unset variables", command: "set -euo pipefail" },
          { label: "Stop on a pipeline that fails partway", command: "set -o pipefail" },
          { label: "Prevent globbing surprises", command: "IFS=$'\\n'", note: "Use with `while read -r line`" },
          { label: "Cleanup on exit", command: "trap 'rm -rf \"$tmp\"' EXIT" },
        ],
      },
      {
        title: "Loops and pipelines",
        entries: [
          { label: "Read a file line by line", command: "while IFS= read -r line; do echo \"$line\"; done < hosts.txt" },
          { label: "Loop over IPs from a scan", command: "grep -oE '([0-9]{1,3}\\.){3}[0-9]{1,3}' out.gnmap | sort -u | while read -r ip; do echo \"$ip\"; done" },
          { label: "Parallel with a limit", command: "xargs -a hosts.txt -P 4 -n 1 -I{} sh -c 'echo {}'" },
          { label: "Progress-free output for pipes", command: "cmd 2>/dev/null | tee -a run.log", note: "Keep stderr in a log, not in the pipe" },
        ],
      },
      {
        title: "Quoting and expansion",
        entries: [
          { label: "Command substitution", command: "ts=$(date -u +%Y%m%dT%H%M%SZ)" },
          { label: "Default value when empty", command: "target=\"${TARGET:-192.0.2.10}\"" },
          { label: "Substring and length", command: "echo \"${host:0:8}\"" },
          { label: "Never word-split a list", command: 'for f in "${files[@]}"; do :; done' },
        ],
      },
      {
        title: "Debugging",
        entries: [
          { label: "Trace execution", command: "bash -x ./script.sh" },
          { label: "Syntax check only", command: "bash -n ./script.sh" },
          { label: "See what a command resolves to", command: "type -a nmap; command -v ffuf" },
        ],
      },
    ],
  },
  {
    slug: "regex",
    title: "Regex for log and payload triage",
    description: "Patterns you can paste into grep -E, a filter box or a notebook, with the caveats that matter.",
    category: "misc",
    icon: "Hash",
    lastUpdated: "2026-01-05",
    sections: [
      {
        title: "Indicators",
        entries: [
          { label: "IPv4 address", command: "([0-9]{1,3}\\.){3}[0-9]{1,3}", note: "Validates shape, not range — check octets > 255 separately" },
          { label: "CIDR block", command: "([0-9]{1,3}\\.){3}[0-9]{1,3}/([89]|[12][0-9]|3[0-2])" },
          { label: "MAC address", command: "([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}" },
          { label: "FQDN in a log line", command: "\\b(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}\\b" },
          { label: "URL", command: "https?://[^\\s\"'<>)]+" },
        ],
      },
      {
        title: "Common secrets and identifiers",
        entries: [
          { label: "PEM private key header", command: "-----BEGIN [A-Z ]*PRIVATE KEY-----" },
          { label: "JWT (three base64url segments)", command: "eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]*" },
          { label: "AWS access key id shape", command: "\\b(AKIA|ASIA)[0-9A-Z]{16}\\b" },
          { label: "Long hex blob (possible hash)", command: "\\b[0-9a-f]{32,128}\\b", note: "Expect false positives from ids and hashes of non-secrets" },
        ],
      },
      {
        title: "HTTP and log work",
        entries: [
          { label: "Status code from a combined log line", command: "\" ([0-9]{3}) [0-9]+" },
          { label: "User-Agent value", command: "Mozilla.*\\(([^)]*)\\)" },
          { label: "Query string parameter named 'next'", command: "[?&]next=([^&]*)" },
          { label: "Anything URL-encoded", command: "%[0-9a-fA-F]{2}", note: "Multiple layers show repeated %25" },
        ],
      },
      {
        title: "Usage",
        entries: [
          { label: "Extended regex with grep", command: "grep -E 'pattern' file" },
          { label: "Only the matched part", command: "grep -oE 'pattern' file | sort -u" },
          { label: "Case-insensitive count", command: "grep -icE 'pattern' file" },
          { label: "Replace in place with a backup", command: "sed -Ei.bak 's/pattern/repl/g' file" },
        ],
      },
    ],
  },
  {
    slug: "network-troubleshooting",
    title: "Network troubleshooting",
    description: "An ordered diagnostic path with the command for each question, plus how to read the answer.",
    category: "networking",
    icon: "Network",
    lastUpdated: "2026-01-11",
    sections: [
      {
        title: "1 — Am I configured?",
        entries: [
          { label: "Interfaces and state", command: "ip -br addr" },
          { label: "Default route present", command: "ip route get 1.1.1.1" },
          { label: "Name resolution path", command: "resolvectl status | sed -n '1,20p'" },
          { label: "Linux firewall rules in effect", command: "sudo nft list ruleset | head -40" },
        ],
      },
      {
        title: "2 — Can I resolve?",
        entries: [
          { label: "A record", command: "dig +short A example.org" },
          { label: "Full chain from the configured resolver", command: "dig +trace example.org" },
          { label: "Ptr for an IP you found", command: "dig +short -x 192.0.2.10" },
          { label: "Which resolver answered (avoid cache lies)", command: "dig @127.0.0.53 example.org +noall +comments" },
        ],
      },
      {
        title: "3 — Can I connect?",
        entries: [
          { label: "TCP handshake test with timing", command: "time nc -zv 192.0.2.10 443" },
          { label: "Read the banner", command: "nc -nv 192.0.2.10 22" },
          { label: "TLS parameters", command: "openssl s_client -connect 192.0.2.10:443 -servername app.internal </dev/null | sed -n '1,25p'" },
          { label: "Path with per-hop timing", command: "traceroute -T -p 443 192.0.2.10", note: "ICMP-based traceroute is often filtered; TCP tells you about the real path" },
        ],
      },
      {
        title: "4 — What does the wire say?",
        entries: [
          { label: "Bounded capture for one peer", command: "sudo tcpdump -nn -i any -c 200 host 192.0.2.10 and port 443" },
          { label: "Only SYNs, to see half-open behaviour", command: "sudo tcpdump -nn 'tcp[tcpflags] & (tcp-syn|tcp-rst) != 0'" },
          { label: "Save for Wireshark", command: "sudo tcpdump -i eth0 -w /tmp/diag.pcap -C 20 -W 3" },
        ],
      },
      {
        title: "5 — Slow service triage",
        entries: [
          { label: "Retransmissions in the capture", command: "tshark -r /tmp/diag.pcap -Y 'tcp.analysis.retransmission' | wc -l" },
          { label: "Server-side window pressure", command: "tshark -r /tmp/diag.pcap -Y 'tcp.analysis.zero_window' | wc -l" },
          { label: "Compare RTT to total response time", command: "tshark -r /tmp/diag.pcap -T fields -e tcp.handshake.time -e http.time" },
        ],
      },
    ],
  },
];

export const CHEATSHEET_BY_SLUG: ReadonlyMap<string, Cheatsheet> = new Map(
  CHEATSHEETS.map((c) => [c.slug, c]),
);

export function getCheatsheet(slug: string | undefined): Cheatsheet | undefined {
  return slug ? CHEATSHEET_BY_SLUG.get(slug) : undefined;
}

export const TOTAL_CHEATSHEET_ENTRIES = CHEATSHEETS.reduce(
  (sum, c) => sum + c.sections.reduce((n, s) => n + s.entries.length, 0),
  0,
);
