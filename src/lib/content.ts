import { createServerFn } from "@tanstack/react-start";
import { neon } from "@neondatabase/serverless";
import { currentAdminEmail } from "@/lib/session";
import { defaultContent, deepMerge, type SiteContent } from "@/data/content";

/**
 * Site content pipeline. The public site reads the merged content (defaults
 * overlaid with whatever the admin has saved in the `site_content` row). The
 * admin reads the same merged content to edit, and saves the whole tree back.
 * A short in-memory cache keeps the per-request DB read cheap; content is global
 * (same for every visitor) so caching across requests is safe.
 */

function dbUrl(): string | null {
  return process.env.DATABASE_URL ?? null;
}

let cache: { at: number; content: SiteContent } | null = null;
const TTL_MS = 30_000;

async function loadOverride(): Promise<unknown> {
  const url = dbUrl();
  if (!url) return null;
  try {
    const sql = neon(url);
    const rows = (await sql`select data from site_content where id = 1 limit 1`) as Array<{
      data: unknown;
    }>;
    return rows[0]?.data ?? null;
  } catch {
    // On any DB error the site still renders with the shipped defaults.
    return null;
  }
}

async function computeContent(): Promise<SiteContent> {
  const override = await loadOverride();
  return deepMerge(defaultContent, override);
}

/** Public: the effective content, cached briefly. Never throws. */
export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();
  if (cache && now - cache.at < TTL_MS) return cache.content;
  const content = await computeContent();
  cache = { at: now, content };
  return content;
});

/** Admin: the same content, for editing (auth required). */
export const getAdminContent = createServerFn({ method: "GET" }).handler(async () => {
  if (!currentAdminEmail()) throw new Error("Not authorised.");
  return await computeContent();
});

/** Admin: replace the stored content with the edited tree (auth required). */
export const saveSiteContent = createServerFn({ method: "POST" })
  .validator((raw: unknown) => {
    if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
      throw new Error("Invalid content payload.");
    }
    return raw as Record<string, unknown>;
  })
  .handler(async ({ data }) => {
    if (!currentAdminEmail()) throw new Error("Not authorised.");
    const url = dbUrl();
    if (!url) throw new Error("The server is not configured (no database).");
    const sql = neon(url);
    await sql`
      insert into site_content (id, data, updated_at)
      values (1, ${JSON.stringify(data)}::jsonb, now())
      on conflict (id) do update set data = excluded.data, updated_at = now()
    `;
    cache = null; // bust the cache so the change shows immediately on this instance
    return { ok: true as const };
  });
