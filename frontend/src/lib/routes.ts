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

/** Sections offered as search/browse chips. */
export const BROWSE_SECTIONS = Object.entries(SECTION_ROUTES).map(([name, href]) => ({
  name: name === 'National' ? 'Politics & Governance' : name,
  href,
}));
