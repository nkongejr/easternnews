import { api, safe, EMPTY_PAGE } from '@/lib/api';
import { COUNTIES, FEATURED_COUNTIES } from '@/lib/constants';
import HeroNews from '@/components/home/HeroNews';
import BreakingNews from '@/components/home/BreakingNews';
import InsideIssueStrip from '@/components/home/InsideIssueStrip';
import CountySection from '@/components/home/CountySection';
import CountyRoundup, { type CountyEntry } from '@/components/home/CountyRoundup';
import CountyDirectory from '@/components/home/CountyDirectory';
import OpinionSection from '@/components/home/OpinionSection';
import NewsGrid from '@/components/articles/NewsGrid';
import SectionHeader from '@/components/shared/SectionHeader';
import AdBanner from '@/components/shared/AdBanner';
import Sidebar from '@/components/sidebar/Sidebar';

export default async function HomePage() {
  const [heroRes, poolRes, meru, embu, tharakaNithi, kitui, issue] = await Promise.all([
    safe(api.getArticles({ hero: 'true', limit: '1' }), EMPTY_PAGE),
    // One wide request feeds the latest list, the county roundup and the
    // section blocks — far cheaper than a request per block.
    safe(api.getArticles({ limit: '50' }), EMPTY_PAGE),
    safe(api.getArticles({ category: 'Meru', limit: '4' }), EMPTY_PAGE),
    safe(api.getArticles({ category: 'Embu', limit: '4' }), EMPTY_PAGE),
    safe(api.getArticles({ category: 'Tharaka Nithi', limit: '4' }), EMPTY_PAGE),
    safe(api.getArticles({ category: 'Kitui', limit: '4' }), EMPTY_PAGE),
    safe(api.getCurrentIssue(), null),
  ]);

  const pool = poolRes.data;
  const heroArticle = heroRes.data[0] || pool.find((a) => a.isHero) || pool[0];

  // Everything except the lead story, newest first.
  const rest = heroArticle ? pool.filter((a) => a._id !== heroArticle._id) : pool;

  const byCategory = (name: string) => pool.filter((a) => a.category === name);
  const business = byCategory('Business').slice(0, 3);
  const sports = byCategory('Sports').slice(0, 3);
  const opinion = [...byCategory('Opinion'), ...byCategory('Editorial')].slice(0, 3);

  // Freshest story from every county desk, for the "Around the Counties" index.
  const roundup: CountyEntry[] = COUNTIES.map((county) => {
    const article = pool.find((a) => a.category === county.name);
    return article ? { county, article } : null;
  }).filter((e): e is CountyEntry => e !== null);

  const countySections = [
    { county: FEATURED_COUNTIES[0], articles: meru.data },
    { county: FEATURED_COUNTIES[1], articles: embu.data },
    { county: FEATURED_COUNTIES[2], articles: tharakaNithi.data },
    { county: FEATURED_COUNTIES[3], articles: kitui.data },
  ].filter((s) => s.articles.length > 0);

  if (!heroArticle) {
    return (
      <div className="en-container py-24 text-center">
        <h1 className="font-headline text-3xl font-black text-ink">Welcome to The Eastern Newspaper</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted">
          Stories from across the Eastern region will appear here as soon as they are published.
        </p>
      </div>
    );
  }

  return (
    <div>
      <BreakingNews articles={pool.slice(0, 8)} />

      <HeroNews lead={heroArticle} supporting={rest.slice(0, 4)} />

      <AdBanner />

      {/* Main column + sticky rail */}
      <div className="en-container grid gap-10 py-10 lg:grid-cols-3 lg:gap-12">
        <div className="flex min-w-0 flex-col gap-12 lg:col-span-2">
          <section aria-labelledby="latest-news">
            <div id="latest-news">
              <SectionHeader title="Latest News" href="/archive" linkLabel="All stories" />
            </div>
            {rest.length > 0 ? (
              <NewsGrid articles={rest.slice(0, 6)} columns={2} showComments />
            ) : (
              <p className="text-sm text-muted">No further stories published yet.</p>
            )}
          </section>

          {countySections.map((s) => (
            <CountySection key={s.county.slug} county={s.county} articles={s.articles} />
          ))}
        </div>

        <Sidebar />
      </div>

      <InsideIssueStrip articles={issue?.articles || []} issue={issue} />

      {roundup.length > 0 && <CountyRoundup entries={roundup} />}

      {business.length > 0 && (
        <section aria-labelledby="home-business" className="en-container py-10 md:py-12">
          <div id="home-business">
            <SectionHeader title="Business" href="/business" />
          </div>
          <NewsGrid articles={business} columns={3} showComments />
        </section>
      )}

      {sports.length > 0 && (
        <section
          aria-labelledby="home-sports"
          className="border-y border-border bg-surface-alt py-10 md:py-12"
        >
          <div className="en-container">
            <div id="home-sports">
              <SectionHeader title="Sports" href="/sports" />
            </div>
            <NewsGrid articles={sports} columns={3} showComments />
          </div>
        </section>
      )}

      <OpinionSection articles={opinion} />

      <section className="en-container py-10 md:py-12">
        <CountyDirectory description="Every county desk, from Meru to Marsabit." />
      </section>
    </div>
  );
}
