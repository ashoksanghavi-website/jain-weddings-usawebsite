import { createServerFn } from "@tanstack/react-start";
import { neon } from "@neondatabase/serverless";
import { z } from "zod";

/**
 * The single enquiries pipeline. Every form on the site — the contact page, the
 * invitation popup, the per-ceremony cards and the poojan plates — collects the
 * same shape and lands in one Neon table (see the `enquiries` DDL in the build
 * brief). There is no CMS and no second table.
 */

const emptyToNull = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? null : v;

const EnquiryInput = z.object({
  source: z.enum(["contact", "invite", "ceremony", "poojan"]),
  subject: z.preprocess(emptyToNull, z.string().max(200).nullish()),
  name: z.string().trim().min(1, "Please enter your name.").max(120),
  email: z.string().trim().email("Please enter a valid email.").max(200),
  phone: z.preprocess(emptyToNull, z.string().max(60).nullish()),
  wedding_date: z.preprocess(
    emptyToNull,
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD.")
      .nullish(),
  ),
  city: z.preprocess(emptyToNull, z.string().max(120).nullish()),
  message: z.preprocess(emptyToNull, z.string().max(5000).nullish()),
});

export type EnquiryInput = z.input<typeof EnquiryInput>;

// Best-effort burst guard, per warm server instance. The authoritative limit is
// the per-email check below, which is persistent across instances.
const recentHits: number[] = [];
function withinBurstLimit(): boolean {
  const now = Date.now();
  while (recentHits.length > 0 && now - recentHits[0]! > 60_000) recentHits.shift();
  if (recentHits.length >= 40) return false;
  recentHits.push(now);
  return true;
}

export const submitEnquiry = createServerFn({ method: "POST" })
  .validator((raw: unknown) => EnquiryInput.parse(raw))
  .handler(async ({ data }) => {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "The enquiry service is not configured yet. Please email or call instead.",
      );
    }

    if (!withinBurstLimit()) {
      throw new Error("Too many requests just now — please try again in a moment.");
    }

    const sql = neon(url);

    // Rate limit the insert: same sender, at most three messages in five minutes.
    const recent = (await sql`
      select count(*)::int as n
      from enquiries
      where lower(email) = lower(${data.email})
        and created_at > now() - interval '5 minutes'
    `) as Array<{ n: number }>;

    if ((recent[0]?.n ?? 0) >= 3) {
      // Not an error the visitor needs to fix — we already have them.
      return { ok: true as const, deduped: true as const };
    }

    await sql`
      insert into enquiries
        (source, subject, name, email, phone, wedding_date, city, message)
      values
        (${data.source}, ${data.subject ?? null}, ${data.name}, ${data.email},
         ${data.phone ?? null}, ${data.wedding_date ?? null}, ${data.city ?? null},
         ${data.message ?? null})
    `;

    return { ok: true as const };
  });
