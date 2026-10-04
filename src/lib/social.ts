/**
 * Community / social destinations.
 *
 * Each link resolves from a `NEXT_PUBLIC_*` override so real project handles
 * can be plugged in without touching components. Until they are configured,
 * links point at the platform roots (documented in the README) rather than at
 * invented profile URLs.
 */
export type SocialKey = "github" | "gitlab" | "linkedin" | "discord" | "reddit" | "x";

export interface SocialLink {
  key: SocialKey;
  label: string;
  href: string;
}

function env(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

export function getSocialLinks(repositoryFallback: string): SocialLink[] {
  return [
    {
      key: "github",
      label: "GitHub",
      href: env("NEXT_PUBLIC_GITHUB_URL") ?? repositoryFallback,
    },
    {
      key: "gitlab",
      label: "GitLab",
      href: env("NEXT_PUBLIC_GITLAB_URL") ?? "https://gitlab.com",
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      href: env("NEXT_PUBLIC_LINKEDIN_URL") ?? "https://www.linkedin.com",
    },
    {
      key: "discord",
      label: "Discord",
      href: env("NEXT_PUBLIC_DISCORD_URL") ?? "https://discord.com",
    },
    {
      key: "reddit",
      label: "Reddit",
      href: env("NEXT_PUBLIC_REDDIT_URL") ?? "https://www.reddit.com",
    },
    {
      key: "x",
      label: "X (Twitter)",
      href: env("NEXT_PUBLIC_X_URL") ?? "https://x.com",
    },
  ];
}
