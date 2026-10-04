"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Github, Menu, Search, X } from "lucide-react";
import { useHotkeys } from "@/hooks/useHotkeys";
import { useOverlay } from "@/hooks/useOverlay";
import { Portal } from "@/components/ui/Portal";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { OPEN_SEARCH_EVENT } from "@/components/search/OpenSearchButton";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { CATEGORIES } from "@/data/categories";
import { MOBILE_NAV_GROUPS, NAV_LINKS, SITE } from "@/lib/constants";
import { repositoryHref, repositoryIsExternal } from "@/lib/repo";
import { cn } from "@/lib/utils";
import { PageContainer } from "./PageContainer";

/**
 * The whole site chrome: sticky navbar, mobile drawer and the search palette.
 * Overlays render through <Portal> into document.body — the header's
 * backdrop-blur would otherwise trap `fixed` descendants inside the 56px
 * header box instead of the viewport.
 */
export function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const openSearch = useCallback(() => setSearchOpen(true), []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    window.addEventListener(OPEN_SEARCH_EVENT, openSearch);
    return () => window.removeEventListener(OPEN_SEARCH_EVENT, openSearch);
  }, [openSearch]);

  const hotkeys = useMemo(
    () => [
      { combo: "mod+k", handler: openSearch, allowInInput: true },
      { combo: "/", handler: openSearch },
    ],
    [openSearch],
  );
  useHotkeys(hotkeys);

  const toolsActive = pathname === "/tools" || pathname.startsWith("/tools/");

  return (
    <header
      className={cn(
        "print-hide sticky top-0 z-50 border-b transition-colors duration-200",
        scrolled
          ? "border-line bg-surface/92 backdrop-blur-[6px]"
          : "border-transparent bg-surface/70 backdrop-blur-[6px]",
      )}
    >
      <PageContainer width="wide">
        <div className="flex h-14 items-center gap-3">
          <Link href="/" className="group flex shrink-0 items-center" aria-label={`${SITE.name} home`}>
            <Image
              src="/cyberatlas-logo.svg"
              alt=""
              width={82}
              height={39}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          <nav aria-label="Primary" className="ml-2 hidden min-w-0 flex-1 items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/tools"
                  ? toolsActive
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-[5px] px-2.5 py-1.5 text-[13.5px] font-medium transition-colors duration-150",
                    active ? "text-ink" : "text-ink-soft hover:text-ink",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute inset-x-2.5 -bottom-[13px] h-px origin-left transition-transform duration-200",
                      active ? "scale-x-100 bg-accent" : "scale-x-0 bg-line-strong",
                    )}
                    aria-hidden
                  />
                </Link>
              );
            })}
            <ToolsMegaChevron />
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={openSearch}
              className="hidden h-9 w-[248px] items-center gap-2 rounded-[5px] border border-line bg-elevated px-2.5 text-left text-[13px] text-ink-mute transition-colors duration-150 hover:border-line-strong hover:text-ink-soft md:flex xl:w-[300px]"
              aria-label="Open search"
            >
              <Search className="size-3.5 shrink-0" aria-hidden />
              <span className="min-w-0 flex-1 truncate">Search tools, commands…</span>
              <kbd className="shrink-0 rounded border border-line bg-card px-1 py-0.5 font-mono text-[10px]">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={openSearch}
              aria-label="Search"
              className="grid size-9 place-items-center rounded-[5px] border border-line/70 bg-elevated text-ink-soft transition-colors hover:border-line-strong hover:text-ink md:hidden"
            >
              <Search className="size-4" aria-hidden />
            </button>

            <a
              href={repositoryHref()}
              {...(repositoryIsExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              aria-label={repositoryIsExternal ? "Project repository" : "Contribution guide"}
              title={repositoryIsExternal ? "Project repository" : "Contribution guide"}
              className="hidden size-9 place-items-center rounded-[5px] border border-line/70 bg-elevated text-ink-soft transition-colors hover:border-line-strong hover:text-ink sm:grid"
            >
              <Github className="size-4" aria-hidden />
            </a>

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              className="grid size-9 place-items-center rounded-[5px] border border-line/70 bg-elevated text-ink-soft transition-colors hover:border-line-strong hover:text-ink lg:hidden"
            >
              <Menu className="size-4.5" aria-hidden />
            </button>
          </div>
        </div>
      </PageContainer>

      <MobileNav open={menuOpen} onClose={closeMenu} />
      <SearchOverlay open={searchOpen} onClose={closeSearch} />
    </header>
  );
}

/**
 * Category menu as a click-to-toggle accordion panel: the chevron expands and
 * collapses the list with a height animation. Closes on selection, Escape,
 * outside pointer-down, or route change. No hover-only behaviour, so touch,
 * mouse and keyboard all get the same control.
 */
function ToolsMegaChevron() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        rootRef.current?.querySelector<HTMLButtonElement>("[data-trigger]")?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open ]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        data-trigger
        aria-expanded={open}
        aria-controls="tools-category-panel"
        aria-label="Browse by category"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "ml-0.5 grid size-7 place-items-center rounded-[5px] transition-colors",
          open ? "bg-elevated text-accent" : "text-ink-mute hover:bg-elevated hover:text-ink",
        )}
      >
        <ChevronDown
          className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
      </button>

      <div className="absolute top-full right-0 z-50 w-[280px] pt-2">
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <div
              id="tools-category-panel"
              aria-hidden={!open}
              className={cn(
                "overflow-hidden rounded-md border border-line bg-elevated shadow-pop",
                !open && "invisible",
              )}
            >
              <p className="border-b border-line px-3 py-2 font-mono text-[10.5px] tracking-[0.14em] text-ink-mute uppercase">
                Categories
              </p>
              <ul className="max-h-[60vh] overflow-y-auto p-1.5">
                {CATEGORIES.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/tools/${category.slug}`}
                      tabIndex={open ? undefined : -1}
                      onClick={() => setOpen(false)}
                      className="block rounded-[5px] px-2.5 py-2 transition-colors hover:bg-card"
                    >
                      <span className="block text-[13px] font-medium text-ink">{category.name}</span>
                      <span className="block truncate text-[12px] text-ink-mute">{category.blurb}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useOverlay(open, onClose);
  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[80] lg:hidden" role="presentation">
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="absolute inset-0 h-full w-full cursor-default bg-main/75 animate-fade-in"
        />
        <nav
          ref={panelRef}
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="absolute top-0 right-0 flex h-full w-[min(88vw,340px)] flex-col border-l border-line bg-surface animate-panel-in"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <Link href="/" onClick={onClose} aria-label={`${SITE.name} home`}>
              <Image
                src="/cyberatlas-logo.svg"
                alt=""
                width={82}
                height={39}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="grid size-9 place-items-center rounded-[5px] border border-line text-ink-soft transition-colors hover:text-ink"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
            {MOBILE_NAV_GROUPS.map((group) => (
              <MobileNavGroup
                key={group.title}
                title={group.title}
                links={group.links.map((l) => ({ href: l.href, label: l.label }))}
                onNavigate={onClose}
              />
            ))}

            <MobileNavGroup
              title="Categories"
              onNavigate={onClose}
              links={CATEGORIES.map((c) => ({ href: `/tools/${c.slug}`, label: c.name }))}
              layout="chips"
            />

            <div className="mt-4 border-t border-line pt-4">
              <p className="mb-2 font-mono text-[10.5px] tracking-[0.16em] text-ink-mute uppercase">
                Connect
              </p>
              <SocialLinks label="CyberAtlas on social platforms" />
              <a
                href={repositoryHref()}
                {...(repositoryIsExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                onClick={onClose}
                className="mt-3 flex items-center justify-center gap-2 rounded-[5px] border border-line bg-elevated px-3 py-2.5 text-[13.5px] font-medium text-ink"
              >
                <Github className="size-4" aria-hidden />
                {repositoryIsExternal ? "Project repository" : "Contribute"}
              </a>
            </div>
          </div>
        </nav>
      </div>
    </Portal>
  );
}

/**
 * One drawer section as an accordion: the group title is a real button that
 * expands/collapses its links. Sections start expanded so every destination
 * is reachable the moment the drawer opens; collapsing is a space option.
 */
function MobileNavGroup({
  title,
  links,
  onNavigate,
  layout = "list",
}: {
  title: string;
  links: { href: string; label: string }[];
  onNavigate: () => void;
  layout?: "list" | "chips";
}) {
  const [expanded, setExpanded] = useState(true);
  const panelId = useId();

  return (
    <div className="mb-2 overflow-hidden rounded-md border border-line/70 bg-card/40">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left"
      >
        <span className="font-mono text-[11px] tracking-[0.16em] text-ink-soft uppercase">
          {title}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-ink-mute transition-transform duration-200",
            expanded && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      <div
        id={panelId}
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          {layout === "list" ? (
            <ul className="border-t border-line/70 p-1.5">
              {links.map((link) => (
                <li key={`${title}-${link.href}`}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    tabIndex={expanded ? undefined : -1}
                    className="block rounded-[5px] px-2.5 py-2.5 text-[14px] text-ink-soft transition-colors hover:bg-elevated hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="flex flex-wrap gap-1.5 border-t border-line/70 p-2.5">
              {links.map((link) => (
                <li key={`${title}-${link.href}`}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    tabIndex={expanded ? undefined : -1}
                    className="inline-block rounded-[5px] border border-line bg-card px-2.5 py-1.5 text-[12.5px] text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

