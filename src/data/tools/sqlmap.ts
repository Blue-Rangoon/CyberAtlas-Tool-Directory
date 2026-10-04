import type { Tool } from "@/types";

export const sqlmap: Tool = {
  slug: "sqlmap",
  name: "SQLMap",
  shortDescription: "Automated SQL injection detection engine",
  description: [
    "SQLMap detects and confirms SQL injection flaws by generating and sending probes, then reporting what the database reveals back. It is a verification tool: it turns a suspicious parameter into a reproducible finding — or rules the parameter out.",
    "It can also enumerate schema, read limited files and, on some database configurations, execute further actions. Those capabilities are only appropriate inside a signed scope with a documented test plan; in a report, the enumeration of your own test data is the evidence, not an exploit demonstration.",
  ],
  category: "pentesting",
  subcategory: "web",
  icon: "Database",
  website: "https://sqlmap.org",
  repository: "https://github.com/sqlmapproject/sqlmap",
  documentation: "https://github.com/sqlmapproject/sqlmap/wiki/Usage",
  license: "GPL-3.0",
  openSource: true,
  difficulty: "intermediate",
  platforms: ["linux", "macos", "windows", "kali", "parrot", "docker", "source"],
  tags: ["sql injection", "database", "web", "verification", "owasp"],
  status: "verified",
  lastUpdated: "2026-01-12",
  commonlyUsed: true,
  installation: [
    {
      platform: "linux",
      method: "apt",
      title: "apt",
      kind: "recommended",
      commands: ["sudo apt update", "sudo apt install sqlmap"],
      notes: ["Distribution packages can trail upstream; `sqlmap --version` tells you what you actually have."],
    },
    {
      platform: "linux",
      method: "git",
      title: "Development checkout",
      kind: "alternative",
      commands: [
        "git clone --depth 1 https://github.com/sqlmapproject/sqlmap.git",
        "python3 sqlmap/sqlmap.py --version",
      ],
    },
    {
      platform: "macos",
      method: "Homebrew",
      title: "Homebrew",
      kind: "recommended",
      commands: ["brew install sqlmap"],
    },
    {
      platform: "windows",
      method: "zip",
      title: "Official archive + Python",
      kind: "recommended",
      description:
        "SQLMap ships as a pure-Python archive: download it, install Python 3, then run sqlmap.py.",
      official: true,
      sourceUrl: "https://sqlmap.org/",
      notes: ["Install Python from python.org and tick 'Add to PATH'; the SQLite/PostgreSQL client libraries are optional."],
    },
  ],
  commands: [
    {
      id: "detect",
      title: "Detect an injection point on one parameter",
      description:
        "Runs detection techniques against a single GET parameter and reports which ones produced a true/false differential.",
      command: "python3 sqlmap.py -u 'http://192.0.2.20/item.php?id=17' -p id --batch --level 1 --risk 1",
      shell: "bash",
      platform: "linux",
      difficulty: "intermediate",
      warnings: [
        "Only run against systems you are authorized to test, and keep the request rate agreed in the scope document.",
      ],
      notes: [
        "`--batch` accepts defaults so the run is non-interactive; `--level`/`--risk` bound how many tests are attempted. Start at 1/1.",
      ],
      tags: ["detection"],
    },
    {
      id: "banner",
      title: "Read the DBMS banner",
      description: "Confirms backend DBMS, version and operating system as reported through the injection point.",
      command: "python3 sqlmap.py -u 'http://192.0.2.20/item.php?id=17' -p id --banner --batch",
      shell: "bash",
      difficulty: "intermediate",
      expectedOutput: "[INFO] the back-end DBMS is MySQL\nback-end DBMS: MySQL >= 8.0",
      notes: ["A banner alone is a low-severity data-disclosure finding; it becomes material when combined with what else is reachable."],
      tags: ["fingerprint"],
    },
    {
      id: "databases",
      title: "Enumerate database names",
      description: "Lists schemas visible to the connection the application uses.",
      command:
        "python3 sqlmap.py -u 'http://192.0.2.20/item.php?id=17' -p id --dbs --batch --dbms mysql",
      shell: "bash",
      difficulty: "intermediate",
      notes: [
        "Declaring `--dbms` skips fingerprinting of other engines, which shortens the run and reduces noise.",
        "Enumerating tables containing personal data is usually out of scope: stop at the schema list and ask the client what the names mean.",
      ],
      tags: ["enumeration"],
    },
    {
      id: "limited-dump",
      title: "Dump a bounded number of rows",
      description: "Proves read access with the smallest possible sample instead of exfiltrating a table.",
      command:
        "python3 sqlmap.py -u 'http://192.0.2.20/item.php?id=17' -p id -D appdb -T users -C id,username --start 1 --count 5 --batch",
      shell: "bash",
      difficulty: "advanced",
      warnings: [
        "Never dump credentials or personal data during an assessment unless the rules of engagement explicitly authorise it.",
      ],
      notes: ["`--start`/`--count` are also the difference between a defensible sample and a reportable data breach."],
      tags: ["dump", "minimised"],
    },
    {
      id: "request-file",
      title: "Run from a saved request",
      description:
        "Feeds a raw HTTP request file so headers, cookies, CSRF tokens and JSON bodies are used exactly as captured.",
      command: "python3 sqlmap.py -r login.req --batch --forms",
      shell: "bash",
      difficulty: "advanced",
      notes: [
        "`--forms` parses the body's form fields as parameters. Delete session values you do not want replayed before saving the file.",
      ],
      tags: ["request", "headers"],
    },
    {
      id: "tamper-bypass",
      title: "Test filter handling with a tamper script",
      description:
        "Applies encoding transformations to probes so you can see whether an input filter is actually mitigating the flaw.",
      command:
        "python3 sqlmap.py -u 'http://192.0.2.20/search?q=sock' -p q --tamper=space2comment,between --batch",
      shell: "bash",
      difficulty: "advanced",
      notes: [
        "List what is available with `--list-tampers`. A filter that only strips spaces is a weak control, and that is the finding.",
      ],
      tags: ["tamper", "waf"],
    },
    {
      id: "crawl-target",
      title: "Test URLs exported from a crawler",
      description: "Works through a list of URLs rather than one parameter, which is how a whole application gets covered.",
      command: "python3 sqlmap.py -m urls.txt --batch --threads 2 --delay 1",
      shell: "bash",
      difficulty: "advanced",
      warnings: ["`--threads` multiplies request volume. Keep it at 1-2 against anything that also serves real users."],
      notes: ["Pair with a scoped crawler export and log which URLs were tested."],
      tags: ["crawl", "batch"],
    },
    {
      id: "flush-session",
      title: "Reset cached results",
      description: "Clears the per-URL cache so retests do not silently reuse yesterday's conclusion.",
      command: "python3 sqlmap.py -u 'http://192.0.2.20/item.php?id=17' --flush-session --batch",
      shell: "bash",
      difficulty: "beginner",
      notes: ["The `sqlmap` output directory holds session and log files; store it with the engagement record and clean it afterwards."],
      tags: ["hygiene"],
    },
  ],
  examples: [
    {
      title: "Turning a suspicion into a finding",
      scenario: "A 'Ref' parameter in a partner portal echoes a SQL error when you type a quote.",
      steps: [
        { label: "Confirm with the minimum detection level", command: "python3 sqlmap.py -r ref.req -p Ref --batch --level 1 --risk 1" },
        { label: "Establish what is reachable, without reading user data", command: "python3 sqlmap.py -r ref.req -p Ref --banner --current-user --current-db --batch" },
        { label: "Retest after the patch, with a clean session", command: "python3 sqlmap.py -r ref.req -p Ref --flush-session --batch --level 1" },
      ],
      outcome:
        "A finding with an exact reproduction, an impact statement grounded in what was actually reachable, and a verified retest.",
    },
  ],
  useCases: [
    { title: "Confirm or dismiss an injection suspicion", description: "Remove ambiguity from a manual test before it reaches a report." },
    { title: "Validate a fix", description: "Re-run the same probes after remediation and keep both outputs." },
    { title: "Lab training", description: "Understand how blind and error-based detection differ, against deliberately vulnerable apps." },
  ],
  commonErrors: [
    {
      symptom: "No injection points found on a parameter you know is vulnerable",
      causes: ["Insufficient level/risk, anti-CSRF token expiring, redirect handling, or an auth cookie that lapsed mid-run."],
      solution:
        "Re-save the request with a fresh cookie, raise `--level 3 --risk 2`, add `--no-redirect` or `--ignore-redirects` as appropriate, and confirm the session with `--safe-url`.",
    },
    {
      symptom: "Run aborts with 'HTTP error 403' or a WAF page every few probes",
      causes: ["Rate limiting or signature blocking."],
      solution:
        "Add `--delay`, `--timeout`, `--retries`, and lower `--threads`. If the WAF is the control under test, document that it blocked the tool rather than working around it without approval.",
      commands: ["python3 sqlmap.py -u URL -p id --batch --delay 2 --timeout 30 --threads 1"],
    },
    {
      symptom: "Stale results appear even after the code was patched",
      causes: ["Cached session data in the output directory."],
      solution: "Use `--flush-session` for a retest, or `--purge-output` to clear the whole directory at engagement end.",
    },
    {
      symptom: "SyntaxError / unsupported Python on a fresh machine",
      causes: ["Old interpreter, or Python 2 assumptions from an outdated tutorial."],
      solution: "Run with `python3` explicitly and install a current upstream checkout.",
    },
  ],
  tips: [
    "Prefer `-r request.req` over `-u`: it keeps the exact headers, so what you tested matches what the browser sends.",
    "Run `--dbms` explicitly once you know the engine — fewer probes, faster and cleaner logs.",
    "Take the log file from the output directory into your evidence folder; it is the record of what you actually sent.",
    "In a report, describe the reachable data class and the confirmation method, not the number of rows you could have taken.",
  ],
  alternatives: ["sqlmap has no drop-in equivalent for automated verification; manual testing plus a proxy remains the primary method"],
  relatedTools: ["burp-suite", "nmap", "nuclei"],
  references: [
    { label: "SQLMap wiki — usage", url: "https://github.com/sqlmapproject/sqlmap/wiki/Usage", note: "Full flag reference maintained upstream." },
    { label: "OWASP Testing Guide: SQLi", url: "https://owasp.org/www-project-web-security-testing-guide/", note: "Methodology context for testing injection in scope." },
    { label: "Official site", url: "https://sqlmap.org/", note: "Release downloads and changelog." },
  ],
};
