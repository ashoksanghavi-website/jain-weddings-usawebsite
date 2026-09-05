import { createFileRoute } from "@tanstack/react-router";
import { useState, type CSSProperties, type FormEvent } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { BrandIcon } from "@/components/site/BrandIcon";
import { Kicker, Masthead, Section, StampFrame } from "@/components/site/primitives";
import { meta, images as seo } from "@/data/site";
import { useSiteContent } from "@/components/site/ContentProvider";
import { submitEnquiry } from "@/lib/enquiries";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: meta.contact.title },
      { name: "description", content: meta.contact.description },
      { property: "og:title", content: meta.contact.title },
      { property: "og:description", content: meta.contact.description },
      { property: "og:image", content: seo.celebration.src },
      { name: "twitter:image", content: seo.celebration.src },
    ],
  }),
  component: ContactRoute,
});

function Field({
  id,
  label,
  type = "text",
  required,
  textarea,
  options,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  options?: readonly string[];
}) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  // The label floats up when the field is focused, holds a value, is a native
  // date input (which always shows its own dd-mm-yyyy text) or a select. The
  // raised/rest position is applied via INLINE STYLE — the earlier Tailwind
  // arbitrary utilities (`-translate-y-[22px]`) worked in dev (JIT) but were not
  // emitted into the production CSS, so the label overlapped the date text live.
  const raised = focused || value.length > 0 || type === "date" || !!options;
  const active = focused || value.length > 0;

  const shared =
    "w-full border-0 border-b border-gold/25 bg-transparent px-2 pb-2.5 pt-6 text-[15px] text-ink outline-none transition-colors duration-300";

  const labelStyle: CSSProperties = {
    transformOrigin: "left",
    transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1), color 0.3s ease, letter-spacing 0.3s ease",
    transform: raised ? "translateY(-2px) scale(0.78)" : "translateY(20px)",
    color: focused ? "var(--color-kumkum)" : "var(--color-mist)",
    letterSpacing: raised ? "0.14em" : "0.02em",
  };

  // Accent underline grows from the centre on focus/fill — driven by inline
  // style so it always renders (Tailwind never purges it).
  const underlineStyle: CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "2px",
    background: "var(--color-kumkum)",
    transformOrigin: "center",
    transform: active ? "scaleX(1)" : "scaleX(0)",
    transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
  };

  const focusProps = {
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  };

  return (
    <div className="relative pt-3">
      <label
        htmlFor={id}
        style={labelStyle}
        className="pointer-events-none absolute left-2 top-0 z-10 font-util text-[13px]"
      >
        {label}
        {required ? " *" : ""}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={id}
          rows={4}
          required={required}
          aria-required={required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={shared}
          {...focusProps}
        />
      ) : options ? (
        <select
          id={id}
          name={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={shared}
          {...focusProps}
        >
          <option value="" />
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          aria-required={required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={shared}
          {...focusProps}
        />
      )}
      <span aria-hidden style={underlineStyle} />
    </div>
  );
}

function ContactRoute() {
  const { contactPage, images, site, socials } = useSiteContent();
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    const fd = new FormData(e.currentTarget);
    const val = (k: string) => {
      const v = fd.get(k);
      return typeof v === "string" ? v : "";
    };
    try {
      await submitEnquiry({
        data: {
          source: "contact",
          subject: val("ceremony"),
          name: val("name"),
          email: val("email"),
          phone: val("phone"),
          wedding_date: val("date"),
          city: val("city"),
          message: val("message"),
        },
      });
      setState("sent");
    } catch {
      setState("error");
    }
  }

  return (
    <>
      <Masthead
        kicker={contactPage.kicker}
        title={contactPage.h1}
        line={contactPage.line}
        crumb="Contact"
      />

      <Section tone="paper">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="jw-contact-card">
              <span aria-hidden className="jw-contact-edge" />
              <div className="relative p-7 sm:p-9">
                <p lang="sa" aria-hidden className="jw-contact-om">
                  ॐ
                </p>
                <Kicker>Directly</Kicker>

                <a href={site.phoneHref} className="jw-contact-row mt-6">
                  <span>
                    <span className="jw-contact-label">Toll free</span>
                    <span className="jw-contact-value">{site.phone}</span>
                  </span>
                  <Phone className="h-4 w-4 shrink-0 text-kumkum" aria-hidden />
                </a>

                <a href={`mailto:${site.email}`} className="jw-contact-row">
                  <span>
                    <span className="jw-contact-label">Email</span>
                    <span className="jw-contact-value text-[16px]">{site.email}</span>
                  </span>
                  <Mail className="h-4 w-4 shrink-0 text-kumkum" aria-hidden />
                </a>

                <div className="jw-contact-row">
                  <span>
                    <span className="jw-contact-label">Where</span>
                    <span className="jw-contact-value text-[15px] leading-snug">
                      {site.location}
                      <br />
                      <span className="text-[13.5px] text-mist">
                        Travelling to any domestic or international destination
                      </span>
                    </span>
                  </span>
                  <MapPin className="h-4 w-4 shrink-0 text-kumkum" aria-hidden />
                </div>

                <p className="mt-7 font-util text-[10px] uppercase tracking-[0.22em] text-gold">
                  Elsewhere
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${s.label}, opens in a new window`}
                      className="jw-social"
                    >
                      <BrandIcon name={s.icon} brand className="h-[18px] w-[18px]" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <img
              src={images.celebration.src}
              alt={images.celebration.alt}
              width={800}
              height={600}
              loading="lazy"
              decoding="async"
              className="mt-6 aspect-[4/3] w-full border border-gold/40 object-cover"
            />
          </div>

          <div className="lg:col-span-7">
            {/* The form sits inside a printed card, so it reads as an
                invitation reply rather than a web form on a page. */}
            <div className="jw-form-card">
              <span aria-hidden className="jw-form-edge" />

              <div className="jw-form-body">
                {state === "sent" ? (
                  <>
                    <p lang="sa" aria-hidden className="jw-form-om">
                      ॐ
                    </p>
                    <p
                      role="status"
                      aria-live="polite"
                      className="font-display text-[1.5rem] italic text-kumkum"
                    >
                      {contactPage.success}
                    </p>
                  </>
                ) : (
                  <form onSubmit={onSubmit}>
                    <Kicker>Send a message</Kicker>
                    <h2 className="mt-4 font-display text-[26px] leading-[1.2]">
                      {contactPage.formHeading}
                    </h2>

                    <span aria-hidden className="jw-card-divider">
                      <span />
                      <i />
                      <span />
                    </span>

                    <div className="grid gap-x-7 gap-y-1 sm:grid-cols-2">
                      <Field id="name" label={contactPage.fields.name} required />
                      <Field id="email" label={contactPage.fields.email} type="email" required />
                      <Field id="phone" label={contactPage.fields.phone} type="tel" />
                      <Field id="date" label={contactPage.fields.date} type="date" />
                      <Field id="city" label={contactPage.fields.city} />
                      <Field
                        id="ceremony"
                        label={contactPage.fields.type}
                        options={contactPage.ceremonyTypes}
                      />
                    </div>

                    <div className="mt-1">
                      <Field id="message" label={contactPage.fields.message} textarea />
                    </div>

                    {state === "error" ? (
                      <p role="alert" className="mt-5 text-[14.5px] text-kumkum">
                        {contactPage.error}
                      </p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={state === "loading"}
                      className="jw-btn-primary mt-8 w-full"
                    >
                      {state === "loading" ? "Sending" : contactPage.submit}
                    </button>

                    <p className="mt-4 text-center text-[12px] leading-relaxed text-mist">
                      {contactPage.privacy}
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
