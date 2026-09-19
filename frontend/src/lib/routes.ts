import { COUNTIES } from './constants';

/**
 * Maps a category name to its live route.
 * Counties → /counties/<slug>; sections → their own page.
 * "National" is presented to readers as Politics & Governance.
 */
const SECTION_ROUTES: Record<string, string> = {
  Business: '/business',
  Sports: '/sports',
  Opinion: '/opinion',
  Editorial: '/editorial',
  National: '/politics',
  Technology: '/technology',
  Entertainment: '/entertainment',
  Lifestyle: '/lifestyle',
};

export function categoryRoute(category?: string): string | null {
  if (!category) return null;
  const county = COUNTIES.find((c) => c.name === category);
  if (county) return `/counties/${county.slug}`;
  return SECTION_ROUTES[category] ?? null;
}

/**
 * Pretty `/category/<slug>` aliases used by the Kenyanews-style IA.
 * Canonical live URLs (`/politics`, `/business`, `/counties/meru` …) stay
 * unchanged so existing search listings are not broken.
 */
export const CATEGORY_ALIASES: Record<string, string> = {
  politics: '/politics',
  national: '/politics',
  business: '/business',
  sports: '/sports',
  opinion: '/opinion',
  editorial: '/editorial',
  features: '/editorial',
  technology: '/technology',
  entertainment: '/entertainment',
  lifestyle: '/lifestyle',
  latest: '/latest',
  'county-news': '/counties',
  counties: '/counties',
};

/** Sections offered as search/browse chips. */
export const BROWSE_SECTIONS = Object.entries(SECTION_ROUTES).map(([name, href]) => ({
  name: name === 'National' ? 'Politics & Governance' : name,
  href,
}));
