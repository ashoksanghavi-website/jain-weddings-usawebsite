import { Reveal } from "@/components/site/primitives";
import type { GalleryVideo } from "@/data/site";

/**
 * The gallery's films — six ceremony clips shown as two rows of three on
 * desktop, two-up on tablet and stacked on phones. Each loads only its poster
 * until played (preload="metadata"), and playsInline keeps iOS from forcing
 * fullscreen, so a whole grid of videos stays light and reliable on mobile.
 */
export function VideoGallery({
  videos,
  label = "Films",
}: {
  videos: GalleryVideo[];
  label?: string;
}) {
  return (
    <div
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      role="group"
      aria-label={label}
    >
      {videos.map((v, i) => (
        <Reveal as="article" key={v.src} delay={(i % 3) * 0.07} className="h-full">
          <figure className="h-full">
            <div className="overflow-hidden rounded-xl border border-gold/40 bg-card p-[1.5px] shadow-[0_18px_40px_rgba(74,13,23,0.18)]">
              <video
                src={v.src}
                poster={v.poster}
                controls
                preload="metadata"
                playsInline
                aria-label={v.caption}
                className="aspect-video w-full rounded-[10px] bg-maroon2 object-cover"
              />
            </div>
            {v.caption ? (
              <figcaption className="mt-3 text-center font-[family-name:var(--font-display)] text-[15px] italic text-ink/80">
                {v.caption}
              </figcaption>
            ) : null}
          </figure>
        </Reveal>
      ))}
    </div>
  );
}

export default VideoGallery;
