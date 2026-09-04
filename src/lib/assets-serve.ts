import { neon } from "@neondatabase/serverless";

/**
 * Serves an uploaded asset by id. Called from the SSR fetch entry (server.ts)
 * for any `/asset/<id>` request. Server-only — never imported by client code.
 */
export async function serveAsset(id: string): Promise<Response> {
  const url = process.env.DATABASE_URL;
  if (!url) return new Response("Not found", { status: 404 });
  if (!/^[a-f0-9]{8,}\.[a-z0-9]{1,5}$/i.test(id)) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const sql = neon(url);
    const rows = (await sql`
      select content_type, data from assets where id = ${id} limit 1
    `) as Array<{ content_type: string; data: string }>;
    if (!rows[0]) return new Response("Not found", { status: 404 });
    const bytes = Buffer.from(rows[0].data, "base64");
    return new Response(bytes, {
      headers: {
        "content-type": rows[0].content_type,
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Error", { status: 500 });
  }
}
