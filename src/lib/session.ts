import {
  getCookie,
  setCookie,
  deleteCookie,
  getRequestIP,
} from "@tanstack/react-start/server";
import {
  createHash,
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

/**
 * Server-only auth core, shared by the admin and content server functions.
 *
 * This module imports server-only APIs (`@tanstack/react-start/server`,
 * `node:crypto`). It must only ever be used *inside* `createServerFn` handlers,
 * so the client build strips it — never call these from module scope of a file
 * the client imports.
 */

const COOKIE = "jw_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function dbUrl(): string {
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

export function verifyPassword(password: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const derived = scryptSync(password, Buffer.from(saltHex, "hex"), 64);
  const expected = Buffer.from(hashHex, "hex");
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

// Per-IP login throttle (best-effort, per warm instance).
const attempts = new Map<string, { n: number; first: number }>();
export function loginAllowed(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.first > 15 * 60 * 1000) {
    attempts.set(ip, { n: 1, first: now });
    return true;
  }
  rec.n += 1;
  return rec.n <= 10;
}

export function callerIp(): string {
  try {
    return getRequestIP({ xForwardedFor: true }) || "unknown";
  } catch {
    return "unknown";
  }
}

/** The signed-in admin's email, or null. */
export function currentAdminEmail(): string | null {
  const token = getCookie(COOKIE);
  if (!token) return null;
  return verifyToken(token, sessionKey(dbUrl()))?.email ?? null;
}

/** Issue the session cookie for an authenticated admin. */
export function setAdminSession(email: string): void {
  const token = sign(
    { email, exp: Math.floor(Date.now() / 1000) + MAX_AGE },
    sessionKey(dbUrl()),
  );
  setCookie(COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function clearAdminSession(): void {
  deleteCookie(COOKIE, { path: "/" });
}
