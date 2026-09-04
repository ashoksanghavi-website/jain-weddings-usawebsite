import { useEffect, useRef, useState } from "react";

/**
 * Entrance trigger. Deliberately fail-open: it reveals on first sight via an
 * IntersectionObserver, but ALSO via an initial check and a scroll/resize
 * listener (reliable on every mobile browser), and finally a safety timeout —
 * so content and images can never stay hidden if the observer misbehaves, which
 * is exactly what was leaving the reveal "curtains" stuck on iOS Safari.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      setShown(true);
      return;
    }

    let done = false;
    let io: IntersectionObserver | undefined;
    let raf = 0;
    let timer = 0;

    const finish = () => {
      if (done) return;
      done = true;
      setShown(true);
      io?.disconnect();
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };

    const inView = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return r.top < vh * 0.92 && r.bottom > 0;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (inView()) finish();
      });
    };

    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) finish();
        },
        { threshold: 0.01, rootMargin: "0px 0px -8% 0px" },
      );
      io.observe(el);
    }

    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll);

    // Reveal anything already on screen at mount, and never let it stick.
    if (inView()) finish();
    timer = window.setTimeout(finish, 4000);

    return finish;
  }, []);

  return { ref, shown };
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}
