import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { SITE } from "@/lib/constants";
import { PageContainer } from "./PageContainer";
import { FooterGroups } from "./FooterGroups";
import { SocialLinks } from "./SocialLinks";

export interface FooterGroup {
  title: string;
  links: { label: string; href: string }[];
}

const GROUPS: FooterGroup[] = [
  {
    title: "Tools",
    links: [
      { label: "All tools", href: "/tools" },
      { label: "Categories", href: "/tools#categories" },
      ...CATEGORIES.slice(0, 4).map((c) => ({ label: c.name, href: `/tools/${c.slug}` })),
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Roadmaps", href: "/roadmaps" },
      { label: "Learning Hub", href: "/learning" },
      { label: "Concepts", href: "/learning#concepts" },
      { label: "Cheatsheets", href: "/cheatsheets" },
      { label: "Labs & CTFs", href: "/learning#labs" },
    ],
  },
  {
    title: "Compare",
    links: [
      { label: "All comparisons", href: "/comparisons" },
      { label: "ffuf vs Gobuster", href: "/comparisons/ffuf-vs-gobuster" },
      { label: "Nmap vs Masscan", href: "/comparisons/nmap-vs-masscan" },
      { label: "Wireshark vs tcpdump", href: "/comparisons/wireshark-vs-tcpdump" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Overview", href: "/community" },
      { label: "Contribution guide", href: "/community/contribute" },
      { label: "Request a tool", href: "/community/request-tool" },
      { label: "Suggest an edit", href: "/community/suggest-edit" },
      { label: "Content revisions", href: "/community#revisions" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "About", href: "/about" },
      { label: "Verification", href: "/about/verification" },
      { label: "Sources", href: "/about/sources" },
      { label: "Privacy", href: "/about/privacy" },
      { label: "Terms", href: "/about/terms" },
    ],
  },
  {
    title: "Safety",
    links: [
      { label: "FAQs", href: "/faqs" },
      { label: "Cookie policy", href: "/cookies" },
      { label: "Responsible use", href: "/about/responsible-use" },
      { label: "Legal & ethics", href: "/about/responsible-use" },
      { label: "Disclaimer", href: "/about/terms#disclaimer" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="print-hide mt-20 border-t border-line bg-surface">
      <PageContainer width="wide" className="py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
          <div>
            <BrandLogo />
            <p className="mt-3 max-w-xs text-[13px] leading-6 text-ink-soft">
              An open-source directory of cybersecurity tools, commands and learning
              resources — curated, documented and community maintained.
            </p>
            <p className="mt-4 mb-2 font-mono text-[10.5px] tracking-[0.16em] text-ink-mute uppercase">
              Connect
            </p>
            <SocialLinks />
            <Link
              href="/community/contribute"
              className="group mt-3 inline-flex items-center gap-1.5 text-[12.5px] text-accent-blue transition-colors hover:underline"
            >
              How contributing works
              <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>

          <FooterGroups groups={GROUPS} />
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-5 text-[12px] text-ink-mute sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {SITE.shortName} Tool Directory · dataset v{SITE.datasetVersion} ({" "}
            {SITE.datasetRevision} )
          </p>
          <p className="font-mono text-[11.5px]">
            Documentation only. Test systems you own or are authorized to test.
          </p>
        </div>
      </PageContainer>
    </footer>
  );
}

function BrandLogo() {
  return (
    <Link href="/" className="group inline-flex items-center" aria-label={`${SITE.name} home`}>
      <Image
        src="/cyberatlas-logo.svg"
        alt=""
        width={100}
        height={48}
        className="h-11 w-auto object-contain"
      />
    </Link>
  );
}
