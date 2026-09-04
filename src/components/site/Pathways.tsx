import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "@/components/site/ContentProvider";
import { GoldRule, Kicker, Reveal, Section, SplitHeading } from "@/components/site/primitives";

/**
 * Cross links at the foot of every page, so no page is a dead end. The page
 * you are already on is filtered out rather than shown and disabled.
 */
export function Pathways({ exclude }: { exclude?: string }) {
  const { pathways } = useSiteContent();
  const cards = pathways.cards.filter((c) => c.to !== exclude);

  return (
    <Section tone="paper">
      <div className="mx-auto max-w-2xl text-center">
        <Kicker>{pathways.heading}</Kicker>
        <div className="mt-5">
          <SplitHeading text={pathways.heading} level={2} />
        </div>
        <GoldRule className="mx-auto mt-6 max-w-[160px]" />
        <Reveal delay={0.1}>
          <p className="mt-6 text-[15.5px] leading-relaxed text-mist">{pathways.line}</p>
        </Reveal>
      </div>

      <ul className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-2">
        {cards.map((c, i) => (
          <Reveal as="li" key={c.to} delay={(i % 2) * 0.08} className="h-full">
            <Link to={c.to} className="jw-path">
              <span aria-hidden className="jw-path-edge" />
              <span className="font-[family-name:var(--font-util)] text-[10px] uppercase tracking-[0.22em] text-gold">
                {c.kicker}
              </span>
              <span className="jw-path-title">{c.title}</span>
              <span className="jw-path-body">{c.body}</span>
              <span className="jw-path-go">
                {c.cta}
                <ArrowRight size={13} aria-hidden />
              </span>
            </Link>
          </Reveal>
        ))}

        {/* The fourth cell. A live om rather than a fourth link, so the grid
            closes on a blessing instead of another door. */}
        <Reveal as="li" delay={0.18} className="h-full">
          <div className="jw-bless">
            <span aria-hidden className="jw-bless-glow" />
            <span aria-hidden className="jw-bless-ring" />
            <span lang="sa" aria-hidden className="jw-bless-om">
              ॐ
            </span>
            <p lang="sa" className="jw-bless-sa">
              {pathways.blessing.sa}
            </p>
            <p className="jw-bless-en">{pathways.blessing.en}</p>
            <p className="jw-bless-line">{pathways.blessing.line}</p>
            <Link to="/contact" className="jw-bless-cta">
              {pathways.blessing.cta}
              <ArrowRight size={13} aria-hidden />
            </Link>
          </div>
        </Reveal>
      </ul>
    </Section>
  );
}
