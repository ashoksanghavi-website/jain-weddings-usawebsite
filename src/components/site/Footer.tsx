import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { BrandIcon } from "@/components/site/BrandIcon";
import { useSiteContent } from "@/components/site/ContentProvider";
import { Button, GoldRule, Kicker, SplitHeading } from "./primitives";

export function InvitationBand() {
  const { images, invitationBand, site } = useSiteContent();
  return (
    /* Deep ivory rather than maroon. It used to sit directly on top of the
       maroon footer, so the two ran together as one slab and the call to
       action disappeared into it. */
    <section className="relative isolate overflow-hidden bg-card">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_50%_0%,color-mix(in_oklab,var(--color-gold)_14%,transparent),transparent_62%)]"
      />
      <img
        src={images.contactBand.src}
        alt=""
        width={1600}
        height={900}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-[0.07]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-4 inset-y-4 border border-gold/30 lg:inset-x-10 lg:inset-y-8"
      />

      <div className="container-site grid gap-12 py-18 lg:grid-cols-12 lg:gap-16 lg:py-20">
        <div className="lg:col-span-7">
          <Kicker>{invitationBand.eyebrow}</Kicker>
          <div className="mt-5">
            <SplitHeading text={invitationBand.h2} className="pb-1 leading-[1.12]" />
          </div>
          <div className="mt-7 flex items-center gap-4">
            <span aria-hidden className="h-px w-12 bg-gold/50" />
            <span aria-hidden className="block h-[7px] w-[7px] rotate-45 bg-gold" />
            <span aria-hidden className="h-px w-12 bg-gold/50" />
          </div>
          <p className="prose-measure mt-7 text-[16.5px] leading-relaxed text-ink/85">
            {invitationBand.line}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button to="/contact">{invitationBand.primary}</Button>
            <a href={site.phoneHref} className="jw-band-call">
              <span className="font-[family-name:var(--font-util)] text-[10px] uppercase tracking-[0.2em] text-mist">
                {invitationBand.secondaryLabel}
              </span>
              <span className="mt-1 flex items-center gap-2.5 font-[family-name:var(--font-display)] text-[22px] text-ink">
                <Phone size={16} aria-hidden className="text-kumkum" />
                {site.phone}
              </span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="jw-band-aside">
            <span aria-hidden className="jw-band-aside-edge" />
            <p className="font-[family-name:var(--font-util)] text-[10px] uppercase tracking-[0.22em] text-gold">
              {invitationBand.aside.heading}
            </p>
            <ol className="mt-6">
              {invitationBand.aside.steps.map((st, i) => (
                <li key={st} className="jw-band-step">
                  <span className="jw-band-num">{String(i + 1).padStart(2, "0")}</span>
                  <span>{st}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 flex items-center gap-2.5 text-[13px] text-mist">
              <span aria-hidden className="block h-1.5 w-1.5 rotate-45 bg-kumkum" />
              {invitationBand.aside.foot}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { LOGO, about, routes, site, socials } = useSiteContent();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      {pathname !== "/contact" ? <InvitationBand /> : null}
      <footer className="relative isolate overflow-hidden bg-maroon2 text-paper/85">
        <span
          aria-hidden
          lang="sa"
          className="pointer-events-none absolute -bottom-24 right-4 -z-10 select-none leading-none text-gold2"
          style={{ fontSize: 300, opacity: 0.05 }}
        >
          ॐ
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-4 top-4 bottom-4 -z-10 border border-gold2/14 lg:inset-x-10 lg:top-8 lg:bottom-8"
        />

        {/* the blessing line, above everything */}
        <div className="container-site relative border-b border-gold2/20 py-10 text-center">
          <p lang="sa" className="text-[26px] text-gold2">
            {about.footerBlessing}
          </p>
          <p className="mt-3 font-util text-[10px] uppercase tracking-[0.26em] text-paper/50">
            {about.footerBlessingEn}
          </p>
        </div>

        <div className="container-site relative grid gap-14 py-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <span className="inline-block bg-card p-3">
              <img
                src={LOGO}
                alt={site.brand}
                width={160}
                height={46}
                className="h-[46px] w-auto"
              />
            </span>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-paper/75">
              {about.footerBio}
            </p>

            <p className="mt-7 flex items-start gap-3 text-[13.5px] text-paper/70">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold2" aria-hidden />
              <span>
                {site.location}
                <br />
                Travelling to any domestic or international destination
              </span>
            </p>
          </div>

          <nav className="lg:col-span-3" aria-label="Footer">
            <Kicker tone="gold2">Pages</Kicker>
            <ul className="mt-6">
              {routes.map((r) => (
                <li key={r.to}>
                  <Link to={r.to} className="jw-foot-link">
                    <span aria-hidden className="jw-foot-dash" />
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <Kicker tone="gold2">Elsewhere</Kicker>
            <ul className="mt-6">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="jw-foot-link">
                    <BrandIcon name={s.icon} className="h-3.5 w-3.5 shrink-0 text-gold2" />
                    {s.label}
                    <span className="sr-only">, opens in a new window</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <Kicker tone="gold2">Directly</Kicker>

            <a href={site.phoneHref} className="jw-foot-card mt-6">
              <span>
                <span className="block font-util text-[10px] uppercase tracking-[0.2em] text-paper/45">
                  Toll free
                </span>
                <span className="mt-1 block font-[family-name:var(--font-display)] text-[21px] text-paper">
                  {site.phone}
                </span>
              </span>
              <Phone className="h-4 w-4 shrink-0 text-gold2" aria-hidden />
            </a>

            <a href={`mailto:${site.email}`} className="jw-foot-card mt-3">
              <span className="text-[14px]">{site.email}</span>
              <Mail className="h-4 w-4 shrink-0 text-gold2" aria-hidden />
            </a>

            <Link to="/contact" className="jw-foot-card jw-foot-cta mt-3">
              <span className="font-util text-[11.5px] font-semibold uppercase tracking-[0.16em]">
                Send your wedding date
              </span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="container-site relative flex flex-col gap-4 border-t border-gold2/20 py-8 font-util text-[11.5px] uppercase tracking-[0.14em] text-paper/50 md:flex-row md:items-center md:justify-between">
          <p>{site.copyright}</p>
          <p className="flex items-center gap-3">
            <span aria-hidden className="block h-1.5 w-1.5 rotate-45 bg-gold2" />
            {site.signatory}
          </p>
        </div>

        <div className="container-site relative border-t border-gold2/10 py-4 text-center font-util text-[10.5px] uppercase tracking-[0.16em] text-paper/40">
          Designed by{" "}
          <a
            href="https://www.automatedcodes.com"
            target="_blank"
            rel="noreferrer"
            className="text-gold2/80 underline-offset-4 transition-colors hover:text-gold2 hover:underline"
          >
            Automated Codes
            <span className="sr-only">, opens in a new window</span>
          </a>
        </div>
      </footer>
    </>
  );
}

export default Footer;
