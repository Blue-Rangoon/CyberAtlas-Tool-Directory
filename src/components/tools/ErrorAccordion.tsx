import { CommandRow } from "@/components/tools/CommandBlock";
import { Disclosure } from "@/components/ui/Accordion";
import type { ErrorEntry } from "@/types";

/**
 * Troubleshooting entries. Kept as native <details> so they are usable with no
 * JavaScript and remain open when a reader navigates back to them.
 */
export function ErrorAccordion({ entries }: { entries: ErrorEntry[] }) {
  return (
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <Disclosure
          key={entry.symptom}
          defaultOpen={index === 0}
          title={
            <span className="font-mono text-[12.8px] leading-5 text-ink">{entry.symptom}</span>
          }
          meta={`Cause ${index + 1}/${entries.length}`}
        >
          <div className="space-y-3">
            <div>
              <p className="font-mono text-[10.5px] tracking-[0.12em] text-ink-mute uppercase">
                Possible causes
              </p>
              <ul className="mt-1.5 space-y-1">
                {entry.causes.map((cause) => (
                  <li key={cause} className="flex gap-2 text-[13px] leading-6 text-ink-soft">
                    <span className="mt-2.5 size-1 shrink-0 rounded-full bg-ink-mute/60" aria-hidden />
                    {cause}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10.5px] tracking-[0.12em] text-ink-mute uppercase">
                Usual fix
              </p>
              <p className="mt-1.5 text-[13px] leading-6 text-ink-soft">{entry.solution}</p>
            </div>
            {entry.commands?.length ? (
              <div className="space-y-2">
                {entry.commands.map((command, i) => (
                  <CommandRow key={`${command}-${i}`} command={command} />
                ))}
              </div>
            ) : null}
          </div>
        </Disclosure>
      ))}
    </div>
  );
}
