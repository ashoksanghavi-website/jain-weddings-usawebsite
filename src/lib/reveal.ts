/**
 * Scroll-reveal controller — deliberately vanilla JS, not React.
 *
 * Every earlier attempt drove the reveal from React (one useState/useEffect per
 * element). On real iOS Safari that proved unreliable: hydration timing, React
 * StrictMode double-invokes and re-render reconciliation could all leave the
 * `.jw-in` class off, so the animation looked dead even though the content was
 * fine.
 *
 * This is a single global IntersectionObserver that runs independently of React.
 * The React components only ever render the *static* classes (`jw-rv`, `jw-sh`,
 * `jw-gr`) — that string never changes, so React never reconciles the element's
 * className and never strips the `jw-in` this file adds. The hidden start state
 * is gated behind `html.js` in CSS, so if this never ran, everything is simply
 * visible. It reveals when an element is in view via the observer AND a
 * scroll/touchmove rect check (touchmove fires continuously during an iOS
 * momentum flick, when scroll/observer callbacks are delivered late), plus a few
 * delayed scans so a stale first measurement after hydration can't strand
 * above-the-fold content. A MutationObserver picks up elements added by
 * client-side navigation.
 */

const SELECTOR = ".jw-rv, .jw-sh, .jw-gr";

let io: IntersectionObserver | null = null;
let started = false;
let rafId = 0;
const pending = new Set<Element>();

function reveal(el: Element) {
  el.classList.add("jw-in");
  pending.delete(el);
  io?.unobserve(el);
}

function isInView(el: Element) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  // Trigger a touch before it fully enters so that on iOS momentum scrolling —
  // where scroll/observer callbacks arrive late — it is already animating by the
  // time it is on screen, instead of popping in after you have scrolled past.
  return r.top < vh * 0.97 && r.bottom > -40 && r.width + r.height > 0;
}

function checkPending() {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    rafId = 0;
    for (const el of [...pending]) if (isInView(el)) reveal(el);
  });
}

/** Observe any matching elements not yet handled, and reveal those already in view. */
export function scanReveal() {
  if (typeof document === "undefined") return;
  const els = document.querySelectorAll(SELECTOR);
  for (const el of els) {
    if (el.classList.contains("jw-in") || pending.has(el)) continue;
    if (io) {
      pending.add(el);
      io.observe(el);
    } else {
      // No IntersectionObserver support: reveal outright (CSS still cross-fades).
      el.classList.add("jw-in");
    }
  }
  for (const el of [...pending]) if (isInView(el)) reveal(el);
}

export function initReveal() {
  if (started || typeof window === "undefined") return;
  started = true;

  // The controller is alive: cancel the head-script safety that would otherwise
  // drop the `html.js` gate (and with it the animation) after 5s.
  try {
    clearTimeout((window as unknown as { __jwRevealSafety?: number }).__jwRevealSafety);
  } catch {
    /* ignore */
  }

  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(SELECTOR).forEach((el) => el.classList.add("jw-in"));
    return;
  }

  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) reveal(e.target);
    },
    { threshold: 0.01, rootMargin: "0px 0px -6% 0px" },
  );

  window.addEventListener("scroll", checkPending, { passive: true, capture: true });
  window.addEventListener("touchmove", checkPending, { passive: true, capture: true });
  window.addEventListener("resize", checkPending, { passive: true });
  window.addEventListener("orientationchange", checkPending);
  window.addEventListener("pageshow", () => {
    scanReveal();
    checkPending();
  });

  scanReveal();
  requestAnimationFrame(scanReveal);
  setTimeout(scanReveal, 200);
  setTimeout(() => {
    scanReveal();
    checkPending();
  }, 800);

  // Elements added by client-side navigation.
  if (typeof MutationObserver !== "undefined" && document.body) {
    const mo = new MutationObserver(() => scanReveal());
    mo.observe(document.body, { childList: true, subtree: true });
  }
}
