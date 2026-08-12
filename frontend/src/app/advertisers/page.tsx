import { api } from '@/lib/api';
import SponsoredCard from '@/components/sidebar/SponsoredCard';

export const metadata = { title: 'Our Advertisers & Sponsors' };

const CATEGORIES = ['Hotel', 'TVET/College', 'University', 'Security Services', 'Other'];

export default async function AdvertisersPage() {
  const all = await api.getAdvertisers();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-headline text-3xl font-bold mb-2">Advertiser Directory</h1>
      <p className="text-gray-500 mb-8">Businesses and institutions supporting The Eastern Newspaper.</p>

      {CATEGORIES.map((cat) => {
        const items = all.filter((a) => a.category === cat);
        if (!items.length) return null;
        return (
          <section key={cat} className="mb-10">
            <h2 className="font-headline text-xl font-bold text-brand-blue mb-4">{cat}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((ad) => (
                <SponsoredCard key={ad._id} advertiser={ad} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}