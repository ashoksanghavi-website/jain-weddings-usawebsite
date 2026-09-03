import { useEffect, useState, type FormEvent } from "react";
import { invite } from "@/data/site";
import { CardModal } from "@/components/site/CardModal";
import { submitEnquiry } from "@/lib/enquiries";

const KEY = "jw-invite-shown";
const DELAY = 30_000;

/** Opens once per session, thirty seconds in. */
export function InvitePopup() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) return;
    } catch {
      return;
    }
    const t = window.setTimeout(() => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* ignore */
      }
      setOpen(true);
    }, DELAY);
    return () => window.clearTimeout(t);
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const g = (k: string) => String(d.get(k) ?? "").trim();
    setErr(false);
    setLoading(true);
    try {
      await submitEnquiry({
        data: {
          source: "invite",
          subject: "Invitation card",
          name: g("name"),
          email: g("email"),
          wedding_date: g("date"),
          city: g("city"),
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
    <CardModal
      open={open}
      onClose={() => setOpen(false)}
      eyebrow={invite.eyebrow}
      title={invite.heading}
    >
      {sent ? (
        <p role="status" aria-live="polite" className="text-[15.5px] leading-relaxed">
          {invite.sent}
        </p>
      ) : (
        <>
          <p className="text-[15.5px] leading-[1.75] text-ink/85">{invite.line}</p>

          <ul className="mt-6 border-y border-gold/25 py-5">
            {invite.points.map((pt) => (
              <li key={pt} className="flex gap-3 py-2 text-[14.5px] leading-snug text-ink/85">
                <span aria-hidden className="mt-2 block h-1.5 w-1.5 shrink-0 rotate-45 bg-kumkum" />
                {pt}
              </li>
            ))}
          </ul>

          <form onSubmit={onSubmit} className="mt-6">
            <div className="grid gap-x-6 sm:grid-cols-2">
              <label className="jw-inv-field">
                <span>{invite.nameLabel}</span>
                <input name="name" required autoComplete="name" />
              </label>
              <label className="jw-inv-field">
                <span>{invite.emailLabel}</span>
                <input name="email" type="email" required autoComplete="email" spellCheck={false} />
              </label>
              <label className="jw-inv-field">
                <span>{invite.dateLabel}</span>
                <input name="date" type="date" />
              </label>
              <label className="jw-inv-field">
                <span>{invite.cityLabel}</span>
                <input name="city" />
              </label>
            </div>

            {err ? (
              <p role="alert" className="mt-5 text-[14px] text-kumkum">
                Something went wrong sending that. Please try again, or email us
                directly.
              </p>
            ) : null}

            <button type="submit" disabled={loading} className="jw-btn-primary mt-8 w-full">
              {loading ? "Sending" : invite.submit}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full font-[family-name:var(--font-util)] text-[11.5px] uppercase tracking-[0.18em] text-mist transition-colors hover:text-ink"
            >
              {invite.dismiss}
            </button>
          </form>
        </>
      )}
    </CardModal>
  );
}
