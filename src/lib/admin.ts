import { createServerFn } from "@tanstack/react-start";
import { neon } from "@neondatabase/serverless";
import { z } from "zod";
import {
  callerIp,
  clearAdminSession,
  currentAdminEmail,
  dbUrl,
  hashPassword,
  loginAllowed,
  setAdminSession,
  verifyPassword,
} from "@/lib/session";

/**
 * Admin server functions for the enquiries dashboard and the content CMS auth.
 * All the server-only auth machinery lives in `@/lib/session`; this file only
 * defines the RPC endpoints, so the client gets thin stubs and none of the
 * server internals.
 */

const LoginInput = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(1).max(200),
});

export const adminLogin = createServerFn({ method: "POST" })
  .validator((raw: unknown) => LoginInput.parse(raw))
  .handler(async ({ data }) => {
    if (!loginAllowed(callerIp())) {
      throw new Error("Too many attempts. Please wait a few minutes and try again.");
    }
    const sql = neon(dbUrl());
    const rows = (await sql`
      select password_hash from admin_users
      where lower(email) = lower(${data.email}) limit 1
    `) as Array<{ password_hash: string }>;

    const ok = rows[0] ? verifyPassword(data.password, rows[0].password_hash) : false;
    if (!ok) throw new Error("Incorrect email or password.");

    await sql`update admin_users set last_login_at = now() where lower(email) = lower(${data.email})`;

    const email = data.email.toLowerCase();
    setAdminSession(email);
    return { ok: true as const, email };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  clearAdminSession();
  return { ok: true as const };
});

export const adminMe = createServerFn({ method: "GET" }).handler(async () => {
  try {
    return { email: currentAdminEmail() };
  } catch {
    return { email: null };
  }
});

export type AdminEnquiry = {
  id: string;
  created_at: string;
  source: string;
  subject: string | null;
  name: string;
  email: string;
  phone: string | null;
  wedding_date: string | null;
  city: string | null;
  message: string | null;
};

export const adminEnquiries = createServerFn({ method: "GET" }).handler(async () => {
  const email = currentAdminEmail();
  if (!email) throw new Error("Not authorised.");
  const sql = neon(dbUrl());
  const enquiries = (await sql`
    select id::text as id,
           created_at::text as created_at,
           source, subject, name, email, phone,
           wedding_date::text as wedding_date,
           city, message
    from enquiries
    order by id desc
    limit 500
  `) as AdminEnquiry[];
  return { email, enquiries };
});

const ChangePasswordInput = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(8, "New password must be at least 8 characters.").max(200),
});

export const adminChangePassword = createServerFn({ method: "POST" })
  .validator((raw: unknown) => ChangePasswordInput.parse(raw))
  .handler(async ({ data }) => {
    const email = currentAdminEmail();
    if (!email) throw new Error("Not authorised.");
    const sql = neon(dbUrl());
    const rows = (await sql`
      select password_hash from admin_users where lower(email) = lower(${email}) limit 1
    `) as Array<{ password_hash: string }>;
    if (!rows[0] || !verifyPassword(data.currentPassword, rows[0].password_hash)) {
      throw new Error("Your current password is incorrect.");
    }
    await sql`update admin_users set password_hash = ${hashPassword(data.newPassword)} where lower(email) = lower(${email})`;
    return { ok: true as const };
  });
