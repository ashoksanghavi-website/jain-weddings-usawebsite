import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import {
  ArrowLink,
  InlayImage,
  Button,
  GoldRule,
  Kicker,
  PullQuote,
  Reveal,
  Section,
  SplitHeading,
  StampFrame,
} from "@/components/site/primitives";
import RitualIndex from "@/components/site/RitualIndex";
import ImageStreamHero from "@/components/ui/image-stream-hero";
import { Voices } from "@/components/site/Voices";
import { CeremonyEnquiry } from "@/components/site/CeremonyEnquiry";
import { Pathways } from "@/components/site/Pathways";
import { meta, images as seo } from "@/data/site";
import { useSiteContent } from "@/components/site/ContentProvider";
import { HeroVideo } from "@/components/site/HeroVideo";
import { Phone } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: meta.home.title },
      { name: "description", content: meta.home.description },
      { property: "og:title", content: meta.home.title },
      { property: "og:description", content: meta.home.description },
      { property: "og:image", content: seo.hero.src },
      { name: "twitter:image", content: seo.hero.src },
    ],
  }),
  component: Home,
});

function Hero() {
  const { home, site } = useSiteContent();
  const sideA = useRef<HTMLDivElement | null>(null);
  const sideB = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    if (!mq.matches) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        if (sideA.current) sideA.current.style.transform = `translateY(${y * 0.05}px)`;
        if (sideB.current) sideB.current.style.transform = `translateY(${y * -0.04}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative isolate flex min-h-[560px] items-end overflow-hidden bg-maroon2 lg:min-h-[600px]">
      <HeroVideo />

      {/* the printed border of an invitation, over the footage */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-4 inset-y-4 border border-gold2/25 lg:inset-x-10 lg:inset-y-8"
      />

      <div className="container-site relative w-full pb-10 pt-[132px] lg:pb-12 lg:pt-[140px]">
        <div className="max-w-4xl">
          <Kicker tone="gold2">{home.kicker}</Kicker>

          <h1
            className="mt-5 pb-1 leading-[1.04] text-paper"
            aria-label={`${home.h1a} ${home.h1b}`}
          >
            <span className="block">{home.h1a}</span>
            <span className="block italic text-gold2">{home.h1b}</span>
          </h1>

          <div className="mt-5 flex items-center gap-4">
            <span aria-hidden className="h-px w-14 bg-gold2/50" />
            <span aria-hidden className="block h-[7px] w-[7px] rotate-45 bg-gold2" />
          </div>

          <p className="prose-measure mt-5 text-[16px] leading-[1.7] text-paper/88">{home.intro}</p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Button to="/contact">{home.primaryCta}</Button>
            <a href={site.phoneHref} className="jw-hero-call">
              <Phone size={15} aria-hidden />
              {site.phone}
            </a>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3">
            <ArrowLink to="/wedding-rituals" tone="paper">
              {home.arrowCta}
            </ArrowLink>
            <ArrowLink to="/wedding-gallery" tone="paper">
              {home.heroSecondary}
            </ArrowLink>
          </div>
        </div>

        <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2.5 border-t border-gold2/25 pt-5 font-util text-[11px] uppercase tracking-[0.18em] text-paper/70">
          {home.facts.map((fact, i) => (
            <li key={fact} className="flex items-center gap-5">
              {i > 0 ? <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-gold2" /> : null}
              {fact}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Home() {
  const { gallery, home, images, rituals, site, testimonials } = useSiteContent();
  const c = home.celebration;

  return (
    <>
      <Hero />

      <Section tone="paper">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <InlayImage
              src={images.celebration.src}
              alt={images.celebration.alt}
              width={800}
              height={1000}
              curtain
              className="aspect-[4/5]"
            />
          </div>
          <div className="lg:col-span-7">
            <Kicker>{c.kicker}</Kicker>
            <SplitHeading text={c.h2} className="mt-5 text-ink" />
            {c.paragraphs.map((p, i) => (
              <Reveal key={p} delay={0.1 + i * 0.05}>
                <p className="prose-measure mt-6 text-ink/90">{p}</p>
              </Reveal>
            ))}
            <PullQuote>{c.quote}</PullQuote>
            <ArrowLink to="/wedding-rituals">{c.arrow}</ArrowLink>
          </div>
        </div>
      </Section>

      {home.ceremonies.map((row, i) => (
        <Section key={row.number} tone={i === 1 ? "tint" : "paper"}>
          <div
            className={`grid items-center gap-14 lg:grid-cols-12 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
          >
            <div className="lg:col-span-5">
              <InlayImage
                src={row.image.src}
                alt={row.image.alt}
                width={800}
                height={1000}
                className="aspect-[4/5]"
              />
            </div>
            <div className="lg:col-span-7">
              <Kicker>{row.number}</Kicker>
              <SplitHeading text={row.title} className="mt-4 text-ink" />
              {row.verse.length ? (
                <StampFrame tone="card" hairline className="mt-7">
                  <div className="space-y-2 p-8">
                    {row.verse.map((line) => (
                      <p key={line} className="text-[1.05rem] italic leading-9 text-ink/90">
                        {line}
                      </p>
                    ))}
                  </div>
                </StampFrame>
              ) : null}
              {row.body.map((p) => (
                <Reveal key={p} delay={0.1}>
                  <p className="prose-measure mt-6 text-ink/90">{p}</p>
                </Reveal>
              ))}
              <Reveal delay={0.16}>
                <div className="mt-8">
                  <CeremonyEnquiry number={row.number} title={row.title} />
                </div>
              </Reveal>
            </div>
          </div>
        </Section>
      ))}

      <Section tone="paper">
        <div className="mb-12 max-w-2xl">
          <Kicker>Rituals, traditions and customs</Kicker>
          <SplitHeading text="The ceremony, ritual by ritual" className="mt-5 text-ink" />
          <Reveal delay={0.1}>
            <p className="prose-measure mt-5 text-[15.5px] text-mist">
              The first six rites, in the order they are conducted. Open any one to read what it is
              actually asking for.
            </p>
          </Reveal>
        </div>
        <RitualIndex items={rituals.slice(0, 6)} />
        <div className="mt-10">
          <ArrowLink to="/wedding-rituals">{home.ritualsArrow}</ArrowLink>
        </div>
      </Section>

      {/* The Vidhikar. The portrait is a studio cutout on a flat backdrop, so it
          is set inside a printed card rather than bled to the edge, and the
          crop is pulled to the top so the face is never cut. */}
      <Section tone="tint">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Kicker>{home.vidhikar.kicker}</Kicker>
            <SplitHeading text={home.vidhikar.h2} className="mt-5 text-ink" />
            <GoldRule className="mt-7 max-w-[140px]" />
            {home.vidhikar.paragraphs.map((p, i) => (
              <Reveal key={p} delay={0.1 + i * 0.04}>
                <p className="prose-measure mt-6 text-ink/90">{p}</p>
              </Reveal>
            ))}

            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-wrap items-end justify-between gap-8 border-t border-gold/30 pt-8">
                <div>
                  <p className="font-display text-[28px] italic text-ink">
                    {home.vidhikar.signature}
                  </p>
                  <Kicker className="mt-2">{home.vidhikar.signatureRole}</Kicker>
                </div>
                <ArrowLink to="/about">More about Ashok</ArrowLink>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <div className="jw-vidh">
              <span aria-hidden className="jw-vidh-edge" />
              <div className="jw-vidh-plate">
                <img
                  src={images.vidhikar.src}
                  alt={images.vidhikar.alt}
                  width={800}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p lang="sa" aria-hidden className="jw-vidh-om">
                ॐ
              </p>
              <p className="jw-vidh-cap">{site.location}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* The blessing ribbon. Ink rather than maroon so it reads as a rule
          between sections, with a single om held behind it. */}
      <div aria-hidden className="jw-ribbon">
        <span lang="sa" className="jw-ribbon-om">
          ॐ
        </span>
        <span className="jw-ribbon-fade jw-ribbon-fade-l" />
        <span className="jw-ribbon-fade jw-ribbon-fade-r" />

        <div className="group relative flex h-[92px] items-center">
          <div className="marquee-track flex shrink-0 items-center gap-10 whitespace-nowrap pr-10 group-hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center gap-10">
                {home.marquee.map((word) => (
                  <span key={`${copy}-${word}`} className="flex items-center gap-10">
                    <span className="jw-ribbon-word">{word}</span>
                    <span className="jw-ribbon-dot" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="relative bg-paper py-16">
        <ImageStreamHero
          images={gallery.map((g) => ({ src: g.thumb, alt: "" }))}
          cards={9}
          speed={30}
          axis={52}
          path={{ cardRadius: 0.9, exitHeight: 42, turnExit: 24 }}
          className="h-[480px] w-full bg-paper max-md:h-[360px]"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[120px] bg-gradient-to-b from-paper to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[120px] bg-gradient-to-t from-paper to-transparent" />
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <p className="max-w-[22ch] rounded-full px-10 py-8 text-center font-display text-[32px] italic text-ink [background:radial-gradient(closest-side,var(--color-paper)_60%,transparent)]">
              {home.corridorLine}
            </p>
          </div>
        </ImageStreamHero>
        <div className="container-site mt-10">
          <ArrowLink to="/wedding-gallery">{home.corridorArrow}</ArrowLink>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-maroon">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-4 inset-y-4 border border-gold2/20 lg:inset-x-10 lg:inset-y-8"
        />
        <div className="container-site relative py-10 lg:py-12">
          <div className="mx-auto max-w-2xl text-center">
            <Kicker tone="gold2">In their words</Kicker>
            <div className="mt-5">
              <SplitHeading
                text="Blessings that families remember"
                level={2}
                className="pb-1 leading-[1.14] text-paper"
              />
            </div>
            <div className="mx-auto mt-5 flex items-center justify-center gap-4">
              <span aria-hidden className="h-px w-12 bg-gold2/45" />
              <span aria-hidden className="block h-[7px] w-[7px] rotate-45 bg-gold2" />
              <span aria-hidden className="h-px w-12 bg-gold2/45" />
            </div>
            <p className="prose-measure mx-auto mt-5 text-[15px] leading-relaxed text-paper/80">
              Every one of these was written by a family after their ceremony. The photographs
              beside them were shared by those same families.
            </p>
          </div>

          <div className="mt-8">
            <Voices />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button to="/contact">Send your wedding date</Button>
            <Button href={site.phoneHref} variant="onMaroon">
              {site.phone}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
