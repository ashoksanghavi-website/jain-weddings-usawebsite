# Notes for agents working on this repo

- **Jain, not Vedic.** The ceremony turns on **Mangal Phera**, and the rites are
  the twelve on the rituals page (Var Aagaman → Akhand Saubhagyavati). Never add
  "the seven steps" / saptapadi. Testimonials are real people — do not invent or
  rewrite them.
- **Copy lives in one file.** All copy, image URLs and lists are in
  `src/data/site.ts`. Do not hardcode copy in components.
- **Every Devanagari string carries `lang="sa"`** — it is both the font hook and
  correct for screen readers.
- **Forms → Neon.** The contact page, invitation popup, ceremony cards and poojan
  plates all post to `src/lib/enquiries.ts` (one server function, one `enquiries`
  table). No CMS. The server reads `process.env.DATABASE_URL`.
- **Images must be plain paths.** Save real files in `public/` and reference them
  as direct string paths (e.g. `/logo.png`). Do not use any `@/assets` proxy or
  `.asset.json` pointer — those break outside Lovable's preview on Vercel.
- **Deployment.** Server-rendered; `npm run build` writes `.vercel/output`. See
  [DEPLOY.md](DEPLOY.md).
