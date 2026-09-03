import { useState } from "react";
import { Plus } from "lucide-react";
import type { Ritual } from "@/data/site";

/**
 * The ceremony, ritual by ritual.
 *
 * The photograph is pinned in a sticky column on the left and cross fades as
 * the reader moves down the list, so the image and the open row are never out
 * of step and the section never leaves a tall empty gap on either side.
 */
export function RitualIndex({ items }: { items: Ritual[] }) {
  const [open, setOpen] = useState(0);
  const active = items[open] ?? items[0]!;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      {/* the plate */}
      <div className="order-2 hidden lg:order-1 lg:col-span-5 lg:block">
        <div className="lg:sticky lg:top-[130px]">
          <div className="jw-rit-frame">
            {items.map((r, i) => (
              <img
                key={r.number}
                src={r.image}
                alt={`${r.name}, ${r.meaning}`}
                loading="lazy"
                decoding="async"
                width={800}
                height={1000}
                data-active={i === open}
                className="jw-rit-img"
              />
            ))}
            <span aria-hidden className="jw-rit-plate-edge" />
          </div>

          <div key={active.number} className="jw-rit-caption">
            <p className="font-[family-name:var(--font-util)] text-[10px] uppercase tracking-[0.24em] text-gold">
              Ritual {active.number} of {String(items.length).padStart(2, "0")}
            </p>
            <p
              lang="sa"
              className="mt-3 font-[family-name:var(--font-display)] text-[22px] text-kumkum"
            >
              {active.sa}
            </p>
          </div>
        </div>
      </div>

      {/* the list */}
      <ul className="order-1 lg:order-2 lg:col-span-7">
        {items.map((r, i) => (
          <li key={r.number} className="jw-rit-row" data-open={open === i}>
            <button
              type="button"
              aria-expanded={open === i}
              aria-controls={`rit-${r.number}`}
              onClick={() => setOpen(open === i ? -1 : i)}
              onMouseEnter={() => setOpen(i)}
              className="jw-rit-head"
            >
              <span className="jw-rit-num">{r.number}</span>

              <span className="min-w-0 flex-1">
                <span className="jw-rit-name">{r.name}</span>
                <span className="jw-rit-meaning">{r.meaning}</span>
              </span>

              <Plus className="jw-rit-icon h-[18px] w-[18px]" aria-hidden />
            </button>

            <div
              id={`rit-${r.number}`}
              role="region"
              className="grid transition-[grid-template-rows] duration-[420ms]"
              style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                {/* On phones the sticky plate is far down the page, so the
                    photograph is repeated inside the open row where it is
                    actually being read. Hidden from lg up to avoid showing the
                    same image twice. */}
                <img
                  src={r.image}
                  alt={`${r.name}, ${r.meaning}`}
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={600}
                  className="jw-rit-inline lg:hidden"
                />
                <p className="jw-rit-body">{r.body}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RitualIndex;
