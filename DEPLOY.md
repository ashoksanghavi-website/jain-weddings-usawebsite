# Deploying

## GitHub, then Vercel

1. Create an **empty** repo on GitHub. Do not tick README, .gitignore or
   licence, or the first push will be rejected.
2. Upload everything in this folder.
3. Vercel: Add New, Project, import the repo.
4. **Leave every build setting alone.** Do not set a Framework Preset and do not
   type anything into Output Directory. Press Deploy.

### Why the settings matter

This is a server rendered app. `npm run build` produces `dist/client` and
`dist/server` and **there is no index.html anywhere**. Pointed at `dist`, Vercel
finds no entry file and every URL returns 404.

`vite.config.ts` pins Nitro to the `vercel` preset, which emits `.vercel/output`
in Vercel's Build Output API format: static assets, a routing config, and a
`__server` function that renders the pages. `vercel.json` points Vercel at that
folder. Those two files together are the whole fix.

## Backend (Neon)

Every form on the site — the contact page, the invitation popup, the per-ceremony
cards and the poojan plates — posts to one TanStack Start server function
(`src/lib/enquiries.ts`) which validates the input, rate limits it, and writes a
single row to the `enquiries` table on **Neon** Postgres. There is no CMS and no
second table.

The table:

```sql
create table enquiries (
  id           bigserial primary key,
  created_at   timestamptz not null default now(),
  source       text not null,          -- 'contact' | 'invite' | 'ceremony' | 'poojan'
  subject      text,                    -- which ceremony or poojan, if any
  name         text not null,
  email        text not null,
  phone        text,
  wedding_date date,
  city         text,
  message      text
);
```

**Connection string.** The server function reads `process.env.DATABASE_URL`.
- Local: it is in `.env` (git-ignored). Copy `.env.example` if you need to recreate it.
- Vercel: set `DATABASE_URL` in Project → Settings → Environment Variables
  (Production + Preview) before the first deploy, or the forms return an error.

**Reading enquiries.** They land in the Neon table; view them in the Neon console
(Tables → `enquiries`) or with any Postgres client. Email-on-insert notification
(so Ashok is emailed rather than checking the console) is not wired yet — the
intended next step is a no-key notifier such as FormSubmit, or Resend if a key is
added.

## Before going live

**Images and video.** Every photograph and the hero footage are served from the
client's own WordPress install at jainweddingsusa.com. That was deliberate: they
are the real ceremony photographs, not stock. It does mean this site depends on
that host staying up. Before the old site is ever taken down, download the files
referenced by the `IMG` constant at the top of `src/data/site.ts` into `/public`
and set `IMG` to an empty string.

## Animation approach

Almost every animation on this site is a CSS transform or opacity change driven
by one shared IntersectionObserver hook. Ten keyframe sets and around thirty five
transitions cover the entrance reveals, hairline draws, curtains, marquee,
mastheads, poojan plates, pathway cards, dialogs, mobile navigation and footer.
None of them touch the main thread while running.

`framer-motion` is installed but currently imported nowhere, so it is not in the
shipped client bundle. Two places would genuinely benefit from it and are worth
doing if the budget allows:

- **The photo spread drag** on the gallery page. CSS has no concept of pointer
  velocity, so the cards currently settle on a fixed curve rather than carrying
  the momentum of the throw.
- **Dialog exit animations.** Modals currently vanish on close because animating
  an element out as React unmounts it needs `AnimatePresence`.

If those are wired up, import through `LazyMotion` with the `m` component rather
than the full `motion` export. That is roughly 15 KB instead of 93 KB.

## Devanagari

Bodoni Moda carries no Devanagari glyphs, so every Sanskrit string on the site
was silently falling back to a system font. Tiro Devanagari Sanskrit is now
loaded, and every Devanagari string is marked `lang="sa"`, which is both the hook
the stylesheet uses and the correct thing to do for a screen reader.

## Content note

This is a **Jain** practice, not a Vedic one. The ceremony turns on **Mangal
Phera**, and the rites are the twelve on the rituals page, Var Aagaman through
Akhand Saubhagyavati. If anyone later asks for "the seven steps" or the saptapadi
to be added, that request is wrong for this client and worth checking with Ashok
before acting on it.
