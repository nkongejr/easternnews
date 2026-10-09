import { api, safe } from '@/lib/api';
import {
  CONFIGURED_FLOATING_ADS,
  DEFAULT_FLOATING_AD_TIMING,
  resolveFloatingAds,
} from '@/lib/floatingAds';
import FloatingAdRotator from './FloatingAdRotator';

/**
 * Server wrapper for the rotating floating article adverts (CMS placement
 * `article-overlay`, plus the configurable promo list in `lib/floatingAds`).
 *
 * It collects every eligible advert — not just the first booking — and hands
 * the list to the client rotator, which decides *when* each one closes over
 * the story: one at a time, a few seconds after the article opens, then the
 * next after the reader closes the previous one. Renders nothing when no
 * advert is active, so an unsold slot never leaves a frame on screen.
 */
export default async function ArticleOverlayAd() {
  const advertisers = await safe(api.getAdvertisers({ placement: 'article-overlay' }), []);
  const ads = resolveFloatingAds(advertisers, CONFIGURED_FLOATING_ADS);
  if (ads.length === 0) return null;

  return <FloatingAdRotator ads={ads} timing={DEFAULT_FLOATING_AD_TIMING} />;
}
