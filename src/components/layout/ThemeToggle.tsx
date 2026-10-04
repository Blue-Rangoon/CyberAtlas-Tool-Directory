"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

/**
 * Navbar theme switch. The icon shows the theme you will switch TO (sun in
 * dark mode, moon in light mode), and the accessible name says the same.
 * Both icons are always mounted and cross-fade with opacity/transform only.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";
  const label = isLight ? "Switch to dark theme" : "Switch to light theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-[5px] border border-line/70 bg-elevated text-ink-soft transition-colors hover:border-line-strong hover:text-ink",
        className,
      )}
    >
      <Sun
        className={cn(
          "absolute size-4 transition-[opacity,transform] duration-200",
          isLight ? "-rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100",
        )}
        aria-hidden
      />
      <Moon
        className={cn(
          "absolute size-4 transition-[opacity,transform] duration-200",
          isLight ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-50 opacity-0",
        )}
        aria-hidden
      />
    </button>
  );
}
