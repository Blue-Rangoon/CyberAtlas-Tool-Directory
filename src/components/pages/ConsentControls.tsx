"use client";

import { CircleCheck, CircleSlash, CircleDashed } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useConsent } from "@/hooks/useConsent";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const COPY = {
  accepted: {
    icon: CircleCheck,
    tone: "text-success",
    title: "You accepted",
    body: "Ads and ad-partner cookies are permitted. The cookie notice will not appear again on this browser.",
  },
  declined: {
    icon: CircleSlash,
    tone: "text-warning",
    title: "You declined",
    body: "Ads and ad-partner cookies are not permitted. The notice will appear again on your next visit until you accept.",
  },
  unset: {
    icon: CircleDashed,
    tone: "text-ink-mute",
    title: "No choice recorded yet",
    body: "Nothing optional is enabled. You will see the notice after scrolling on other pages.",
  },
} as const;

/** Lets a visitor see and change their stored choice, plus the current theme. */
export function ConsentControls() {
  const { status, accept, decline, reset } = useConsent();
  const { theme, setTheme } = useTheme();
  const copy = COPY[status];
  const Icon = copy.icon;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <section
        aria-labelledby="consent-title"
        className="rounded-md border border-line bg-card p-4"
      >
        <h3 id="consent-title" className="font-mono text-[10.5px] tracking-[0.16em] text-ink-mute uppercase">
          Cookie &amp; ads choice
        </h3>
        <p className="mt-2 flex items-center gap-2 text-[14px] font-semibold text-ink" role="status" aria-live="polite">
          <Icon className={cn("size-4", copy.tone)} aria-hidden />
          {copy.title}
        </p>
        <p className="mt-1 text-[13px] leading-6 text-ink-soft">{copy.body}</p>
        <div className="mt-3.5 flex flex-wrap gap-2">
          <Button size="sm" variant="primary" onClick={accept} disabled={status === "accepted"}>
            Accept
          </Button>
          <Button size="sm" variant="secondary" onClick={decline} disabled={status === "declined"}>
            Decline
          </Button>
          <Button size="sm" variant="ghost" onClick={reset} disabled={status === "unset"}>
            Reset choice
          </Button>
        </div>
      </section>

      <section
        aria-labelledby="theme-title"
        className="rounded-md border border-line bg-card p-4"
      >
        <h3 id="theme-title" className="font-mono text-[10.5px] tracking-[0.16em] text-ink-mute uppercase">
          Theme preference
        </h3>
        <p className="mt-2 text-[14px] font-semibold text-ink capitalize">{theme} theme</p>
        <p className="mt-1 text-[13px] leading-6 text-ink-soft">
          Saved in local storage whenever you use the toggle. It is functional storage, so it is
          kept whichever cookie choice you make.
        </p>
        <div className="mt-3.5 inline-flex rounded-[5px] border border-line bg-surface p-0.5" role="group" aria-label="Theme">
          {(["dark", "light"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={theme === value}
              onClick={() => setTheme(value)}
              className={cn(
                "rounded-[4px] px-3 py-1 text-[12.5px] capitalize transition-colors duration-150",
                theme === value
                  ? "bg-elevated text-ink shadow-[inset_0_0_0_1px_var(--color-line-strong)]"
                  : "text-ink-mute hover:text-ink-soft",
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
