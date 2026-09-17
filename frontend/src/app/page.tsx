import { api } from '@/lib/api';
import Hero from '@/components/home/Hero';
import InsideIssueStrip from '@/components/home/InsideIssueStrip';
import CategorySection from '@/components/home/CategorySection';
import ArticleCard from '@/components/articles/ArticleCard';
import Sidebar from '@/components/sidebar/Sidebar';
import Link from 'next/link';
import { COUNTIES } from '@/lib/constants';

export default async function HomePage() {
  const [heroData, latestData, issue, meru, embu, business, sports, opinion] =
    await Promise.all([
      api.getArticles({ hero: 'true', limit: '1' }),
      api.getArticles({ limit: '6' }).catch(() => null),
      api.getCurrentIssue().catch(() => null),
      api.getArticles({ category: 'Meru', limit: '3' }),
      api.getArticles({ category: 'Embu', limit: '3' }),
      api.getArticles({ category: 'Business', limit: '3' }),
      api.getArticles({ category: 'Sports', limit: '3' }),
      api.getArticles({ category: 'Opinion', limit: '3' }),
    ]);

  const heroArticle = heroData.data[0];
  const issueArticles = issue?.articles || [];
  const latestArticles = latestData?.data || [];

  return (
    <div>
      {heroArticle && <Hero article={heroArticle} />}
      <InsideIssueStrip articles={issueArticles} />

      <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-10">
        {/* Main editorial column */}
        <div className="lg:col-span-2 min-w-0">
          {/* Latest News */}
          {latestArticles.length > 0 && (
            <section className="mb-10" aria-labelledby="latest-news-heading">
              <div className="section-rule flex items-end justify-between pb-2 mb-5">
                <h2 id="latest-news-heading" className="h-section">
                  Latest News
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-8">
                {latestArticles.slice(0, 4).map((a) => (
                  <ArticleCard key={a._id} article={a} />
                ))}
              </div>
            </section>
          )}

          <CategorySection title="Meru" href="/counties/meru" articles={meru.data} />
          <CategorySection title="Embu" href="/counties/embu" articles={embu.data} />
          <CategorySection title="Business" href="/business" articles={business.data} />
          <CategorySection title="Sports" href="/sports" articles={sports.data} />
          <CategorySection title="Opinion" href="/opinion" articles={opinion.data} />
        </div>

        <Sidebar />
      </div>

      {/* Counties index */}
      <section className="bg-paper-muted border-t border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="section-rule flex items-end justify-between pb-2 mb-5">
            <h2 className="h-section">Explore All Counties</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {COUNTIES.map((c) => (
              <Link
                key={c.slug}
                href={`/counties/${c.slug}`}
                className="bg-white border border-gray-200 px-4 py-3 text-center text-sm font-bold uppercase tracking-wide hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-colors"
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
