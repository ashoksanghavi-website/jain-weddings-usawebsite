import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/data/site";

export function Lightbox({
  items,
  index,
  onClose,
  onMove,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onMove: (next: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const item = items[index];

  useEffect(() => {
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove((index + 1) % items.length);
      if (e.key === "ArrowLeft") onMove((index - 1 + items.length) % items.length);
      if (e.key === "Tab") {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, items.length, onClose, onMove]);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.caption}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-maroon2/95 p-6"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-gold2/40 text-paper"
      >
        <X className="h-5 w-5" aria-hidden />
      </button>

      <img
        src={item.full}
        alt={item.caption}
        className="max-h-[72vh] w-auto max-w-full object-contain"
        decoding="async"
      />

      <div className="mt-6 flex items-center gap-6 text-paper/88">
        <button
          type="button"
          aria-label="Previous photograph"
          onClick={() => onMove((index - 1 + items.length) % items.length)}
          className="grid h-11 w-11 place-items-center rounded-full border border-gold2/40"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <p className="font-util text-[11px] uppercase tracking-[0.22em]">
          {item.caption}, {index + 1} of {items.length}
        </p>
        <button
          type="button"
          aria-label="Next photograph"
          onClick={() => onMove((index + 1) % items.length)}
          className="grid h-11 w-11 place-items-center rounded-full border border-gold2/40"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}

export default Lightbox;
