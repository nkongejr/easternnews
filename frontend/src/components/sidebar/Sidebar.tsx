import { api } from '@/lib/api';
import MostReadWidget from './MostReadWidget';
import LatestUpdatesWidget from './LatestUpdatesWidget';
import PendingBillsWidget from './PendingBillsWidget';
import SponsoredCard from './SponsoredCard';
import NewsletterWidget from './NewsletterWidget';
import SocialFollowWidget from './SocialFollowWidget';

/**
 * Shared right-hand rail. Sticks under the sticky navigation on desktop and
 * stacks below the main column on tablet/phone.
 */
export default async function Sidebar({ withNewsletter = true }: { withNewsletter?: boolean }) {
  let advertisers: Awaited<ReturnType<typeof api.getAdvertisers>> = [];
  try {
    advertisers = await api.getAdvertisers({ placement: 'sidebar' });
  } catch {
    advertisers = [];
  }

  return (
    <aside className="flex flex-col gap-6 lg:sticky lg:top-20 lg:self-start">
      <MostReadWidget />
      <LatestUpdatesWidget />
      <SocialFollowWidget />

      {advertisers.slice(0, 2).map((ad) => (
        <SponsoredCard key={ad._id} advertiser={ad} />
      ))}

      <PendingBillsWidget />

      {withNewsletter && <NewsletterWidget />}

      {advertisers.slice(2, 4).map((ad) => (
        <SponsoredCard key={ad._id} advertiser={ad} />
      ))}
    </aside>
  );
}
