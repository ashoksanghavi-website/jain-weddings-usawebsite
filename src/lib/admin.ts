import { createServerFn } from "@tanstack/react-start";
import {
  getCookie,
  setCookie,
  deleteCookie,
  getRequestIP,
} from "@tanstack/react-start/server";
import { neon } from "@neondatabase/serverless";
import { z } from "zod";
import {
  createHash,
  createHmac,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

/**
 * Admin auth for the enquiries dashboard. One admin user (row in `admin_users`,
 * scrypt-hashed password). Login sets an HMAC-signed, HttpOnly session cookie.
 * The signing key is derived from DATABASE_URL, so no extra secret is needed.
 */

const COOKIE = "jw_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function dbUrl(): string {
  const u = process.env.DATABASE_URL;
  if (!u) throw new Error("The server is not configured (no database).");
  return u;
}

function sessionKey(url: string): Buffer {
  return createHash("sha256").update("jw-admin-session::" + url).digest();
}

function sign(payload: object, key: Buffer): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", key).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verifyToken(token: string, key: Buffer): { email: string } | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const expected = createHmac("sha256", key).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString()) as {
      email?: string;
      exp?: number;
    };
    if (!data.email || typeof data.exp !== "number") return null;
    if (data.exp < Math.floor(Date.now() / 1000)) return null;
    return { email: data.email };
  } catch {
    return null;
  }
}

function verifyPassword(password: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const derived = scryptSync(password, Buffer.from(saltHex, "hex"), 64);
  const expected = Buffer.from(hashHex, "hex");
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

// Per-IP login throttle (best-effort, per warm instance).
const attempts = new Map<string, { n: number; first: number }>();
function loginAllowed(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.first > 15 * 60 * 1000) {
    attempts.set(ip, { n: 1, first: now });
    return true;
  }
  rec.n += 1;
  return rec.n <= 10;
}

function callerIp(): string {
  try {
    return getRequestIP({ xForwardedFor: true }) || "unknown";
  } catch {
    return "unknown";
  }
}

function currentAdminEmail(): string | null {
  const token = getCookie(COOKIE);
  if (!token) return null;
  return verifyToken(token, sessionKey(dbUrl()))?.email ?? null;
}

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
    const url = dbUrl();
    const sql = neon(url);
    const rows = (await sql`
      select password_hash from admin_users
      where lower(email) = lower(${data.email}) limit 1
    `) as Array<{ password_hash: string }>;

    const ok = rows[0] ? verifyPassword(data.password, rows[0].password_hash) : false;
    if (!ok) throw new Error("Incorrect email or password.");

    await sql`update admin_users set last_login_at = now() where lower(email) = lower(${data.email})`;

    const email = data.email.toLowerCase();
    const token = sign(
      { email, exp: Math.floor(Date.now() / 1000) + MAX_AGE },
      sessionKey(url),
    );
    setCookie(COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: MAX_AGE,
    });
    return { ok: true as const, email };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(COOKIE, { path: "/" });
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
