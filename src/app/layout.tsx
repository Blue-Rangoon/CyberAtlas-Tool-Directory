import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { AssistantButton } from "@/components/layout/AssistantButton";
import { SITE } from "@/lib/constants";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: "%s | CyberAtlas Tool Directory",
  },
  description: SITE.description,
  applicationName: SITE.name,
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  keywords: [
    "cybersecurity tools",
    "nmap commands",
    "osint tools",
    "pentesting tools",
    "security cheatsheets",
    "learning roadmaps",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: { card: "summary", title: SITE.name, description: SITE.description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Applies the saved theme before first paint: no flash of the wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Font swap keeps first paint independent of the network. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-main text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-70 focus:rounded-[5px] focus:border focus:border-accent/50 focus:bg-elevated focus:px-3 focus:py-2 focus:text-[13px] focus:text-ink"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="min-h-[70vh]">
          {children}
        </main>
        <Footer />
        <CookieBanner />
        <AssistantButton />
        {/* ─── Atlas Assistant integration slot ───────────────────────────────
              The current panel uses a local directory resolver in
              src/lib/atlas.ts. No model or backend is connected.

              For your future integration you can EITHER:
              1. Replace the resolver in AtlasPanel with a request to a secure
                 server route. Keep API keys server-side (process.env), never in
                 NEXT_PUBLIC_* or browser code; OR
              2. Paste a vendor's browser embed here, immediately before
                 </body> (the App Router equivalent of index.html). After it
                 loads set window.__CW_ASSISTANT__ = true and, for a lazy
                 script, dispatch new Event("CyberAtlas:assistant-ready").

              AssistantButton detects that flag and hides Atlas so the local
              panel and vendor launcher never collide. If the embed supplies
              its own launcher, you may remove <AssistantButton /> above. */}
      </body>
    </html>
  );
}
