# CyberAtlas-Tool-Directory
This repository is open for contributions from cybersecurity, OSINT, pentesting enthusiasts, and anyone who loves to contribute to open-source projects. 

⚠️Note: This website is for educational purposes only and does not promote or encourage malicious activity or serious intent to cause harm to any organization or individual's privacy and terms of service. This is not legal advice!


# Project Structure

```bash
├── public
│   ├── cyberatlas-logo.ico
│   ├── cyberatlas-logo.svg
│   ├── favicon.ico
│   └── favicon.svg
├── src
│   ├── app
│   │   ├── about
│   │   │   ├── [slug]
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── api
│   │   │   └── health
│   │   │       └── route.ts
│   │   ├── cheatsheets
│   │   │   ├── [slug]
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── community
│   │   │   ├── contribute
│   │   │   │   └── page.tsx
│   │   │   ├── request-tool
│   │   │   │   └── page.tsx
│   │   │   ├── suggest-edit
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── comparisons
│   │   │   ├── [slug]
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── cookies
│   │   │   └── page.tsx
│   │   ├── faqs
│   │   │   └── page.tsx
│   │   ├── learning
│   │   │   ├── concepts
│   │   │   │   └── [slug]
│   │   │   │       └── page.tsx
│   │   │   └── page.tsx
│   │   ├── roadmaps
│   │   │   ├── [slug]
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── search
│   │   │   └── page.tsx
│   │   ├── tools
│   │   │   ├── [slug]
│   │   │   │   ├── [sub]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── error.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components
│   │   ├── cheatsheets
│   │   │   └── CheatsheetView.tsx
│   │   ├── common
│   │   │   ├── CopyButton.tsx
│   │   │   ├── CopyLinkButton.tsx
│   │   │   ├── DocSection.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   └── PlatformBadge.tsx
│   │   ├── community
│   │   │   └── DraftManager.tsx
│   │   ├── comparisons
│   │   │   └── ComparisonTable.tsx
│   │   ├── layout
│   │   │   ├── AssistantButton.tsx
│   │   │   ├── AtlasPanel.tsx
│   │   │   ├── Breadcrumbs.tsx
│   │   │   ├── CookieBanner.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── FooterGroups.tsx
│   │   │   ├── PageContainer.tsx
│   │   │   ├── SiteHeader.tsx
│   │   │   ├── SocialLinks.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── learning
│   │   │   └── LearningCards.tsx
│   │   ├── pages
│   │   │   ├── CategoryView.tsx
│   │   │   ├── ConsentControls.tsx
│   │   │   ├── FaqExplorer.tsx
│   │   │   ├── ToolDocsView.tsx
│   │   │   └── ToolsBrowser.tsx
│   │   ├── roadmaps
│   │   │   ├── RoadmapCard.tsx
│   │   │   └── RoadmapView.tsx
│   │   ├── search
│   │   │   ├── OpenSearchButton.tsx
│   │   │   ├── SearchOverlay.tsx
│   │   │   └── resultMeta.ts
│   │   ├── tools
│   │   │   ├── CommandBlock.tsx
│   │   │   ├── ErrorAccordion.tsx
│   │   │   ├── InstallationSection.tsx
│   │   │   ├── RelatedTools.tsx
│   │   │   ├── ToolCard.tsx
│   │   │   ├── ToolDocNav.tsx
│   │   │   ├── ToolFilters.tsx
│   │   │   └── ToolHeader.tsx
│   │   └── ui
│   │       ├── Accordion.tsx
│   │       ├── AccordionSelect.tsx
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Callout.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Portal.tsx
│   │       ├── States.tsx
│   │       └── Tabs.tsx
│   ├── data
│   │   ├── tools
│   │   │   ├── aircrack-ng.ts
│   │   │   ├── exiftool.ts
│   │   │   ├── ffuf.ts
│   │   │   ├── forensics-cloud.ts
│   │   │   ├── hashcat.ts
│   │   │   ├── index.ts
│   │   │   ├── networking.ts
│   │   │   ├── nmap.ts
│   │   │   ├── osint.ts
│   │   │   ├── pentesting.ts
│   │   │   ├── sherlock.ts
│   │   │   ├── sqlmap.ts
│   │   │   └── wireshark.ts
│   │   ├── categories.ts
│   │   ├── cheatsheets.ts
│   │   ├── comparisons.ts
│   │   ├── faqs.ts
│   │   ├── learning.ts
│   │   └── roadmaps.ts
│   ├── db
│   │   ├── index.ts
│   │   └── schema.ts
│   ├── hooks
│   │   ├── useConsent.ts
│   │   ├── useCookieBanner.ts
│   │   ├── useCopy.ts
│   │   ├── useHotkeys.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useOverlay.ts
│   │   ├── useScrollSpy.ts
│   │   ├── useScrolledPast.ts
│   │   └── useTheme.ts
│   ├── lib
│   │   ├── atlas.ts
│   │   ├── consent.ts
│   │   ├── constants.ts
│   │   ├── filters.ts
│   │   ├── icons.ts
│   │   ├── platforms.ts
│   │   ├── repo.ts
│   │   ├── search.ts
│   │   ├── social.ts
│   │   ├── stats.ts
│   │   ├── theme.ts
│   │   ├── updates.ts
│   │   └── utils.ts
│   └── types
│       ├── common.ts
│       ├── index.ts
│       ├── learning.ts
│       └── tool.ts
├── .gitignore
├── LICENSE
├── drizzle.config.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## 🧭 Overall Website Architecture

```bash
                         CyberAtlas
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
       DISCOVER            LEARN             USE
          │                 │                 │
          │                 │                 │
       Categories        Roadmaps           Tools
       Search            Concepts           Commands
       Comparisons       Guides             Examples
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                            ▼
                       COMMUNITY
                            │
                 ┌──────────┼──────────┐
                 ▼          ▼          ▼
              Contribute  Verify    Update
```

---

Webpage Structure:

```bash
CyberAtlas Tool Directory
│
├── 🏠 HOME
│
├── 🧰 TOOLS
│   │
│   ├── OSINT
│   │   ├── Phone Number
│   │   ├── Email
│   │   ├── Username
│   │   ├── Social Media
│   │   ├── Domain
│   │   ├── IP / Network
│   │   ├── Images / Metadata
│   │   ├── Search Engines
│   │   └── Archives
│   │
│   ├── 🔴 PENTESTING
│   │   ├── Reconnaissance
│   │   ├── Network
│   │   ├── Web
│   │   ├── Enumeration
│   │   ├── Vulnerability Scanning
│   │   ├── Password / Hash
│   │   └── Exploitation
│   │
│   ├── 🌐 NETWORKING
│   │   ├── Discovery
│   │   ├── Packet Analysis
│   │   ├── DNS
│   │   ├── HTTP
│   │   ├── Traffic
│   │   └── Network Utilities
│   │
│   ├── 🔬 FORENSICS
│   │   ├── Disk
│   │   ├── Memory
│   │   ├── File Analysis
│   │   ├── Metadata
│   │   └── Incident Response
│   │
│   ├── 📡 WIRELESS
│   │   ├── Wi-Fi
│   │   ├── Bluetooth
│   │   └── Wireless Analysis
│   │
│   ├── ☁️ CLOUD / DEVSECOPS
│   │   ├── Cloud
│   │   ├── Containers
│   │   ├── Kubernetes
│   │   └── CI/CD Security
│   │
│   └── ⚙️ MISC
│       ├── Cryptography
│       ├── Encoding
│       ├── Automation
│       ├── Wordlists
│       └── Utilities
│
├── 🗺️ ROADMAPS
│   ├── Absolute Beginner
│   ├── Cybersecurity Fundamentals
│   ├── OSINT Investigator
│   ├── Web Pentester
│   ├── Network Pentester
│   ├── Bug Bounty
│   ├── Blue Team
│   ├── Digital Forensics
│   └── CTF Beginner
│
├── ⚔️ COMPARISONS
│   ├── Tool vs Tool
│   ├── Which Tool?
│   ├── Feature Comparisons
│   └── Alternatives
│
├── 📚 LEARNING HUB
│   ├── Cyber Concepts
│   ├── Beginner Guides
│   ├── Practice Labs
│   ├── CTF Resources
│   ├── Certifications
│   └── Resources
│
├── 📋 CHEATSHEETS
│   ├── Nmap
│   ├── Linux
│   ├── Bash
│   ├── PowerShell
│   ├── Wireshark
│   ├── tcpdump
│   ├── Networking
│   └── Regex
│
├── 👥 COMMUNITY
│   ├── Contributors
│   ├── Recently Updated
│   ├── Add Tool
│   ├── Request Tool
│   ├── Suggest Edit
│   ├── Report Outdated Info
│   └── GitHub
│
└── ℹ️ ABOUT
    ├── About
    ├── Verification
    ├── Sources
    ├── Contribution Guide
    ├── Privacy
    ├── Terms
    └── Disclaimer
```

🏠 Homepage Architecture

```bash
┌─────────────────────────────────────────────────────────┐
│ NAVBAR                                                  │
│                                                         │
│ Logo | Tools | Roadmaps | Comparisons | Learning | ...  │
│                                      Search | Theme | ☰│
└─────────────────────────────────────────────────────────┘

                         HERO

             Cybersecurity Tools.
             Commands. Knowledge.

      Curated tools, commands, setup guides
           and practical resources.

        ┌─────────────────────────────────┐
        │ 🔎 Search tools, commands...    │
        └─────────────────────────────────┘


                     QUICK STATS

       ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
       │ 250+   │ │ 3000+  │ │ 50+    │ │ Open   │
       │ Tools  │ │ Cmds   │ │ Topics │ │ Source │
       └────────┘ └────────┘ └────────┘ └────────┘


                 EXPLORE CATEGORIES

 ┌─────────┐ ┌────────────┐ ┌────────────┐
 │  OSINT  │ │ Pentesting │ │ Networking │
 └─────────┘ └────────────┘ └────────────┘

 ┌───────────┐ ┌──────────┐ ┌────────────┐
 │ Forensics │ │ Wireless │ │ Cloud/etc. │
 └───────────┘ └──────────┘ └────────────┘


                   POPULAR TOOLS

   Nmap   Burp   Wireshark   ffuf   Sherlock
    │       │        │         │        │


                  LEARNING PATHS

 ┌──────────────┐ ┌──────────────┐
 │ Beginner     │ │ OSINT        │
 │ Fundamentals │ │ Investigator │
 └──────────────┘ └──────────────┘

 ┌──────────────┐ ┌──────────────┐
 │ Web          │ │ Bug Bounty   │
 │ Pentester    │ │              │
 └──────────────┘ └──────────────┘


                RECENTLY UPDATED

      Nmap     Sherlock     Wireshark


                       ↓

                    FOOTER

```


🧰 Tools Architecture:
- When someone clicks Tools

```bash
TOOLS
 │
 ├── Category navigation
 │
 ├── Search
 │
 ├── Filters
 │    ├── Category
 │    ├── Platform
 │    ├── Difficulty
 │    └── Purpose
 │
 └── Tool Cards
```


📄 Individual Tool Page

This is the most important page template.

```bash
┌───────────────────────────────────────────────┐
│ ← Tools / OSINT / Username                   │
│                                               │
│ 🔵 Sherlock                                  │
│ Hunt down social media accounts by username   │
│                                               │
│ [GitHub] [Official] [Copy Link]               │
│                                               │
│ ✓ Verified     v0.x     Linux / Win / macOS  │
└───────────────────────────────────────────────┘

┌──────────────┐ ┌─────────────────────────────┐
│ PAGE NAV     │ │ CONTENT                     │
│              │ │                             │
│ Overview     │ │ Overview                    │
│ Installation │ │ What is Sherlock?           │
│ Commands     │ │                             │
│ Examples     │ │ Installation                │
│ Use Cases    │ │ ─────────────               │
│ Errors       │ │ Windows | Linux | macOS     │
│ Alternatives │ │                             │
│ References   │ │ Commands                    │
│              │ │ ┌─────────────────────────┐ │
│              │ │ │ command                 │ │
│              │ │ │                    Copy │ │
│              │ │ └─────────────────────────┘ │
│              │ │                             │
│              │ │ Example                     │
│              │ │                             │
│              │ │ Common Errors               │
│              │ │                             │
│              │ │ Related Tools               │
└──────────────┘ └─────────────────────────────┘
```

#### Desktop
- Sidebar + content.

#### Tablet
- Sidebar becomes collapsible.

#### Mobile
```bash
┌─────────────────────┐
│ ☰  CyberAtlas    🔍│
├─────────────────────┤
│ Sherlock            │
│ Username OSINT      │
│                     │
│ [Overview]          │
│ [Installation ▼]    │
│ [Commands ▼]        │
│                     │
│ Content...          │
└─────────────────────┘
```

## ⚔️ Comparison Page

```bash
                ffuf
                  │
                  VS
                  │
               Gobuster


┌──────────────────────────────────────┐
│ QUICK SUMMARY                         │
└──────────────────────────────────────┘

┌────────────┬──────────┬──────────────┐
│ Feature    │ ffuf      │ Gobuster     │
├────────────┼──────────┼──────────────┤
│ Speed      │ ...      │ ...          │
│ Fuzzing    │ ...      │ ...          │
│ Recursion  │ ...      │ ...          │
│ Difficulty │ ...      │ ...          │
└────────────┴──────────┴──────────────┘


WHEN TO USE

┌──────────────────┐  ┌──────────────────┐
│ ffuf             │  │ Gobuster         │
│                  │  │                  │
│ • ...            │  │ • ...            │
│ • ...            │  │ • ...            │
└──────────────────┘  └──────────────────┘


EXAMPLE COMMANDS

ffuf                           gobuster
────────────                   ────────────
command                        command


RELATED TOOLS
```


## 🗺️ Roadmap Architecture
And each node links to your own content:

```bash
ROADMAP STEP
     │
     ├── Concept
     ├── Tools
     ├── Commands
     ├── Labs
     └── Resources
```

```bash
WEB PENTESTING
│
├── 01 Fundamentals
│    ├── Networking
│    ├── HTTP
│    └── Linux
│
├── 02 Recon
│    ├── Nmap
│    ├── Subfinder
│    └── Amass
│
├── 03 Enumeration
│    ├── Gobuster
│    ├── ffuf
│    └── WhatWeb
│
├── 04 Vulnerability Discovery
│    ├── Nuclei
│    └── Burp Suite
│
├── 05 Web Vulnerabilities
│    ├── XSS
│    ├── SQLi
│    └── Authentication
│
├── 06 Exploitation
│
└── 07 Reporting
```

## 🎨 Design System
- Visual language: Dark + Technical but not "edgy hacker."

```bash
BACKGROUND
│
├── Main       #070B12
├── Surface     #0C121C
├── Card        #101925
└── Elevated    #151F2D

BORDERS
│
└── Subtle      #1D2A3A

TEXT
│
├── Primary     #F1F5F9
├── Secondary   #94A3B8
└── Muted       #64748B

ACCENTS
│
├── Primary     Cyan / Blue
├── Success     Green
├── Warning     Amber
├── Danger      Red
└── OSINT       Teal/Purple
```

## 📱 Responsive Architecture

```bash
                 DESKTOP
            ┌───────────────┐
            │ Full Navbar   │
            ├───────┬───────┤
            │ Side  │ Main  │
            │ bar   │       │
            └───────┴───────┘
                    │
                    ▼
                  TABLET
            ┌───────────────┐
            │ Compact Nav   │
            ├───────────────┤
            │ Filters ▼     │
            │               │
            │ Main Content  │
            └───────────────┘
                    │
                    ▼
                  MOBILE
            ┌───────────────┐
            │ ☰ Logo    🔍 │
            ├───────────────┤
            │ Content       │
            │               │
            │ Cards →       │
            │ 1 column      │
            │               │
            └───────────────┘
```

## 🧱 Actual visual hierarchy

```bash
                    CyberAtlas
                       │
              ┌────────┴────────┐
              │                 │
           DISCOVER           LEARN
              │                 │
       ┌──────┼──────┐          │
       │      │      │          │
     Tools Search Compare    Roadmaps
       │                         │
       ▼                         ▼
   Tool Page                 Learning
       │                         │
       └──────────┬──────────────┘
                  ▼
             PRACTICE
                  │
               Labs / CTF
                  │
                  ▼
             COMMUNITY
                  │
          ┌───────┼───────┐
          ▼       ▼       ▼
        Add     Verify   Update
        Tool    Content  Content
```
