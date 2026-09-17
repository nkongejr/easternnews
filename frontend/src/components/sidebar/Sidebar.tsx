import { api } from '@/lib/api';
import MostReadWidget from './MostReadWidget';
import PendingBillsWidget from './PendingBillsWidget';
import SponsoredCard from './SponsoredCard';
import NewsletterWidget from './NewsletterWidget';

/**
 * Shared right-hand rail. Sticks under the sticky navigation on desktop and
 * stacks below the main column on tablet/phone.
 *
 * Each module resolves its own data, so a failing widget never takes the whole
 * page down with it.
 */
export default async function Sidebar({ withNewsletter = true }: { withNewsletter?: boolean }) {
  let advertisers: Awaited<ReturnType<typeof api.getAdvertisers>> = [];
  try {
    advertisers = await api.getAdvertisers({ placement: 'sidebar' });
  } catch {
    advertisers = [];
  }

  return (
    <aside className="flex flex-col gap-8 lg:sticky lg:top-20 lg:self-start">
      <MostReadWidget />

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
