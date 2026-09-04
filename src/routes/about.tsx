import { createFileRoute } from "@tanstack/react-router";
import {
  Button,
  GoldRule,
  InlayImage,
  Kicker,
  Masthead,
  PullQuote,
  Reveal,
  Section,
  SplitHeading,
  StampFrame,
} from "@/components/site/primitives";
import { Pathways } from "@/components/site/Pathways";
import { useSiteContent } from "@/components/site/ContentProvider";
import { meta, images as seo } from "@/data/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: meta.about.title },
      { name: "description", content: meta.about.description },
      { property: "og:title", content: meta.about.title },
      { property: "og:description", content: meta.about.description },
      { property: "og:image", content: seo.aboutPortrait.src },
      { name: "twitter:image", content: seo.aboutPortrait.src },
    ],
  }),
  component: About,
});

function About() {
  const { about, images, site } = useSiteContent();
  return (
    <>
      <Masthead kicker={about.kicker} title={about.h1} line={about.line} crumb="About" />

      <Section tone="paper">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-5">
            <InlayImage
              src={images.aboutPortrait.src}
              alt={images.aboutPortrait.alt}
              width={800}
              height={1000}
              curtain
              className="aspect-[4/5]"
            />
            <StampFrame tone="card" hairline>
              <img
                src={images.certificate.src}
                alt={images.certificate.alt}
                width={600}
                height={800}
                loading="lazy"
                decoding="async"
                className="w-full p-5"
              />
            </StampFrame>
          </div>

          <div className="lg:col-span-7">
            {about.paragraphs.map((p, i) => (
              <Reveal key={p} delay={0.06 * i}>
                <p className="prose-measure mt-6 first:mt-0 text-ink/90">{p}</p>
              </Reveal>
            ))}
            <PullQuote>{about.quote}</PullQuote>
          </div>
        </div>
      </Section>

      {/* In short: the facts, before the mission */}
      <Section tone="tint">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Kicker>{about.factsHeading}</Kicker>
            <div className="mt-5">
              <SplitHeading text={about.factsHeading} level={2} />
            </div>
            <GoldRule className="mt-7 max-w-[130px]" />
            <Reveal delay={0.1}>
              <p className="mt-7 border-l-2 border-kumkum pl-5 text-[15px] leading-relaxed text-mist">
                {about.notBusiness}
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <dl className="grid gap-x-12 sm:grid-cols-2">
              {about.facts.map((f, i) => (
                <Reveal key={f.k} delay={(i % 2) * 0.06}>
                  <div className="jw-fact">
                    <dt className="font-[family-name:var(--font-util)] text-[10px] uppercase tracking-[0.22em] text-gold">
                      {f.k}
                    </dt>
                    <dd className="mt-2 text-[16px] leading-snug">{f.v}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      {/* Mission, rebuilt around three pillars */}
      <section className="relative isolate overflow-hidden bg-maroon">
        <img
          src={images.aboutMission.src}
          alt=""
          aria-hidden
          width={1200}
          height={800}
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-[0.1]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-4 inset-y-4 border border-gold2/22 lg:inset-x-10 lg:inset-y-8"
        />

        <div className="container-site relative py-18 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Kicker tone="gold2">{about.mission.kicker}</Kicker>
            <div className="mt-5">
              <SplitHeading
                text={about.mission.h2}
                level={2}
                className="pb-1 leading-[1.14] text-paper"
              />
            </div>
            <div className="mx-auto mt-8 flex items-center justify-center gap-4">
              <span aria-hidden className="h-px w-12 bg-gold2/45" />
              <span aria-hidden className="block h-[7px] w-[7px] rotate-45 bg-gold2" />
              <span aria-hidden className="h-px w-12 bg-gold2/45" />
            </div>
            <Reveal delay={0.1}>
              <p className="mt-8 font-[family-name:var(--font-display)] text-[24px] italic leading-snug text-gold2">
                {about.mission.lead}
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="prose-measure mx-auto mt-7 text-[16.5px] leading-relaxed text-paper/85">
                {about.mission.body}
              </p>
            </Reveal>
          </div>

          <ul className="mt-16 grid gap-6 lg:grid-cols-3">
            {about.mission.pillars.map((p, i) => (
              <Reveal as="li" key={p.num} delay={i * 0.09} className="h-full">
                <div className="jw-pillar">
                  <span aria-hidden className="jw-pillar-edge" />
                  <span className="jw-pillar-num">{p.num}</span>
                  <h3 className="jw-pillar-title">{p.title}</h3>
                  <p className="jw-pillar-body">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
            <Button to="/contact">Send your wedding date</Button>
            <Button href={site.phoneHref} variant="onMaroon">
              {site.phone}
            </Button>
          </div>
        </div>
      </section>

      <Pathways exclude="/about" />
    </>
  );
}
