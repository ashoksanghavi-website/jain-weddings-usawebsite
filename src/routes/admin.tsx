import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  adminEnquiries,
  adminLogin,
  adminLogout,
  adminMe,
  type AdminEnquiry,
} from "@/lib/admin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Enquiries — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminRoute,
});

const SOURCE_LABEL: Record<string, string> = {
  contact: "Contact form",
  invite: "Invitation",
  ceremony: "Ceremony",
  poojan: "Poojan",
};

function fmtWhen(value: string | Date): string {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AdminRoute() {
  const [status, setStatus] = useState<"loading" | "out" | "in">("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [rows, setRows] = useState<AdminEnquiry[]>([]);
  const [loadingRows, setLoadingRows] = useState(false);

  const loadRows = useCallback(async () => {
    setLoadingRows(true);
    try {
      const res = await adminEnquiries();
      setRows(res.enquiries);
      setEmail(res.email);
      setStatus("in");
    } catch {
      setStatus("out");
    } finally {
      setLoadingRows(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    adminMe()
      .then((res) => {
        if (!active) return;
        if (res.email) {
          setEmail(res.email);
          void loadRows();
        } else {
          setStatus("out");
        }
      })
      .catch(() => active && setStatus("out"));
    return () => {
      active = false;
    };
  }, [loadRows]);

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] bg-paper" aria-busy="true">
        <div className="mx-auto max-w-md px-6 py-24 text-center font-util text-[12px] uppercase tracking-[0.2em] text-mist">
          Loading…
        </div>
      </div>
    );
  }

  if (status === "out") {
    return <LoginView onSignedIn={loadRows} />;
  }

  return (
    <DashboardView
      email={email}
      rows={rows}
      loading={loadingRows}
      onRefresh={loadRows}
      onSignedOut={() => {
        setStatus("out");
        setRows([]);
        setEmail(null);
      }}
    />
  );
}

function LoginView({ onSignedIn }: { onSignedIn: () => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setErr(null);
    setBusy(true);
    try {
      await adminLogin({
        data: {
          email: String(fd.get("email") ?? "").trim(),
          password: String(fd.get("password") ?? ""),
        },
      });
      onSignedIn();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Sign in failed.");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[70vh] bg-paper">
      <div className="mx-auto max-w-md px-6 py-16 sm:py-24">
        <div className="border border-gold/40 bg-card p-8 sm:p-10">
          <p lang="sa" aria-hidden className="text-center font-display text-[30px] text-kumkum">
            ॐ
          </p>
          <h1 className="mt-2 text-center font-display text-[28px] leading-tight text-ink">
            Enquiries
          </h1>
          <p className="mt-1 text-center font-util text-[11px] uppercase tracking-[0.2em] text-mist">
            Admin sign in
          </p>

          <form onSubmit={onSubmit} className="mt-8">
            <label className="jw-inv-field">
              <span>Email</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="username"
                defaultValue="asanghavi@aol.com"
                spellCheck={false}
              />
            </label>
            <label className="jw-inv-field">
              <span>Password</span>
              <input name="password" type="password" required autoComplete="current-password" />
            </label>

            {err ? (
              <p role="alert" className="mt-5 text-[14px] text-kumkum">
                {err}
              </p>
            ) : null}

            <button type="submit" disabled={busy} className="jw-btn-primary mt-8 w-full">
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function DashboardView({
  email,
  rows,
  loading,
  onRefresh,
  onSignedOut,
}: {
  email: string | null;
  rows: AdminEnquiry[];
  loading: boolean;
  onRefresh: () => void;
  onSignedOut: () => void;
}) {
  async function signOut() {
    try {
      await adminLogout();
    } finally {
      onSignedOut();
    }
  }

  return (
    <div className="min-h-[70vh] bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gold/40 pb-5">
          <div>
            <p className="font-util text-[11px] uppercase tracking-[0.2em] text-gold">
              Jain Weddings USA
            </p>
            <h1 className="mt-1 font-display text-[30px] leading-tight text-ink">
              Enquiries
              <span className="ml-3 align-middle font-util text-[12px] uppercase tracking-[0.15em] text-mist">
                {rows.length} total
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {email ? <span className="text-[13px] text-mist">{email}</span> : null}
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="font-util text-[11px] uppercase tracking-[0.16em] text-kumkum hover:underline disabled:opacity-50"
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>
            <button
              type="button"
              onClick={signOut}
              className="font-util text-[11px] uppercase tracking-[0.16em] text-mist hover:text-ink"
            >
              Sign out
            </button>
          </div>
        </div>

        {rows.length === 0 ? (
          <p className="py-16 text-center text-[15px] text-mist">
            No enquiries yet. New submissions will appear here.
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b border-mist/30 font-util text-[10px] uppercase tracking-[0.16em] text-mist">
                  <th className="py-3 pr-4 font-semibold">When</th>
                  <th className="py-3 pr-4 font-semibold">Source</th>
                  <th className="py-3 pr-4 font-semibold">Name</th>
                  <th className="py-3 pr-4 font-semibold">Contact</th>
                  <th className="py-3 pr-4 font-semibold">Details</th>
                  <th className="py-3 font-semibold">Message</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-mist/15 align-top">
                    <td className="py-3 pr-4 whitespace-nowrap text-[13px] text-mist">
                      {fmtWhen(r.created_at)}
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <span className="inline-block border border-gold/40 px-2 py-0.5 font-util text-[10px] uppercase tracking-[0.12em] text-maroon">
                        {SOURCE_LABEL[r.source] ?? r.source}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-medium text-ink">{r.name}</td>
                    <td className="py-3 pr-4 text-[13px]">
                      <a href={`mailto:${r.email}`} className="text-kumkum hover:underline">
                        {r.email}
                      </a>
                      {r.phone ? (
                        <div className="text-mist">
                          <a href={`tel:${r.phone}`} className="hover:underline">
                            {r.phone}
                          </a>
                        </div>
                      ) : null}
                    </td>
                    <td className="py-3 pr-4 text-[13px] text-ink/80">
                      {r.subject ? <div>{r.subject}</div> : null}
                      {r.wedding_date ? (
                        <div className="text-mist">Date: {String(r.wedding_date)}</div>
                      ) : null}
                      {r.city ? <div className="text-mist">{r.city}</div> : null}
                      {!r.subject && !r.wedding_date && !r.city ? (
                        <span className="text-mist">—</span>
                      ) : null}
                    </td>
                    <td className="py-3 max-w-[280px] text-[13px] text-ink/80">
                      {r.message ? r.message : <span className="text-mist">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
