import { createFileRoute } from "@tanstack/react-router";
import {
  Button,
  GoldRule,
  Kicker,
  Masthead,
  Reveal,
  Section,
  SplitHeading,
} from "@/components/site/primitives";
import { Pathways } from "@/components/site/Pathways";
import RitualIndex from "@/components/site/RitualIndex";
import { useSiteContent } from "@/components/site/ContentProvider";
import { meta, rituals as seoRituals } from "@/data/site";

export const Route = createFileRoute("/wedding-rituals")({
  head: () => ({
    meta: [
      { title: meta.rituals.title },
      { name: "description", content: meta.rituals.description },
      { property: "og:title", content: meta.rituals.title },
      { property: "og:description", content: meta.rituals.description },
      { property: "og:image", content: seoRituals[7]?.image ?? "" },
      { name: "twitter:image", content: seoRituals[7]?.image ?? "" },
    ],
  }),
  component: RitualsPage,
});

function RitualsPage() {
  const { rituals, ritualsPage, site } = useSiteContent();
  return (
    <>
      <Masthead
        kicker={ritualsPage.kicker}
        title={ritualsPage.h1}
        line={ritualsPage.line}
        crumb="Wedding Rituals"
      />

      <Section tone="paper">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-[18px] leading-[1.85] text-ink/88">{ritualsPage.opening}</p>
          </Reveal>
          <GoldRule className="mx-auto mt-9 max-w-[160px]" />
        </div>

        <div className="mt-16">
          <div className="mb-12 max-w-2xl">
            <Kicker>{ritualsPage.indexHeading}</Kicker>
            <div className="mt-5">
              <SplitHeading text={ritualsPage.indexHeading} level={2} />
            </div>
            <Reveal delay={0.1}>
              <p className="mt-5 text-[15.5px] text-mist">{ritualsPage.indexLine}</p>
            </Reveal>
          </div>
          <RitualIndex items={rituals} />
        </div>
      </Section>

      <section className="relative isolate overflow-hidden bg-maroon">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-4 inset-y-4 border border-gold2/22 lg:inset-x-10 lg:inset-y-8"
        />
        <div className="container-site relative py-18 text-center lg:py-22">
          <Kicker tone="gold2">{ritualsPage.panel.kicker}</Kicker>
          <div className="mx-auto mt-5 max-w-4xl">
            <SplitHeading
              text={ritualsPage.panel.h2}
              level={2}
              className="pb-1 leading-[1.14] text-paper"
            />
          </div>
          <div className="mx-auto mt-8 flex items-center justify-center gap-4">
            <span aria-hidden className="h-px w-12 bg-gold2/45" />
            <span aria-hidden className="block h-[7px] w-[7px] rotate-45 bg-gold2" />
            <span aria-hidden className="h-px w-12 bg-gold2/45" />
          </div>
          <p className="prose-measure mx-auto mt-8 text-[16.5px] leading-relaxed text-paper/85">
            {ritualsPage.panel.body}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button to="/contact">Send your wedding date</Button>
            <Button href={site.phoneHref} variant="onMaroon">
              {site.phone}
            </Button>
          </div>
        </div>
      </section>

      <Pathways exclude="/wedding-rituals" />
    </>
  );
}
