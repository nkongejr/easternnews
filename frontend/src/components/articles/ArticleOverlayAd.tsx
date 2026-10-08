import { api, safe } from '@/lib/api';
import StickyAdBar from './StickyAdBar';

/**
 * Server wrapper for the floating article advert (CMS placement
 * `article-overlay`). Fetches the booked advertiser and hands it to the client
 * bar, which decides *when* to close over the story. Renders nothing when the
 * slot is empty, so an unsold placement never leaves a frame on screen.
 */
export default async function ArticleOverlayAd() {
  const advertisers = await safe(api.getAdvertisers({ placement: 'article-overlay' }), []);
  const ad = advertisers[0];
  if (!ad) return null;

  return <StickyAdBar advertiser={ad} />;
}
