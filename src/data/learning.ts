import type { Concept, LearningResource } from "@/types";

/**
 * Concepts are short, structured explanations for readers who have not met the
 * vocabulary yet. Each page answers one question and links onward.
 */
export const CONCEPTS: Concept[] = [
  {
    slug: "what-is-an-ip-address",
    title: "What is an IP address?",
    question: "Why does every machine need one, and what does the number actually mean?",
    summary:
      "An IP address identifies an interface on a network so packets can be delivered to the right place. It is not a person, not a building and not a permanent label for a machine.",
    difficulty: "beginner",
    minutes: 7,
    icon: "Globe",
    sections: [
      {
        heading: "The one-sentence version",
        paragraphs: [
          "An IP address is a numeric label assigned to a network interface. Your machine sends packets to a destination address; every router between you and it only needs to answer 'which way is closer to this number?' That single idea explains addressing, routing and most of subnetting.",
        ],
      },
      {
        heading: "IPv4 in practice",
        paragraphs: [
          "An IPv4 address is 32 bits written as four decimal octets. The number alone is not enough — you also need the prefix length, which says how many leading bits identify the network.",
        ],
        code: [
          { language: "text", value: "192.0.2.10/24   → network 192.0.2.0 – 192.0.2.255\n10.20.0.5/16    → network 10.20.0.0 – 10.20.255.255" },
        ],
      },
      {
        heading: "Private ranges you will meet constantly",
        paragraphs: [
          "Three IPv4 ranges are reserved for internal use and must not be routed on the public internet. Anything else is potentially public.",
        ],
        bullets: [
          "10.0.0.0/8 — one huge private block, common in data centres",
          "172.16.0.0/12 — frequently used by container and cloud networks",
          "192.168.0.0/16 — home and small-office routers",
          "169.254.0.0/16 — link-local: means 'no address was assigned', which is a diagnostic in itself",
        ],
        callout: {
          tone: "info",
          text: "A finding on 10.x is not automatically low risk: internal reachability is a real attack position. Scope, not address, decides severity.",
        },
      },
      {
        heading: "IPv6, briefly",
        paragraphs: [
          "128 bits, written in hexadecimal groups, with no NAT expectation — every interface gets a globally reachable address unless a firewall says otherwise. Prefixes are usually /64 per subnet, and the low 64 bits often encode the MAC address (a privacy concern worth knowing about).",
        ],
      },
      {
        heading: "What an address does not tell you",
        bullets: [
          "It is not identity: shared NAT, DHCP and dynamic assignments mean the same address belongs to different endpoints over time.",
          "Geolocation from an address is an estimate from registration data plus measurements, not a location reading.",
          "Reverse DNS can be absent, wrong or deliberately set — corroboration required.",
        ],
      },
    ],
    checkYourUnderstanding: [
      {
        question: "Two hosts on 192.168.1.10/24 and 192.168.1.20/16 — same subnet?",
        answer: "Yes, on the /16 host's view they are in the same network; the /24 host will still send off-subnet traffic to its default gateway. Mismatched prefix lengths are a classic local cause of asymmetric routing.",
      },
      {
        question: "You see 169.254.x.x in a capture. What does it suggest?",
        answer: "The interface failed to obtain an address (DHCP or SLAAC failure) and self-assigned a link-local one. Traffic beyond the local segment should not exist.",
      },
    ],
    relatedConcepts: ["what-is-a-port", "what-is-cidr", "what-is-dns"],
    relatedTools: ["nmap", "tcpdump"],
    sources: [
      { label: "RFC 791 — Internet Protocol", url: "https://www.rfc-editor.org/rfc/rfc791", note: "The definition, not a tutorial." },
      { label: "RFC 1918 — Address allocation for private internets", url: "https://www.rfc-editor.org/rfc/rfc1918" },
    ],
  },
  {
    slug: "what-is-a-port",
    title: "What is a port?",
    question: "If an address finds the machine, what finds the program?",
    summary:
      "A port is a 16-bit delivery number that lets one IP address host many services. It says 'hand this to that listener', nothing more.",
    difficulty: "beginner",
    minutes: 6,
    icon: "Waypoints",
    sections: [
      {
        heading: "Socket = address + port",
        paragraphs: [
          "Transport protocols identify endpoints by a pair: address plus port. A TCP connection is fully described by five values — source address, source port, destination address, destination port and protocol. That is why 'is port 443 open?' is ambiguous unless you add 'from where'.",
        ],
      },
      {
        heading: "Numbering",
        bullets: [
          "0–1023: well-known ports, reserved for system services (22 SSH, 25 SMTP, 80 HTTP, 443 HTTPS, 53 DNS)",
          "1024–49151: registered ports used by applications",
          "49152–65535: ephemeral ports, usually the client side of a connection",
          "Port numbers are the same in TCP and UDP but unrelated: 53/udp and 53/tcp can be different programs.",
        ],
      },
      {
        heading: "What a scan can and cannot prove",
        paragraphs: [
          "A listener answering does not prove what program is behind it, and a filtered port does not prove a service is absent — only that your probe got no usable answer from this position.",
        ],
        code: [
          { language: "bash", value: "ss -ltnp\n# LISTEN 0 128 0.0.0.0:22  users:((\"sshd\",pid=641))\n\nnmap -p 22,80,443 192.0.2.10\n# 22/tcp open ssh | 80/tcp filtered http | 443/tcp closed https" },
        ],
        callout: {
          tone: "warning",
          text: "'open', 'filtered' and 'closed' are three different statements. Reports that collapse them into 'vulnerable' are wrong in both directions.",
        },
      },
    ],
    checkYourUnderstanding: [
      { question: "Why can a port be open internally and closed from your laptop?", answer: "Firewall rules are directional. Reachability is a property of the path, not the port." },
      { question: "You found 8080/tcp 'open'. What is the next command?", answer: "Read the banner or the response: `nc -nv host 8080` or `curl -sv http://host:8080/` — then decide whether it is in scope to probe further." },
    ],
    relatedConcepts: ["what-is-an-ip-address", "tcp-vs-udp", "what-is-a-firewall"],
    relatedTools: ["nmap", "netcat"],
    sources: [{ label: "IANA service name registry", url: "https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml", note: "Authoritative 'assigned meaning' of port numbers." }],
  },
  {
    slug: "what-is-dns",
    title: "What is DNS?",
    question: "How does a name become an address, and why does that matter to security?",
    summary:
      "DNS is a global, cached, hierarchical lookup system. Most 'the site is down' and 'why does this IP appear?' investigations come back to it.",
    difficulty: "beginner",
    minutes: 9,
    icon: "Compass",
    sections: [
      {
        heading: "The chain",
        paragraphs: [
          "A resolver walks from the root to the TLD to the authoritative zone, caching each answer for its TTL. That cache is why a change takes time to propagate and why two machines can legitimately see different answers at the same moment.",
        ],
        bullets: [
          "A / AAAA — address. CNAME — alias. MX — mail. NS — who is authoritative. TXT — free-form text used for policy records.",
          "SOA carries the zone serial; a stale secondary is visible there.",
          "PTR lives in reverse zones and answers 'what name is this address?'",
        ],
      },
      {
        heading: "Record types you will actually be asked about",
        code: [
          { language: "bash", value: "dig +short A example.org\ndig +short MX example.org\ndig +short TXT _dmarc.example.org\ndig +short -x 192.0.2.10" },
        ],
      },
      {
        heading: "Security relevance",
        bullets: [
          "Subdomain takeover: a dangling CNAME pointing at a service nobody claims.",
          "Certificate transparency logs record names, which is why passive enumeration works at all.",
          "DNS tunneling shows up as long labels and unusually frequent queries — visible in a capture, not in an access log.",
          "Cache poisoning and resolver-level filtering both change what you see, which matters when you verify a finding from a second location.",
        ],
        callout: { tone: "info", text: "Always re-check a DNS observation from a second resolver before it becomes a finding. One cache is one opinion." },
      },
    ],
    checkYourUnderstanding: [
      { question: "A subdomain resolves but the site 404s. Is it in use?", answer: "Something is configured; whether anything is served is a separate question. Record both facts." },
      { question: "What makes a CNAME risky here?", answer: "If the target service is unclaimed, an outsider can register that name on the third-party platform and receive your visitors. That is the takeover condition." },
    ],
    relatedConcepts: ["what-is-an-ip-address", "what-is-http", "what-is-cidr"],
    relatedTools: ["subfinder", "theharvester", "tcpdump"],
    sources: [
      { label: "RFC 1035 — Domain Names", url: "https://www.rfc-editor.org/rfc/rfc1035" },
      { label: "crt.sh certificate search", url: "https://crt.sh/", note: "Independent confirmation for name discovery." },
    ],
  },
  {
    slug: "what-is-http",
    title: "What is HTTP?",
    question: "What travels between a browser and a server, and where can it be changed?",
    summary:
      "HTTP is a text protocol of requests and responses. Understanding the four parts of a request explains proxies, cookies, caching, and half of all web findings.",
    difficulty: "beginner",
    minutes: 10,
    icon: "Globe",
    sections: [
      {
        heading: "Anatomy of a request",
        code: [
          { language: "text", value: "POST /api/v1/items HTTP/1.1      ← method, target, version\nHost: app.internal             ← routing hint\nCookie: session=abc123         ← state the server issued\nContent-Type: application/json ← how to read the body\n\n{\"q\":\"report\"}                ← body" },
        ],
      },
      {
        heading: "Response status classes",
        bullets: [
          "1xx informational — mostly invisible except 100 Continue",
          "2xx success — 200, 201, 204; 200 does not mean 'correct', only 'handled'",
          "3xx redirection — 301 permanent, 302 temporary, 304 cache revalidation",
          "4xx client — 401 unauthenticated, 403 not permitted, 404 absent, 429 rate limited",
          "5xx server — 500, 502 through a proxy, 503 overloaded",
        ],
        callout: {
          tone: "info",
          text: "401 vs 403 is a design statement: 'who are you?' versus 'I know who you are and the answer is no'. Confusing them creates misleading findings.",
        },
      },
      {
        heading: "Where a request can be modified",
        paragraphs: [
          "Client → browser extensions → local proxy (Burp, on 127.0.0.1:8080) → OS proxy settings → corporate egress → CDN or load balancer → reverse proxy → application framework. A 'header the server ignores' is usually a header some earlier hop already rewrote.",
        ],
      },
      {
        heading: "HTTPS, in one paragraph",
        paragraphs: [
          "HTTPS is HTTP over TLS: encryption plus authentication of the server's certificate, then optionally the client's. The URL, method and headers travel inside the encrypted tunnel; the hostname is visible in the certificate handshake unless encrypted SNI is negotiated. Nothing about HTTPS makes an application secure — it protects the path, not the logic.",
        ],
      },
    ],
    checkYourUnderstanding: [
      { question: "A redirect to /login on every request — what likely happened?", answer: "Your session ended. The 302 is a symptom of expired authentication, not a finding about the endpoint." },
      { question: "Why do tools report a path exists when it returns 403?", answer: "Existence and permission are separate facts. A 403 confirms the resource is known to the server." },
    ],
    relatedConcepts: ["what-is-dns", "what-is-a-port", "hashing-vs-encryption"],
    relatedTools: ["burp-suite", "ffuf"],
    sources: [
      { label: "RFC 9110 — HTTP Semantics", url: "https://www.rfc-editor.org/rfc/rfc9110", note: "Status codes and methods, defined rather than described." },
      { label: "MDN HTTP overview", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview", note: "Readable browser-side framing." },
    ],
  },
  {
    slug: "tcp-vs-udp",
    title: "TCP vs UDP",
    question: "Why do some scans answer and others simply go quiet?",
    summary:
      "TCP negotiates and confirms a stream. UDP sends datagrams and accepts silence. Nearly every 'is this port open?' ambiguity comes from that difference.",
    difficulty: "beginner",
    minutes: 8,
    icon: "Network",
    sections: [
      {
        heading: "TCP: three-way handshake",
        code: [
          { language: "text", value: "client                      server\n  ---- SYN ---->                (half-open)\n  <--- SYN/ACK ---              (waiting)\n  ---- ACK ---->                (established)" },
        ],
        paragraphs: [
          "A SYN scan stops after SYN/SYN-ACK and sends RST, which is why it is faster and why it needs raw sockets. A connect scan completes the handshake through the OS.",
        ],
      },
      {
        heading: "What 'open|filtered' really means",
        paragraphs: [
          "UDP has no handshake. If a probe is dropped you cannot distinguish 'nothing is listening' from 'a firewall dropped it' from 'the service got the packet and stayed quiet'. Nmap reports that ambiguity instead of inventing an answer.",
        ],
        bullets: [
          "ICMP port-unreachable in response to a datagram → closed",
          "Any application response → open",
          "Silence → open|filtered, and you must say so",
        ],
      },
      {
        heading: "Where each one lives",
        bullets: [
          "TCP: HTTP/1.1 and HTTP/2, SMTP, SSH, LDAP, SMB, databases",
          "UDP: DNS, NTP, DHCP, SNMP, RIP, QUIC/HTTP/3 — connection-oriented behaviour is rebuilt in the application",
          "QUIC is the instructive case: unreliable datagrams, but per-stream ordering and its own loss recovery — an argument against 'UDP is insecure by nature'.",
        ],
      },
    ],
    checkYourUnderstanding: [
      { question: "Why is a UDP sweep of all ports a bad idea on a small device?", answer: "Each probe invites an ICMP reply from a device whose stack or rate limiter can be overwhelmed. Restrict the port list, always." },
      { question: "A UDP port returns 'open' but the service rejects your query. Contradiction?", answer: "No — 'open' means it answered something. Authorisation is an application-layer question." },
    ],
    relatedConcepts: ["what-is-a-port", "what-is-a-firewall", "what-is-http"],
    relatedTools: ["nmap", "tcpdump", "wireshark"],
    sources: [
      { label: "RFC 9293 — TCP", url: "https://www.rfc-editor.org/rfc/rfc9293", note: "State machine, including the half-open states." },
      { label: "RFC 768 — UDP", url: "https://www.rfc-editor.org/rfc/rfc768", note: "Short enough to read entirely." },
    ],
  },
  {
    slug: "what-is-cidr",
    title: "What is CIDR?",
    question: "How do you say 'this block of addresses' without listing them?",
    summary:
      "CIDR notation writes an address plus a prefix length to describe a block: /24 is 256 addresses, /16 is 65,536. Reading it quickly is a practical scanning and scoping skill.",
    difficulty: "beginner",
    minutes: 6,
    icon: "Hash",
    sections: [
      {
        heading: "Prefix length is a count of fixed bits",
        code: [
          { language: "text", value: "192.0.2.0/24  → 24 fixed bits → 2^8  = 256 addresses\n192.0.2.0/26  → 26 fixed bits → 2^6   = 64 addresses\n10.0.0.0/8    →  8 fixed bits → 2^24  = 16,777,216" },
        ],
        paragraphs: [
          "The host portion is the remaining bits. Sizes are always powers of two, and a block's network address is the first usable line of the block.",
        ],
      },
      {
        heading: "Sizes worth memorising",
        bullets: [
          "/32 — one address; how you write 'exactly this host' in a rule",
          "/31 and /30 — point-to-point links and tiny links (2 and 4 addresses)",
          "/24 — a typical LAN; a Nmap default scan is 256 × 1000 probes, which is why rate matters",
          "/22 — 1,024 addresses, common cloud allocation",
          "/16 — 65,536, usually one VPC",
        ],
      },
      {
        heading: "Scope arithmetic you will actually do",
        paragraphs: [
          "Before any range scan, compute the address count and multiply by ports. '203.0.113.0/24, ports 1-65535' is 16.7 million probes. That number is the conversation to have with the network owner, not something to discover mid-run.",
        ],
        callout: { tone: "warning", text: "Never scan a range you have not verified as in scope. An accidental /8 sweep is an outage and possibly an offence." },
      },
    ],
    checkYourUnderstanding: [
      { question: "Is 192.168.5.130/25 in the same block as 192.168.5.20?", answer: "Yes. A /25 covers .0–.127 and .128–.255 — .130 is in the second half, .20 in the first: different subnets." },
      { question: "Why prefer /32 in an exclude file?", answer: "Explicit single-address entries cannot silently widen if the block is edited later." },
    ],
    relatedConcepts: ["what-is-an-ip-address", "what-is-a-firewall"],
    relatedTools: ["nmap", "masscan"],
    sources: [{ label: "RFC 4632 — CIDR", url: "https://www.rfc-editor.org/rfc/rfc4632" }],
  },
  {
    slug: "hashing-vs-encryption",
    title: "Hashing vs encryption",
    question: "Why can a site verify your password but not tell you what it was?",
    summary:
      "Hashing is one-way fingerprinting; encryption is reversible with a key. Mixing them up causes designs that leak, and reports that overstate or understate risk.",
    difficulty: "beginner",
    minutes: 8,
    icon: "Lock",
    sections: [
      {
        heading: "Two different jobs",
        bullets: [
          "Hash: fixed-length digest, no key, not recoverable. Used for verification and integrity.",
          "Encryption: reversible transform under a key. Confidentiality, with key management as the real problem.",
          "Encoding (Base64, hex, URL): not protection at all. `echo -n 'x' | base64` is a formatting change.",
        ],
        callout: { tone: "info", text: "If a document says 'encrypted passwords' it usually means hashed. That wording difference is a meaningful review question." },
      },
      {
        heading: "Why password hashes are slow on purpose",
        paragraphs: [
          "A verification hash must be expensive to try many times. bcrypt, scrypt, Argon2 and PBKDF2 exist for exactly that; MD5/SHA-1/SHA-256 are fast and therefore unsuitable as password storage, which is what makes them crackable at high rates.",
        ],
        code: [
          { language: "text", value: "MD5(password)        → billions/sec on one GPU\nArgon2id(t=3,m=64M) → deliberately memory-hard, thousands/sec at most" },
        ],
      },
      {
        heading: "Salts, peppers and work factors",
        bullets: [
          "Salt: unique per record, kills rainbow tables and forces per-target work. Must be stored, may be public.",
          "Pepper: secret mixed in, stored separately from the database. An extra layer, not a substitute for a slow function.",
          "Work factor: tune upward as hardware improves. That is maintenance, not a one-time setting.",
        ],
      },
      {
        heading: "What a hash audit actually measures",
        paragraphs: [
          "When a cracker recovers a password, it is because the guess was in the candidate space — the audit result is a statement about users and policy, and about which lists were covered. '0 recovered' with 10,000 guesses means nothing; say what you tested.",
        ],
      },
    ],
    checkYourUnderstanding: [
      { question: "Is Base64 encryption?", answer: "No. It is reversible with no key. 'Encode' and 'encrypt' are not interchangeable words in a design review." },
      { question: "A system stores SHA-256(password + username). Reasonable?", answer: "No — fast, and the salt is guessable. Use a memory-hard function with a proper work factor." },
    ],
    relatedConcepts: ["what-is-a-vulnerability", "what-is-http"],
    relatedTools: ["hashcat", "john", "cyberchef"],
    sources: [
      { label: "NIST SP 800-63B §5.1.1.2", url: "https://pages.nist.gov/800-63-3/sp800-63b.html", note: "Memorised secret storage requirements." },
      { label: "OWASP Password Storage Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html" },
    ],
  },
  {
    slug: "what-is-a-vulnerability",
    title: "What is a vulnerability?",
    question: "What has to be true before a 'finding' is a finding?",
    summary:
      "A vulnerability is a reachable weakness that enables a specific harm. Missing any of those three parts and you have a configuration observation, not a finding.",
    difficulty: "beginner",
    minutes: 7,
    icon: "ShieldAlert",
    sections: [
      {
        heading: "Three parts, always",
        bullets: [
          "Weakness: a defect in design, implementation, configuration or behaviour.",
          "Reachability: an attacker position that can actually exercise it.",
          "Impact: a harm someone cares about — data, availability, integrity, money, trust.",
        ],
        callout: { tone: "info", text: "Severity models encode this: a patchable, unreachable bug is usually low. 'CVSS 9.8' with no reachable path is not a finding." },
      },
      {
        heading: "Classes rather than payloads",
        paragraphs: [
          "Learn the classes; payloads go out of fashion. Input handling, authentication and session, authorisation, cryptography, configuration, business logic, dependency risk. Every specific issue is an instance of one of these.",
        ],
      },
      {
        heading: "Vulnerability vs exploit vs risk",
        code: [
          { language: "text", value: "vulnerability : unauthenticated endpoint returns other tenants' records\nexploit       : a concrete method that demonstrates it\nrisk          : likelihood x impact, given your exposure and controls" },
        ],
        paragraphs: [
          "A public exploit raises likelihood, not automatically impact. Conversely, an elegant bug with no path is still a weakness worth fixing and rarely urgent.",
        ],
      },
      {
        heading: "Disclosure, briefly",
        bullets: [
          "Report to the owner first, with reproduction steps and no data you did not need.",
          "Agree a timeline before publishing anything; coordination is what makes disclosure responsible.",
          "If you find real personal data, stop and report. Keep testing that endpoint for more.",
        ],
      },
    ],
    checkYourUnderstanding: [
      { question: "A CVE affects your version but the vulnerable feature is not enabled. Report it?", answer: "Yes as an inventory item, no as a finding; the reachability element fails. State exactly why." },
      { question: "What makes 'missing security headers' weak as a finding?", answer: "Impact. Unless you can show the specific harm the missing header would prevent in this application, it is a hardening suggestion." },
    ],
    relatedConcepts: ["hashing-vs-encryption", "what-is-http"],
    relatedTools: ["nuclei", "sqlmap", "burp-suite"],
    sources: [
      { label: "OWASP Testing Guide v4.2", url: "https://owasp.org/www-project-web-security-testing-guide/" },
      { label: "CWE", url: "https://cwe.mitre.org/", note: "A taxonomy of weakness types, not of exploits." },
    ],
  },
  {
    slug: "what-is-a-firewall",
    title: "What is a firewall?",
    question: "What does a firewall decide, and what does it happily pass through?",
    summary:
      "A firewall decides which flows may exist based on header fields. It is not an antivirus, an input validator, or a reason to trust anything that arrives on an allowed port.",
    difficulty: "beginner",
    minutes: 6,
    icon: "ShieldCheck",
    sections: [
      {
        heading: "What it sees",
        bullets: [
          "Address, port, protocol, interface, direction, connection state",
          "Nothing about intent, authentication or the contents of an allowed request",
        ],
      },
      {
        heading: "Statefulness is the important part",
        paragraphs: [
          "A stateful firewall tracks connections so inbound traffic must belong to a session that originated inside. The practical consequence for testing: an 'unreachable' result from outside may be the state table doing its job, and a rule that permits a reply on a high port is not the same as permitting a new inbound connection there.",
        ],
      },
      {
        heading: "How testers should read the answers",
        code: [
          { language: "bash", value: "nmap -Pn -p 80 203.0.113.5\n# closed   → something answered with RST: the packet got there\n# filtered → no answer: dropped, or a silent rule\n# open     → a listener completed the handshake" },
        ],
        callout: { tone: "info", text: "Never report 'firewall rule works' from a filtered result alone. Say what the observation supports." },
      },
    ],
    relatedConcepts: ["what-is-a-port", "tcp-vs-udp", "what-is-cidr"],
    relatedTools: ["nmap", "tcpdump"],
    sources: [{ label: "NIST SP 700-36 (firewall guidance)", url: "https://csrc.nist.gov/pubs/sp/800/410/final", note: "Security for network devices — current authoritative framing." }],
  },
  {
    slug: "what-is-osint",
    title: "What is OSINT?",
    question: "What makes public information research rather than Googling?",
    summary:
      "Open-source intelligence is the disciplined collection, evaluation and reporting of publicly available information. The discipline is the whole point.",
    difficulty: "beginner",
    minutes: 7,
    icon: "ScanSearch",
    sections: [
      {
        heading: "Method over tools",
        bullets: [
          "A defined question, before any collection begins.",
          "Sources recorded with dates, because public data goes stale quickly.",
          "Independent corroboration: one source is a lead, two unrelated sources are evidence.",
          "Explicit confidence language: confirmed, probable, possible, not established.",
        ],
      },
      {
        heading: "What public does not mean",
        paragraphs: [
          "Publicly accessible is not the same as free to use. Purpose limitation, platform terms, privacy law and professional rules all still apply to a person's public posts. Research on individuals especially requires minimisation: collect what answers the question and nothing else.",
        ],
        callout: { tone: "warning", text: "Automated collection makes it easy to over-collect at scale. Bound every run: dates, sources, limits, retention." },
      },
      {
        heading: "A repeatable first pass",
        bullets: [
          "Write the question and what would falsify it.",
          "Enumerate sources by type: registrars, certificates, platforms, archives, company records.",
          "Run automated collection with parameters recorded; verify hits manually.",
          "Store artefacts (screenshots, URLs, timestamps) in one case folder.",
          "Write findings with confidence levels and gaps.",
        ],
      },
    ],
    relatedConcepts: ["what-is-dns", "what-is-a-vulnerability"],
    relatedTools: ["sherlock", "exiftool", "theharvester", "spiderfoot"],
    sources: [
      { label: "OSINT Framework", url: "https://osintframework.com/", note: "Curated index of public sources by category." },
      { label: "UK JCIO Code of Conduct", url: "https://www.jcio.org.uk/code-of-ethics", note: "An example of a professional code that constrains practice." },
    ],
  },
];

export const CONCEPT_BY_SLUG: ReadonlyMap<string, Concept> = new Map(
  CONCEPTS.map((c) => [c.slug, c]),
);

export function getConcept(slug: string | undefined): Concept | undefined {
  return slug ? CONCEPT_BY_SLUG.get(slug) : undefined;
}

/**
 * Practice resources point at external projects. They are always labelled as
 * external, and only real, well-known destinations are listed.
 */
export const RESOURCES: LearningResource[] = [
  {
    slug: "owasp-juice-shop",
    type: "lab",
    title: "OWASP Juice Shop",
    provider: "OWASP",
    description:
      "Deliberately vulnerable single-page web app with an integrated scoring server. Runs in Docker or Node on your own machine.",
    url: "https://github.com/juice-shop/juice-shop",
    difficulty: "beginner",
    tags: ["web", "self-hosted", "owasp"],
  },
  {
    slug: "dvwa",
    type: "lab",
    title: "DVWA — Damn Vulnerable Web Application",
    provider: "Community",
    description:
      "Small PHP/MySQL app with selectable difficulty, useful for watching how a fix changes behaviour.",
    url: "https://github.com/digininja/DVWA",
    difficulty: "beginner",
    tags: ["web", "self-hosted"],
  },
  {
    slug: "metasploitable3",
    type: "lab",
    title: "Metasploitable 3",
    provider: "Rapid7",
    description:
      "Deliberately vulnerable VM image for network and host assessments in an isolated range.",
    url: "https://github.com/rapid7/metasploitable3",
    difficulty: "intermediate",
    tags: ["vm", "network", "isolated"],
  },
  {
    slug: "bandit",
    type: "lab",
    title: "OverTheWire: Bandit",
    provider: "OverTheWire",
    description:
      "Wargame levels that teach SSH, permissions, pipes and grep by requiring them. The most common first stop before anything graphical.",
    url: "https://overthewire.org/wargames/bandit/",
    difficulty: "beginner",
    tags: ["linux", "wargame"],
  },
  {
    slug: "tryhackme",
    type: "ctf",
    title: "TryHackMe guided rooms",
    provider: "TryHackMe",
    description: "Hand-held paths with in-browser VMs; useful when you want structure rather than a blank target.",
    url: "https://tryhackme.com",
    difficulty: "beginner",
    tags: ["platform", "guided"],
  },
  {
    slug: "hackthebox",
    type: "ctf",
    title: "Hack The Box",
    provider: "Hack The Box",
    description: "Labs and competitive machines with write-ups gated behind the same access model as the ranges.",
    url: "https://www.hackthebox.com",
    difficulty: "intermediate",
    tags: ["platform", "machines"],
  },
  {
    slug: "picoctf",
    type: "ctf",
    title: "picoCTF",
    provider: "Carnegie Mellon University",
    description: "Long-running high-school CTF with a persistent practice archive — good for reverse engineering and forensics firsts.",
    url: "https://picoctf.org",
    difficulty: "beginner",
    tags: ["ctf", "education"],
  },
  {
    slug: "cybertalents-ctftime",
    type: "ctf",
    title: "CTFtime",
    provider: "Community",
    description: "Calendar and results index for CTFs. Use it to find an upcoming event rather than an archive.",
    url: "https://ctftime.org",
    difficulty: "intermediate",
    tags: ["ctf", "schedule"],
  },
  {
    slug: "cyberdefenders",
    type: "lab",
    title: "CyberDefenders",
    provider: "CyberDefenders",
    description: "Blue-team labs built on real memory, packet and disk images with question-driven analysis.",
    url: "https://cyberdefenders.org",
    difficulty: "intermediate",
    tags: ["blue-team", "forensics"],
  },
  {
    slug: "blue-team-labs",
    type: "lab",
    title: "Blue Team Labs Online",
    provider: "CyberDefenders",
    description: "Investigation challenges with evidence downloads; a natural companion to the forensics category.",
    url: "https://blueteamlabs.online",
    difficulty: "intermediate",
    tags: ["blue-team", "ir"],
  },
  {
    slug: "comptia-security",
    type: "certification",
    title: "CompTIA Security+",
    provider: "CompTIA",
    issuer: "CompTIA",
    description: "Vendor-neutral baseline across vocabulary, controls and domains. Widely used as an HR keyword rather than a competence proof.",
    url: "https://www.comptia.org/certifications/security",
    difficulty: "beginner",
    tags: ["entry", "vendor-neutral"],
  },
  {
    slug: "ejpt",
    type: "certification",
    title: "eJPT",
    provider: "INE",
    issuer: "INE",
    description: "Practical junior pentest exam in an assigned lab range; a common first hands-on certification.",
    url: "https://elearnsecurity.com/ejpt/",
    difficulty: "beginner",
    tags: ["practical", "pentest"],
  },
  {
    slug: "oscp",
    type: "certification",
    title: "OSCP",
    provider: "OffSec",
    issuer: "OffSec",
    description:
      "24-hour practical exam against multiple lab machines with a report. Read the current exam description before preparing — it changes.",
    url: "https://www.offsec.com/courses/pen-200/",
    difficulty: "advanced",
    tags: ["practical", "pentest"],
  },
  {
    slug: "gcia-gcih",
    type: "certification",
    title: "GIAC incident-handling certifications",
    provider: "SANS/GIAC",
    issuer: "GIAC",
    description: "Defensive, incident-oriented credentials with substantial training cost attached; typically employer-funded.",
    url: "https://www.giac.org/certifications/certified-incident-handler-gcih/",
    difficulty: "advanced",
    tags: ["blue-team", "ir"],
  },
  {
    slug: "wahh",
    type: "book",
    title: "The Web Application Hacker's Handbook (2e)",
    provider: "Wiley",
    description: "Older than current framework defaults but still the clearest taxonomy of testing techniques and reasoning.",
    url: "https://portswigger.net/web-app-hackers-handbook",
    difficulty: "intermediate",
    tags: ["web", "reference"],
  },
  {
    slug: "practical-malware-analysis",
    type: "book",
    title: "Practical Malware Analysis",
    provider: "No Starch Press",
    description: "Structured lab discipline for static and dynamic analysis; the exercises assume an isolated VM.",
    url: "https://nostarch.com/malware",
    difficulty: "intermediate",
    tags: ["malware", "labs"],
  },
  {
    slug: "mitre-attack",
    type: "guide",
    title: "MITRE ATT&CK",
    provider: "MITRE",
    description: "Knowledge base of adversary tactics and techniques, used for detection mapping and coverage discussion.",
    url: "https://attack.mitre.org",
    tags: ["framework", "detection"],
  },
  {
    slug: "owasp-top-10",
    type: "guide",
    title: "OWASP Top 10",
    provider: "OWASP",
    description: "A awareness document of recurring web risk categories — useful vocabulary, not a testing methodology or a standard.",
    url: "https://owasp.org/www-project-top-ten/",
    tags: ["web", "risk"],
  },
  {
    slug: "nist-csf",
    type: "guide",
    title: "NIST Cybersecurity Framework 2.0",
    provider: "NIST",
    description: "Organisational functions (Govern, Identify, Protect, Detect, Respond, Recover) for structuring a programme.",
    url: "https://www.nist.gov/cyberframework",
    tags: ["governance", "programme"],
  },
  {
    slug: "rfc-index",
    type: "guide",
    title: "RFC Editor index",
    provider: "RFC Editor",
    description: "When a tutorial contradicts the protocol, read the protocol. HTTP, TCP, DNS and IP are all short reads at this point.",
    url: "https://www.rfc-editor.org/",
    tags: ["reference", "primary-source"],
  },
  {
    slug: "cybersec-courses",
    type: "course",
    title: "University of Maryland — CMSC 656 (open notes)",
    provider: "UMD",
    description: "Publicly posted course notes on network and systems security fundamentals; a rigorous free alternative to paid intros.",
    url: "https://www.cs.umd.edu/class/spring2024/cmsc656/",
    difficulty: "advanced",
    tags: ["university", "systems"],
  },
];

export const RESOURCE_GROUPS = [
  { key: "lab", title: "Practice labs", blurb: "Isolated targets you own or are given access to." },
  { key: "ctf", title: "CTF resources", blurb: "Competitions and archives, ranked by beginner-friendliness." },
  { key: "certification", title: "Certifications", blurb: "What each exam actually measures, without the marketing." },
  { key: "book", title: "Books", blurb: "Reference material that outlives tool versions." },
  { key: "guide", title: "Frameworks & references", blurb: "Authoritative documents worth reading directly." },
  { key: "course", title: "Courses", blurb: "Structured study with public materials." },
] as const;
