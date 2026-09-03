import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gallery, testimonials } from "@/data/site";

/**
 * Editorial testimonials: a large index numeral, the quote, the family, and a
 * rule selector beneath. Built from the supplied reference, translated into
 * this site's palette and type, and with the photograph kept because these are
 * real families rather than stock avatars.
 *
 * The cross fade is a timed opacity swap rather than a library transition, so
 * nothing is pulled in for it and it degrades to a plain change under reduced
 * motion.
 */
export function Voices() {
  const [active, setActive] = useState(0);
  const [out, setOut] = useState(false);
  const total = testimonials.length;
  /** Horizontal swipe, so the section works by thumb as well as by click. */
  const touch = useRef<{ x: number; y: number } | null>(null);

  const go = (next: number) => {
    if (next === active || out) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(next);
      return;
    }
    setOut(true);
    window.setTimeout(() => {
      setActive(next);
      window.setTimeout(() => setOut(false), 40);
    }, 280);
  };

  const prev = () => go(active === 0 ? total - 1 : active - 1);
  const next = () => go(active === total - 1 ? 0 : active + 1);

  const current = testimonials[active]!;
  const photo = gallery[active % gallery.length]!;

  const onDown = (e: ReactPointerEvent) => {
    touch.current = { x: e.clientX, y: e.clientY };
  };

  const onUp = (e: ReactPointerEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    // Ignore anything that is mostly a vertical scroll, or too small to mean it
    if (Math.abs(dx) < 46 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) next();
    else prev();
  };

  return (
    <div
      className="jw-ed"
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={() => {
        touch.current = null;
      }}
      style={{ touchAction: "pan-y" }}
    >
      <div className="jw-ed-top">
        <span aria-hidden className="jw-ed-index">
          {String(active + 1).padStart(2, "0")}
        </span>

        <div className="jw-ed-main">
          <blockquote className="jw-ed-quote" data-out={out}>
            {current.quote}
          </blockquote>

          <figure className="jw-ed-author" data-out={out}>
            <span className="jw-ed-avatar">
              <img
                src={photo.thumb}
                alt=""
                aria-hidden
                loading="lazy"
                decoding="async"
                width={96}
                height={96}
              />
            </span>
            <figcaption>
              <span className="jw-ed-name">{current.name}</span>
              <span className="jw-ed-role">A family served by Ashok</span>
            </figcaption>
          </figure>
        </div>
      </div>

      <div className="jw-ed-nav">
        <div className="jw-ed-rules">
          <div className="flex items-center gap-3">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                type="button"
                onClick={() => go(i)}
                className="jw-ed-rule-btn"
                aria-label={`Show the note from ${t.name}`}
                aria-current={i === active ? "true" : undefined}
              >
                <span className="jw-ed-rule" data-active={i === active} />
              </button>
            ))}
          </div>
          <span className="jw-ed-count">
            {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button type="button" onClick={prev} className="jw-ed-arrow" aria-label="Previous note">
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button type="button" onClick={next} className="jw-ed-arrow" aria-label="Next note">
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
