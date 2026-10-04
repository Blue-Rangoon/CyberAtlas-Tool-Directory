import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { FaqExplorer } from "@/components/pages/FaqExplorer";
import { FAQS } from "@/data/faqs";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about the CyberAtlas Tool Directory: finding tools, installation, learning paths, comparisons, contributing, and legal boundaries.",
  alternates: { canonical: "/faqs" },
};

/** Machine-readable Q&A so search engines can surface direct answers. */
function FaqJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: [...faq.a, ...(faq.bullets ?? [])].join(" "),
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function FaqsPage() {
  return (
    <PageContainer width="content" className="py-7 sm:py-9">
      <FaqJsonLd />
      <Breadcrumbs items={[{ label: "About", href: "/about" }, { label: "FAQs" }]} className="mb-5" />
      <PageHeader
        eyebrow="Help"
        title="Frequently asked questions"
        description={`${FAQS.length} answers about finding tools, installing them, learning in order, comparing options, contributing, and staying on the right side of the law.`}
      />
      <div className="mt-7">
        <FaqExplorer />
      </div>
      <p className="mt-8 border-t border-line pt-5 text-[13px] leading-6 text-ink-mute">
        Still stuck?{" "}
        <Link href="/community/suggest-edit" className="text-accent-blue hover:underline">
          Suggest a question
        </Link>{" "}
        — gaps in this page are treated like gaps anywhere else: reported, then fixed. For boundaries
        on testing, read{" "}
        <Link href="/about/responsible-use" className="text-accent-blue hover:underline">
          legal &amp; ethical use
        </Link>
        .
      </p>
    </PageContainer>
  );
}
