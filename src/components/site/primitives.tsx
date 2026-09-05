import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode, HTMLAttributes, CSSProperties } from "react";
import { cn } from "@/lib/utils";

/* ---------------- Reveal ---------------- */

export function Reveal({
  children,
  delay = 0,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const Tag = As;
  return (
    <Tag
      className={cn("jw-rv", className)}
      style={delay ? ({ "--d": `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}

/* ---------------- SplitHeading ---------------- */

export function SplitHeading({
  text,
  level = 2,
  className,
  italicFrom,
}: {
  text: string;
  level?: 1 | 2;
  className?: string;
  italicFrom?: string;
}) {
  const Tag = (level === 1 ? "h1" : "h2") as "h1" | "h2";
  const words = text.split(" ");
  const italicIndex = italicFrom ? words.indexOf(italicFrom.split(" ")[0] ?? "") : -1;

  return (
    <Tag aria-label={text} className={cn("jw-sh", className)}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <span
            aria-hidden
            className={cn("jw-word", italicIndex >= 0 && i >= italicIndex ? "italic" : undefined)}
            style={{ "--d": `${i * 0.055}s` } as CSSProperties}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/* ---------------- Kicker ---------------- */

export function Kicker({
  children,
  tone = "gold",
  className,
}: {
  children: ReactNode;
  tone?: "gold" | "gold2";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-util text-[11px] font-semibold uppercase tracking-[0.22em]",
        tone === "gold" ? "text-gold" : "text-gold2",
        className,
      )}
    >
      {children}
    </p>
  );
}

/* ---------------- GoldRule ---------------- */

export function GoldRule({
  className,
  tone = "gold",
}: {
  className?: string;
  tone?: "gold" | "gold2";
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "jw-gr block h-px w-full",
        tone === "gold" ? "bg-gold/60" : "bg-gold2/50",
        className,
      )}
    />
  );
}

/* ---------------- Section ---------------- */

export function Section({
  children,
  className,
  tone = "paper",
  ...rest
}: {
  children: ReactNode;
  tone?: "paper" | "tint" | "maroon" | "none";
} & HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn(
        "section-y",
        tone === "paper" && "bg-paper text-ink",
        tone === "tint" && "bg-[#F6EFE1] text-ink",
        tone === "maroon" && "bg-maroon text-paper",
        className,
      )}
      {...rest}
    >
      <div className="container-site">{children}</div>
    </section>
  );
}

/* ---------------- StampFrame ---------------- */

export function StampFrame({
  children,
  tone = "card",
  hairline = false,
  className,
  innerClassName,
}: {
  children: ReactNode;
  tone?: "paper" | "card" | "maroon";
  hairline?: boolean;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div
      className={cn(
        "stamp relative",
        tone === "paper" && "bg-paper",
        tone === "card" && "bg-card",
        tone === "maroon" && "bg-maroon",
        className,
      )}
    >
      {hairline ? (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-3 z-10 border",
            tone === "maroon" ? "border-gold2/40" : "border-gold/40",
          )}
        />
      ) : null}
      <div className={cn("relative", innerClassName)}>{children}</div>
    </div>
  );
}

/* ---------------- Buttons ---------------- */

const btnBase =
  "jw-btn inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-7 font-util text-[11.5px] font-semibold uppercase tracking-[0.16em]";

export function Button({
  children,
  to,
  href,
  variant = "primary",
  className,
  type,
  disabled,
  onClick,
}: {
  children: ReactNode;
  to?: string;
  href?: string;
  variant?: "primary" | "outline" | "onMaroon";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}) {
  const styles = cn(
    btnBase,
    variant === "primary" && "bg-kumkum text-paper hover:bg-[#8f2019]",
    variant === "outline" && "border border-gold/60 bg-transparent text-ink hover:bg-gold/10",
    variant === "onMaroon" && "border border-gold2/50 text-paper hover:bg-gold2/15",
    disabled && "pointer-events-none opacity-60",
    className,
  );

  if (to) {
    return (
      <Link to={to} className={styles}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={styles}>
        {children}
      </a>
    );
  }
  return (
    <button type={type ?? "button"} className={styles} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export function ArrowLink({
  children,
  to,
  tone = "ink",
  className,
}: {
  children: ReactNode;
  to: string;
  tone?: "ink" | "paper";
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cn("jw-arrow group", tone === "paper" && "jw-arrow-paper", className)}
    >
      <span className="jw-arrow-label">{children}</span>
      <span aria-hidden className="jw-arrow-disc">
        <ArrowRight className="h-[13px] w-[13px]" aria-hidden />
      </span>
    </Link>
  );
}

/* ---------------- InlayImage ---------------- */

export function InlayImage({
  src,
  alt,
  width,
  height,
  curtain = false,
  className,
  imgClassName,
  eager = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  curtain?: boolean;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  // The image is shown directly — no reveal "curtain" overlay. On real iOS
  // Safari a CSS-animated curtain could stick in its covering state and leave a
  // solid maroon block over the photograph, so it is gone entirely.
  void curtain;
  return (
    <div className={cn("plate relative overflow-hidden bg-gold/70 p-[1.5px]", className)}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        {...(eager ? { fetchPriority: "high" as const } : {})}
        className={cn("plate h-full w-full object-cover", imgClassName)}
      />
    </div>
  );
}

/* ---------------- QuoteCard ---------------- */

export function QuoteCard({ quote, name }: { quote: string; name: string }) {
  return (
    <StampFrame tone="card" className="h-full">
      <figure className="flex h-full flex-col gap-5 p-8">
        <span aria-hidden className="block h-2 w-2 rotate-45 bg-kumkum" />
        <blockquote className="font-display text-[1.15rem] italic leading-relaxed text-ink">
          {quote}
        </blockquote>
        <figcaption className="mt-auto font-util text-[11px] font-semibold uppercase tracking-[0.22em] text-kumkum">
          {name}
        </figcaption>
      </figure>
    </StampFrame>
  );
}

/* ---------------- Pull quote ---------------- */

export function PullQuote({
  children,
  tone = "ink",
}: {
  children: ReactNode;
  tone?: "ink" | "paper";
}) {
  return (
    <div className="my-8 max-w-[52ch]">
      <GoldRule className="mb-5 max-w-[120px]" tone={tone === "ink" ? "gold" : "gold2"} />
      <p
        className={cn(
          "font-display text-[1.5rem] italic leading-snug",
          tone === "ink" ? "text-kumkum" : "text-gold2",
        )}
      >
        {children}
      </p>
    </div>
  );
}

/* ---------------- Masthead ---------------- */

/**
 * The band under the header on every inner page.
 *
 * The previous version pinned a fixed 150px height around a clamped h1, so on
 * a long title the descenders were clipped. This one has no fixed height at
 * all: it is padded, it grows with its content, and it can never crop type.
 */
export function Masthead({
  kicker,
  title,
  line,
  crumb,
}: {
  kicker: string;
  title: string;
  line: string;
  crumb?: string;
}) {
  return (
    <header className="relative isolate overflow-hidden bg-maroon">
      {/* A faint printed border, the way a card is embossed rather than framed */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-4 inset-y-3 -z-10 border border-gold2/22 lg:inset-x-10 lg:inset-y-6"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 -z-10 h-[420px] w-[420px] rounded-full bg-gold/12 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-20 -z-10 h-[380px] w-[380px] rounded-full bg-kumkum/22 blur-3xl"
      />

      <div className="container-site py-11 text-center lg:py-14">
        {crumb ? (
          <p className="mb-5 font-[family-name:var(--font-util)] text-[10.5px] uppercase tracking-[0.22em] text-paper/50">
            <Link to="/" className="transition-colors hover:text-gold2">
              Home
            </Link>
            <span className="px-2" aria-hidden>
              /
            </span>
            <span className="text-gold2">{crumb}</span>
          </p>
        ) : null}

        <Kicker tone="gold2">{kicker}</Kicker>

        {/* leading-[1.14] and pb give the descenders somewhere to sit */}
        <div className="mx-auto mt-4 max-w-4xl">
          <SplitHeading text={title} level={1} className="pb-1 leading-[1.14] text-paper" />
        </div>

        <div className="mx-auto mt-6 flex items-center justify-center gap-4">
          <span aria-hidden className="h-px w-12 bg-gold2/45" />
          <span aria-hidden className="block h-[7px] w-[7px] rotate-45 bg-gold2" />
          <span aria-hidden className="h-px w-12 bg-gold2/45" />
        </div>

        <p className="prose-measure mx-auto mt-6 text-[15px] leading-relaxed text-paper/85">
          {line}
        </p>
      </div>
    </header>
  );
}
