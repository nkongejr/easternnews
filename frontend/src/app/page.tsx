import { api } from '@/lib/api';
import Hero from '@/components/home/Hero';
import InsideIssueStrip from '@/components/home/InsideIssueStrip';
import CategorySection from '@/components/home/CategorySection';
import Sidebar from '@/components/sidebar/Sidebar';
import Link from 'next/link';
import { COUNTIES } from '@/lib/constants';

export default async function HomePage() {
  const [heroData, issue, meru, embu, business, sports, opinion] = await Promise.all([
    api.getArticles({ hero: 'true', limit: '1' }),
    api.getCurrentIssue().catch(() => null),
    api.getArticles({ category: 'Meru', limit: '3' }),
    api.getArticles({ category: 'Embu', limit: '3' }),
    api.getArticles({ category: 'Business', limit: '3' }),
    api.getArticles({ category: 'Sports', limit: '3' }),
    api.getArticles({ category: 'Opinion', limit: '3' }),
  ]);

  const heroArticle = heroData.data[0];
  const issueArticles = issue?.articles || [];

  return (
    <div>
      {heroArticle && <Hero article={heroArticle} />}
      <InsideIssueStrip articles={issueArticles} />

      <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <CategorySection title="Meru" href="/counties/meru" articles={meru.data} />
          <CategorySection title="Embu" href="/counties/embu" articles={embu.data} />
          <CategorySection title="Business" href="/business" articles={business.data} />
          <CategorySection title="Sports" href="/sports" articles={sports.data} />
          <CategorySection title="Opinion" href="/opinion" articles={opinion.data} />
        </div>
        <Sidebar />
      </div>

      <section className="bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-headline text-2xl font-bold text-brand-blue mb-6">Explore All Counties</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {COUNTIES.map((c) => (
              <Link
                key={c.slug}
                href={`/counties/${c.slug}`}
                className="bg-white border rounded-lg p-4 text-center font-semibold hover:bg-brand-blue hover:text-white transition"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}