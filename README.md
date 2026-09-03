# Jain Weddings USA

The website for **Ashok Hiralal Sanghavi**, an ordained Jain Vidhikar who conducts
Jain wedding ceremonies and poojans across North America.

> This is a **Jain** practice, not a Vedic one. The ceremony turns on **Mangal
> Phera**, and the rites are the twelve on the rituals page (Var Aagaman through
> Akhand Saubhagyavati). Requests for "the seven steps" or the saptapadi are wrong
> for this client — check with Ashok before acting on them.

## Stack

- **React 19 + TanStack Start** (server-rendered) on **Vite**
- **Tailwind CSS v4** (design tokens in the `@theme` block of `src/styles.css`)
- **Neon** Postgres for enquiries (one table, no CMS)
- Deployed on **Vercel** from GitHub

## Local development

Requires Node.js and npm.

```sh
npm install
cp .env.example .env   # then paste your Neon DATABASE_URL into .env
npm run dev            # http://localhost:8080
```

`npm run build` produces the Vercel Build Output in `.vercel/output` (there is no
`index.html` — this is a server-rendered app). See [DEPLOY.md](DEPLOY.md).

## Forms → Neon

The contact form, the invitation popup, the per-ceremony cards and the poojan
plates all post to one server function (`src/lib/enquiries.ts`) that validates,
rate-limits and inserts a single row into the `enquiries` table. Set
`DATABASE_URL` locally (`.env`) and on Vercel (project env vars). Details and the
table schema are in [DEPLOY.md](DEPLOY.md).

## Content

Every word of copy, every image URL and every list lives in `src/data/site.ts`.
Components do not hardcode copy. Images are currently served from the client's
existing WordPress install (`IMG` constant); before the old site is taken down,
download them into `public/` and set `IMG` to `""` (see the handoff kit's
`download-assets` scripts).
