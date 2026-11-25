import { useEffect, useState } from "react";
import { useSiteContent } from "@/components/site/ContentProvider";

/**
 * The opening slideshow behind the hero. Real ceremony photographs cross-fade
 * as the site loads. The first image is the LCP element (eager, high priority);
 * the rest advance on a timer. Respects reduced-motion by holding the first
 * frame. A maroon scrim keeps the hero type readable over any photo.
 */
export function HeroSlideshow() {
  const { heroSlides } = useSiteContent();
  const slides = heroSlides?.length ? heroSlides : [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {slides.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt=""
          width={1600}
          height={900}
          loading={i === 0 ? "eager" : "lazy"}
          decoding={i === 0 ? "sync" : "async"}
          {...(i === 0 ? { fetchPriority: "high" as const } : {})}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: i === index ? 1 : 0,
            transition: "opacity 1200ms ease-in-out",
            transform: i === index ? "scale(1.06)" : "scale(1)",
            transitionProperty: "opacity, transform",
            transitionDuration: "1200ms, 6000ms",
            transitionTimingFunction: "ease-in-out, ease-out",
          }}
        />
      ))}

      {/* Scrim, so the type over it always reads */}
      <span
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(74,13,23,.93) 0%, rgba(74,13,23,.8) 42%, rgba(74,13,23,.52) 72%, rgba(74,13,23,.62) 100%)",
        }}
      />
    </div>
  );
}

export default HeroSlideshow;
