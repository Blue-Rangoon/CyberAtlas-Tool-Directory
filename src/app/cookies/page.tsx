import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { ConsentControls } from "@/components/pages/ConsentControls";
import { CONSENT_KEY } from "@/lib/consent";
import { THEME_KEY } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "What CyberAtlas stores in your browser: theme preference, your cookie choice and local progress — and how advertising and consent work.",
  alternates: { canonical: "/cookies" },
};

interface StorageItem {
  key: string;
  purpose: string;
  kind: "Functional" | "Consent record" | "Local feature data";
  retention: string;
}

/** Everything the site writes. If a feature adds storage, it must be listed here. */
const STORAGE: StorageItem[] = [
  {
    key: THEME_KEY,
    purpose: "Remembers whether you picked the light or dark theme so it applies before the page paints.",
    kind: "Functional",
    retention: "Until you clear site data",
  },
  {
    key: CONSENT_KEY,
    purpose: "Records whether you accepted or declined, so an accepted choice is not asked again.",
    kind: "Consent record",
    retention: "Until you reset it or clear site data",
  },
  {
    key: "cyberatlas:progress:<roadmap>",
    purpose: "Which roadmap stages you ticked as done. Never leaves your browser.",
    kind: "Local feature data",
    retention: "Until you press Reset or clear site data",
  },
  {
    key: "cyberatlas:drafts:<form>",
    purpose: "Contribution drafts you chose to save locally. Never leaves your browser.",
    kind: "Local feature data",
    retention: "Until you delete the draft or clear site data",
  },
];

export default function CookiePolicyPage() {
  return (
    <PageContainer width="content" className="py-7 sm:py-9">
      <Breadcrumbs
        items={[{ label: "About", href: "/about" }, { label: "Cookie policy" }]}
        className="mb-5"
      />

      <header className="border-b border-line pb-5">
        <p className="font-mono text-[11px] tracking-[0.14em] text-ink-mute uppercase">
          Project · storage and advertising
        </p>
        <h1 className="mt-1.5 text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink sm:text-[34px]">
          Cookie policy
        </h1>
        <p className="mt-2.5 max-w-3xl text-[15px] leading-7 text-ink-soft">
          Plain version: this site sets <strong className="text-ink">no cookies of its own</strong>.
          It uses your browser&apos;s local storage to remember your theme, your cookie choice and
          your local progress. The site may show advertising, which is the one place a third party
          could add cookies — and only if you accept.
        </p>
      </header>

      <section className="mt-7" aria-labelledby="choice-title">
        <SectionHeader
          id="choice-title"
          title="Your choice"
          description="The same options as the notice that appears while you scroll. Changes apply immediately."
        />
        <ConsentControls />
      </section>

      <section className="mt-10" aria-labelledby="stored-title">
        <SectionHeader
          id="stored-title"
          title="What is stored in your browser"
          description="Local storage stays on your device and is not sent to a server with each request, unlike cookies."
        />
        <ul className="space-y-2.5">
          {STORAGE.map((item) => (
            <li key={item.key} className="rounded-md border border-line bg-card p-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <code className="min-w-0 rounded border border-line bg-main px-1.5 py-0.5 font-mono text-[12px] break-all text-ink">
                  {item.key}
                </code>
                <Badge tone="outline">{item.kind}</Badge>
                <span className="ml-auto text-[11.5px] text-ink-mute">{item.retention}</span>
              </div>
              <p className="mt-2 text-[13.5px] leading-6 text-ink-soft">{item.purpose}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[12.5px] leading-6 text-ink-mute">
          No analytics identifiers, fingerprints or tracking pixels are written by this site.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="ads-title">
        <SectionHeader id="ads-title" title="Advertising" />
        <div className="space-y-3 text-[14px] leading-7 text-ink-soft">
          <p>
            This site may display advertising to cover hosting costs. Any ad appears in a clearly
            labelled, separate slot — never inside a command, between a command and its explanation,
            over navigation, or styled to resemble documentation.
          </p>
          <p>
            Ad networks can set their own cookies or read identifiers in your browser to choose and
            measure ads. Those are third-party cookies under that provider&apos;s policy, not ours.
          </p>
        </div>
        <ul className="mt-3.5 space-y-2">
          {[
            ["If you accept", "Ad partners may be loaded and may set cookies once ads are enabled on the site."],
            ["If you decline", "No ad partner script is loaded and no ad cookies are requested. You will be asked again on your next visit until you accept."],
            ["Right now", "No ad network is wired into this build, so nothing third-party is currently running. This page will be updated, with the provider named, before that changes."],
          ].map(([title, body]) => (
            <li key={title} className="flex gap-2.5 rounded-md border border-line bg-card px-3.5 py-2.5">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              <span className="text-[13.5px] leading-6 text-ink-soft">
                <strong className="font-semibold text-ink">{title}.</strong> {body}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="manage-title">
        <SectionHeader id="manage-title" title="Managing and deleting it" />
        <ul className="space-y-2 text-[14px] leading-7 text-ink-soft">
          <li className="flex gap-2.5">
            <span className="mt-3 size-1 shrink-0 rounded-full bg-accent/70" aria-hidden />
            Change or reset your cookie choice above at any time.
          </li>
          <li className="flex gap-2.5">
            <span className="mt-3 size-1 shrink-0 rounded-full bg-accent/70" aria-hidden />
            Switch theme with the sun/moon button in the navigation bar; it is saved immediately.
          </li>
          <li className="flex gap-2.5">
            <span className="mt-3 size-1 shrink-0 rounded-full bg-accent/70" aria-hidden />
            Clear this site&apos;s data in your browser settings to remove everything listed above in one step.
          </li>
          <li className="flex gap-2.5">
            <span className="mt-3 size-1 shrink-0 rounded-full bg-accent/70" aria-hidden />
            Browsers can also block third-party cookies globally, which applies to any ad partner regardless of this choice.
          </li>
        </ul>
      </section>

      <Callout tone="info" title="Why a notice for local storage?" className="mt-9">
        <p>
          The theme and progress entries are functional and would not need consent on their own. The
          notice exists because of advertising, and because it is simpler to tell you everything the
          site writes in one place than to make you work out which parts count.
        </p>
      </Callout>

      <p className="mt-8 border-t border-line pt-5 text-[13px] leading-6 text-ink-mute">
        Related:{" "}
        <Link href="/about/privacy" className="text-accent-blue hover:underline">
          Privacy
        </Link>
        ,{" "}
        <Link href="/about/terms" className="text-accent-blue hover:underline">
          Terms
        </Link>{" "}
        and the{" "}
        <Link href="/faqs" className="text-accent-blue hover:underline">
          FAQs
        </Link>
        . Questions or corrections are welcome through{" "}
        <Link href="/community/suggest-edit" className="text-accent-blue hover:underline">
          Suggest an edit
        </Link>
        .
      </p>
    </PageContainer>
  );
}
