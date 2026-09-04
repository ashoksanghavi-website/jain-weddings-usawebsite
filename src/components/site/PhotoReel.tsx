import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ReelPhoto {
  src: string;
  alt: string;
  caption?: string;
}

/**
 * A photo reel built on native horizontal scroll-snap. No pointer-drag, no
 * width measurement, no 3D transforms — the browser does the scrolling, so it
 * works reliably on every touch device (this replaced a JS coverflow that
 * stalled on iOS Safari). Swipe to scroll, tap a photo to open it; arrows and
 * dots ride on the same native scroll. All positioning uses
 * getBoundingClientRect so padding/snap can never throw the math off.
 */
export function PhotoReel({
  photos,
  onOpen,
  label = "Photographs",
}: {
  photos: ReelPhoto[];
  onOpen?: (index: number) => void;
  label?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  const setActiveBoth = useCallback((i: number) => {
    activeRef.current = i;
    setActive(i);
  }, []);

  const nearestIndex = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return 0;
    const mid = el.getBoundingClientRect().left + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    itemRefs.current.forEach((item, i) => {
      if (!item) return;
      const r = item.getBoundingClientRect();
      const c = r.left + r.width / 2;
      const d = Math.abs(c - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  }, []);

  const onScroll = useCallback(() => {
    const next = nearestIndex();
    if (next !== activeRef.current) setActiveBoth(next);
  }, [nearestIndex, setActiveBoth]);

  useEffect(() => {
    setActiveBoth(nearestIndex());
  }, [nearestIndex, setActiveBoth]);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollerRef.current;
    const item = itemRefs.current[index];
    if (!el || !item) return;
    const elRect = el.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    // Smooth + scroll-snap:mandatory fight each other, so move instantly; the
    // snap then settles cleanly on the card.
    el.scrollLeft += itemRect.left + itemRect.width / 2 - (elRect.left + elRect.width / 2);
  }, []);

  const step = (dir: -1 | 1) => {
    const next = Math.max(0, Math.min(photos.length - 1, activeRef.current + dir));
    setActiveBoth(next);
    scrollToIndex(next);
  };

  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label={label}>
      <div ref={scrollerRef} className="jw-reel" onScroll={onScroll} tabIndex={0}>
        {photos.map((p, i) => (
          <button
            key={`${p.src}-${i}`}
            type="button"
            ref={(node) => {
              itemRefs.current[i] = node;
            }}
            onClick={() => onOpen?.(i)}
            className="jw-reel-item"
            aria-label={p.caption ? `Open ${p.caption}` : `Open photograph ${i + 1}`}
          >
            <img
              src={p.src}
              alt={p.alt}
              loading={i < 2 ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
              className="jw-reel-img"
            />
          </button>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous photograph"
        onClick={() => step(-1)}
        className="jw-cf-arrow left-2 sm:left-4"
      >
        <ChevronLeft className="size-5" aria-hidden />
      </button>
      <button
        type="button"
        aria-label="Next photograph"
        onClick={() => step(1)}
        className="jw-cf-arrow right-2 sm:right-4"
      >
        <ChevronRight className="size-5" aria-hidden />
      </button>

      {photos[active]?.caption ? (
        <p key={active} className="jw-cf-caption">
          <span className="jw-cf-title">{photos[active]!.caption}</span>
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
        {photos.map((p, i) => (
          <button
            key={`dot-${p.src}-${i}`}
            type="button"
            aria-label={`Go to photograph ${i + 1}`}
            aria-current={i === active}
            onClick={() => {
              setActiveBoth(i);
              scrollToIndex(i);
            }}
            className="jw-cf-dot"
            data-active={i === active}
          />
        ))}
      </div>
    </div>
  );
}

export default PhotoReel;
