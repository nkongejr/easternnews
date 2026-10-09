import type { Advertiser } from '@/types';

/**
 * A single floating (overlay) advertisement shown over news articles.
 *
 * This is the advert shape the rotating overlay works with. It is deliberately
 * a superset of the CMS `Advertiser` record so a booking from the newsroom and
 * a hand-configured promo below both support every field the design needs:
 * banner image, headline, optional description, optional advertiser name,
 * destination URL, optional call-to-action button, and active/inactive status.
 */
export interface FloatingAd {
  /** Stable id — rotation, dismissal and session state are keyed on it. */
  id: string;
  /** Banner / promo image. Omitted for a text-only advert. */
  image?: string;
  /** Main line of copy shown on the card. */
  headline: string;
  /** Optional supporting copy under the headline. */
  description?: string;
  /** Optional sponsor line, e.g. "Bezalel Hotel Meru". */
  advertiserName?: string;
  /** Destination URL when the advert is clicked. */
  href?: string;
  /** Optional call-to-action button label, e.g. "Book a slot". */
  ctaLabel?: string;
  /** Inactive adverts are never displayed. */
  active: boolean;
}

/** Configurable display timing for the overlay rotation. */
export interface FloatingAdTiming {
  /** Delay after an article opens before the first advert appears. */
  initialDelayMs: number;
  /**
   * Interval between adverts after one is dismissed. Either a fixed number of
   * milliseconds or a [min, max] range drawn at schedule time (so the reader
   * gets a natural 20–30s pause rather than a metronome).
   */
  nextAdDelayMs: number | [number, number];
}

/**
 * Default timing: first advert ~5s after the article opens, then the next
 * eligible advert 20–30s after the previous one is closed. Tune here.
 */
export const DEFAULT_FLOATING_AD_TIMING: FloatingAdTiming = {
  initialDelayMs: 5000,
  nextAdDelayMs: [20000, 30000],
};

/** Resolve `nextAdDelayMs` (fixed or ranged) to a concrete delay in ms. */
export function resolveAdDelay(
  spec: FloatingAdTiming['nextAdDelayMs'],
  rng: () => number = Math.random,
): number {
  if (typeof spec === 'number') return Math.max(0, spec);
  const [a, b] = spec;
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return Math.round(min + rng() * (max - min));
}

/**
 * Configurable advert list.
 *
 * The newsroom books client adverts through the CMS (Advertiser records on the
 * `article-overlay` placement) — those are merged in by `resolveFloatingAds`.
 * This list holds the standing promos the publication can edit directly in one
 * place, with the same fields a CMS booking maps to. Flip `active` to pause or
 * resume any of them; inactive entries are skipped by the rotation.
 */
export const CONFIGURED_FLOATING_ADS: FloatingAd[] = [
  {
    id: 'house:advertise-with-us',
    image: '/og-default.png',
    headline: 'Advertise in The Eastern Newspaper',
    description:
      'Put your business in front of readers across Meru, Embu, Isiolo, Tharaka Nithi and beyond — in the paper and online.',
    advertiserName: 'The Eastern Newspaper',
    href: '/advertise',
    ctaLabel: 'Book a slot',
    active: true,
  },
  {
    id: 'house:print-edition',
    image: '/eastern-newspaper-logo.jpg',
    headline: 'Subscribe to the print edition',
    description:
      'Every issue of Eastern Newspaper, from county politics to business and sport — delivered where you are.',
    advertiserName: 'The Eastern Newspaper',
    href: '/publications',
    ctaLabel: 'View editions',
    active: true,
  },
  {
    id: 'house:lower-eastern',
    headline: 'Reach readers in the Lower Eastern counties',
    description:
      'Machakos, Makueni and Kitui campaigns now booking — print, online and sponsored features.',
    advertiserName: 'The Eastern Newspaper',
    href: '/advertise',
    ctaLabel: 'Talk to us',
    // Paused example — inactive adverts are skipped by the rotation.
    active: false,
  },
];

/**
 * Map a CMS advertiser booking to the floating-advert shape.
 *
 * The overlay uses the advertiser's logo as its banner, the business name as
 * headline and sponsor line, and the booking's website as the destination.
 * CMS bookings are always treated as active here because the advertisers API
 * only returns active records (`isActive: true` filter server-side).
 */
export function advertiserToFloatingAd(ad: Advertiser): FloatingAd {
  return {
    id: `cms:${ad._id}`,
    image: ad.logo || undefined,
    headline: ad.businessName,
    description: ad.description || undefined,
    advertiserName: ad.businessName,
    href: ad.linkURL || undefined,
    ctaLabel: ad.linkURL ? 'Visit' : undefined,
    active: ad.isActive !== false,
  };
}

/**
 * Build the rotation's advert list from every available source: CMS bookings
 * first (client adverts get first turn), then the configured promos. Inactive
 * adverts are dropped and duplicate ids deduplicated, so adding, removing or
 * deactivating an advert can never break the rotation downstream.
 *
 * With no sources active this returns an empty list and the overlay simply
 * never renders.
 */
export function resolveFloatingAds(
  advertisers: Advertiser[],
  configured: FloatingAd[] = CONFIGURED_FLOATING_ADS,
): FloatingAd[] {
  const merged: FloatingAd[] = [];
  const seen = new Set<string>();
  for (const ad of [...advertisers.map(advertiserToFloatingAd), ...configured]) {
    if (!ad.active || !ad.id || seen.has(ad.id)) continue;
    seen.add(ad.id);
    merged.push(ad);
  }
  return merged;
}

/** True when the URL leaves the site (opened in a new tab). */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
