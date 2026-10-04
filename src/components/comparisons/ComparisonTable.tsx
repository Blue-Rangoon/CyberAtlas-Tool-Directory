import { Fragment } from "react";
import { CircleCheck, Minus } from "lucide-react";
import { groupBy } from "@/lib/utils";
import type { ComparisonFeature, ComparisonValue } from "@/types";

function Value({ value }: { value: ComparisonValue }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex items-center gap-1.5 text-[13px] text-success">
        <CircleCheck className="size-3.5 shrink-0" aria-hidden />
        Documented
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-mute">
        <Minus className="size-3.5 shrink-0" aria-hidden />
        Not a feature
      </span>
    );
  }
  if (typeof value === "string") {
    return <span className="text-[13px] leading-6 text-ink-soft">{value}</span>;
  }
  return (
    <span className="block">
      <span className="text-[13px] leading-6 text-ink-soft">{value.text}</span>
      {value.note ? (
        <span className="mt-0.5 block text-[12px] leading-5 text-ink-mute">{value.note}</span>
      ) : null}
    </span>
  );
}

/**
 * Two-pane comparison. Desktop: real table with a sticky feature column.
 * Mobile: the same data as stacked feature cards — never a shrunken table.
 */
export function ComparisonTable({
  features,
  toolA,
  toolB,
}: {
  features: ComparisonFeature[];
  toolA: string;
  toolB: string;
}) {
  const groups = groupBy(features, (f) => f.group);
  const groupNames = Object.keys(groups);

  return (
    <>
      {/* Mobile / narrow tablet */}
      <div className="space-y-4 md:hidden">
        {groupNames.map((group) => (
          <div key={group}>
            <p className="mb-2 font-mono text-[10.5px] tracking-[0.14em] text-ink-mute uppercase">
              {group}
            </p>
            <ul className="space-y-2.5">
              {groups[group].map((feature) => (
                <li key={`${group}-${feature.feature}`} className="rounded-md border border-line bg-card p-3.5">
                  <h4 className="text-[13.5px] font-semibold text-ink">{feature.feature}</h4>
                  <dl className="mt-2 space-y-2">
                    <Side label={toolA} value={feature.a} />
                    <Side label={toolB} value={feature.b} />
                  </dl>
                  {feature.notes ? (
                    <p className="mt-2 border-t border-line/70 pt-2 text-[12px] leading-5 text-ink-mute">
                      {feature.notes}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Tablet and up */}
      <div className="scroll-rail hidden rounded-md border border-line bg-card md:block">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <caption className="sr-only">
            Feature comparison between {toolA} and {toolB}
          </caption>
          <thead className="sticky top-0 z-10 bg-elevated">
            <tr className="border-b border-line">
              <th scope="col" className="w-[30%] px-3.5 py-2.5 text-[12px] font-semibold text-ink-mute">
                Attribute
              </th>
              <th scope="col" className="px-3.5 py-2.5 text-[13px] font-semibold text-ink">
                {toolA}
              </th>
              <th scope="col" className="px-3.5 py-2.5 text-[13px] font-semibold text-ink">
                {toolB}
              </th>
            </tr>
          </thead>
          <tbody>
            {groupNames.map((group) => (
              <Fragment key={group}>
                <tr className="bg-surface/80">
                  <th
                    colSpan={3}
                    scope="colgroup"
                    className="px-3.5 py-1.5 text-left font-mono text-[10.5px] tracking-[0.14em] text-ink-mute uppercase"
                  >
                    {group}
                  </th>
                </tr>
                {groups[group].map((feature) => (
                  <tr
                    key={`${group}-${feature.feature}`}
                    className="border-t border-line/70 align-top transition-colors hover:bg-elevated/50"
                  >
                    <th scope="row" className="px-3.5 py-3 text-[13px] font-medium text-ink">
                      {feature.feature}
                    </th>
                    <td className="px-3.5 py-3">
                      <Value value={feature.a} />
                    </td>
                    <td className="px-3.5 py-3">
                      <Value value={feature.b} />
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Side({ label, value }: { label: string; value: ComparisonValue }) {
  return (
    <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-2">
      <dt className="truncate font-mono text-[11px] text-ink-mute">{label}</dt>
      <dd className="min-w-0">
        <Value value={value} />
      </dd>
    </div>
  );
}
