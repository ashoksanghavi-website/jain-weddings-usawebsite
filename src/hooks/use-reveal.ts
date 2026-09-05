import { useEffect, useRef, useState } from "react";

/**
 * Scroll-into-view trigger. Reveals when the element enters the viewport, via an
 * IntersectionObserver AND a capture scroll/resize listener (reliable on every
 * mobile browser, iOS included) AND an initial check for anything already on
 * screen. The hidden start state lives behind `html.js` in CSS, so without
 * JavaScript everything is simply visible — nothing can stay stuck. No blanket
 * timeout, so below-the-fold content genuinely animates in as you scroll to it.
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

    const cleanup = () => {
      io?.disconnect();
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("load", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };

    const finish = () => {
      if (done) return;
      done = true;
      setShown(true);
      cleanup();
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
    window.addEventListener("load", onScroll);

    // Reveal anything already on screen at mount.
    if (inView()) finish();

    // Cleanup only removes listeners — it must NOT reveal (that would fire under
    // React StrictMode's double-invoke and defeat the scroll trigger).
    return cleanup;
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
