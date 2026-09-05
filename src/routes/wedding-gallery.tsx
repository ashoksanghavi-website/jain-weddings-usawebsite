import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  GoldRule,
  Kicker,
  Masthead,
  Reveal,
  Section,
  SplitHeading,
} from "@/components/site/primitives";
import Lightbox from "@/components/site/Lightbox";
import { PhotoCarousel } from "@/components/site/PhotoCarousel";
import { Occasions } from "@/components/site/Occasions";
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

function GalleryPage() {
  const { gallery, galleryPage } = useSiteContent();
  const [lightbox, setLightbox] = useState<number | null>(null);

  // The carousel opens centred on this photograph (falls back to the first).
  const frontIndex = Math.max(
    0,
    gallery.findIndex((g) => g.caption === "Traditions and customs"),
  );

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
        <PhotoCarousel
          photos={gallery.map((g) => ({ src: g.thumb, caption: g.caption }))}
          label="Wedding photographs"
          initialIndex={frontIndex}
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
