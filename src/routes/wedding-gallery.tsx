import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play } from "lucide-react";
import {
  GoldRule,
  Kicker,
  Masthead,
  Reveal,
  Section,
  SplitHeading,
} from "@/components/site/primitives";
import Lightbox from "@/components/site/Lightbox";
import { PhotoReel } from "@/components/site/PhotoReel";
import { Occasions } from "@/components/site/Occasions";
import { useMediaQuery } from "@/hooks/use-reveal";
import { useSiteContent } from "@/components/site/ContentProvider";
import { meta, gallery as seoGallery } from "@/data/site";

export const Route = createFileRoute("/wedding-gallery")({
  head: () => ({
    meta: [
      { title: meta.gallery.title },
      { name: "description", content: meta.gallery.description },
      { property: "og:title", content: meta.gallery.title },
      { property: "og:description", content: meta.gallery.description },
      { property: "og:image", content: seoGallery[0]?.full ?? "" },
      { name: "twitter:image", content: seoGallery[0]?.full ?? "" },
    ],
  }),
  component: GalleryPage,
});

function FilmFacade({ src, title, poster }: { src: string; title: string; poster: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <video
        src={src}
        controls
        autoPlay
        className="aspect-video w-full border border-gold/40 bg-maroon2"
      >
        <track kind="captions" />
      </video>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play the film, ${title}`}
      className="group relative block aspect-video w-full overflow-hidden border border-gold/40"
    >
      <img
        src={poster}
        alt=""
        width={800}
        height={450}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
      <span className="absolute inset-0 grid place-items-center bg-maroon2/45 transition-colors group-hover:bg-maroon2/60">
        <span className="grid h-16 w-16 place-items-center rounded-full border border-gold2/60 bg-maroon/70">
          <Play className="h-6 w-6 text-paper" aria-hidden />
        </span>
      </span>
      <span className="absolute bottom-0 left-0 right-0 bg-maroon/85 p-3 font-util text-[11px] uppercase tracking-[0.22em] text-gold2">
        {title}
      </span>
    </button>
  );
}

function GalleryPage() {
  const { films, gallery, galleryPage } = useSiteContent();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const compact = useMediaQuery("(max-width: 767px), (prefers-reduced-motion: reduce)");

  return (
    <>
      <Masthead
        kicker={galleryPage.kicker}
        title={galleryPage.h1}
        line={galleryPage.line}
        crumb="Wedding Gallery"
      />

      {/* Swipe the reel, tap a photograph to open it full size. Native
          scroll-snap so it works on every touch device. */}
      <Section tone="paper">
        <PhotoReel
          photos={gallery.map((g) => ({ src: g.thumb, alt: g.caption, caption: g.caption }))}
          label="Wedding photographs"
          onOpen={(n) => setLightbox(n)}
        />
        <Reveal delay={0.1}>
          <p className="mx-auto mt-2 max-w-md text-center font-[family-name:var(--font-util)] text-[10.5px] uppercase tracking-[0.22em] text-mist">
            {galleryPage.dragHint}
          </p>
        </Reveal>
      </Section>

      <Section tone="tint">
        <div className="mx-auto max-w-2xl text-center">
          <Kicker>CAPTURING THE MOMENT</Kicker>
          <div className="mt-5">
            <SplitHeading text={galleryPage.mosaicHeading} level={2} />
          </div>
          <GoldRule className="mx-auto mt-6 max-w-[160px]" />
          <Reveal delay={0.1}>
            <p className="mt-6 text-[15.5px] leading-relaxed text-mist">{galleryPage.mosaicLine}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {gallery.map((g, i) => (
            <Reveal key={g.full} delay={(i % 4) * 0.06}>
              <button type="button" onClick={() => setLightbox(i)} className="jw-tile">
                <img
                  src={g.thumb}
                  alt={g.caption}
                  width={400}
                  height={284}
                  loading="lazy"
                  decoding="async"
                />
                <span className="jw-tile-cap">{g.caption}</span>
              </button>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="paper">
        <Occasions />
      </Section>

      <Section tone="tint">
        <div className="mx-auto max-w-2xl text-center">
          <Kicker>FILMS</Kicker>
          <div className="mt-5">
            <SplitHeading text={galleryPage.filmsHeading} level={2} />
          </div>
          <GoldRule className="mx-auto mt-6 max-w-[160px]" />
          <Reveal delay={0.1}>
            <p className="mt-6 text-[15.5px] leading-relaxed text-mist">{galleryPage.filmsLine}</p>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {films.map((f, i) => (
            <FilmFacade
              key={f.src}
              src={f.src}
              title={f.title}
              poster={gallery[i + 4]?.thumb ?? gallery[0]!.thumb}
            />
          ))}
        </div>
      </Section>

      {lightbox !== null ? (
        <Lightbox
          items={gallery}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onMove={(n) => setLightbox(n)}
        />
      ) : null}
    </>
  );
}
