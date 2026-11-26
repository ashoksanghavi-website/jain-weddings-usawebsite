import { useEffect, useState } from "react";
import { useSiteContent } from "@/components/site/ContentProvider";

/**
 * The opening slideshow behind the hero. Real ceremony photographs cross-fade
 * as the site loads.
 *
 * Every slide loads eagerly: a lazy slide stays blank until the fade reaches it,
 * which on phones left the hero showing only the dark background ("the slider
 * isn't working"). The cross-fade runs even under reduced-motion (opacity is not
 * vestibular motion) so the slideshow always advances; only the slow zoom is
 * dropped there. A light, bottom-and-left scrim keeps the type readable while
 * letting the colour of the photographs through.
 */
export function HeroSlideshow() {
  const { heroSlides } = useSiteContent();
  const slides = heroSlides?.length ? heroSlides : [];
  const [index, setIndex] = useState(0);
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    setMotion(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-maroon2">
      {slides.map((s, i) => {
        const active = i === index;
        return (
          <img
            key={s.src}
            src={s.src}
            alt=""
            width={1600}
            height={900}
            loading="eager"
            decoding={i === 0 ? "sync" : "async"}
            {...(i === 0 ? { fetchPriority: "high" as const } : {})}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              opacity: active ? 1 : 0,
              transform: active && motion ? "scale(1.06)" : "scale(1)",
              transition: motion
                ? "opacity 1200ms ease-in-out, transform 6000ms ease-out"
                : "opacity 1200ms ease-in-out",
            }}
          />
        );
      })}

      {/* Lighter scrim: darker only along the bottom and left (where the type
          sits), so the photographs stay vibrant up top and to the right. */}
      <span
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(74,13,23,0.90) 0%, rgba(74,13,23,0.55) 20%, rgba(74,13,23,0.12) 46%, rgba(74,13,23,0) 68%), linear-gradient(90deg, rgba(74,13,23,0.62) 0%, rgba(74,13,23,0.28) 40%, rgba(74,13,23,0) 72%)",
        }}
      />
    </div>
  );
}

export default HeroSlideshow;
