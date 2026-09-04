import { useState, type FormEvent } from "react";
import { ArrowRight, Clock3, MapPin } from "lucide-react";
import { useSiteContent } from "@/components/site/ContentProvider";
import { Reveal } from "@/components/site/primitives";
import { CardModal } from "@/components/site/CardModal";
import { submitEnquiry } from "@/lib/enquiries";

/**
 * Fourteen poojans as invitation plates. Each card is given its own corner
 * treatment from a rotating set, so the grid does not read as one card
 * repeated fourteen times, and each opens a dialog carrying its own detail.
 */
const CORNERS = ["jw-pl-a", "jw-pl-b", "jw-pl-c", "jw-pl-d"];

/**
 * The enquiry that sits inside a poojan dialog (and the catch-all ॐ cell).
 * Same pipeline as every other form on the site: it writes one row to the
 * enquiries table, tagged source 'poojan' with the poojan name as the subject.
 */
function PoojanEnquiry({ subject }: { subject: string }) {
  const { site } = useSiteContent();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const g = (k: string) => String(d.get(k) ?? "").trim();
    setErr(false);
    setLoading(true);
    try {
      await submitEnquiry({
        data: {
          source: "poojan",
          subject,
          name: g("name"),
          email: g("email"),
          message: g("message"),
        },
      });
      setSent(true);
    } catch {
      setErr(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <p
        role="status"
        aria-live="polite"
        className="mt-8 border-t border-gold/25 pt-6 font-[family-name:var(--font-display)] text-[17px] italic text-kumkum"
      >
        Thank you — your enquiry is with us, and we will reply shortly.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 border-t border-gold/25 pt-6">
      <label className="jw-inv-field">
        <span>Your name</span>
        <input name="name" required autoComplete="name" />
      </label>
      <label className="jw-inv-field">
        <span>Email</span>
        <input name="email" type="email" required autoComplete="email" spellCheck={false} />
      </label>
      <label className="jw-inv-field">
        <span>Your message (optional)</span>
        <textarea name="message" rows={3} />
      </label>

      {err ? (
        <p role="alert" className="mt-4 text-[14px] text-kumkum">
          Something went wrong sending that. Please try again, or call {site.phone}.
        </p>
      ) : null}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <button type="submit" disabled={loading} className="jw-btn-primary">
          {loading ? "Sending" : "Send enquiry"}
        </button>
        <a href={site.phoneHref} className="jw-btn-line">
          {site.phone}
        </a>
      </div>
    </form>
  );
}

export function PoojanGrid() {
  const { servicesPage } = useSiteContent();
  const [open, setOpen] = useState<number | null>(null);
  const [omOpen, setOmOpen] = useState(false);
  const item = open === null ? null : servicesPage.poojans[open]!;

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {servicesPage.poojans.map((p, i) => (
          <Reveal key={p.name} delay={(i % 3) * 0.07} className="h-full">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className={`jw-poojan ${CORNERS[i % CORNERS.length]}`}
            >
              <span aria-hidden className="jw-poojan-edge" />

              <span className="flex items-baseline gap-3">
                <span className="font-[family-name:var(--font-util)] text-[11px] font-semibold tracking-[0.2em] text-gold">
                  {p.number}
                </span>
                <span className="font-[family-name:var(--font-util)] text-[10px] uppercase tracking-[0.2em] text-mist">
                  {p.sub}
                </span>
              </span>

              <span className="jw-poojan-title">{p.name}</span>
              <span className="jw-poojan-summary">{p.summary}</span>

              <span className="jw-poojan-foot">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={12} aria-hidden />
                  {p.duration}
                </span>
                <span className="jw-poojan-go">
                  {servicesPage.cardCta}
                  <ArrowRight size={12} aria-hidden />
                </span>
              </span>
            </button>
          </Reveal>
        ))}

        {/* the fifteenth cell would otherwise be an empty gap */}
        <Reveal delay={0.14} className="h-full">
          <div className="jw-om-cell">
            <span aria-hidden className="jw-poojan-edge" />
            <span lang="sa" aria-hidden className="jw-om-mark">
              ॐ
            </span>
            <p className="jw-om-line">{servicesPage.omLine}</p>
            <button type="button" onClick={() => setOmOpen(true)} className="jw-om-cta">
              {servicesPage.omCta}
              <ArrowRight size={13} aria-hidden />
            </button>
          </div>
        </Reveal>
      </div>

      <CardModal
        open={item !== null}
        onClose={() => setOpen(null)}
        eyebrow={`POOJAN ${item?.number ?? ""}`}
        title={item?.name ?? ""}
      >
        {item ? (
          <>
            <dl className="mb-7 grid grid-cols-2 gap-4 border-y border-gold/25 py-5">
              <div>
                <dt className="flex items-center gap-2 font-[family-name:var(--font-util)] text-[10px] uppercase tracking-[0.2em] text-mist">
                  <Clock3 size={12} aria-hidden />
                  Runs for
                </dt>
                <dd className="mt-1.5 text-[15px]">{item.duration}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 font-[family-name:var(--font-util)] text-[10px] uppercase tracking-[0.2em] text-mist">
                  <MapPin size={12} aria-hidden />
                  Performed at
                </dt>
                <dd className="mt-1.5 text-[15px]">{item.setting}</dd>
              </div>
            </dl>

            {item.body.map((b) => (
              <p key={b} className="mb-4 text-[15.5px] leading-[1.75] text-ink/88">
                {b}
              </p>
            ))}

            <p className="mt-6 border-l-2 border-kumkum pl-4 font-[family-name:var(--font-display)] text-[16px] italic text-maroon">
              {item.note}
            </p>

            <PoojanEnquiry subject={item.name} />
          </>
        ) : null}
      </CardModal>

      <CardModal
        open={omOpen}
        onClose={() => setOmOpen(false)}
        eyebrow="Other services"
        title={servicesPage.omCta}
      >
        <p className="text-[15.5px] leading-[1.75] text-ink/85">{servicesPage.omLine}</p>
        <PoojanEnquiry subject="General enquiry" />
      </CardModal>
    </>
  );
}
