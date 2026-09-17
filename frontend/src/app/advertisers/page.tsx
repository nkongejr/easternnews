import { api, safe } from '@/lib/api';
import SponsoredCard from '@/components/sidebar/SponsoredCard';
import PageHeader from '@/components/shared/PageHeader';

export const metadata = { title: 'Our Advertisers & Sponsors' };

const CATEGORIES = ['Hotel', 'TVET/College', 'University', 'Security Services', 'Other'];

export default async function AdvertisersPage() {
  const all = await safe(api.getAdvertisers(), []);

  return (
    <div>
      <PageHeader
        title="Advertiser Directory"
        description="Businesses and institutions supporting The Eastern Newspaper."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Advertisers' }]}
      />

      <div className="en-container py-8 md:py-10">
        {all.length === 0 ? (
          <p className="rounded-sm border border-border bg-surface-alt p-8 text-center text-sm text-muted">
            No advertisers listed yet.
          </p>
        ) : (
          CATEGORIES.map((cat) => {
            const items = all.filter((a) => a.category === cat);
            if (!items.length) return null;
            return (
              <section key={cat} className="mb-10 last:mb-0">
                <h2 className="mb-5 border-b-2 border-brand-gold pb-2 font-headline text-xl font-black uppercase tracking-tight text-ink">
                  {cat}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((ad) => (
                    <SponsoredCard key={ad._id} advertiser={ad} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
