import type { Tool } from "@/types";

export const hashcat: Tool = {
  slug: "hashcat",
  name: "Hashcat",
  shortDescription: "GPU-accelerated password recovery benchmark",
  description: [
    "Hashcat is an offline password-recovery benchmark and audit tool. It runs candidate words through a hashing kernel on the GPU or CPU and compares digests, which makes it useful for measuring how quickly a policy's passwords fall to a modern attack.",
    "Legitimate use is against hashes you own or are authorized to test: your own lab captures, a client's export supplied in the scope document, or benchmarking hardware. Any other use against other people's credentials is unlawful.",
  ],
  category: "pentesting",
  subcategory: "credentials",
  icon: "Lock",
  website: "https://hashcat.net/hashcat/",
  repository: "https://github.com/hashcat/hashcat",
  documentation: "https://hashcat.net/wiki/",
  openSource: true,
  difficulty: "advanced",
  platforms: ["windows", "macos", "linux", "kali", "parrot", "arch", "fedora", "source"],
  tags: ["hashing", "password audit", "gpu", "wordlist", "rules"],
  status: "verified",
  lastUpdated: "2026-01-10",
  commonlyUsed: true,
  installation: [
    {
      platform: "linux",
      method: "apt",
      title: "apt",
      kind: "recommended",
      commands: ["sudo apt update", "sudo apt install hashcat"],
      requiresElevation: true,
      notes: [
        "For GPU kernels the OpenCL/CUDA driver stack must match your hardware; `hashcat -I` lists usable devices.",
      ],
    },
    {
      platform: "fedora",
      method: "dnf",
      title: "dnf",
      kind: "recommended",
      commands: ["sudo dnf install hashcat"],
    },
    {
      platform: "macos",
      method: "Homebrew",
      title: "Homebrew",
      kind: "recommended",
      commands: ["brew install hashcat"],
      notes: ["Metal-backed runs need the OpenCL/Metal runtime that ships with the OS."],
    },
    {
      platform: "windows",
      method: "release",
      title: "Official 7-Zip archive",
      kind: "recommended",
      description:
        "Windows builds are distributed as signed archives on the project's download page; extract to a folder and run hashcat.exe from there.",
      official: true,
      sourceUrl: "https://hashcat.net/hashcat/",
      notes: ["Antivirus and SmartScreen frequently flag the binary. Exclude the lab folder deliberately, not blindly."],
    },
    {
      platform: "source",
      method: "source",
      title: "Build from source",
      kind: "manual",
      commands: [
        "git clone https://github.com/hashcat/hashcat.git",
        "cd hashcat && make -j$(nproc)",
        "sudo make install",
      ],
      requiresElevation: true,
    },
  ],
  commands: [
    {
      id: "identify",
      title: "Identify the hash type",
      description:
        "A helper bundled with the project estimates the hash mode so you do not guess a numeric mode.",
      command: "hashid '5f4dcc3b5aa765d61d8327deb882cf99'",
      shell: "bash",
      platform: "linux",
      difficulty: "beginner",
      notes: ["`hashcat --example_hashes` is the built-in reference of every mode with a sample digest."],
      tags: ["modes"],
    },
    {
      id: "wordlist",
      title: "Straight wordlist attack",
      description: "Tests each candidate word against every hash in the file.",
      command: "hashcat -m 0 -a 0 captures/hashes.txt /usr/share/wordlists/rockyou.txt",
      shell: "bash",
      difficulty: "beginner",
      notes: [
        "`-m 0` is MD5, `-a 0` is the straight attack. `-o recovered.txt` writes results, `--show` lists already-recovered plaintexts without re-running.",
      ],
      tags: ["straight"],
    },
    {
      id: "rules",
      title: "Wordlist with rules",
      description: "Applies mangling rules (capitalisation, appending years, leet substitution) to each base word.",
      command:
        "hashcat -m 100 -a 0 -r rules/best64.rule captures/sha1.txt company-wordlist.txt",
      shell: "bash",
      difficulty: "intermediate",
      notes: [
        "Rules turn one list into thousands of variants; expect the candidate rate to fall accordingly. `rules/` ships with the project.",
      ],
      tags: ["rules"],
    },
    {
      id: "mask",
      title: "Brute force with a mask",
      description: "Enumerates a pattern instead of the whole keyspace — the practical way to test a stated policy.",
      command: "hashcat -m 1000 -a 3 captures/ntlm.txt '?u?l?l?l?l?d?d'",
      shell: "bash",
      difficulty: "intermediate",
      expectedOutput: "Session..........: hashcat\nSpeed.#1.........: 21474836 ks/s\nRecovered........: 4125/10000 (41.25%)",
      notes: [
        "Always state a keyspace estimate before starting a mask attack — `?u?l?l?l?l?d?d` alone is billions of candidates.",
      ],
      tags: ["mask", "policy test"],
    },
    {
      id: "hybrid",
      title: "Hybrid word + mask",
      description: "Appends a mask suffix to each word, which mirrors how users extend a common base.",
      command:
        "hashcat -m 1000 -a 6 base-words.txt '?d?d?d' --increment",
      shell: "bash",
      difficulty: "intermediate",
      tags: ["hybrid"],
    },
    {
      id: "benchmark",
      title: "Benchmark and device check",
      description: "Measures candidate rates per mode so you can compare hardware or estimate an audit's runtime.",
      command: "hashcat -b -m 1000",
      shell: "bash",
      difficulty: "beginner",
      notes: ["`hashcat -I` shows devices and driver versions; `--backend-ignore-dev` excludes an accelerator that is causing kernel errors."],
      tags: ["benchmark"],
    },
    {
      id: "session-resume",
      title: "Pause and resume a long audit",
      description: "Sessions store the restore point so an overnight run survives a reboot.",
      command: "hashcat --session corp-q1 --restore",
      shell: "bash",
      difficulty: "intermediate",
      notes: [
        "Restore files live in the session directory (on Linux: `~/.local/share/hashcat/`). Keep them with the engagement record and delete them at the end.",
      ],
      tags: ["session"],
    },
    {
      id: "potfile",
      title: "Verify what has already been recovered",
      description: "Reads matches from the potfile instead of re-cracking hashes an earlier run already solved.",
      command: "hashcat -m 0 --show captures/hashes.txt",
      shell: "bash",
      difficulty: "beginner",
      warnings: [
        "The potfile stores plaintext. Treat it as sensitive material: encrypted storage, restricted access, deletion at engagement close.",
      ],
      tags: ["potfile"],
    },
  ],
  examples: [
    {
      title: "Auditing a password policy, defensibly",
      scenario: "The security policy requires 8+ characters with a class. The client exports salted SHA-1 of all accounts for a controlled audit.",
      steps: [
        { label: "Confirm the mode and rate on your hardware", command: "hashcat -b -m 100 | tail -n 12" },
        { label: "Baseline: top corporate-password lists against the export", command: "hashcat -m 100 -a 0 -o out/corpo.txt in/sha1.txt /usr/share/wordlists/rockyou.txt" },
        { label: "Policy-shaped mask for the remaining hashes", command: "hashcat -m 100 -a 3 --markov 1 --session corpo-policy in/sha1.txt '?u?l?l?l?l?d?d?d'" },
        { label: "Report the percentage and time-to-recover, not the plaintexts", command: "wc -l out/corpo.txt in/sha1.txt" },
      ],
      outcome:
        "A defensible statement of exposure: what fraction of accounts fell within X hours, and which policy change would raise the cost.",
    },
  ],
  useCases: [
    { title: "Password policy audit", description: "Quantify how fast an organisation's hashes fall under realistic attacks." },
    { title: "Recovery of your own material", description: "Recover access to a disk or archive you own, with your own wordlist." },
    { title: "Hardware benchmarking", description: "Compare GPU kernels for hashing cost analysis." },
  ],
  commonErrors: [
    {
      symptom: "\"No devices or left active kernels detected\"",
      causes: ["Missing or mismatched OpenCL/CUDA driver, or the user lacks permission for the device."],
      solution:
        "Install the vendor driver (not just the runtime), re-check with `hashcat -I`, and on Linux add the user to the `video` group or run with the correct udev access.",
      commands: ["hashcat -I", "sudo usermod -aG video $USER"],
    },
    {
      symptom: "\"Hash-mode (-m) expected, but not specified\" / constant hash-mode mismatch",
      causes: ["Wrong mode for the digest format, or extra text around the hash (usernames, separators)."],
      solution:
        "Check the digest against `--example_hashes`, and use the `sep`/`-j`/`-k` options or a small awk pass to isolate the hash field. NTLM from a `pwdump` file needs `-m 1000` with the second column only.",
      commands: ["awk -F: '{print $2}' /tmp/lab/pwdump > in/ntlm.txt"],
    },
    {
      symptom: "Run completes with 0 of 0 cracked and 'Exhausted'",
      causes: ["The candidate space genuinely did not contain the plaintexts — not a tool failure."],
      solution: "Change strategy: better base list, rules, hybrid or a wider mask. Record the candidate count you actually covered so the negative result is meaningful.",
    },
    {
      symptom: "Antivirus removes the binary on Windows",
      causes: ["Recovery tools are commonly flagged."],
      solution: "Run the audit in an isolated lab VM, restore the file from the official archive, and never disable protections wholesale on a workstation.",
    },
  ],
  tips: [
    "Estimate keyspace and expected runtime before starting; `--keyspace` gives the candidate count and the benchmark gives the rate.",
    "Order attacks cheap-first: straight, then rules, then hybrid, then mask. Most of an audit's value arrives in the first two.",
    "`--username` when hashes include a user prefix, `--show` to avoid re-running solved ones, `--left` to retry only unsolved.",
    "Store the potfile, session restore and outputs under encryption, and delete them when the engagement closes.",
  ],
  alternatives: ["john", "hashcat"],
  relatedTools: ["john", "hydra", "aircrack-ng"],
  references: [
    { label: "Hashcat wiki", url: "https://hashcat.net/wiki/", note: "Hash list, rule syntax and optimisation guidance." },
    { label: "Hash example list", url: "https://openwall.info/wiki/john/hash-formats", note: "Cross-reference for digest formats and modes." },
    { label: "NIST SP 800-63B §3.1.1.2", url: "https://pages.nist.gov/800-63-3/sp800-63b.html", note: "The modern baseline for password verification and policy." },
  ],
};
