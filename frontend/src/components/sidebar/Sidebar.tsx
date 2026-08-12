import { api } from '@/lib/api';
import MostReadWidget from './MostReadWidget';
import PendingBillsWidget from './PendingBillsWidget';
import SponsoredCard from './SponsoredCard';

export default async function Sidebar() {
  const advertisers = await api.getAdvertisers({ placement: 'sidebar' });

  return (
    <aside className="space-y-6">
      <MostReadWidget />
      <PendingBillsWidget />
      {advertisers.slice(0, 3).map((ad) => (
        <SponsoredCard key={ad._id} advertiser={ad} />
      ))}
    </aside>
  );
}