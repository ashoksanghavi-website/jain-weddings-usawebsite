import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

/**
 * A dialog shaped like a wedding card rather than a web modal: scalloped
 * paper, a printed gold border inset from the edge, a diamond divider.
 * Locks scroll, traps Tab, closes on Escape and on backdrop, returns focus.
 */
export function CardModal({
  open,
  onClose,
  eyebrow,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;

    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    const focusables = () =>
      Array.from(
        panel.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="jw-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="jw-card-title"
        className="jw-card"
      >
        <span aria-hidden className="jw-card-rule" />

        <button type="button" onClick={onClose} className="jw-card-close" aria-label="Close">
          <X size={17} aria-hidden />
        </button>

        <div className="jw-card-body">
          {eyebrow ? (
            <p className="font-[family-name:var(--font-util)] text-[10px] uppercase tracking-[0.24em] text-gold">
              {eyebrow}
            </p>
          ) : null}

          <h2
            id="jw-card-title"
            className="mt-4 font-[family-name:var(--font-display)] text-[26px] leading-[1.2]"
          >
            {title}
          </h2>

          <span aria-hidden className="jw-card-divider">
            <span />
            <i />
            <span />
          </span>

          {children}
        </div>
      </div>
    </div>
  );
}
