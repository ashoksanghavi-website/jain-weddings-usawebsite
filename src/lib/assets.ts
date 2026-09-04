import { createServerFn } from "@tanstack/react-start";
import { neon } from "@neondatabase/serverless";
import { z } from "zod";
import { randomBytes } from "node:crypto";
import { currentAdminEmail, dbUrl } from "@/lib/session";

/**
 * Image / media upload. The admin picks a file; it is stored (base64) in the
 * Neon `assets` table and referenced by a short `/asset/<id>` URL that
 * `src/lib/assets-serve.ts` serves. No WordPress, no external host.
 */

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

const UploadInput = z.object({
  contentType: z.string().min(1).max(100),
  base64: z.string().min(1),
});

export const uploadAsset = createServerFn({ method: "POST" })
  .validator((raw: unknown) => UploadInput.parse(raw))
  .handler(async ({ data }) => {
    if (!currentAdminEmail()) throw new Error("Not authorised.");
    const ext = EXT[data.contentType.toLowerCase()];
    if (!ext) throw new Error("Unsupported file type. Use JPG, PNG, WebP, GIF, SVG or MP4.");
    const approxBytes = Math.floor(data.base64.length * 0.75);
    if (approxBytes > 4 * 1024 * 1024) throw new Error("File is too large (max 4 MB).");

    const id = `${randomBytes(12).toString("hex")}.${ext}`;
    const sql = neon(dbUrl());
    await sql`insert into assets (id, content_type, data) values (${id}, ${data.contentType}, ${data.base64})`;
    return { url: `/asset/${id}` };
  });
