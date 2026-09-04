import { createFileRoute } from "@tanstack/react-router";
import {
  GoldRule,
  InlayImage,
  Kicker,
  Masthead,
  PullQuote,
  Reveal,
  Section,
  SplitHeading,
} from "@/components/site/primitives";
import { PoojanGrid } from "@/components/site/PoojanGrid";
import { Pathways } from "@/components/site/Pathways";
import { useSiteContent } from "@/components/site/ContentProvider";
import { meta, images as seo } from "@/data/site";

export const Route = createFileRoute("/other-services")({
  head: () => ({
    meta: [
      { title: meta.services.title },
      { name: "description", content: meta.services.description },
      { property: "og:title", content: meta.services.title },
      { property: "og:description", content: meta.services.description },
      { property: "og:image", content: seo.ganesh.src },
      { name: "twitter:image", content: seo.ganesh.src },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { images, servicesPage } = useSiteContent();
  return (
    <>
      <Masthead
        kicker={servicesPage.kicker}
        title={servicesPage.h1}
        line={servicesPage.line}
        crumb="Other Services"
      />

      <Section tone="paper">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <InlayImage
              src={images.ganesh.src}
              alt={images.ganesh.alt}
              width={800}
              height={1000}
              curtain
              className="aspect-[4/5]"
            />
          </div>
          <div className="lg:col-span-7">
            {servicesPage.paragraphs.map((p, i) => (
              <Reveal key={p} delay={0.06 * i}>
                <p className="prose-measure mt-6 first:mt-0 text-ink/90">{p}</p>
              </Reveal>
            ))}
            <PullQuote>{servicesPage.quote}</PullQuote>
            {servicesPage.afterQuote.map((p, i) => (
              <Reveal key={p} delay={0.06 * i}>
                <p className="prose-measure mt-6 text-ink/90">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="tint">
        <div className="mx-auto max-w-2xl text-center">
          <Kicker>{servicesPage.listHeading}</Kicker>
          <div className="mt-5">
            <SplitHeading text={servicesPage.listHeading} level={2} />
          </div>
          <GoldRule className="mx-auto mt-6 max-w-[160px]" />
          <Reveal delay={0.1}>
            <p className="mt-6 text-[15.5px] leading-relaxed text-mist">{servicesPage.listLine}</p>
          </Reveal>
        </div>

        <div className="mt-14">
          <PoojanGrid />
        </div>
      </Section>

      <Pathways exclude="/other-services" />
    </>
  );
}
