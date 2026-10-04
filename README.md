# CyberAtlas Tool Directory

An open-source directory and learning surface for cybersecurity tooling: what a tool does,
whether it runs on your platform, how to install it, which commands matter, what those commands
actually do, where it fits in a study path — and what to use instead.

**This is documentation, not a control panel.** Nothing here executes a command, and nothing here
should be pointed at a system you do not own or are not explicitly authorized to test.

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4 with design tokens declared in `src/app/globals.css`
- `lucide-react` for the single icon set
- **No backend.** All content is typed TypeScript data, statically rendered.

## Where things live

```
src/
├── app/                     # routes (one folder per page, metadata per page)
│   ├── tools/[slug]/        # /tools/nmap (tool) AND /tools/osint (category)
│   └── about/[slug]/        # policy pages driven by a single content map
├── components/
│   ├── layout/              # SiteHeader (navbar + mobile drawer + palette), Footer, containers
│   ├── ui/                  # primitives: Button, Card, Badge, Tabs, Callout, Accordion, States
│   ├── tools/               # ToolCard, ToolGrid, ToolFilters, CommandBlock, Installation, Errors
│   ├── roadmaps/            # RoadmapCard, RoadmapView (local progress)
│   ├── comparisons/         # ComparisonTable (responsive)
│   ├── cheatsheets/         # CheatsheetView (filter + copy + print)
│   ├── search/              # SearchOverlay (⌘K palette), result metadata
│   └── common/              # CopyButton, PlatformBadge, PageHeader, DocSection, Breadcrumbs
├── data/
│   ├── categories.ts        # category + subcategory spine
│   ├── tools/               # one file per documented tool; shorter entries grouped by area
│   ├── roadmaps.ts  comparisons.ts  cheatsheets.ts  learning.ts
├── hooks/                   # useCopy, useLocalStorage, useMediaQuery, useHotkeys, useScrollSpy, useOverlay
├── lib/                     # search index, filter logic, platforms, stats, updates, utils
└── types/                   # the content model every data file is written against
```

## Adding content

Content is data. Add a file, export a typed object, register it — the directory, category counts,
search index, cross-links, sitemaps and the activity feed all derive from that entry.

1. `src/data/tools/<slug>.ts` exporting `export const myTool: Tool = { … }`.
2. Point `category` / `subcategory` at existing slugs (add a subtopic in `src/data/categories.ts` if it is genuinely new).
3. Fill `installation` per platform; anything needing sudo sets `requiresElevation: true`.
4. Every `Command` needs `title`, `description` and `command`. A command without an explanation is rejected in review.
5. Link `alternatives`, `relatedTools` and roadmap tool lists by **slug**; unresolvable slugs render as an explicit "not documented yet — request it" note rather than a dead link.
6. Add it to `RAW_TOOLS` in `src/data/tools/index.ts`.
7. `npm run build` — the type system catches omissions; there is no schema to keep in sync by hand.

### Writing rules

- Summarise and link the upstream manual; do not copy it.
- Examples use documentation ranges (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`) or private lab ranges.
- Never invent versions, verification dates, download counts, star counts, contributor names or benchmarks. Optional fields exist so that absence is honest.
- Descriptions stay technical: "enumerate services on an authorized target", never "hack anything".

## Design system

Tokens live in one place (`globals.css`): surfaces, borders, text steps, accents, status colours,
motion curves, print rules and the `prefers-reduced-motion` reset. Components use semantic classes
(`bg-card`, `border-line`, `text-ink-soft`) — raw hex inside a component is a review comment.

Category colour is deliberately restricted to icons, dots, badges, active nav and thin accents so
the interface stays coherent as the taxonomy grows.

## Atlas Assistant (local guide + future integration)

`AssistantButton` appears at the viewport's bottom-right on every page. Opening
it lazy-loads `AtlasPanel` and `src/lib/atlas.ts`, a deterministic directory
lookup: typed questions and `/help`, `/tools`, `/commands nmap`, `/install nmap
linux`, `/compare ffuf vs gobuster`, `/roadmaps`, `/concept dns` and `/clear`
produce source-linked answers from the same content as the rest of the site.
Commands are documentation with copy buttons, **not executed**. Unknown questions
get an honest "not in this directory" response, not a fabricated AI answer.
There is no API call, no fake delay, and chat history is only in component memory
for the current page session.

The panel is non-modal: page scrolls when the pointer is outside it, and long
conversations scroll independently inside it. It stays fixed in place while the
page scrolls. Escape / Close returns focus to the launcher (or, on phones, the
cookie banner if it has appeared). The panel and button use only semantic theme
tokens and are hidden in print. On phones an open panel temporarily defers the
cookie banner; on close the banner resumes until the visitor chooses.

To connect a real assistant later:

1. **API approach:** replace `resolveAtlasInput` in `AtlasPanel` with a request to
   a secure route that reads the key from `process.env` on the server. Never
   expose the key in client code or `NEXT_PUBLIC_*`.
2. **Vendor embed approach:** paste the embed into the marked slot at the end
   of `src/app/layout.tsx` (the App Router equivalent of `index.html`, before
   `</body>`). Once loaded set `window.__CW_ASSISTANT__ = true`; for a lazy
   script also dispatch `window.dispatchEvent(new Event("cyberatlas:assistant-ready"))`.
   The local launcher hides automatically, so it cannot clash with a vendor
   launcher. Or remove `<AssistantButton />` from the layout if the vendor
   supplies its own button.

## Theming and consent

- **Two themes, one token layer.** Dark is the default. `html[data-theme="light"]` in
  `globals.css` overrides the same semantic variables, so components never branch on theme.
  New surface states use tokens (`bg-card-hover`, `text-on-accent`, `shadow-pop`) — raw hex in a
  component will not follow the theme.
- The theme is stored in `localStorage` (`cyberatlas:theme`) and applied by an inline script in
  `<head>` before first paint (`src/lib/theme.ts`).
- The cookie notice (`CookieBanner`) shows bottom-left after scrolling. Accepted choices persist
  (`cyberatlas:cookie-consent`); declined visitors are asked again on every new visit.
- Any future ad slot must call `hasAdConsent()` from `src/lib/consent.ts` before loading a
  third-party script. Add every new storage key to `/cookies`.

## Decisions worth knowing

- **Search** is a small in-memory index over the typed content with title-weighted ranking. No
  search dependency, no network round-trip, no artificial delay.
- **Filters** live in the URL (`/tools?category=osint&platform=linux`), so any filtered view is
  shareable and survives back/forward/refresh.
- **Progress and drafts are local-only.** There is no account system; roadmap progress and
  contribution drafts persist in `localStorage`, and the copy says so.
- **No execution.** A future sandboxed playground would be a separate, isolated system; commands
  here are documentation.
- The repository link resolves from `NEXT_PUBLIC_REPOSITORY_URL`. When unset, GitHub buttons link to
  the on-site contribution guide instead of a dead URL.
- Social icons (footer + mobile drawer) resolve from `NEXT_PUBLIC_GITHUB_URL`,
  `NEXT_PUBLIC_GITLAB_URL`, `NEXT_PUBLIC_LINKEDIN_URL`, `NEXT_PUBLIC_DISCORD_URL`,
  `NEXT_PUBLIC_REDDIT_URL` and `NEXT_PUBLIC_X_URL` (see `src/lib/social.ts`). Until real
  handles are configured they point at the platform roots rather than invented profiles.

## Scripts

```bash
npm run dev       # local development
npm run build     # static build of every documented route
npm run typecheck # tsc --noEmit
npm run lint      # eslint
```

## Project Structure: 

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
├── README.md
├── drizzle.config.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── tsconfig.tsbuildinfo
```



