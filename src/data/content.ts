import * as S from "@/data/site";

/**
 * The whole editable site content, assembled from the static defaults in
 * `site.ts`. The admin CMS edits a deep copy of this shape and stores it in the
 * Neon `site_content` table; the public site loads that stored copy and merges
 * it over these defaults, so the site always renders even with an empty or
 * broken DB (it just falls back to what ships in the code).
 */
export const defaultContent = {
  IMG: S.IMG,
  LOGO: S.LOGO,
  heroVideo: S.heroVideo,
  site: S.site,
  socials: S.socials,
  routes: S.routes,
  weddingMenu: S.weddingMenu,
  servicesMenu: S.servicesMenu,
  meta: S.meta,
  images: S.images,
  rituals: S.rituals,
  gallery: S.gallery,
  films: S.films,
  home: S.home,
  testimonials: S.testimonials,
  about: S.about,
  ceremonyEnquiry: S.ceremonyEnquiry,
  ritualsPage: S.ritualsPage,
  galleryPage: S.galleryPage,
  servicesPage: S.servicesPage,
  contactPage: S.contactPage,
  invitationBand: S.invitationBand,
  invite: S.invite,
  pathways: S.pathways,
  notFoundPage: S.notFoundPage,
};

export type SiteContent = typeof defaultContent;

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * Deep-merge `override` onto `base`. Objects merge key by key; arrays and
 * scalars from `override` replace `base` wholesale. New keys that exist only in
 * `base` (e.g. a field added in code after content was saved) are preserved.
 */
export function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (isPlainObject(base) && isPlainObject(override)) {
    const out: Record<string, unknown> = { ...base };
    for (const key of Object.keys(override)) {
      out[key] = key in base ? deepMerge((base as Record<string, unknown>)[key], override[key]) : override[key];
    }
    return out as T;
  }
  // arrays and scalars: the override wins outright
  return override as T;
}

/** A deep, structured clone of the defaults, safe to mutate in the editor. */
export function cloneDefaultContent(): SiteContent {
  return JSON.parse(JSON.stringify(defaultContent)) as SiteContent;
}
