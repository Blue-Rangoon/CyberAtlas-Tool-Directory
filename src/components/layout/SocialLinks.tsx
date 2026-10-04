import { siDiscord, siGithub, siGitlab, siReddit, siX } from "simple-icons";
import { repositoryHref } from "@/lib/repo";
import { getSocialLinks, type SocialKey } from "@/lib/social";
import { cn } from "@/lib/utils";

/**
 * LinkedIn is no longer shipped by simple-icons, so its classic 24×24 glyph
 * lives here. Bounds-checked against the 0–24 viewBox at authoring time.
 */
const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z";

const PATHS: Record<SocialKey, string> = {
  github: siGithub.path,
  gitlab: siGitlab.path,
  linkedin: LINKEDIN_PATH,
  discord: siDiscord.path,
  reddit: siReddit.path,
  x: siX.path,
};

/**
 * Social icon row. Pure server component — no hooks, no client JS.
 * The GitHub entry follows the repository resolution (env URL, else the
 * on-site contribution guide); the rest resolve from `src/lib/social.ts`.
 */
export function SocialLinks({
  className,
  label = "CyberAtlas on social platforms",
}: {
  className?: string;
  label?: string;
}) {
  const links = getSocialLinks(repositoryHref());

  return (
    <ul className={cn("flex flex-wrap items-center gap-1.5", className)} aria-label={label}>
      {links.map((link) => {
        const external = /^https?:\/\//.test(link.href);
        // Until a repository URL is configured, the GitHub mark points at the
        // on-site contribution guide — the label must say where it goes.
        const accessibleLabel =
          link.key === "github" && !external ? "Contribution guide" : link.label;
        return (
          <li key={link.key}>
            <a
              href={link.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              title={accessibleLabel}
              aria-label={accessibleLabel}
              className="grid size-8 place-items-center rounded-[5px] border border-line bg-elevated text-ink-soft transition-colors duration-150 hover:border-line-strong hover:text-accent"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
                <path d={PATHS[link.key]} />
              </svg>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
