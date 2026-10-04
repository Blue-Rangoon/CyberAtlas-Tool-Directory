import type { Tool } from "@/types";

export const ffuf: Tool = {
  slug: "ffuf",
  name: "ffuf",
  shortDescription: "Fast web fuzzer written in Go",
  description: [
    "ffuf drives a list of values into a placeable FUZZ position in a URL, header, body or cookie, and reports responses that differ from the noise. It is commonly used for content discovery and for controlled input testing on applications you are authorized to assess.",
    "Its filtering flags are the reason people reach for it: after a run you can throw away everything that matched a size, status code, word count, regex or line count, which is what makes a 100k-word list survivable.",
  ],
  category: "pentesting",
  subcategory: "content-discovery",
  icon: "Zap",
  website: "https://github.com/ffuf/ffuf",
  repository: "https://github.com/ffuf/ffuf",
  documentation: "https://github.com/ffuf/ffuf#usage",
  license: "MIT",
  openSource: true,
  difficulty: "beginner",
  platforms: ["linux", "macos", "windows", "kali", "parrot", "arch", "docker", "source"],
  tags: ["fuzzing", "content discovery", "directories", "http", "vhosts"],
  status: "verified",
  lastUpdated: "2026-01-19",
  commonlyUsed: true,
  installation: [
    {
      platform: "linux",
      method: "apt",
      title: "apt (Debian 12+, Kali, Parrot)",
      kind: "recommended",
      commands: ["sudo apt update", "sudo apt install ffuf"],
      requiresElevation: true,
      notes: ["Availability depends on your release; if the package is absent use the Go or release-binary method."],
    },
    {
      platform: "linux",
      method: "go",
      title: "Go install (latest tagged release)",
      kind: "alternative",
      description: "Builds a current binary into $GOPATH/bin.",
      commands: ["go install github.com/ffuf/ffuf/v2@latest"],
      notes: ["Ensure `$(go env GOPATH)/bin` is on your PATH."],
    },
    {
      platform: "macos",
      method: "Homebrew",
      title: "Homebrew",
      kind: "recommended",
      commands: ["brew install ffuf"],
    },
    {
      platform: "windows",
      method: "release",
      title: "Official release archive",
      kind: "recommended",
      description:
        "Grab the Windows .zip from the repository's releases page and add the folder to PATH.",
      official: true,
      sourceUrl: "https://github.com/ffuf/ffuf/releases",
    },
    {
      platform: "source",
      method: "source",
      title: "Build from source",
      kind: "manual",
      commands: [
        "git clone https://github.com/ffuf/ffuf",
        "cd ffuf && go build -o ffuf .",
      ],
    },
  ],
  commands: [
    {
      id: "basic-dirs",
      title: "Content discovery with one FUZZ position",
      description:
        "Replaces FUZZ in the URL with each word of the list and prints responses that pass the filters.",
      command:
        "ffuf -u http://192.0.2.20/FUZZ -w /usr/share/wordlists/secLists/Discovery/Web-Content/common.txt",
      shell: "bash",
      platform: "linux",
      difficulty: "beginner",
      warnings: ["Run only against systems you are authorized to test."],
      notes: [
        "The default filters out nothing but responses with an empty size, status 0 and the same size as `-recalibrate`'s baseline request when enabled.",
      ],
      tags: ["directories", "discovery"],
    },
    {
      id: "filter-noise",
      title: "Filter out the noise",
      description:
        "Keep only interesting responses by status code, and drop a known soft-404 size.",
      command:
        "ffuf -u http://192.0.2.20/FUZZ -w wordlist.txt -mc 200,204,301,302,307,401,403 -sc 404",
      shell: "bash",
      difficulty: "beginner",
      notes: [
        "`-mc` = match codes, `-sc` = suppress codes. `-fc` / `-fs` / `-fw` / `-fl` / `-fr` are the matching counterparts for code, size, words, lines and regex.",
      ],
      tags: ["filters"],
    },
    {
      id: "calibrate",
      title: "Auto-calibrate a soft-404 baseline",
      description:
        "Sends a probe request per word and discards responses that look identical to the 'not found' page — the single most useful flag on noisy applications.",
      command:
        "ffuf -u http://192.0.2.20/FUZZ -w wordlist.txt -recalibrate",
      shell: "bash",
      difficulty: "intermediate",
      notes: [
        "Use `-calibrated-lines 5` when the baseline size varies, and confirm the calibration result: a site returning identical sizes for everything will hide real paths.",
      ],
      tags: ["calibration", "soft-404"],
    },
    {
      id: "vhosts",
      title: "Virtual host enumeration",
      description:
        "Drives the Host header instead of the path to find names that the same IP serves.",
      command: "ffuf -u http://192.0.2.20 -H 'Host: FUZZ.internal' -w hosts.txt -fs 0",
      shell: "bash",
      difficulty: "intermediate",
      notes: ["Many front ends answer 200 for unknown hosts; always compare against a deliberately invalid host."],
      tags: ["vhost", "headers"],
    },
    {
      id: "authenticated",
      title: "Authenticated run with a cookie and rate limit",
      description:
        "Reuses a session and throttles requests so a WAF or a shared staging box stays usable.",
      command:
        "ffuf -u https://app.internal/FUZZ -w wordlist.txt -b 'session=abc123' -t 20 -p 0.2 -maxtime 10m",
      shell: "bash",
      difficulty: "intermediate",
      warnings: [
        "Session cookies expire mid-run. Watch for a wall of 302s to /login and treat them as a failed run, not as findings.",
      ],
      notes: ["`-t` sets threads, `-p` adds a per-request pause, `-maxtime` bounds the run."],
      tags: ["auth", "rate limit"],
    },
    {
      id: "post-fuzz",
      title: "Fuzz a POST parameter",
      description: "Places the value inside the request body with multiple FUZZ positions.",
      command:
        "ffuf -u https://app.internal/search -X POST -d 'q=FUZZ&page=FUZZ2' -w words.txt -w pages.txt:FUZZ2",
      shell: "bash",
      difficulty: "advanced",
      notes: [
        "Multiple `-w` flags pair a wordlist with a named position. Keep total requests in mind: it is list A × list B.",
      ],
      tags: ["post", "body"],
    },
    {
      id: "proxy-replay",
      title: "Fuzz an existing request captured by a proxy",
      description:
        "Load a raw request file so headers, tokens and body are preserved exactly as the browser sent them.",
      command: "ffuf -request req.txt -request-proto http -w wordlist.txt",
      shell: "bash",
      difficulty: "advanced",
      notes: ["Paste the request from Burp's 'Copy to file' or a raw HTTP export. Never paste requests containing live user tokens into shared notes."],
      tags: ["replay", "burp"],
    },
    {
      id: "replacer",
      title: "Transform words on the fly",
      description:
        "The replacer applies URL encoding, case changes or templating to each word without a second list.",
      command:
        "ffuf -u http://192.0.2.20/FUZZ -w list.txt -replacer urlencode",
      shell: "bash",
      difficulty: "advanced",
      expectedOutput: "admin → admin%20FUZZ-style payloads with url-encoding applied",
      notes: ["Chain several with `-replacer=urleset,append`. `urleset` in particular bypasses naive 'decode once' normalisation checks."],
      tags: ["encoder", "bypass"],
    },
    {
      id: "save-output",
      title: "Save results for reporting",
      description: "Writes machine-readable output you can revisit without re-running the scan.",
      command:
        "ffuf -u http://192.0.2.20/FUZZ -w wordlist.txt -o findings.json -of json",
      shell: "bash",
      difficulty: "beginner",
      notes: ["Supported formats include json, ejson, md, html, csv, xml and md (default json when `-o` has no extension hint)."],
      tags: ["output", "reporting"],
    },
  ],
  examples: [
    {
      title: "Enumerate an admin surface without flooding the app",
      scenario: "A staging app is in scope, and it returns a 200 page for every unknown path.",
      steps: [
        {
          label: "Establish the soft-404 baseline",
          command: "ffuf -u https://staging.internal/FUZZ -w /dev/null -calibrate 2>/dev/null || true",
        },
        {
          label: "Run with filters, threads and pause tuned for a shared system",
          command:
            "ffuf -u https://staging.internal/FUZZ -w common.txt -mc 200,301,302,401,403 -fs 1473 -t 10 -p 0.1 -o ffuf-admin.json",
        },
        {
          label: "Confirm each hit manually",
          command: "curl -sk -o /dev/null -w '%{http_code} %{size_download}\\n' https://staging.internal/backup.sql",
        },
      ],
      outcome:
        "A short list of candidates, each verified by hand before anything reaches a report — never trust fuzz output alone.",
    },
  ],
  useCases: [
    { title: "Content and directory discovery", description: "Find exposed paths, backups and panels on an in-scope web host." },
    { title: "Virtual host review", description: "Discover internal names bound to one IP." },
    { title: "Parameter behaviour testing", description: "Observe how an endpoint reacts to controlled inputs in a lab." },
    { title: "API route enumeration", description: "Compare documented and undeclared routes in a staging tenant." },
  ],
  commonErrors: [
    {
      symptom: "Thousands of results, all with status 200 and the same length",
      causes: ["The application serves a catch-all route (soft 404)."],
      solution:
        "Identify the baseline response size and suppress it (`-fs <size>`), or use `-recalibrate`. Add `-max-candidates` when exploring a very large list.",
    },
    {
      symptom: "\"error: unknown shorthand flag\" after upgrading",
      causes: ["Flags moved between ffuf v1 and v2 releases."],
      solution: "Check `ffuf -h` for the installed version, and pin the release in reusable scripts instead of following blog-post syntax.",
    },
    {
      symptom: "Every request returns 429 or a WAF block page",
      causes: ["Thread count exceeded the rate limit or the WAF flagged the pattern."],
      solution:
        "Reduce `-t`, add `-p`, shrink the list, and check the scope/rules of engagement — deliberately evading a WAF is out of scope for most assessments.",
    },
    {
      symptom: "Runs finish with 0 results on HTTPS targets",
      causes: ["TLS verification failing silently, or a proxy configured in the environment."],
      solution: "Add `-s` for silence-free output while testing, and set `-x` only when you intend to route through a proxy.",
      commands: ["ffuf -u https://app.internal/FUZZ -w list.txt -x http://127.0.0.1:8080 -k"],
    },
  ],
  tips: [
    "Sort findings by response size variance rather than by status: a path that differs in length from the baseline is usually real.",
    "Keep wordlists small and iterate. `common.txt` then `raft-small-words` beats one 4M-line list.",
    "Persist `-o file.json` every run; you will want to re-filter old results instead of re-fuzzing an application.",
    "Use `-e .php,.html,.json` for extension fuzzing and `-s` to remove the progress bar when piping output.",
  ],
  alternatives: ["gobuster", "feroxbuster"],
  relatedTools: ["gobuster", "burp-suite", "nuclei"],
  references: [
    { label: "ffuf README & flag reference", url: "https://github.com/ffuf/ffuf", note: "Canonical usage text for the installed version." },
    { label: "Replacer documentation", url: "https://github.com/ffuf/ffuf#replacers", note: "Encoder and templating options." },
    { label: "SecLists", url: "https://github.com/danielmiessler/SecLists", note: "Widely mirrored wordlists referenced by many tutorials." },
  ],
};
