import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { ceremonyEnquiry } from "@/data/site";
import { CardModal } from "@/components/site/CardModal";
import { submitEnquiry } from "@/lib/enquiries";

/**
 * A small invitation card attached to each of the three ceremony rows on the
 * homepage, so a reader can act at the moment they are interested rather than
 * scrolling to the bottom of the page to find a form.
 */
export function CeremonyEnquiry({ number, title }: { number: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);

  const close = () => {
    setOpen(false);
    window.setTimeout(() => {
      setSent(false);
      setErr(false);
    }, 300);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const g = (k: string) => String(d.get(k) ?? "").trim();
    setErr(false);
    setLoading(true);
    try {
      await submitEnquiry({
        data: {
          source: "ceremony",
          subject: `${number}. ${title}`,
          name: g("name"),
          email: g("email"),
          wedding_date: g("date"),
        },
      });
      setSent(true);
    } catch {
      setErr(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="jw-cer-cta">
        <span aria-hidden className="jw-cer-cta-edge" />
        <span className="jw-cer-cta-label">
          {ceremonyEnquiry.cta}
          <ArrowRight size={13} aria-hidden />
        </span>
        <span className="sr-only">, {title}</span>
      </button>

      <CardModal open={open} onClose={close} eyebrow={ceremonyEnquiry.eyebrow} title={title}>
        {sent ? (
          <p role="status" aria-live="polite" className="text-[15px] leading-relaxed">
            {ceremonyEnquiry.sent}
          </p>
        ) : (
          <>
            <p className="text-[15px] leading-[1.75] text-ink/85">
              {ceremonyEnquiry.notes[number] ?? ceremonyEnquiry.intro}
            </p>

            <form onSubmit={onSubmit} className="mt-6">
              <label className="jw-inv-field">
                <span>{ceremonyEnquiry.nameLabel}</span>
                <input name="name" required autoComplete="name" />
              </label>
              <div className="grid gap-x-6 sm:grid-cols-2">
                <label className="jw-inv-field">
                  <span>{ceremonyEnquiry.emailLabel}</span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    spellCheck={false}
                  />
                </label>
                <label className="jw-inv-field">
                  <span>{ceremonyEnquiry.dateLabel}</span>
                  <input name="date" type="date" />
                </label>
              </div>

              {err ? (
                <p role="alert" className="mt-5 text-[14px] text-kumkum">
                  Something went wrong sending that. Please try again, or email us
                  directly.
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="jw-btn-primary mt-7 w-full"
              >
                {loading ? "Sending" : ceremonyEnquiry.submit}
              </button>
              <button
                type="button"
                onClick={close}
                className="mt-3 w-full font-[family-name:var(--font-util)] text-[11px] uppercase tracking-[0.18em] text-mist transition-colors hover:text-ink"
              >
                {ceremonyEnquiry.cancel}
              </button>
            </form>
          </>
        )}
      </CardModal>
    </>
  );
}
