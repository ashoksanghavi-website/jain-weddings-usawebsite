import { useEffect, useRef, useState } from "react";
import { useSiteContent } from "@/components/site/ContentProvider";

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

/**
 * Full bleed ceremony footage behind the hero.
 *
 * The still is the LCP element and is never removed. The video fades in over
 * it only once it is genuinely playing, so the two are never visible at once.
 *
 * iOS only autoplays a video that is really muted and inline, and React does
 * not reliably reflect the muted prop onto the DOM node, so those are set
 * imperatively before play is attempted and the rejection is swallowed.
 */
export function HeroVideo() {
  const { heroVideo } = useSiteContent();
  const [mount, setMount] = useState(false);
  const [live, setLive] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && conn.effectiveType !== "4g") return;

    let timer = 0;
    const arm = () => {
      timer = window.setTimeout(() => setMount(true), 600);
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", arm);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!mount || !el) return;
    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;

    const go = () => {
      const p = el.play();
      if (p && typeof p.catch === "function") p.catch(() => undefined);
    };
    go();
    el.addEventListener("loadeddata", go);
    const onVisible = () => {
      if (document.visibilityState === "visible" && el.paused) go();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      el.removeEventListener("loadeddata", go);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [mount]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <img
        src={heroVideo.poster}
        alt=""
        width={1600}
        height={900}
        fetchPriority="high"
        decoding="sync"
        className="h-full w-full object-cover"
        style={{
          opacity: live ? 0 : 1,
          transition: "opacity 900ms ease-out",
          animation: "jw-hero-scale 2s cubic-bezier(0.22,1,0.36,1) both",
        }}
      />
      {mount && heroVideo.mp4 ? (
        <video
          ref={ref}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
          disablePictureInPicture
          onPlaying={() => setLive(true)}
          onCanPlay={() => setLive(true)}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: live ? 1 : 0, transition: "opacity 900ms ease-out" }}
        >
          <source src={heroVideo.mp4} type="video/mp4" />
        </video>
      ) : null}

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
