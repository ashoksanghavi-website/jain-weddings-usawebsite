import { useState } from "react";
import { MapPin, Sun } from "lucide-react";
import { useSiteContent } from "@/components/site/ContentProvider";
import { GoldRule, Kicker, Reveal, SplitHeading } from "@/components/site/primitives";

/**
 * Five ceremonies, picked from a rail of names. The photograph and the note
 * swap together, so the chips are a control rather than decoration.
 */
export function Occasions() {
  const { galleryPage } = useSiteContent();
  const [i, setI] = useState(0);
  const active = galleryPage.occasions[i]!;

  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <Kicker>{galleryPage.occasionsHeading}</Kicker>
        <div className="mt-5">
          <SplitHeading text={galleryPage.occasionsHeading} level={2} />
        </div>
        <GoldRule className="mx-auto mt-6 max-w-[160px]" />
        <Reveal delay={0.1}>
          <p className="mt-6 text-[15.5px] leading-relaxed text-mist">
            {galleryPage.occasionsLine}
          </p>
        </Reveal>
      </div>

      <ul className="mt-12 flex flex-wrap justify-center gap-3">
        {galleryPage.occasions.map((o, n) => (
          <li key={o.couple}>
            <button
              type="button"
              onClick={() => setI(n)}
              className="jw-occ-chip"
              data-active={n === i}
            >
              <span aria-hidden className="jw-occ-diamond" />
              {o.couple}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-12 grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <div className="jw-occ-frame">
            {galleryPage.occasions.map((o, n) => (
              <img
                key={o.couple}
                src={o.image}
                alt={`${o.couple}, ${o.place}`}
                loading="lazy"
                decoding="async"
                width={900}
                height={640}
                data-active={n === i}
                className="jw-occ-img"
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-6">
          <p className="font-[family-name:var(--font-util)] text-[10px] uppercase tracking-[0.24em] text-gold">
            {String(i + 1).padStart(2, "0")} of{" "}
            {String(galleryPage.occasions.length).padStart(2, "0")}
          </p>

          <h3 key={active.couple} className="jw-occ-name">
            {active.couple}
          </h3>

          <dl className="mt-6 flex flex-wrap gap-x-9 gap-y-3">
            <div className="flex items-center gap-2.5">
              <MapPin size={14} aria-hidden className="text-kumkum" />
              <dt className="sr-only">Where</dt>
              <dd className="font-[family-name:var(--font-util)] text-[12px] uppercase tracking-[0.14em] text-mist">
                {active.place}
              </dd>
            </div>
            <div className="flex items-center gap-2.5">
              <Sun size={14} aria-hidden className="text-kumkum" />
              <dt className="sr-only">Season</dt>
              <dd className="font-[family-name:var(--font-util)] text-[12px] uppercase tracking-[0.14em] text-mist">
                {active.season}
              </dd>
            </div>
          </dl>

          <GoldRule className="mt-7 max-w-[130px]" />

          <p key={`${active.couple}-note`} className="jw-occ-note">
            {active.note}
          </p>
        </div>
      </div>
    </>
  );
}
