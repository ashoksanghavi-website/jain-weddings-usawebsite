import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LOGO, servicesMenu, site, weddingMenu } from "@/data/site";

function NavLink({
  to,
  label,
  active,
  onClick,
}: {
  to: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="group relative py-2 font-util text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink"
    >
      {label}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 -bottom-0.5 h-px bg-kumkum transition-transform duration-[250ms]",
          active
            ? "scale-x-100"
            : "origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100",
        )}
      />
    </Link>
  );
}

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [accordion, setAccordion] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerBottom, setHeaderBottom] = useState(120);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        setScrolled(y > 20);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, y / max) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const measure = () => {
      const rect = headerRef.current?.getBoundingClientRect();
      if (rect) setHeaderBottom(rect.bottom);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden
        className="h-0.5 origin-left bg-gradient-to-r from-kumkum to-gold2"
        style={{ transform: `scaleX(${progress})` }}
      />

      {/* Utility strip. Gradient rather than flat, a gold hairline beneath it,
          a pulsing mark on the tagline and the contacts as pills. */}
      <div className="jw-util hidden min-[520px]:flex">
        <div className="container-site flex h-[42px] w-full items-center justify-between gap-6 font-util text-[12.5px]">
          <p className="hidden items-center gap-3 min-[760px]:flex">
            <span aria-hidden className="jw-util-dot" />
            <span className="tracking-[0.1em] text-gold2">{site.tagline}</span>
          </p>

          <div className="flex flex-1 items-center justify-end gap-1.5 sm:gap-2">
            <a href={site.phoneHref} className="jw-util-link">
              <Phone className="h-3.5 w-3.5 text-gold2" aria-hidden />
              {site.phone}
            </a>
            <span aria-hidden className="hidden h-4 w-px bg-paper/20 sm:block" />
            <a href={`mailto:${site.email}`} className="jw-util-link">
              <Mail className="h-3.5 w-3.5 text-gold2" aria-hidden />
              <span className="hidden sm:inline">{site.email}</span>
              <span className="sm:hidden">Email</span>
            </a>
            <span aria-hidden className="hidden h-4 w-px bg-paper/20 lg:block" />
            <span className="hidden items-center gap-2 pl-2 text-paper/60 lg:flex">
              <MapPin className="h-3.5 w-3.5 text-gold2" aria-hidden />
              Elkhart, Indiana
            </span>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "bg-paper/88 backdrop-blur-md backdrop-saturate-150 transition-shadow",
          scrolled && "border-b border-gold/40",
        )}
      >
        <div className="container-site flex h-[74px] items-center justify-between gap-6">
          <Link to="/" className="flex items-center" aria-label={site.brand}>
            <img src={LOGO} alt={site.brand} width={160} height={46} className="h-[46px] w-auto" />
          </Link>

          <nav className="hidden items-center gap-9 min-[1080px]:flex" aria-label="Main">
            <NavLink to="/" label="Home" active={isActive("/")} />
            <NavLink to="/about" label="About" active={isActive("/about")} />

            <div className="group relative py-2">
              <button className="flex items-center gap-1.5 font-util text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink">
                Wedding
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </button>
              <div className="invisible absolute left-1/2 top-full z-40 w-[520px] -translate-x-1/2 translate-y-2 border border-gold/40 bg-card p-3 opacity-0 shadow-xl transition-all duration-[250ms] group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {weddingMenu.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-4 p-3 transition-colors hover:bg-paper"
                  >
                    <img
                      src={item.thumb}
                      alt=""
                      width={64}
                      height={64}
                      loading="lazy"
                      decoding="async"
                      className="h-16 w-16 shrink-0 object-cover"
                    />
                    <span>
                      <span className="block font-display text-[1.2rem] text-ink">
                        {item.title}
                      </span>
                      <span className="block font-util text-[12px] text-mist">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="group relative py-2">
              <button className="flex items-center gap-1.5 font-util text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink">
                Other Services
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </button>
              <div className="invisible absolute left-1/2 top-full z-40 w-56 -translate-x-1/2 translate-y-2 border border-gold/40 bg-card p-2 opacity-0 shadow-xl transition-all duration-[250ms] group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {servicesMenu.map((item) =>
                  item.external ? (
                    <a
                      key={item.label}
                      href={item.to}
                      target="_blank"
                      rel="noreferrer"
                      className="block px-3 py-2.5 font-util text-[11.5px] uppercase tracking-[0.16em] text-ink hover:bg-paper"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="block px-3 py-2.5 font-util text-[11.5px] uppercase tracking-[0.16em] text-ink hover:bg-paper"
                    >
                      {item.label}
                    </Link>
                  ),
                )}
              </div>
            </div>

            <NavLink to="/contact" label="Contact" active={isActive("/contact")} />
          </nav>

          <Link
            to="/contact"
            className="hidden min-h-[44px] items-center rounded-full bg-kumkum px-6 font-util text-[11.5px] font-semibold uppercase tracking-[0.16em] text-paper transition-colors duration-[250ms] hover:bg-[#8f2019] min-[1080px]:inline-flex"
          >
            Book a consultation
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close the menu" : "Open the menu"}
            className="grid h-11 w-11 place-items-center text-ink min-[1080px]:hidden"
          >
            {open ? <Menu className="hidden" aria-hidden /> : null}
            {open ? (
              <X className="h-6 w-6" aria-hidden />
            ) : (
              <Menu className="h-6 w-6" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div
          className="jw-mnav fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-paper min-[1080px]:hidden"
          style={{ top: headerBottom }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-4 inset-y-4 border border-gold/25"
          />

          <div className="container-site relative py-8">
            <nav aria-label="Mobile">
              <ul>
                {[
                  { label: "Home", to: "/" },
                  { label: "About", to: "/about" },
                ].map((l, i) => (
                  <li key={l.to} className="jw-mnav-item" style={{ ["--i" as string]: i }}>
                    <Link to={l.to as "/"} className="jw-mnav-link" data-active={isActive(l.to)}>
                      <span className="jw-mnav-num">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex-1">{l.label}</span>
                      <ArrowUpRight className="jw-mnav-arrow h-4 w-4" aria-hidden />
                    </Link>
                  </li>
                ))}

                {[
                  {
                    key: "wedding",
                    label: "Wedding",
                    num: "03",
                    items: weddingMenu.map((w) => ({
                      label: w.title,
                      to: w.to,
                      external: false,
                      hint: w.description,
                    })),
                  },
                  {
                    key: "services",
                    label: "Other Services",
                    num: "04",
                    items: servicesMenu.map((sv) => ({
                      label: sv.label,
                      to: sv.to,
                      external: sv.external,
                      hint: "",
                    })),
                  },
                ].map((group, gi) => (
                  <li
                    key={group.key}
                    className="jw-mnav-item"
                    style={{ ["--i" as string]: 2 + gi }}
                  >
                    <button
                      type="button"
                      className="jw-mnav-link w-full text-left"
                      aria-expanded={accordion === group.key}
                      onClick={() => setAccordion(accordion === group.key ? null : group.key)}
                    >
                      <span className="jw-mnav-num">{group.num}</span>
                      <span className="flex-1">{group.label}</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-gold transition-transform duration-300",
                          accordion === group.key && "rotate-180",
                        )}
                        aria-hidden
                      />
                    </button>
                    <div
                      className="grid transition-[grid-template-rows] duration-[350ms]"
                      style={{ gridTemplateRows: accordion === group.key ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <ul className="jw-mnav-sub">
                          {group.items.map((item) =>
                            item.external ? (
                              <li key={item.label}>
                                <a
                                  href={item.to}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="jw-mnav-sublink"
                                >
                                  <span aria-hidden className="jw-mnav-dot" />
                                  <span>
                                    {item.label}
                                    <span className="sr-only">, opens in a new window</span>
                                  </span>
                                </a>
                              </li>
                            ) : (
                              <li key={item.label}>
                                <Link to={item.to as "/"} className="jw-mnav-sublink">
                                  <span aria-hidden className="jw-mnav-dot" />
                                  <span>
                                    {item.label}
                                    {item.hint ? (
                                      <span className="jw-mnav-hint">{item.hint}</span>
                                    ) : null}
                                  </span>
                                </Link>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </div>
                  </li>
                ))}

                <li className="jw-mnav-item" style={{ ["--i" as string]: 4 }}>
                  <Link to="/contact" className="jw-mnav-link" data-active={isActive("/contact")}>
                    <span className="jw-mnav-num">05</span>
                    <span className="flex-1">Contact</span>
                    <ArrowUpRight className="jw-mnav-arrow h-4 w-4" aria-hidden />
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="jw-mnav-item mt-9" style={{ ["--i" as string]: 5 }}>
              <Link
                to="/contact"
                className="flex min-h-[52px] w-full items-center justify-center bg-kumkum px-6 font-util text-[12px] font-semibold uppercase tracking-[0.18em] text-paper"
              >
                Book a consultation
              </Link>

              <div className="mt-7 border border-gold/30 p-6">
                <p className="font-util text-[10px] uppercase tracking-[0.22em] text-gold">
                  No cost, no obligation
                </p>
                <a
                  href={site.phoneHref}
                  className="mt-4 flex items-center gap-3 font-display text-[22px] text-ink"
                >
                  <Phone className="h-4 w-4 text-kumkum" aria-hidden />
                  {site.phone}
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-3 flex items-center gap-3 text-[14px] text-mist"
                >
                  <Mail className="h-4 w-4 text-kumkum" aria-hidden />
                  {site.email}
                </a>
                <p lang="sa" className="mt-6 text-[22px] text-gold">
                  णमो अरिहंताणं
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Header;
