/**
 * Repository link resolution.
 *
 * This build has no hard-coded GitHub URL, because a dead link is worse than an
 * absent one. Set `NEXT_PUBLIC_REPOSITORY_URL` (e.g.
 * `https://github.com/your-org/cyberatlas-directory`) and every "GitHub" affordance
 * in the product starts pointing at it; otherwise it links to the on-site
 * contribution guide, which is real content.
 */
export const REPOSITORY_URL = process.env.NEXT_PUBLIC_REPOSITORY_URL?.trim();

export const REPO_FALLBACK_HREF = "/community/contribute";

export function repositoryHref(path?: string): string {
  if (!REPOSITORY_URL) return REPO_FALLBACK_HREF;
  const base = REPOSITORY_URL.replace(/\/+$/, "");
  return path ? `${base}/${path.replace(/^\/+/, "")}` : base;
}

export const repositoryIsExternal = Boolean(REPOSITORY_URL);
