import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  adminChangePassword,
  adminEnquiries,
  adminLogin,
  adminLogout,
  adminMe,
  type AdminEnquiry,
} from "@/lib/admin";
import { ContentEditor } from "@/components/admin/ContentEditor";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Jain Weddings USA" },
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

  const check = useCallback(() => {
    adminMe()
      .then((res) => {
        setEmail(res.email);
        setStatus(res.email ? "in" : "out");
      })
      .catch(() => setStatus("out"));
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] bg-paper" aria-busy="true">
        <div className="mx-auto max-w-md px-6 py-24 text-center font-util text-[12px] uppercase tracking-[0.2em] text-mist">
          Loading…
        </div>
      </div>
    );
  }
  if (status === "out") return <LoginView onSignedIn={check} />;
  return (
    <Dashboard
      email={email}
      onSignedOut={() => {
        setStatus("out");
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
    <div className="min-h-[80vh] bg-paper">
      <div className="mx-auto max-w-md px-6 py-16 sm:py-24">
        <div className="border border-gold/40 bg-card p-8 sm:p-10">
          <p lang="sa" aria-hidden className="text-center font-display text-[30px] text-kumkum">
            ॐ
          </p>
          <h1 className="mt-2 text-center font-display text-[28px] leading-tight text-ink">
            Jain Weddings USA
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

type Tab = "enquiries" | "content" | "password";

function Dashboard({ email, onSignedOut }: { email: string | null; onSignedOut: () => void }) {
  const [tab, setTab] = useState<Tab>("enquiries");

  async function signOut() {
    try {
      await adminLogout();
    } finally {
      onSignedOut();
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-gold/40 bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <div>
            <p className="font-util text-[10px] uppercase tracking-[0.2em] text-gold">
              Jain Weddings USA
            </p>
            <h1 className="font-display text-[24px] leading-tight text-ink">Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            {email ? <span className="hidden text-[13px] text-mist sm:inline">{email}</span> : null}
            <button
              type="button"
              onClick={signOut}
              className="font-util text-[11px] uppercase tracking-[0.16em] text-mist hover:text-ink"
            >
              Sign out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 px-5 sm:px-8">
          {(
            [
              ["enquiries", "Enquiries"],
              ["content", "Edit website"],
              ["password", "Password"],
            ] as [Tab, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`jw-adm-tab ${tab === id ? "is-active" : ""}`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {tab === "enquiries" ? <EnquiriesTab /> : null}
        {tab === "content" ? <ContentEditor /> : null}
        {tab === "password" ? <PasswordTab /> : null}
      </div>
    </div>
  );
}

function EnquiriesTab() {
  const [rows, setRows] = useState<AdminEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminEnquiries();
      setRows(res.enquiries);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-[22px] text-ink">
          Enquiries
          <span className="ml-3 align-middle font-util text-[12px] uppercase tracking-[0.15em] text-mist">
            {rows.length} total
          </span>
        </h2>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="font-util text-[11px] uppercase tracking-[0.16em] text-kumkum hover:underline disabled:opacity-50"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {loading && rows.length === 0 ? (
        <p className="py-16 text-center font-util text-[12px] uppercase tracking-[0.2em] text-mist">
          Loading…
        </p>
      ) : rows.length === 0 ? (
        <p className="py-16 text-center text-[15px] text-mist">
          No enquiries yet. New submissions will appear here.
        </p>
      ) : (
        <div className="overflow-x-auto">
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
  );
}

function PasswordTab() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const current = String(fd.get("current") ?? "");
    const next = String(fd.get("next") ?? "");
    const confirm = String(fd.get("confirm") ?? "");
    setMsg(null);
    if (next.length < 8) {
      setMsg({ ok: false, text: "New password must be at least 8 characters." });
      return;
    }
    if (next !== confirm) {
      setMsg({ ok: false, text: "The new passwords do not match." });
      return;
    }
    setBusy(true);
    try {
      await adminChangePassword({ data: { currentPassword: current, newPassword: next } });
      setMsg({ ok: true, text: "Password changed. Use it next time you sign in." });
      form.reset();
    } catch (e2) {
      setMsg({ ok: false, text: e2 instanceof Error ? e2.message : "Could not change password." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md">
      <h2 className="mb-5 font-display text-[22px] text-ink">Change password</h2>
      <form onSubmit={onSubmit} className="border border-gold/40 bg-card p-6 sm:p-8">
        <label className="jw-inv-field">
          <span>Current password</span>
          <input name="current" type="password" required autoComplete="current-password" />
        </label>
        <label className="jw-inv-field">
          <span>New password</span>
          <input name="next" type="password" required autoComplete="new-password" minLength={8} />
        </label>
        <label className="jw-inv-field">
          <span>Confirm new password</span>
          <input name="confirm" type="password" required autoComplete="new-password" minLength={8} />
        </label>

        {msg ? (
          <p
            role={msg.ok ? "status" : "alert"}
            className={`mt-5 text-[14px] ${msg.ok ? "text-green-700" : "text-kumkum"}`}
          >
            {msg.text}
          </p>
        ) : null}

        <button type="submit" disabled={busy} className="jw-btn-primary mt-8 w-full">
          {busy ? "Saving…" : "Change password"}
        </button>
      </form>
    </div>
  );
}
